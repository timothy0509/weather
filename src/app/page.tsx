"use client";

import { useEffect, useMemo } from "react";

import Link from "next/link";

import { api } from "@/app/providers";
import { AppShell } from "@/components/app-shell";
import { Alert } from "@/components/alert";
import { RainfallPanel } from "@/components/rainfall-panel";
import { SignalStrip } from "@/components/signal-strip";
import { useStationContext } from "@/components/station-provider";
import { Topbar } from "@/components/topbar";
import { getHkoWeatherVisual } from "@/lib/hko-icons";
import { t } from "@/lib/i18n";
import { formatHktDateTime, getHktDateParts } from "@/lib/time";
import { getTempTone, toneColor } from "@/lib/weather-visual";

export default function Home() {
  const { lang, station } = useStationContext();
  const hktToday = useMemo(() => getHktDateParts(), []);

  const dashboardQuery = api.weather.dashboard.useQuery(
    { lang, station },
    { staleTime: 30_000, refetchInterval: 60_000 },
  );

  const sunTimesQuery = api.weather.sunTimes.useQuery({
    lang,
    year: hktToday.year,
    month: hktToday.month,
    day: hktToday.day,
  });

  const now = dashboardQuery.data?.now;
  const forecast = dashboardQuery.data?.forecast9d;
  const warnings = dashboardQuery.data?.warnings ?? [];
  const localForecast = dashboardQuery.data?.localForecast;
  const swt = dashboardQuery.data?.swt;
  const errors = dashboardQuery.data?.errors;

  const hasTcWarning = useMemo(
    () => warnings.some((w) => w.key === "WTCSGNL" || w.code?.startsWith("TC")),
    [warnings],
  );

  const tcTrackQuery = api.weather.tcTrack.useQuery(undefined, {
    enabled: hasTcWarning,
    staleTime: 5 * 60_000,
  });

  const previewDays = useMemo(() => (forecast?.days ?? []).slice(0, 9), [forecast?.days]);

  const tempC = now?.temperature?.value ?? null;
  const tempTone = useMemo(() => getTempTone(tempC), [tempC]);

  const hasLightning = useMemo(() => {
    if (!now?.lightning?.data?.length) return false;
    return now.lightning.data.some((entry) => entry.occur);
  }, [now?.lightning?.data]);

  const nowStats = useMemo(() => {
    if (!now) return [];
    const items: { label: string; value: string }[] = [];
    if (now.mintempFrom00To09) {
      items.push({ label: t(lang, "label.mintemp_00_09"), value: now.mintempFrom00To09 });
    }
    if (now.rainfallFrom00To12) {
      items.push({ label: t(lang, "label.rainfall_00_12"), value: now.rainfallFrom00To12 });
    }
    if (now.rainfallLastMonth) {
      items.push({ label: t(lang, "label.rainfall_last_month"), value: now.rainfallLastMonth });
    }
    if (now.rainfallJanuaryToLastMonth) {
      items.push({ label: t(lang, "label.rainfall_ytd"), value: now.rainfallJanuaryToLastMonth });
    }
    return items;
  }, [lang, now]);

  const sunLedger = useMemo(() => {
    const sun = sunTimesQuery.data;
    if (!sun) return [];
    const items: { label: string; value: string }[] = [];
    if (sun.rise) items.push({ label: t(lang, "label.sunrise"), value: sun.rise });
    if (sun.transit) items.push({ label: t(lang, "label.sun_transit"), value: sun.transit });
    if (sun.set) items.push({ label: t(lang, "label.sunset"), value: sun.set });
    return items;
  }, [lang, sunTimesQuery.data]);

  useEffect(() => {
    const onRefresh = () => {
      void dashboardQuery.refetch();
      void sunTimesQuery.refetch();
      if (hasTcWarning) void tcTrackQuery.refetch();
    };

    window.addEventListener("tw:refresh", onRefresh);
    return () => window.removeEventListener("tw:refresh", onRefresh);
  }, [dashboardQuery, hasTcWarning, sunTimesQuery, tcTrackQuery]);

  const nowVisual = useMemo(() => {
    return getHkoWeatherVisual(now?.iconCode ?? null);
  }, [now?.iconCode]);

  const retry = () => void dashboardQuery.refetch();
  const retryLabel = t(lang, "action.retry");

  return (
    <AppShell header={<Topbar />}>
      <h1 className="sr-only">{t(lang, "label.board")}</h1>
      <div className="space-y-8">
        {errors?.warnings ? (
          <Alert
            variant="warning"
            message={t(lang, "error.warnings")}
            onRetry={retry}
            retryLabel={retryLabel}
          />
        ) : null}
        <SignalStrip
          warnings={errors?.warnings ? [] : warnings}
          tips={errors?.swt ? undefined : swt?.tips}
        />

        {errors?.swt ? (
          <Alert
            variant="advisory"
            message={t(lang, "error.tips")}
            onRetry={retry}
            retryLabel={retryLabel}
          />
        ) : null}

        {hasTcWarning && tcTrackQuery.data?.cyclones.length ? (
          <section aria-labelledby="tc-heading" className="border border-[rgb(var(--signal-red)/0.35)] bg-[rgb(var(--signal-red)/0.06)] p-4">
            <h2 id="tc-heading" className="label text-[rgb(var(--muted))]">{t(lang, "label.typhoon")}</h2>
            <div className="mt-3 space-y-4">
              {tcTrackQuery.data.cyclones.map((cyclone) => {
                const latest = cyclone.latestPast ?? cyclone.latestForecast;
                return (
                  <div key={cyclone.id} className="text-sm">
                    <div className="font-display text-xl font-bold">
                      {cyclone.englishName}
                      {cyclone.chineseName ? (
                        <span className="ml-2 font-normal text-[rgb(var(--muted))]">
                          {cyclone.chineseName}
                        </span>
                      ) : null}
                    </div>
                    {latest ? (
                      <div className="mt-2 space-y-1 text-[rgb(var(--muted))]">
                        <div>{latest.intensity}</div>
                        <div>
                          {latest.maximumWind} · {latest.latitude} {latest.longitude}
                        </div>
                        {latest.time ? (
                          <div className="font-data text-xs">
                            {formatHktDateTime(latest.time)}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    <a
                      href="https://www.hko.gov.hk/en/wxinfo/currwx/tc_gis.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--signal-teal))] hover:underline"
                    >
                      {t(lang, "label.typhoon.view_map")}
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <section
          aria-labelledby="now-heading"
          className="min-h-[220px] border border-[rgb(var(--rule))] bg-[rgb(var(--card))] p-4 sm:p-6"
        >
          <h2 id="now-heading" className="label text-[rgb(var(--muted))]">{t(lang, "label.now")}</h2>

          {errors?.now ? (
            <div className="mt-3">
              <Alert
                variant="warning"
                message={t(lang, "error.now")}
                onRetry={retry}
                retryLabel={retryLabel}
              />
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <div
                  className="anim-temp font-display text-7xl font-extrabold leading-none tracking-tight tabular-nums sm:text-8xl"
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
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: toneColor(tempTone) }}
                  />
                  <nowVisual.Icon className="h-4 w-4 shrink-0" style={{ color: toneColor(tempTone) }} />
                  <span>{nowVisual.label}</span>
                </div>
              </div>

              <div className="meta space-y-1 sm:text-right">
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

          {!errors?.now && (hasLightning || (now?.tcMessage?.length ?? 0) > 0) ? (
            <div className="mt-4 space-y-2">
              {hasLightning ? (
                <Alert variant="advisory" message={t(lang, "label.lightning.active")} />
              ) : null}
              {now?.tcMessage?.length ? (
                <Alert variant="warning">
                  {now.tcMessage.map((line, index) => (
                    <p key={`tc-${index}`} className={index > 0 ? "mt-1" : "mt-0.5"}>
                      {line}
                    </p>
                  ))}
                </Alert>
              ) : null}
            </div>
          ) : null}

          {!errors?.now && nowStats.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-[rgb(var(--rule))] pt-3 font-data text-xs text-[rgb(var(--muted))]">
              {nowStats.map((stat) => (
                <div key={stat.label}>
                  <span className="uppercase tracking-[0.1em]">{stat.label}</span>{" "}
                  <span className="text-[rgb(var(--fg))]">{stat.value}</span>
                </div>
              ))}
            </div>
          ) : null}

          {sunLedger.length > 0 ? (
            <dl className="mt-4 grid grid-cols-3 divide-x divide-[rgb(var(--rule))] border-y border-[rgb(var(--rule))]">
              {sunLedger.map((entry) => (
                <div key={entry.label} className="px-3 py-2 first:pl-0">
                  <dt className="font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                    {entry.label}
                  </dt>
                  <dd className="mt-0.5 font-data text-sm text-[rgb(var(--fg))]">
                    {entry.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>

        <section aria-labelledby="forecast-heading">
          <div className="flex items-end justify-between gap-3">
            <h2 id="forecast-heading" className="label text-[rgb(var(--muted))]">{t(lang, "label.forecast_9d")}</h2>
            {forecast?.updateTime ? (
              <div className="font-data text-xs text-[rgb(var(--muted))]">
                {t(lang, "label.updated")} {formatHktDateTime(forecast.updateTime)}
              </div>
            ) : null}
          </div>

          {errors?.forecast9d ? (
            <div className="mt-3">
              <Alert
                variant="warning"
                message={t(lang, "error.forecast_9d")}
                onRetry={retry}
                retryLabel={retryLabel}
              />
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-px border-y border-[rgb(var(--rule))] bg-[rgb(var(--rule))] md:grid-cols-5 xl:grid-cols-9">
                {dashboardQuery.isLoading
                  ? Array.from({ length: 9 }).map((_, index) => (
                      <div
                        key={index}
                        className="min-h-[168px] animate-pulse bg-[rgb(var(--bg))] px-3 py-3"
                      >
                        <div className="h-3 w-8 bg-[rgb(var(--fg)/0.08)]" />
                        <div className="mt-2 h-6 w-14 bg-[rgb(var(--fg)/0.08)]" />
                        <div className="mt-2 h-3 w-16 bg-[rgb(var(--fg)/0.06)]" />
                        <div className="mt-2 h-8 w-full bg-[rgb(var(--fg)/0.04)]" />
                      </div>
                    ))
                  : previewDays.map((day) => {
                      const visual = getHkoWeatherVisual(day.ForecastIcon ?? null);
                      const psrText = day.PSR
                        ? `${t(lang, "label.rain_probability")}: ${day.PSR}`
                        : null;
                      return (
                        <div
                          key={day.forecastDate}
                          className="min-h-[168px] bg-[rgb(var(--bg))] px-3 py-3 transition-colors hover:bg-[rgb(var(--fg)/0.04)]"
                        >
                          <div className="font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                            {day.week.slice(0, 3)}
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="font-display text-xl font-bold tabular-nums">
                              {day.forecastMaxtemp.value}°
                            </div>
                            <visual.Icon
                              className="h-4 w-4 shrink-0 text-[rgb(var(--signal-teal))]"
                              aria-label={visual.label}
                            />
                          </div>
                          <div className="font-data text-xs tabular-nums text-[rgb(var(--muted))]">
                            {t(lang, "label.low")} {day.forecastMintemp.value}°
                          </div>
                          {day.forecastMinrh && day.forecastMaxrh ? (
                            <div className="mt-1 font-data text-xs tabular-nums text-[rgb(var(--muted))]">
                              {day.forecastMinrh.value}–{day.forecastMaxrh.value}
                              {day.forecastMaxrh.unit}
                            </div>
                          ) : null}
                          {psrText ? (
                            <div
                              title={psrText}
                              className="mt-1 line-clamp-2 font-data text-xs uppercase leading-snug tracking-[0.08em] text-[rgb(var(--signal-teal))]"
                            >
                              {psrText}
                            </div>
                          ) : null}
                          {day.forecastWind ? (
                            <div
                              title={day.forecastWind}
                              className="mt-1 line-clamp-2 text-xs leading-snug text-[rgb(var(--muted))]"
                            >
                              {day.forecastWind}
                            </div>
                          ) : null}
                          <div
                            title={day.forecastWeather}
                            className="mt-2 line-clamp-2 text-xs leading-snug text-[rgb(var(--muted))]"
                          >
                            {day.forecastWeather}
                          </div>
                        </div>
                      );
                    })}
              </div>
          )}

          {!errors?.forecast9d && (forecast?.seaTemp || (forecast?.soilTemp?.length ?? 0) > 0) ? (
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-data text-xs text-[rgb(var(--muted))]">
              {forecast?.seaTemp?.value != null ? (
                <div>
                  <span className="uppercase tracking-[0.1em]">{t(lang, "label.sea_temp")}</span>{" "}
                  <span className="text-[rgb(var(--fg))]">
                    {forecast.seaTemp.value}
                    {forecast.seaTemp.unit ?? "°C"}
                    {forecast.seaTemp.place ? ` · ${forecast.seaTemp.place}` : ""}
                  </span>
                </div>
              ) : null}
              {forecast?.soilTemp?.map((entry, index) =>
                entry.value != null ? (
                  <div key={`soil-${index}`}>
                    <span className="uppercase tracking-[0.1em]">{t(lang, "label.soil_temp")}</span>{" "}
                    <span className="text-[rgb(var(--fg))]">
                      {entry.value}
                      {entry.unit ?? "°C"}
                      {entry.place ? ` · ${entry.place}` : ""}
                      {entry.depth?.value != null
                        ? ` (${entry.depth.value}${entry.depth.unit ?? "cm"})`
                        : ""}
                    </span>
                  </div>
                ) : null,
              )}
            </div>
          ) : null}
        </section>

        <section aria-labelledby="local-heading" className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="local-heading" className="label text-[rgb(var(--muted))]">{t(lang, "label.local_forecast")}</h2>
            {errors?.localForecast ? (
              <div className="mt-3">
                <Alert
                  variant="warning"
                  message={t(lang, "error.local_forecast")}
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
                  <div className="h-24 animate-pulse rounded-[var(--radius)] bg-[rgb(var(--fg)/0.06)]" />
                ) : localForecast?.forecastDesc ? (
                  <p className="text-base leading-relaxed">{localForecast.forecastDesc}</p>
                ) : (
                  <p className="text-[rgb(var(--muted))]">—</p>
                )}
                {!dashboardQuery.isLoading && localForecast ? (
                  <Link
                    href="/explore"
                    className="inline-block font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--signal-teal))] hover:underline"
                  >
                    {t(lang, "label.local_forecast.brief")}
                  </Link>
                ) : null}
                {localForecast?.tcInfo ? (
                  <Alert variant="warning" message={localForecast.tcInfo} />
                ) : null}
                {localForecast?.fireDangerWarning ? (
                  <Alert variant="advisory" message={localForecast.fireDangerWarning} />
                ) : null}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <RainfallPanel />
          </div>
        </section>

        {dashboardQuery.error ? (
          <Alert
            variant="warning"
            message={t(lang, "error.board")}
            onRetry={retry}
            retryLabel={retryLabel}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
