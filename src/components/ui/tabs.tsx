"use client";

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export function Tabs({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] p-1", className)} {...props} />;
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
        "rounded-xl px-3 py-1.5 text-xs font-medium transition",
        active ? "bg-[rgb(var(--fg)/0.07)]" : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--fg)/0.05)]",
        className,
      )}
      {...props}
    />
  );
}
