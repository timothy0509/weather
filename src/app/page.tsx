"use client";

import { useEffect, useMemo } from "react";

import { api } from "@/app/providers";
import { AppShell } from "@/components/app-shell";
import { RainfallPanel } from "@/components/rainfall-panel";
import { SignalStrip } from "@/components/signal-strip";
import { useStationContext } from "@/components/station-provider";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { getHkoWeatherVisual } from "@/lib/hko-icons";
import { t } from "@/lib/i18n";
import { formatHktDateTime } from "@/lib/time";
import { getTempTone, toneColor } from "@/lib/weather-visual";

function SectionError({
  message,
  onRetry,
  retryLabel,
}: {
  message: string;
  onRetry: () => void;
  retryLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border border-[rgb(var(--signal-red)/0.35)] bg-[rgb(var(--signal-red)/0.08)] px-3 py-2 text-sm">
      <span>{message}</span>
      <Button type="button" variant="ghost" size="sm" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}

export default function Home() {
  const { lang, station } = useStationContext();

  const dashboardQuery = api.weather.dashboard.useQuery(
    { lang, station },
    { staleTime: 30_000, refetchInterval: 60_000 },
  );

  const now = dashboardQuery.data?.now;
  const forecast = dashboardQuery.data?.forecast9d;
  const warnings = dashboardQuery.data?.warnings ?? [];
  const localForecast = dashboardQuery.data?.localForecast;
  const swt = dashboardQuery.data?.swt;
  const errors = dashboardQuery.data?.errors;

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

  const retry = () => void dashboardQuery.refetch();
  const retryLabel = t(lang, "action.retry");

  return (
    <AppShell header={<Topbar />}>
      <div className="space-y-8">
        {errors?.warnings ? (
          <SectionError
            message="HKO warnings unavailable"
            onRetry={retry}
            retryLabel={retryLabel}
          />
        ) : (
          <SignalStrip warnings={warnings} tips={errors?.swt ? undefined : swt?.tips} />
        )}

        {errors?.swt ? (
          <SectionError
            message="HKO tips unavailable"
            onRetry={retry}
            retryLabel={retryLabel}
          />
        ) : null}

        <section className="border-b border-[rgb(var(--rule))] pb-8">
          <div className="section-label">{t(lang, "label.now")}</div>

          {errors?.now ? (
            <div className="mt-3">
              <SectionError
                message="Current observation unavailable"
                onRetry={retry}
                retryLabel={retryLabel}
              />
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div
                  className="anim-temp font-display text-7xl font-extrabold leading-none tracking-tight sm:text-8xl"
                  style={{ color: toneColor(tempTone) }}
                >
                  {dashboardQuery.isLoading ? (
                    <span className="inline-block h-16 w-40 animate-pulse bg-[rgb(var(--fg)/0.08)]" />
                  ) : now?.temperature ? (
                    <>
                      {now.temperature.value}
                      <span className="text-4xl">°</span>
                    </>
                  ) : (
                    "—"
                  )}
                </div>
                <div className="mt-3 font-data text-sm text-[rgb(var(--muted))]">
                  {station}
                </div>
              </div>

              <div className="space-y-1 font-data text-xs uppercase tracking-[0.12em] text-[rgb(var(--muted))] sm:text-right">
                <div className="flex items-center gap-2 sm:justify-end normal-case tracking-normal text-sm text-[rgb(var(--fg))]">
                  <nowVisual.Icon className="h-4 w-4" style={{ color: toneColor(tempTone) }} />
                  {nowVisual.label}
                </div>
                {now?.humidity ? (
                  <div>
                    {t(lang, "label.humidity")} {now.humidity.value}
                    {now.humidity.unit}
                  </div>
                ) : null}
                {now?.uvIndex ? (
                  <div>
                    UV {now.uvIndex.value}
                    {now.uvIndex.desc ? ` · ${now.uvIndex.desc}` : ""}
                  </div>
                ) : null}
                {now?.updateTime ? (
                  <div>
                    {t(lang, "label.updated")} {formatHktDateTime(now.updateTime)}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-end justify-between gap-3">
            <div className="section-label">{t(lang, "label.forecast_9d")}</div>
            {forecast?.updateTime ? (
              <div className="font-data text-[0.65rem] text-[rgb(var(--muted))]">
                {t(lang, "label.updated")} {formatHktDateTime(forecast.updateTime)}
              </div>
            ) : null}
          </div>

          {errors?.forecast9d ? (
            <div className="mt-3">
              <SectionError
                message="9-day forecast unavailable"
                onRetry={retry}
                retryLabel={retryLabel}
              />
            </div>
          ) : (
            <div className="mt-3 -mx-4 overflow-x-auto px-4 pb-1">
              <div className="flex min-w-max gap-0 border-y border-[rgb(var(--rule))]">
                {dashboardQuery.isLoading
                  ? Array.from({ length: 7 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-28 w-28 animate-pulse border-r border-[rgb(var(--rule))] bg-[rgb(var(--fg)/0.04)] last:border-r-0"
                      />
                    ))
                  : previewDays.map((day) => {
                      const visual = getHkoWeatherVisual(day.ForecastIcon ?? null);
                      return (
                        <div
                          key={day.forecastDate}
                          className="w-28 shrink-0 border-r border-[rgb(var(--rule))] px-3 py-3 last:border-r-0"
                        >
                          <div className="font-data text-[0.65rem] uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                            {day.week.slice(0, 3)}
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="font-display text-xl font-bold">
                              {day.forecastMaxtemp.value}°
                            </div>
                            <visual.Icon
                              className="h-4 w-4 text-[rgb(var(--signal-teal))]"
                              aria-label={visual.label}
                            />
                          </div>
                          <div className="font-data text-xs text-[rgb(var(--muted))]">
                            {t(lang, "label.low")} {day.forecastMintemp.value}°
                          </div>
                          <div className="mt-2 line-clamp-2 text-[0.7rem] leading-snug text-[rgb(var(--muted))]">
                            {day.forecastWeather}
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="section-label">Local forecast</div>
            {errors?.localForecast ? (
              <div className="mt-3">
                <SectionError
                  message="Local forecast unavailable"
                  onRetry={retry}
                  retryLabel={retryLabel}
                />
              </div>
            ) : (
              <div className="mt-3 space-y-4">
                {localForecast?.forecastPeriod ? (
                  <div className="font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                    {localForecast.forecastPeriod}
                  </div>
                ) : null}
                {dashboardQuery.isLoading ? (
                  <div className="h-24 animate-pulse bg-[rgb(var(--fg)/0.06)]" />
                ) : localForecast?.forecastDesc ? (
                  <p className="text-base leading-relaxed">{localForecast.forecastDesc}</p>
                ) : (
                  <p className="text-[rgb(var(--muted))]">—</p>
                )}
                {localForecast?.outlook ? (
                  <p className="text-sm leading-relaxed text-[rgb(var(--muted))]">
                    {localForecast.outlook}
                  </p>
                ) : null}
                {localForecast?.tcInfo ? (
                  <p className="border-l-4 border-[rgb(var(--signal-red))] bg-[rgb(var(--signal-red)/0.06)] px-4 py-3 text-sm leading-relaxed">
                    {localForecast.tcInfo}
                  </p>
                ) : null}
                {localForecast?.fireDangerWarning ? (
                  <p className="border-l-4 border-[rgb(var(--signal-amber))] bg-[rgb(var(--signal-amber)/0.1)] px-4 py-3 text-sm leading-relaxed">
                    {localForecast.fireDangerWarning}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <RainfallPanel />
          </div>
        </section>

        {dashboardQuery.error ? (
          <SectionError
            message="Weather board failed to load"
            onRetry={retry}
            retryLabel={retryLabel}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
