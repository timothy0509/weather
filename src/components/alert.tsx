"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type AlertVariant = "advisory" | "warning";

type AlertProps = {
  variant: AlertVariant;
  message?: string;
  title?: string;
  children?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

/**
 * Board alert — two variants, i18n-ready copy via props.
 * advisory: amber left-bar on card (lightning, fire danger, tips errors).
 * warning: solid red block, paper fg (TC messages, section failures).
 * Retry slot reserves 44px min-height so error rows never collapse.
 */
export function Alert({
  variant,
  message,
  title,
  children,
  onRetry,
  retryLabel,
  className,
}: AlertProps) {
  const isWarning = variant === "warning";

  return (
    <div
      role={isWarning ? "alert" : "status"}
      className={cn(
        "flex min-h-[44px] items-center justify-between gap-3 px-4 py-2.5 text-sm leading-relaxed",
        isWarning
          ? "bg-[#C8102E] font-medium text-[#FAF8F2] dark:bg-[#E64650] dark:text-[#12161A]"
          : "border border-[rgb(var(--rule))] border-l-4 border-l-[#E5A100] bg-[rgb(var(--card))] dark:border-l-[#F0B428]",
        className,
      )}
    >
      <div className="min-w-0">
        {title ? (
          <div
            className={cn(
              "font-data text-xs font-semibold uppercase tracking-[0.14em]",
              isWarning ? "opacity-85" : "text-[rgb(var(--muted))]",
            )}
          >
            {title}
          </div>
        ) : null}
        {message ? <p className="mt-0.5">{message}</p> : null}
        {children}
      </div>
      {onRetry ? (
        <Button
          type="button"
          variant={isWarning ? "outline" : "ghost"}
          size="sm"
          onClick={onRetry}
          className={cn(
            "min-h-[44px] min-w-[44px] shrink-0 px-4",
            isWarning &&
              "border-current text-inherit hover:bg-white/15 hover:text-inherit",
          )}
        >
          {retryLabel ?? "Retry"}
        </Button>
      ) : null}
    </div>
  );
}
