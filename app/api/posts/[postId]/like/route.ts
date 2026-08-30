import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getSql } from "@/lib/neon";
import { isPublishedPostId } from "@/lib/likes";
import {
  createVisitorId,
  hashVisitorId,
  VISITOR_COOKIE_MAX_AGE,
  VISITOR_COOKIE_NAME,
} from "@/lib/visitor-id";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ postId: string }> };

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function hasSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return origin !== null && origin === request.nextUrl.origin;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { postId } = await context.params;

  if (!(await isPublishedPostId(postId))) {
    return json({ error: "Post not found" }, 404);
  }

  try {
    const cookieStore = await cookies();
    const visitorId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;
    const sql = getSql();

    if (!visitorId) {
      const rows = await sql`
        SELECT COUNT(*)::INTEGER AS count
        FROM post_likes
        WHERE post_id = ${postId}
      `;

      return json({ count: rows[0]?.count ?? 0, liked: false });
    }

    const visitorHash = hashVisitorId(visitorId);
    const rows = await sql`
      SELECT
        COUNT(*)::INTEGER AS count,
        BOOL_OR(visitor_hash = ${visitorHash}) AS liked
      FROM post_likes
      WHERE post_id = ${postId}
    `;

    return json({
      count: rows[0]?.count ?? 0,
      liked: rows[0]?.liked ?? false,
    });
  } catch (error) {
    console.error("Failed to load like state", error);
    return json({ error: "Like service is unavailable" }, 503);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!hasSameOrigin(request)) {
    return json({ error: "Invalid origin" }, 403);
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ error: "Content-Type must be application/json" }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 1024) {
    return json({ error: "Request body is too large" }, 413);
  }

  const { postId } = await context.params;

  if (!(await isPublishedPostId(postId))) {
    return json({ error: "Post not found" }, 404);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("liked" in body) ||
    typeof body.liked !== "boolean"
  ) {
    return json({ error: "liked must be a boolean" }, 400);
  }

  try {
    const cookieStore = await cookies();
    let visitorId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;
    let shouldSetCookie = false;

    if (!visitorId) {
      if (!body.liked) {
        const sql = getSql();
        const rows = await sql`
          SELECT COUNT(*)::INTEGER AS count
          FROM post_likes
          WHERE post_id = ${postId}
        `;
        return json({ count: rows[0]?.count ?? 0, liked: false });
      }

      visitorId = createVisitorId();
      shouldSetCookie = true;
    }

    const visitorHash = hashVisitorId(visitorId);
    const sql = getSql();

    if (body.liked) {
      await sql`
        INSERT INTO post_likes (post_id, visitor_hash)
        VALUES (${postId}, ${visitorHash})
        ON CONFLICT DO NOTHING
      `;
    } else {
      await sql`
        DELETE FROM post_likes
        WHERE post_id = ${postId}
          AND visitor_hash = ${visitorHash}
      `;
    }

    const rows = await sql`
      SELECT COUNT(*)::INTEGER AS count
      FROM post_likes
      WHERE post_id = ${postId}
    `;
    const response = json({ count: rows[0]?.count ?? 0, liked: body.liked });

    if (shouldSetCookie) {
      response.cookies.set(VISITOR_COOKIE_NAME, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: VISITOR_COOKIE_MAX_AGE,
      });
    }

    return response;
  } catch (error) {
    console.error("Failed to update like state", error);
    return json({ error: "Like service is unavailable" }, 503);
  }
}
