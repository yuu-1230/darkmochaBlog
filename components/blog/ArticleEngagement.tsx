import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { AUTHOR_NAME } from "@/lib/constants";
import { LikeButton } from "@/components/blog/LikeButton";

type ArticleEngagementProps = {
  postId: string;
  authorBio: string;
  authorLinkLabel: string;
  likeLabels: {
    like: string;
    unlike: string;
    unavailable: string;
  };
};

export function ArticleEngagement({
  postId,
  authorBio,
  authorLinkLabel,
  likeLabels,
}: ArticleEngagementProps) {
  return (
    <section className="mb-10 space-y-5" aria-label={authorLinkLabel}>
      <LikeButton postId={postId} labels={likeLabels} />

      <Link
        href="/about"
        className="group flex w-fit items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={authorLinkLabel}
      >
        <Image
          src="/images/About/Icon.png"
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-border transition-transform group-hover:scale-105"
        />
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground group-hover:text-primary">
            {AUTHOR_NAME}
          </span>
          <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
            {authorBio}
          </span>
        </span>
      </Link>
    </section>
  );
}
