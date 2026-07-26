"use client";

import { useMemo, useState } from "react";

import { api } from "@/app/providers";
import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

export function RainfallPanel() {
  const { lang } = useStationContext();
  const [mode, setMode] = useState<"district" | "station">("district");

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

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="section-label">{t(lang, "label.rainfall")}</div>
          <div className="mt-1 font-data text-[0.65rem] text-[rgb(var(--muted))]">
            {mode === "district"
              ? t(lang, "label.rainfall.past_hour_district")
              : t(lang, "label.rainfall.past_hour_stations")}
          </div>
        </div>

        <div className="flex border border-[rgb(var(--rule))]">
          <button
            type="button"
            onClick={() => setMode("district")}
            className={cn(
              "font-data px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.1em] transition",
              mode === "district"
                ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
                : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--fg)/0.05)]",
            )}
          >
            {t(lang, "label.rainfall.districts")}
          </button>
          <button
            type="button"
            onClick={() => setMode("station")}
            className={cn(
              "font-data px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.1em] transition",
              mode === "station"
                ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
                : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--fg)/0.05)]",
            )}
          >
            {t(lang, "label.rainfall.stations")}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-3 flex items-center justify-between gap-3 border border-[rgb(var(--signal-red)/0.35)] bg-[rgb(var(--signal-red)/0.08)] px-3 py-2 text-sm">
          <span>Rainfall unavailable</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              mode === "district" ? districtsQuery.refetch() : stationsQuery.refetch()
            }
          >
            {t(lang, "action.retry")}
          </Button>
        </div>
      ) : (
        <div className="mt-3 max-h-80 overflow-auto border border-[rgb(var(--rule))]">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-[rgb(var(--card))] font-data text-[0.65rem] uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
              <tr className="border-b border-[rgb(var(--rule))]">
                <th className="px-3 py-2 font-medium">Place</th>
                <th className="px-3 py-2 text-right font-medium">mm</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index} className="border-t border-[rgb(var(--rule))]">
                      <td colSpan={2} className="px-3 py-3">
                        <div className="h-4 animate-pulse bg-[rgb(var(--fg)/0.06)]" />
                      </td>
                    </tr>
                  ))
                : rows.slice(0, 18).map((row) => (
                    <tr key={row.label} className="border-t border-[rgb(var(--rule))]">
                      <td className="px-3 py-2">
                        <div className="truncate">{row.label}</div>
                        {row.status === "maintenance" ? (
                          <div className="font-data text-[0.65rem] uppercase tracking-[0.08em] text-[rgb(var(--muted))]">
                            {t(lang, "label.maintenance")}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 text-right font-data tabular-nums">
                        {row.amountMm === null ? "—" : row.amountMm}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
