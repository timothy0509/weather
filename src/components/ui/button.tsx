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
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-medium transition",
        "font-data tracking-wide",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--signal-teal)/0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "md" && "h-9 px-3 text-xs",
        size === "sm" && "h-8 px-2.5 text-xs",
        variant === "solid" &&
          "bg-[rgb(var(--fg))] text-[rgb(var(--bg))] hover:bg-[rgb(var(--fg)/0.88)]",
        variant === "ghost" &&
          "bg-transparent text-[rgb(var(--fg))] hover:bg-[rgb(var(--fg)/0.06)]",
        className,
      )}
      {...props}
    />
  );
}
