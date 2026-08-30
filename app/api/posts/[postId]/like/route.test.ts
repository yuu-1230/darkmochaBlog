/** @jest-environment node */

import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { GET, PUT } from "@/app/api/posts/[postId]/like/route";
import { getSql } from "@/lib/neon";
import { isPublishedPostId } from "@/lib/likes";
import { createVisitorId, hashVisitorId } from "@/lib/visitor-id";

jest.mock("next/headers", () => ({ cookies: jest.fn() }));
jest.mock("@/lib/neon", () => ({ getSql: jest.fn() }));
jest.mock("@/lib/likes", () => ({ isPublishedPostId: jest.fn() }));
jest.mock("@/lib/visitor-id", () => ({
  createVisitorId: jest.fn(),
  hashVisitorId: jest.fn(),
  VISITOR_COOKIE_MAX_AGE: 31_536_000,
  VISITOR_COOKIE_NAME: "blog_visitor_id",
}));

const mockCookies = jest.mocked(cookies);
const mockGetSql = jest.mocked(getSql);
const mockIsPublishedPostId = jest.mocked(isPublishedPostId);
const mockCreateVisitorId = jest.mocked(createVisitorId);
const mockHashVisitorId = jest.mocked(hashVisitorId);

function request(
  method: "GET" | "PUT",
  body?: string,
  headers: Record<string, string> = {},
) {
  return new NextRequest("http://localhost/api/posts/thai-travel/like", {
    method,
    body,
    headers,
  });
}

function context(postId = "thai-travel") {
  return { params: Promise.resolve({ postId }) };
}

