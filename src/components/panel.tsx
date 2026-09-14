import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type PanelProps = ComponentPropsWithoutRef<"section"> & {
  title: string;
  meta?: string;
};

export function Panel({ title, meta, children, className, ...props }: PanelProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius)] border border-[rgb(var(--rule))] bg-[rgb(var(--card))] p-5",
        className,
      )}
      {...props}
    >
      <div className="flex items-end justify-between gap-3">
        <h2 className="label">{title}</h2>
        {meta ? (
          <div className="font-data text-xs text-[rgb(var(--muted))]">{meta}</div>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
