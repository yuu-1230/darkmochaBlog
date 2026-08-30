import type { ComponentProps, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { ArticleEngagement } from "@/components/blog/ArticleEngagement";
import { AUTHOR_NAME } from "@/lib/constants";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt = "", ...props }: ComponentProps<"img">) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />;
  },
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("@/components/blog/LikeButton", () => ({
  LikeButton: ({ postId }: { postId: string }) => (
    <button type="button">like:{postId}</button>
  ),
}));

describe("ArticleEngagement", () => {
  it("renders the like control and linked author profile", () => {
    render(
      <ArticleEngagement
        postId="thai-travel"
        authorBio="長野県出身の学生エンジニア"
        authorLinkLabel="著者プロフィールを見る"
        likeLabels={{ like: "いいね", unlike: "解除", unavailable: "利用不可" }}
      />,
    );

    expect(screen.getByRole("button", { name: "like:thai-travel" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "著者プロフィールを見る" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByText(AUTHOR_NAME)).toBeInTheDocument();
    expect(screen.getByText("長野県出身の学生エンジニア")).toBeInTheDocument();
    expect(screen.getByRole("presentation")).toHaveAttribute(
      "src",
      "/images/About/Icon.png",
    );
  });
});
