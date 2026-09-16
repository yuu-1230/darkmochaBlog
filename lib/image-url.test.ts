import { resolveAbsoluteImageUrl, resolveImageUrl } from "@/lib/image-url";

describe("resolveImageUrl", () => {
  it("記事画像だけをR2 URLへ変換する", () => {
    expect(resolveImageUrl("/images/Articles/Hello/Autumn.jpg")).toBe(
      "https://images.darkmocha.dev/images/Articles/Hello/Autumn.jpg",
    );
  });

  it("既定OG画像はローカル参照を維持する", () => {
    expect(resolveImageUrl("/images/OG.jpg")).toBe("/images/OG.jpg");
  });

  it("アイコンやプロフィール画像はローカル参照を維持する", () => {
    expect(resolveImageUrl("/images/icon.png")).toBe("/images/icon.png");
    expect(resolveImageUrl("/images/About/profile.jpg")).toBe(
      "/images/About/profile.jpg",
    );
  });

  it("外部URLは変更しない", () => {
    expect(resolveImageUrl("https://example.com/image.jpg")).toBe(
      "https://example.com/image.jpg",
    );
  });
});

describe("resolveAbsoluteImageUrl", () => {
  it("記事画像はR2の絶対URLを返す", () => {
    expect(
      resolveAbsoluteImageUrl("/images/Articles/Hello/Autumn.jpg"),
    ).toBe(
      "https://images.darkmocha.dev/images/Articles/Hello/Autumn.jpg",
    );
  });

  it("ローカル画像はサイトの絶対URLを返す", () => {
    expect(resolveAbsoluteImageUrl("/images/OG.jpg")).toBe(
      "https://www.darkmocha.dev/images/OG.jpg",
    );
  });
});
