export function MacWindowBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/50">
      <span className="w-3 h-3 rounded-full bg-traffic-close" />
      <span className="w-3 h-3 rounded-full bg-traffic-minimize" />
      <span className="w-3 h-3 rounded-full bg-traffic-maximize" />
      <span className="flex-1 text-center text-[11px] font-mono text-muted-foreground -ml-9 truncate px-12">
        {title}
      </span>
    </div>
  );
}
