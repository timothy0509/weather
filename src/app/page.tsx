"use client";

import { useMemo } from "react";

import { api } from "@/app/providers";
import { AppShell } from "@/components/app-shell";
import { RainfallPanel } from "@/components/rainfall-panel";
import { useStationContext } from "@/components/station-provider";
import { Topbar } from "@/components/topbar";
import { WarningsDrawer } from "@/components/warnings-drawer";
import { TriangleAlert } from "lucide-react";

import { getHkoWeatherVisual } from "@/lib/hko-icons";
import { getTempTone } from "@/lib/weather-visual";

import { Card } from "@/components/ui/card";

function formatIsoTime(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function Home() {
  const { lang, station } = useStationContext();

  const nowQuery = api.weather.now.useQuery(
    { lang, station },
    { staleTime: 60_000, refetchInterval: 120_000 },
  );
  const forecastQuery = api.weather.forecast9d.useQuery(
    { lang },
    { staleTime: 30 * 60_000 },
  );
  const warningsQuery = api.weather.warnings.useQuery(
    { lang },
    { staleTime: 120_000 },
  );

  const previewDays = useMemo(
    () => (forecastQuery.data?.days ?? []).slice(0, 9),
    [forecastQuery.data?.days],
  );

  const tempC = nowQuery.data?.temperature?.value ?? null;
  const tempTone = useMemo(() => getTempTone(tempC), [tempC]);

  const nowVisual = useMemo(() => {
    return getHkoWeatherVisual(nowQuery.data?.iconCode ?? null);
  }, [nowQuery.data?.iconCode]);

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
                <div className="text-sm text-[rgb(var(--muted))]">Now · {station}</div>
                <div
                  className="mt-2 text-5xl font-semibold tracking-tight"
                  style={{ color: `rgb(var(--wx-${tempTone}))` }}
                >
                  {nowQuery.isLoading ? (
                    <span className="inline-block h-12 w-36 animate-pulse rounded-2xl bg-[rgb(var(--fg)/0.06)]" />
                  ) : nowQuery.data?.temperature ? (
                    `${nowQuery.data.temperature.value}°`
                  ) : (
                    "—"
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[rgb(var(--muted))]">
                  <span className="inline-flex items-center gap-2">
                    <nowVisual.Icon className="h-4 w-4" />
                    {nowVisual.label}
                  </span>
                  {nowQuery.data?.humidity ? (
                    <span>
                      Humidity {nowQuery.data.humidity.value}
                      {nowQuery.data.humidity.unit}
                    </span>
                  ) : null}
                  {nowQuery.data?.updateTime ? (
                    <span>Updated {formatIsoTime(nowQuery.data.updateTime)}</span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {nowQuery.error ? (
            <div className="mt-4 text-sm text-red-500">
              Failed to load current weather.
            </div>
          ) : null}
        </Card>

        <Card className="p-6 lg:col-span-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Warnings</div>
            <div className="text-xs text-[rgb(var(--muted))]">
              {warningsQuery.data?.length
                ? `${warningsQuery.data.length} active`
                : "None"}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {warningsQuery.isLoading ? (
              <div className="h-10 animate-pulse rounded-2xl bg-[rgb(var(--fg)/0.06)]" />
            ) : warningsQuery.data?.length ? (
              warningsQuery.data.slice(0, 3).map((warning) => (
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
                     <WarningsDrawer warning={warning} triggerLabel="Details" />
                   </div>
                 </div>
              ))
            ) : (
              <div className="text-sm text-[rgb(var(--muted))]">
                No active warnings.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold">9‑day forecast</div>
            <div className="text-xs text-[rgb(var(--muted))]">
              {forecastQuery.data?.updateTime
                ? `Updated ${formatIsoTime(forecastQuery.data.updateTime)}`
                : ""}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {forecastQuery.isLoading
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
                          Low {day.forecastMintemp.value}°
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

          {forecastQuery.error ? (
            <div className="mt-4 text-sm text-red-500">
              Failed to load forecast.
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
