import { fetchOgp } from "@/lib/ogp";

export async function OgpCard({ url }: { url: string }) {
  const ogp = await fetchOgp(url);
  const domain = new URL(url).hostname;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex rounded-lg border border-border hover:border-primary/50 transition-colors overflow-hidden bg-card no-underline group/ogp block"
    >
      {ogp.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ogp.image}
          alt=""
          className="w-24 h-24 object-cover shrink-0"
          loading="lazy"
        />
      )}
      <div className="flex flex-col justify-center p-3 min-w-0 gap-0.5">
        {ogp.title && (
          <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight group-hover/ogp:text-primary transition-colors">
            {ogp.title}
          </p>
        )}
        {ogp.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {ogp.description}
          </p>
        )}
        <p className="text-[11px] text-muted-foreground/60 font-mono truncate mt-1">
          {domain}
        </p>
      </div>
    </a>
  );
}
