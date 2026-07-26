"use client";

import * as Dialog from "@radix-ui/react-dialog";

import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { type SignalTone, signalToneBg, signalToneFg } from "@/lib/signal-visual";
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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="font-data shrink-0 border border-current/30 px-2 py-1 text-[0.65rem] uppercase tracking-[0.12em] opacity-90 transition hover:opacity-100"
          style={{ color: signalToneFg(tone) }}
        >
          {triggerLabel ?? warning.name ?? warning.key}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[rgb(var(--fg)/0.35)]" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-[min(440px,92vw)] border-l border-[rgb(var(--rule))] bg-[rgb(var(--bg))] shadow-2xl outline-none">
          <div className="flex h-full flex-col">
            <div
              className="flex items-start justify-between gap-3 px-5 py-4"
              style={{ background: signalToneBg(tone), color: signalToneFg(tone) }}
            >
              <div>
                <div className="font-data text-[0.65rem] uppercase tracking-[0.16em] opacity-80">
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
                  variant="ghost"
                  size="sm"
                  className="text-inherit hover:bg-white/15"
                >
                  {t(lang, "action.close")}
                </Button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-auto px-5 py-5">
              {warning.contents?.length ? (
                <div className="space-y-4">
                  {warning.contents.map((line, index) => (
                    <p
                      key={`${index}-${line.substring(0, 8)}`}
                      className={cn(
                        "text-sm leading-7",
                        index === 0 ? "font-medium" : "text-[rgb(var(--muted))]",
                      )}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-[rgb(var(--muted))]">No details available.</div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
