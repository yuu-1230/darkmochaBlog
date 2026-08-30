import { createVisitorId, hashVisitorId } from "@/lib/visitor-id";

describe("visitor id", () => {
  const originalSecret = process.env.LIKE_HASH_SECRET;

  beforeEach(() => {
    process.env.LIKE_HASH_SECRET = "test-secret-with-enough-entropy";
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.LIKE_HASH_SECRET;
    } else {
      process.env.LIKE_HASH_SECRET = originalSecret;
    }
  });

  it("creates unique 256-bit base64url identifiers", () => {
    const ids = new Set(Array.from({ length: 100 }, createVisitorId));

    expect(ids.size).toBe(100);
    for (const id of ids) {
      expect(id).toMatch(/^[A-Za-z0-9_-]{43}$/);
    }
  });

  it("creates a deterministic SHA-256 HMAC", () => {
    const first = hashVisitorId("visitor-1");
    const second = hashVisitorId("visitor-1");

    expect(first).toBe(second);
    expect(first).toMatch(/^[a-f0-9]{64}$/);
    expect(hashVisitorId("visitor-2")).not.toBe(first);
  });

  it("changes the hash when the secret changes", () => {
    const first = hashVisitorId("visitor-1");
    process.env.LIKE_HASH_SECRET = "another-secret";
    expect(hashVisitorId("visitor-1")).not.toBe(first);
  });

  it("fails explicitly when the secret is missing", () => {
    delete process.env.LIKE_HASH_SECRET;
    expect(() => hashVisitorId("visitor-1")).toThrow(
      "LIKE_HASH_SECRET is not configured",
    );
  });
});
