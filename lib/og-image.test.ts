import { loadImageAsDataUri } from "@/lib/og-image";

describe("loadImageAsDataUri", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("記事画像の取得失敗時は既定OG画像へフォールバックする", async () => {
    const fetchMock = jest
      .fn()
      .mockRejectedValueOnce(new Error("article unavailable"))
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ "content-type": "image/jpeg" }),
        arrayBuffer: async () => Uint8Array.from([1, 2, 3]).buffer,
      });
    global.fetch = fetchMock as typeof fetch;

    await expect(
      loadImageAsDataUri(
        "/images/Articles/Hello/Autumn.jpg",
        "/images/OG.jpg",
      ),
    ).resolves.toBe("data:image/jpeg;base64,AQID");
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://images.darkmocha.dev/images/OG.jpg",
      expect.any(Object),
    );
  });

  it("すべての画像取得に失敗してもnullを返す", async () => {
    global.fetch = jest.fn().mockRejectedValue(
      new Error("R2 unavailable"),
    ) as typeof fetch;

    await expect(
      loadImageAsDataUri(
        "/images/Articles/Hello/Autumn.jpg",
        "/images/OG.jpg",
      ),
    ).resolves.toBeNull();
  });
});
