import {
  getAllLocalDocs,
  getLocalDoc,
  isLocalDocsEnabled,
} from "@/lib/local-docs";

const originalNodeEnv = process.env.NODE_ENV;

function setNodeEnv(value: string) {
  Object.defineProperty(process.env, "NODE_ENV", {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  });
}

afterEach(() => {
  setNodeEnv(originalNodeEnv);
});

describe("local docs", () => {
  it("enables docs outside production", () => {
    setNodeEnv("development");
    expect(isLocalDocsEnabled()).toBe(true);
  });

  it("hides every doc in production", async () => {
    setNodeEnv("production");

    expect(isLocalDocsEnabled()).toBe(false);
    await expect(getAllLocalDocs()).resolves.toEqual([]);
    await expect(getLocalDoc("writing-guide")).resolves.toBeNull();
  });

  it("loads the existing Markdown docs in development", async () => {
    setNodeEnv("development");

    const docs = await getAllLocalDocs();
    expect(docs.map((doc) => doc.slug)).toEqual(
      expect.arrayContaining([
        "blog-platform-research",
        "i18n-design",
        "writing-guide",
      ]),
    );
    expect(docs.every((doc) => doc.title.length > 0)).toBe(true);
  });

  it("uses the first level-one heading as the title", async () => {
    setNodeEnv("development");

    const doc = await getLocalDoc("writing-guide");
    expect(doc).toMatchObject({
      slug: "writing-guide",
      title: "ブログ執筆ガイド",
    });
    expect(doc?.content).toContain("## 1. ファイルの作成");
  });

  it("rejects traversal and unknown slugs", async () => {
    setNodeEnv("development");

    await expect(getLocalDoc("../package")).resolves.toBeNull();
    await expect(getLocalDoc("missing-doc")).resolves.toBeNull();
  });
});
