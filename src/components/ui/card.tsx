import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-[rgb(var(--border))]",
        "bg-[rgb(var(--card)/0.82)] text-[rgb(var(--card-fg))]",
        "shadow-[0_30px_70px_-60px_rgb(var(--shadow)/0.70)]",
        "backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