describe("post like route", () => {
  const sql = jest.fn();

  beforeEach(() => {
    mockIsPublishedPostId.mockResolvedValue(true);
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    } as never);
    mockGetSql.mockReturnValue(sql as never);
    mockCreateVisitorId.mockReturnValue("new-visitor-id");
    mockHashVisitorId.mockReturnValue("a".repeat(64));
  });

  describe("GET", () => {
    it("returns 404 without touching the database for an unknown post", async () => {
      mockIsPublishedPostId.mockResolvedValue(false);

      const response = await GET(request("GET"), context("missing"));

      expect(response.status).toBe(404);
      expect(mockGetSql).not.toHaveBeenCalled();
    });

    it("returns the count and false when no visitor cookie exists", async () => {
      sql.mockResolvedValueOnce([{ count: 7 }]);

      const response = await GET(request("GET"), context());

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ count: 7, liked: false });
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      expect(mockHashVisitorId).not.toHaveBeenCalled();
    });

    it("returns whether the current visitor has liked the post", async () => {
      mockCookies.mockResolvedValue({
        get: jest.fn().mockReturnValue({ value: "visitor-id" }),
      } as never);
      sql.mockResolvedValueOnce([{ count: 3, liked: true }]);

      const response = await GET(request("GET"), context());

      expect(mockHashVisitorId).toHaveBeenCalledWith("visitor-id");
      expect(await response.json()).toEqual({ count: 3, liked: true });
    });

    it("returns 503 without exposing database details", async () => {
      jest.spyOn(console, "error").mockImplementation(() => undefined);
      sql.mockRejectedValueOnce(new Error("database password leaked"));

      const response = await GET(request("GET"), context());

      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({ error: "Like service is unavailable" });
    });
  });

  describe("PUT validation", () => {
    it("rejects a missing or foreign origin", async () => {
      const missing = await PUT(
        request("PUT", JSON.stringify({ liked: true }), {
          "content-type": "application/json",
        }),
        context(),
      );
      const foreign = await PUT(
        request("PUT", JSON.stringify({ liked: true }), {
          origin: "https://example.com",
          "content-type": "application/json",
        }),
        context(),
      );

      expect(missing.status).toBe(403);
      expect(foreign.status).toBe(403);
      expect(mockGetSql).not.toHaveBeenCalled();
    });

    it("requires JSON with a boolean liked field", async () => {
      const wrongType = await PUT(
        request("PUT", "liked=true", {
          origin: "http://localhost",
          "content-type": "text/plain",
        }),
        context(),
      );
      const malformed = await PUT(
        request("PUT", "{", {
          origin: "http://localhost",
          "content-type": "application/json",
        }),
        context(),
      );
      const wrongShape = await PUT(
        request("PUT", JSON.stringify({ liked: "true" }), {
          origin: "http://localhost",
          "content-type": "application/json",
        }),
        context(),
      );

      expect(wrongType.status).toBe(415);
      expect(malformed.status).toBe(400);
      expect(wrongShape.status).toBe(400);
    });

    it("rejects an oversized body and unknown posts", async () => {
      const oversized = await PUT(
        request("PUT", JSON.stringify({ liked: true }), {
          origin: "http://localhost",
          "content-type": "application/json",
          "content-length": "1025",
        }),
        context(),
      );
      mockIsPublishedPostId.mockResolvedValue(false);
      const unknown = await PUT(
        request("PUT", JSON.stringify({ liked: true }), {
          origin: "http://localhost",
          "content-type": "application/json",
        }),
        context("missing"),
      );

      expect(oversized.status).toBe(413);
      expect(unknown.status).toBe(404);
      expect(mockGetSql).not.toHaveBeenCalled();
    });
  });

  describe("PUT mutation", () => {
    const headers = {
      origin: "http://localhost",
      "content-type": "application/json",
    };

    it("creates a visitor cookie and inserts the first like", async () => {
      sql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ count: 1 }]);

      const response = await PUT(
        request("PUT", JSON.stringify({ liked: true }), headers),
        context(),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ count: 1, liked: true });
      expect(mockCreateVisitorId).toHaveBeenCalledTimes(1);
      expect(mockHashVisitorId).toHaveBeenCalledWith("new-visitor-id");
      expect(sql).toHaveBeenCalledTimes(2);
      expect(response.headers.get("set-cookie")).toEqual(
        expect.stringContaining("blog_visitor_id=new-visitor-id"),
      );
      expect(response.headers.get("set-cookie")).toEqual(
        expect.stringContaining("HttpOnly"),
      );
      expect(response.headers.get("set-cookie")?.toLowerCase()).toContain("samesite=lax");
    });

    it("does not create a cookie when an unknown visitor requests unlike", async () => {
      sql.mockResolvedValueOnce([{ count: 5 }]);

      const response = await PUT(
        request("PUT", JSON.stringify({ liked: false }), headers),
        context(),
      );

      expect(await response.json()).toEqual({ count: 5, liked: false });
      expect(response.headers.get("set-cookie")).toBeNull();
      expect(mockCreateVisitorId).not.toHaveBeenCalled();
      expect(sql).toHaveBeenCalledTimes(1);
    });

    it("deletes only the existing visitor's like", async () => {
      mockCookies.mockResolvedValue({
        get: jest.fn().mockReturnValue({ value: "existing-visitor" }),
      } as never);
      sql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ count: 2 }]);

      const response = await PUT(
        request("PUT", JSON.stringify({ liked: false }), headers),
        context(),
      );

      expect(mockHashVisitorId).toHaveBeenCalledWith("existing-visitor");
      expect(await response.json()).toEqual({ count: 2, liked: false });
      expect(sql).toHaveBeenCalledTimes(2);
      expect(sql.mock.calls[0]).toEqual([
        expect.any(Array),
        "thai-travel",
        "a".repeat(64),
      ]);
    });

    it("returns 503 when a mutation fails", async () => {
      jest.spyOn(console, "error").mockImplementation(() => undefined);
      sql.mockRejectedValueOnce(new Error("connection failed"));

      const response = await PUT(
        request("PUT", JSON.stringify({ liked: true }), headers),
        context(),
      );

      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({ error: "Like service is unavailable" });
    });
  });
});
