import Link from "next/link";
import { Home } from "lucide-react";
import { MacWindowBar } from "@/components/MacWindowBar";

export default function NotFound() {
  return (
    <div className="py-24 max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <MacWindowBar title="zsh — 404" />
        <div className="p-8 md:p-12 font-mono text-sm space-y-1.5">
          <p className="text-muted-foreground">
            <span className="text-primary">$</span> cat ./requested-page
          </p>
          <p className="text-destructive">
            cat: ./requested-page: No such file or directory
          </p>
          <p className="text-muted-foreground pt-4">
            <span className="text-primary">$</span> echo $?
          </p>
          <p className="text-foreground">404</p>

          <div className="pt-10 space-y-4">
            <h1 className="text-2xl font-bold text-foreground tracking-tight font-sans">
              404 — Page Not Found
            </h1>
            <p className="text-muted-foreground font-sans leading-relaxed">
              お探しのページは移動したか、削除された可能性があります。
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground hover:bg-accent hover:border-primary/40 transition-colors"
            >
              <Home className="w-4 h-4" />
              cd ~/
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
