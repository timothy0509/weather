"use client";

import { useEffect, useMemo } from "react";

import { api } from "@/app/providers";
import { AppShell } from "@/components/app-shell";
import { RainfallPanel } from "@/components/rainfall-panel";
import { useStationContext } from "@/components/station-provider";
import { Topbar } from "@/components/topbar";
import { WarningsDrawer } from "@/components/warnings-drawer";
import { TriangleAlert } from "lucide-react";

import { getHkoWeatherVisual } from "@/lib/hko-icons";
import { t } from "@/lib/i18n";
import { formatHktDateTime } from "@/lib/time";
import { getTempTone } from "@/lib/weather-visual";

import { Card } from "@/components/ui/card";

export default function Home() {
  const { lang, station } = useStationContext();

  const dashboardQuery = api.weather.dashboard.useQuery(
    { lang, station },
    { staleTime: 30_000, refetchInterval: 60_000 },
  );

  const now = dashboardQuery.data?.now;
  const forecast = dashboardQuery.data?.forecast9d;
  const warnings = dashboardQuery.data?.warnings;

  const previewDays = useMemo(() => (forecast?.days ?? []).slice(0, 9), [forecast?.days]);

  const tempC = now?.temperature?.value ?? null;
  const tempTone = useMemo(() => getTempTone(tempC), [tempC]);

  useEffect(() => {
    const onRefresh = () => {
      void dashboardQuery.refetch();
    };

    window.addEventListener("tw:refresh", onRefresh);
    return () => window.removeEventListener("tw:refresh", onRefresh);
  }, [dashboardQuery]);

  const nowVisual = useMemo(() => {
    return getHkoWeatherVisual(now?.iconCode ?? null);
  }, [now?.iconCode]);

  return (
    <AppShell header={<Topbar />}>
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="relative mt-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgb(var(--border))]"
                style={{ background: `rgb(var(--wx-${tempTone}) / 0.16)` }}
              >
                <nowVisual.Icon
                  className="h-6 w-6"
                  style={{ color: `rgb(var(--wx-${tempTone}))` }}
                />
              </div>

              <div className="min-w-0">
                <div className="text-sm text-[rgb(var(--muted))]">{t(lang, "label.now")} · {station}</div>
                <div
                  className="mt-2 text-5xl font-semibold tracking-tight"
                  style={{ color: `rgb(var(--wx-${tempTone}))` }}
                >
                  {dashboardQuery.isLoading ? (
                    <span className="inline-block h-12 w-36 animate-pulse rounded-2xl bg-[rgb(var(--fg)/0.06)]" />
                  ) : now?.temperature ? (
                    `${now.temperature.value}°`
                  ) : (
                    "—"
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[rgb(var(--muted))]">
                  <span className="inline-flex items-center gap-2">
                    <nowVisual.Icon className="h-4 w-4" />
                    {nowVisual.label}
                  </span>
                  {now?.humidity ? (
                    <span>
                      {t(lang, "label.humidity")} {now.humidity.value}
                      {now.humidity.unit}
                    </span>
                  ) : null}
                  {now?.updateTime ? (
                    <span>
                      {t(lang, "label.updated")} {formatHktDateTime(now.updateTime)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {dashboardQuery.error ? (
            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-red-500">
              <span>Failed to load weather data.</span>
              <button
                type="button"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.04)] px-3 py-1.5 text-xs text-[rgb(var(--fg))]"
                onClick={() => dashboardQuery.refetch()}
              >
                {t(lang, "action.retry")}
              </button>
            </div>
          ) : null}
        </Card>

        <Card className="p-6 lg:col-span-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{t(lang, "label.warnings")}</div>
            <div className="text-xs text-[rgb(var(--muted))]">
              {warnings?.length
                ? `${warnings.length} ${t(lang, "label.warnings.active")}`
                : t(lang, "label.warnings.none")}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {dashboardQuery.isLoading ? (
              <div className="h-10 animate-pulse rounded-2xl bg-[rgb(var(--fg)/0.06)]" />
) : warnings?.length ? (
               warnings.slice(0, 3).map((warning) => (

                 <div
                   key={warning.key}
                   className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] px-4 py-3"
                 >
                   <div className="flex items-start justify-between gap-3">
                     <div className="flex min-w-0 items-start gap-3">
                       <div
                         className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl border border-[rgb(var(--border))]"
                         style={{ background: "rgb(var(--wx-warm) / 0.12)" }}
                         aria-hidden="true"
                       >
                         <TriangleAlert
                           className="h-4 w-4"
                           style={{ color: "rgb(var(--wx-warm))" }}
                         />
                       </div>
                       <div className="min-w-0">
                         <div className="truncate text-sm font-medium">
                           {warning.name ?? warning.key}
                         </div>
                         {warning.contents?.[0] ? (
                           <div className="mt-1 line-clamp-2 text-xs text-[rgb(var(--muted))]">
                             {warning.contents[0]}
                           </div>
                         ) : null}
                       </div>
                     </div>
                     <WarningsDrawer
                      warning={warning}
                      triggerLabel={t(lang, "label.warnings.details")}
                    />
                   </div>
                 </div>
              ))
            ) : (
<div className="text-sm text-[rgb(var(--muted))]">
                 {t(lang, "label.warnings.none")}.
               </div>
            )}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold">{t(lang, "label.forecast_9d")}</div>
            <div className="text-xs text-[rgb(var(--muted))]">
              {forecast?.updateTime
                ? `${t(lang, "label.updated")} ${formatHktDateTime(forecast.updateTime)}`
                : ""}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {dashboardQuery.isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)]"
                  />
                ))
              : previewDays.map((day) => (
                  <div
                    key={day.forecastDate}
                    className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] p-4"
                  >
                    <div className="text-xs text-[rgb(var(--muted))]">
                      {day.week}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold">
                          {day.forecastMaxtemp.value}°
                        </div>
<div className="text-xs text-[rgb(var(--muted))]">
                           {t(lang, "label.low")} {day.forecastMintemp.value}°
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const visual = getHkoWeatherVisual(day.ForecastIcon ?? null);
                          return (
                            <visual.Icon
                              className="h-5 w-5"
                              style={{ color: "rgb(var(--wx-cool))" }}
                              aria-label={visual.label}
                            />
                          );
                        })()}
                      </div>
                    </div>
                    <div className="mt-3 line-clamp-2 text-xs text-[rgb(var(--muted))]">
                      {day.forecastWeather}
                    </div>
                  </div>
                ))}
          </div>

          {dashboardQuery.error ? (
            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-red-500">
              <span>Failed to load forecast.</span>
              <button
                type="button"
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.04)] px-3 py-1.5 text-xs text-[rgb(var(--fg))]"
                onClick={() => dashboardQuery.refetch()}
              >
                {t(lang, "action.retry")}
              </button>
            </div>
          ) : null}
        </Card>

        <div className="lg:col-span-12">
          <RainfallPanel />
        </div>
      </div>
    </AppShell>
  );
}
