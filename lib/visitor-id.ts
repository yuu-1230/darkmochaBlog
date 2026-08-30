import "server-only";

import { createHmac, randomBytes } from "node:crypto";

export const VISITOR_COOKIE_NAME = "blog_visitor_id";
export const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function createVisitorId(): string {
  return randomBytes(32).toString("base64url");
}

export function hashVisitorId(visitorId: string): string {
  const secret = process.env.LIKE_HASH_SECRET;

  if (!secret) {
    throw new Error("LIKE_HASH_SECRET is not configured");
  }

  return createHmac("sha256", secret).update(visitorId).digest("hex");
}
