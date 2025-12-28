"use client";

import { useMemo, useState } from "react";

import { Droplets } from "lucide-react";

import { api } from "@/app/providers";
import { useStationContext } from "@/components/station-provider";
import { Card } from "@/components/ui/card";
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

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgb(var(--border))]"
            style={{ background: "rgb(var(--wx-rain) / 0.12)" }}
            aria-hidden="true"
          >
            <Droplets className="h-4 w-4" style={{ color: "rgb(var(--wx-rain))" }} />
          </div>
            <div>
              <div className="text-sm font-semibold">{t(lang, "label.rainfall")}</div>
              <div className="mt-1 text-xs text-[rgb(var(--muted))]">
                {mode === "district"
                  ? t(lang, "label.rainfall.past_hour_district")
                  : t(lang, "label.rainfall.past_hour_stations")}
              </div>
            </div>

        </div>

        <div className="flex rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] p-1">
          <button
            type="button"
            onClick={() => setMode("district")}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-medium transition",
              mode === "district"
                ? "bg-[rgb(var(--fg)/0.07)]"
                : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--fg)/0.05)]",
            )}
          >
            {t(lang, "label.rainfall.districts")}
          </button>
          <button
            type="button"
            onClick={() => setMode("station")}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-medium transition",
              mode === "station"
                ? "bg-[rgb(var(--fg)/0.07)]"
                : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--fg)/0.05)]",
            )}
          >
            {t(lang, "label.rainfall.stations")}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {(mode === "district" ? districtsQuery.isLoading : stationsQuery.isLoading)
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)]"
              />
            ))
          : rows.slice(0, 12).map((row) => (
              <div
                key={row.label}
                className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{row.label}</div>
                    <div className="mt-1 text-xs text-[rgb(var(--muted))]">
                      {row.status === "maintenance" ? t(lang, "label.maintenance") : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {row.amountMm === null ? "—" : `${row.amountMm}`}
                      <span className="ml-1 text-xs text-[rgb(var(--muted))]">mm</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </Card>
  );
}
