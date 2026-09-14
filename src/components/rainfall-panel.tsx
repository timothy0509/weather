"use client";

import { useMemo, useState } from "react";

import { api } from "@/app/providers";
import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

const MOBILE_ROW_LIMIT = 6;

export function RainfallPanel() {
  const { lang } = useStationContext();
  const [mode, setMode] = useState<"district" | "station">("district");
  const [expanded, setExpanded] = useState(false);

  const districtsQuery = api.weather.rainfallDistricts.useQuery(
    { lang },
    { staleTime: 60_000, enabled: mode === "district" },
  );
  const stationsQuery = api.weather.rainfallStations.useQuery(
    { lang },
    { staleTime: 5 * 60_000, enabled: mode === "station" },
  );

  const rows = useMemo(() => {
    if (mode === "district") return districtsQuery.data?.districts ?? [];
    return stationsQuery.data?.stations ?? [];
  }, [districtsQuery.data?.districts, mode, stationsQuery.data?.stations]);

  const loading = mode === "district" ? districtsQuery.isLoading : stationsQuery.isLoading;
  const error = mode === "district" ? districtsQuery.error : stationsQuery.error;

  const maxAmount = useMemo(() => {
    let max = 0;
    for (const row of rows) {
      if (row.amountMm !== null && row.amountMm > max) max = row.amountMm;
    }
    return max;
  }, [rows]);

  const visibleRows = expanded ? rows.slice(0, 18) : rows.slice(0, MOBILE_ROW_LIMIT);
  const hiddenCount = rows.length - visibleRows.length;

  const switchMode = (next: "district" | "station") => {
    setMode(next);
    setExpanded(false);
  };

  const refetch = () =>
    mode === "district" ? districtsQuery.refetch() : stationsQuery.refetch();

  return (
    <section
      aria-labelledby="rainfall-heading"
      className="border border-[rgb(var(--rule))] bg-[rgb(var(--card))] p-4 sm:p-5"
    >
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 id="rainfall-heading" className="label text-[rgb(var(--muted))]">
            {t(lang, "label.rainfall")}
          </h2>
          <div className="mt-1 font-data text-xs text-[rgb(var(--muted))]">
            {mode === "district"
              ? t(lang, "label.rainfall.past_hour_district")
              : t(lang, "label.rainfall.past_hour_stations")}
          </div>
        </div>

        <div
          role="group"
          aria-label={t(lang, "label.rainfall")}
          className="flex shrink-0 border border-[rgb(var(--rule))]"
        >
          <button
            type="button"
            aria-pressed={mode === "district"}
            onClick={() => switchMode("district")}
            className={cn(
              "min-h-[44px] px-4 py-3 font-data text-xs uppercase tracking-[0.1em] transition",
              mode === "district"
                ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
                : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--fg)/0.05)]",
            )}
          >
            {t(lang, "label.rainfall.districts")}
          </button>
          <button
            type="button"
            aria-pressed={mode === "station"}
            onClick={() => switchMode("station")}
            className={cn(
              "min-h-[44px] border-l border-[rgb(var(--rule))] px-4 py-3 font-data text-xs uppercase tracking-[0.1em] transition",
              mode === "station"
                ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
                : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--fg)/0.05)]",
            )}
          >
            {t(lang, "label.rainfall.stations")}
          </button>
        </div>
      </div>

      <div aria-live="polite" aria-busy={loading} className="mt-3">
        {error ? (
          <div className="flex min-h-[44px] items-center justify-between gap-3 border border-[rgb(var(--signal-red)/0.35)] bg-[rgb(var(--signal-red)/0.08)] px-3 py-2 text-sm">
            <span>Rainfall unavailable</span>
            <Button type="button" variant="ghost" size="sm" onClick={refetch}>
              {t(lang, "action.retry")}
            </Button>
          </div>
        ) : loading ? (
          <div className="border border-[rgb(var(--rule))]">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                {mode === "district"
                  ? t(lang, "label.rainfall.past_hour_district")
                  : t(lang, "label.rainfall.past_hour_stations")}
              </caption>
              <thead className="bg-[rgb(var(--card))] font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                <tr className="border-b border-[rgb(var(--rule))]">
                  <th scope="col" className="px-3 py-2 font-medium">
                    {t(lang, "label.rainfall.place")}
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    {t(lang, "label.rainfall.amount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="border-t border-[rgb(var(--rule))]">
                    <td colSpan={2} className="px-3 py-0">
                      <div className="flex h-[49px] items-center">
                        <div className="h-4 w-full animate-pulse bg-[rgb(var(--fg)/0.06)]" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex min-h-[44px] flex-col gap-2 border border-[rgb(var(--rule))] px-3 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[rgb(var(--muted))]">{t(lang, "label.rainfall.empty")}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={refetch}
              className="min-h-[44px] shrink-0 px-4"
            >
              {t(lang, "action.retry")}
            </Button>
          </div>
        ) : (
          <>
            <div className="border border-[rgb(var(--rule))] sm:max-h-80 sm:overflow-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  {mode === "district"
                    ? t(lang, "label.rainfall.past_hour_district")
                    : t(lang, "label.rainfall.past_hour_stations")}
                </caption>
                <thead className="bg-[rgb(var(--card))] font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--muted))] sm:sticky sm:top-0">
                  <tr className="border-b border-[rgb(var(--rule))]">
                    <th scope="col" className="px-3 py-2 font-medium">
                      {t(lang, "label.rainfall.place")}
                    </th>
                    <th scope="col" className="px-3 py-2 text-right font-medium">
                      {t(lang, "label.rainfall.amount")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => {
                    const pct =
                      row.amountMm !== null && maxAmount > 0
                        ? Math.max(4, Math.round((row.amountMm / maxAmount) * 100))
                        : 0;
                    return (
                      <tr
                        key={row.label}
                        className="border-t border-[rgb(var(--rule))] transition-colors hover:bg-[rgb(var(--fg)/0.04)]"
                      >
                        <td className="min-w-0 px-3 py-2">
                          <div title={row.label} className="truncate">
                            {row.label}
                          </div>
                          <div
                            aria-hidden={pct === 0}
                            className="mt-1 h-1 bg-[rgb(var(--signal-teal)/0.18)]"
                          >
                            {pct > 0 ? (
                              <div
                                className="h-full bg-[rgb(var(--signal-teal))]"
                                style={{ width: `${pct}%` }}
                              />
                            ) : null}
                          </div>
                          {row.status === "maintenance" ? (
                            <div className="mt-1 font-data text-xs uppercase tracking-[0.08em] text-[rgb(var(--muted))]">
                              {t(lang, "label.maintenance")}
                            </div>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right font-data tabular-nums">
                          {row.amountMm === null ? "—" : row.amountMm}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {hiddenCount > 0 || expanded ? (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-2 inline-flex min-h-[44px] items-center px-1 font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--signal-teal))] hover:underline"
              >
                {expanded
                  ? t(lang, "label.rainfall.show_less")
                  : `${t(lang, "label.rainfall.show_all")} (${rows.length})`}
              </button>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
