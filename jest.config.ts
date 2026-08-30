import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  clearMocks: true,
  collectCoverageFrom: [
    "app/api/posts/[postId]/like/route.ts",
    "components/blog/ArticleEngagement.tsx",
    "components/blog/LikeButton.tsx",
    "lib/likes.ts",
    "lib/visitor-id.ts",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^server-only$": "<rootDir>/tests/mocks/server-only.ts",
  },
  modulePathIgnorePatterns: ["<rootDir>/.claude/worktrees/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/**/*.test.{ts,tsx}"],
};

export default createJestConfig(config);
