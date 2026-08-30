import { getAllPosts } from "@/lib/mdx";
import { isPublishedPostId, isValidPostId } from "@/lib/likes";

jest.mock("@/lib/mdx", () => ({
  getAllPosts: jest.fn(),
}));
jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["ja", "en"] },
}));

const mockGetAllPosts = jest.mocked(getAllPosts);

describe("isValidPostId", () => {
  it.each([
    "a",
    "thai-travel",
    "2026-08-30-neon-like-system",
    "a".repeat(100),
  ])("accepts %s", (postId) => {
    expect(isValidPostId(postId)).toBe(true);
  });

  it.each([
    "",
    "Thai-Travel",
    "日本語",
    "thai/travel",
    "thai.travel",
    "thai travel",
    "-thai",
    "thai-",
    "thai--travel",
    "../secret",
    "a".repeat(101),
  ])("rejects %s", (postId) => {
    expect(isValidPostId(postId)).toBe(false);
  });
});

describe("isPublishedPostId", () => {
  it("returns false before reading posts when the id is invalid", async () => {
    await expect(isPublishedPostId("../secret")).resolves.toBe(false);
    expect(mockGetAllPosts).not.toHaveBeenCalled();
  });

  it("finds a post in either locale", async () => {
    mockGetAllPosts.mockImplementation(async (locale) =>
      locale === "en"
        ? ([{ slug: "english-only" }] as Awaited<ReturnType<typeof getAllPosts>>)
        : [],
    );

    await expect(isPublishedPostId("english-only")).resolves.toBe(true);
    expect(mockGetAllPosts).toHaveBeenCalledTimes(2);
  });

  it("returns false when no locale contains the post", async () => {
    mockGetAllPosts.mockResolvedValue([]);
    await expect(isPublishedPostId("missing-post")).resolves.toBe(false);
  });
});
