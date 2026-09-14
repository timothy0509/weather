"use client";

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export function Tabs({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-stretch rounded-[var(--radius)] border border-[rgb(var(--rule))] bg-[rgb(var(--bg))]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsButton({
  active,
  className,
  ...props
}: ComponentPropsWithoutRef<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "min-h-[44px] px-3 font-data text-xs uppercase tracking-[0.1em] transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgb(var(--signal-teal))]",
        active
          ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
          : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--fg)/0.05)]",
        className,
      )}
      {...props}
    />
  );
}
