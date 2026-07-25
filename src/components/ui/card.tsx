import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-[rgb(var(--border))]",
        "bg-[rgb(var(--card))] text-[rgb(var(--card-fg))]",
        className,
      )}
      {...props}
    />
  );
}
