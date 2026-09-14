import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export function Select({ className, ...props }: ComponentPropsWithoutRef<"select">) {
  return (
    <select
      className={cn(
        "h-11 rounded-[var(--radius)] border border-[rgb(var(--rule))] bg-[rgb(var(--bg))] px-3 font-data text-xs uppercase tracking-[0.08em] text-[rgb(var(--fg))]",
        className,
      )}
      {...props}
    />
  );
}
