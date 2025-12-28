"use client";

import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { api } from "@/app/providers";
import { DEFAULT_LANGUAGE, DEFAULT_STATION, readStoredString } from "@/lib/settings";

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
  const [lang, setLang] = useState(() =>
    readStoredString("tw_lang", DEFAULT_LANGUAGE),
  );
  const [station, setStation] = useState(() =>
    readStoredString("tw_station", DEFAULT_STATION),
  );

  useEffect(() => {
    const handler = () => {
      setLang(readStoredString("tw_lang", DEFAULT_LANGUAGE));
      setStation(readStoredString("tw_station", DEFAULT_STATION));
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const nowQuery = api.weather.now.useQuery(
    { lang: lang as never, station },
    { staleTime: 60_000, refetchInterval: 120_000 },
  );
  const forecastQuery = api.weather.forecast9d.useQuery(
    { lang: lang as never },
    { staleTime: 30 * 60_000 },
  );
  const warningsQuery = api.weather.warnings.useQuery(
    { lang: lang as never },
    { staleTime: 120_000 },
  );

  const previewDays = useMemo(
    () => (forecastQuery.data?.days ?? []).slice(0, 9),
    [forecastQuery.data?.days],
  );

  return (
    <AppShell header={<Topbar />}>
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm text-[rgb(var(--muted))]">Now · {station}</div>
              <div className="mt-2 text-5xl font-semibold tracking-tight">
                {nowQuery.isLoading ? (
                  <span className="inline-block h-12 w-36 animate-pulse rounded-2xl bg-[rgb(var(--fg)/0.06)]" />
                ) : nowQuery.data?.temperature ? (
                  `${nowQuery.data.temperature.value}°`
                ) : (
                  "—"
                )}
              </div>
              <div className="mt-3 text-sm text-[rgb(var(--muted))]">
                {nowQuery.data?.humidity
                  ? `Humidity ${nowQuery.data.humidity.value}${nowQuery.data.humidity.unit}`
                  : ""}
                {nowQuery.data?.updateTime
                  ? ` · Updated ${formatIsoTime(nowQuery.data.updateTime)}`
                  : ""}
              </div>
            </div>

            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] px-4 py-3 text-sm">
              <div className="text-xs text-[rgb(var(--muted))]">HKO Icon</div>
              <div className="mt-1 text-sm font-semibold">
                {nowQuery.data?.iconCode ?? "—"}
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
                  <div className="text-sm font-medium">
                    {warning.name ?? warning.key}
                  </div>
                  {warning.contents?.[0] ? (
                    <div className="mt-1 line-clamp-2 text-xs text-[rgb(var(--muted))]">
                      {warning.contents[0]}
                    </div>
                  ) : null}
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
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold">
                          {day.forecastMaxtemp.value}°
                        </div>
                        <div className="text-xs text-[rgb(var(--muted))]">
                          Low {day.forecastMintemp.value}°
                        </div>
                      </div>
                      <div className="text-xs text-[rgb(var(--muted))]">
                        {day.ForecastIcon ?? ""}
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
      </div>
    </AppShell>
  );
}
