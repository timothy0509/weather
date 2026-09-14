"use client";

import * as Dialog from "@radix-ui/react-dialog";

import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { type SignalTone } from "@/lib/signal-visual";
import { formatHktDateTime } from "@/lib/time";

export type WarningEntry = {
  key: string;
  name?: string;
  type?: string;
  code?: string;
  contents?: string[];
  detailUpdateTime?: string;
};

export function WarningsDrawer({
  warning,
  triggerLabel,
  tone = "ink",
}: {
  warning: WarningEntry;
  triggerLabel?: string;
  tone?: SignalTone;
}) {
  const { lang } = useStationContext();
  const isRed = tone === "red" || tone === "black";

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          className={cn(
            "font-data inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center px-4 text-xs font-semibold uppercase tracking-[0.14em]",
            "border border-current transition hover:opacity-80",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--signal-teal))]",
          )}
        >
          {triggerLabel ?? t(lang, "label.warnings.details")}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[rgb(var(--overlay))]" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-[min(440px,92vw)] border-l border-[rgb(var(--rule))] bg-[rgb(var(--bg))] shadow-2xl outline-none">
          <div className="flex h-full flex-col">
            <div
              className={cn(
                "flex items-start justify-between gap-3 px-5 py-4",
                isRed
                  ? "bg-[#C8102E] text-[#FAF8F2] dark:bg-[#E64650] dark:text-[#12161A]"
                  : "bg-[#E5A100] text-[#1A1F24] dark:bg-[#F0B428] dark:text-[#1A1F24]",
              )}
            >
              <div>
                <div className="font-data text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
                  {warning.code ?? warning.key}
                </div>
                <Dialog.Title className="font-display mt-1 text-lg font-bold">
                  {warning.type ?? warning.name ?? warning.key}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-xs opacity-80">
                  {warning.detailUpdateTime
                    ? `${t(lang, "label.updated")} ${formatHktDateTime(warning.detailUpdateTime)}`
                    : t(lang, "label.warnings")}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] border-current text-inherit outline-2 outline-offset-2 hover:bg-white/15 hover:text-inherit focus-visible:outline"
                >
                  {t(lang, "action.close")}
                </Button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-auto px-5 py-5">
              {warning.contents?.length ? (
                <ol className="space-y-4">
                  {warning.contents.map((line, index) => (
                    <li key={`${index}-${line.substring(0, 8)}`} className="flex gap-3">
                      <span
                        aria-hidden
                        className="font-data mt-0.5 shrink-0 text-xs text-[rgb(var(--muted))]"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p
                        className={cn(
                          "text-sm leading-7",
                          index === 0 ? "font-medium" : "text-[rgb(var(--muted))]",
                        )}
                      >
                        {line}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-sm text-[rgb(var(--muted))]">{t(lang, "label.no_details")}</div>
              )}
            </div>

            <div className="border-t border-[rgb(var(--rule))] px-5 py-3 font-data text-xs uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
              {warning.detailUpdateTime
                ? `${t(lang, "label.updated")} ${formatHktDateTime(warning.detailUpdateTime)}`
                : t(lang, "label.warnings")}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
