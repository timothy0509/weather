"use client";

import { WarningsDrawer, type WarningEntry } from "@/components/warnings-drawer";
import { cn } from "@/lib/cn";
import { getSignalTone, signalToneBg, signalToneFg } from "@/lib/signal-visual";

export function SignalStrip({
  warnings,
  tips,
}: {
  warnings: WarningEntry[];
  tips?: string[];
}) {
  if (!warnings.length && !tips?.length) {
    return (
      <div className="anim-strip border border-[rgb(var(--rule))] bg-[rgb(var(--card))] px-4 py-3">
        <div className="section-label">Signals</div>
        <div className="mt-1 font-data text-sm text-[rgb(var(--muted))]">No active warnings</div>
      </div>
    );
  }

  return (
    <div className="anim-strip space-y-2">
      <div className="flex flex-wrap gap-2">
        {warnings.map((warning, index) => {
          const tone = getSignalTone(warning.code, warning.key);
          return (
            <div
              key={warning.key}
              className={cn(
                "flex min-w-0 flex-1 items-stretch gap-0 sm:min-w-[16rem] sm:flex-none",
              )}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div
                className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 py-2.5"
                style={{ background: signalToneBg(tone), color: signalToneFg(tone) }}
              >
                <div className="min-w-0">
                  <div className="font-data text-[0.65rem] uppercase tracking-[0.16em] opacity-80">
                    {warning.code ?? warning.key}
                  </div>
                  <div className="font-display mt-0.5 truncate text-sm font-semibold">
                    {warning.type ?? warning.name ?? warning.key}
                  </div>
                </div>
                <WarningsDrawer
                  warning={warning}
                  triggerLabel="Details"
                  tone={tone}
                />
              </div>
            </div>
          );
        })}
      </div>

      {tips?.length ? (
        <div className="border border-[rgb(var(--rule))] border-l-4 border-l-[rgb(var(--signal-amber))] bg-[rgb(var(--card))] px-4 py-3">
          <div className="section-label">Special tip</div>
          <p className="mt-1 text-sm leading-relaxed">{tips[0]}</p>
        </div>
      ) : null}
    </div>
  );
}
