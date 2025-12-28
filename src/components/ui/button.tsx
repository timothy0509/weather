import type { ButtonHTMLAttributes } from "react";

import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/cn";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "solid" | "ghost";
  size?: "sm" | "md";
};

export function Button({
  className,
  asChild,
  variant = "solid",
  size = "md",
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent)/0.45)] focus-visible:ring-offset-0",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "md" && "h-10 px-4 text-sm",
        size === "sm" && "h-9 px-3 text-sm",
        variant === "solid" &&
          "bg-[rgb(var(--accent))] text-[rgb(var(--accent-fg))] shadow-[0_10px_30px_-18px_rgb(var(--shadow)/0.65)] hover:brightness-105 active:brightness-95",
        variant === "ghost" &&
          "bg-transparent text-[rgb(var(--fg))] hover:bg-[rgb(var(--fg)/0.06)] active:bg-[rgb(var(--fg)/0.10)]",
        className,
      )}
      {...props}
    />
  );
}
