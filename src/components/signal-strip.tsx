"use client";

import { WarningsDrawer, type WarningEntry } from "@/components/warnings-drawer";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { useStationContext } from "@/components/station-provider";
import { getSignalTone } from "@/lib/signal-visual";

/**
 * Docked status instrument: ruled ledger header, solid-tone slabs per
 * active signal, giant 40px signal number, 44px DETAILS chip.
 * Fixed tone pairs (light bg / dark bg) keep >= 4.5:1 contrast:
 *   amber #E5A100/#F0B428 on ink · red #C8102E/#E64650 on paper-light/ink-dark.
 */
export function SignalStrip({
  warnings,
  tips,
}: {
  warnings: WarningEntry[];
  tips?: string[];
}) {
  const { lang } = useStationContext();

  if (!warnings.length && !tips?.length) {
    return (
      <section aria-label={t(lang, "label.signals")} className="anim-strip">
        <h2 className="label border-b border-[rgb(var(--rule))] pb-2 text-[rgb(var(--muted))]">
          {t(lang, "label.signals")}
        </h2>
        <div className="mt-2 border-b border-[rgb(var(--rule))] py-3 font-data text-sm uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          {t(lang, "label.signals.all_clear")}
        </div>
      </section>
    );
  }

  return (
    <section aria-label={t(lang, "label.signals")} className="anim-strip">
      <h2 className="label border-b border-[rgb(var(--rule))] pb-2 text-[rgb(var(--muted))]">
        {t(lang, "label.signals")}
      </h2>

      {warnings.length ? (
        <div className="mt-2 flex flex-wrap gap-2" role="list">
          {warnings.map((warning, index) => {
            const tone = getSignalTone(warning.code, warning.key);
            const isRed = tone === "red" || tone === "black";
            return (
              <div
                key={warning.key}
                role="listitem"
                style={{ animationDelay: `${index * 60}ms` }}
                className={cn(
                  "flex min-w-0 flex-1 items-stretch sm:min-w-[18rem] sm:flex-none",
                  "min-h-[76px] px-4 py-3",
                  isRed
                    ? "bg-[#C8102E] text-[#FAF8F2] dark:bg-[#E64650] dark:text-[#12161A]"
                    : "bg-[#E5A100] text-[#1A1F24] dark:bg-[#F0B428] dark:text-[#1A1F24]",
                )}
              >
                <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden
                      className="font-display shrink-0 text-[40px] font-extrabold leading-none tabular-nums"
                    >
                      {warning.code?.replace(/\D/g, "") || "!"}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-data text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
                        {warning.code ?? warning.key}
                      </span>
                      <span className="font-display mt-0.5 block truncate text-sm font-semibold">
                        {warning.type ?? warning.name ?? warning.key}
                      </span>
                    </span>
                  </div>
                  <WarningsDrawer warning={warning} triggerLabel={t(lang, "label.warnings.details")} tone={tone} />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {tips?.length ? (
        <div className="mt-2 border border-[rgb(var(--rule))] border-l-4 border-l-[#E5A100] bg-[rgb(var(--card))] px-4 py-3 dark:border-l-[#F0B428]">
          <h3 className="label text-[rgb(var(--muted))]">{t(lang, "label.tip")}</h3>
          <p className="mt-1 text-sm leading-relaxed">{tips[0]}</p>
        </div>
      ) : null}
    </section>
  );
}
