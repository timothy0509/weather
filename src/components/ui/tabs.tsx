"use client";

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export function Tabs({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex flex-wrap border border-[rgb(var(--rule))]", className)}
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
        "font-data px-2.5 py-1.5 text-[0.65rem] uppercase tracking-[0.1em] transition",
        active
          ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
          : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--fg)/0.05)]",
        className,
      )}
      {...props}
    />
  );
}
