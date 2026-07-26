"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "@/app/providers";
import { AppShell } from "@/components/app-shell";
import { Topbar } from "@/components/topbar";
import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsButton } from "@/components/ui/tabs";
import { CLIMATE_STATIONS, TIDE_STATIONS } from "@/lib/hko-stations";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { formatHktDateTime, getHktDateParts, getHktYesterdayIso, toCompactDate } from "@/lib/time";

const OPENDATA_PRESETS = [
  { label: "Sunrise/sunset (SRS)", dataType: "SRS", dateMode: "day" as const, requiresStation: false },
  { label: "Moonrise/moonset (MRS)", dataType: "MRS", dateMode: "day" as const, requiresStation: false },
  { label: "Visibility (LTMV)", dataType: "LTMV", dateMode: "none" as const, requiresStation: false },
  { label: "Lightning count (LHL)", dataType: "LHL", dateMode: "none" as const, requiresStation: false },
  { label: "Daily mean temp (CLMTEMP)", dataType: "CLMTEMP", dateMode: "month" as const, requiresStation: true },
  { label: "Daily max temp (CLMMAXT)", dataType: "CLMMAXT", dateMode: "month" as const, requiresStation: true },
  { label: "Daily min temp (CLMMINT)", dataType: "CLMMINT", dateMode: "month" as const, requiresStation: true },
  { label: "Radiation report (RYES)", dataType: "RYES", dateMode: "yesterday" as const, requiresStation: false },
] as const;

type Preset = (typeof OPENDATA_PRESETS)[number];

function Panel({
  title,
  meta,
  children,
  className,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-[rgb(var(--rule))] bg-[rgb(var(--card))] p-5", className)}>
      <div className="flex items-end justify-between gap-3">
        <div className="section-label">{title}</div>
        {meta ? <div className="font-data text-[0.65rem] text-[rgb(var(--muted))]">{meta}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ExplorePage() {
  const { lang } = useStationContext();

  const hktToday = useMemo(() => getHktDateParts(), []);
  const hktYesterday = useMemo(() => getHktYesterdayIso(), []);
  const lunarDate = hktToday.iso;

  const localQuery = api.weather.localForecast.useQuery({ lang });
  const tipsQuery = api.weather.specialWeatherTips.useQuery({ lang });
  const earthquakeQuery = api.weather.earthquake.useQuery();
  const lunarQuery = api.weather.lunarDate.useQuery({ date: lunarDate });

  const [preset, setPreset] = useState<Preset>(OPENDATA_PRESETS[0]);
  const [climateStation, setClimateStation] = useState<string>("HKO");
  const [tideStation, setTideStation] = useState<string>("QUB");
  const [tideMode, setTideMode] = useState<"heights" | "times">("heights");

  const openDataParams = useMemo(() => {
    const base = {
      dataType: preset.dataType,
      lang,
    };

    if (preset.dateMode === "yesterday") {
      return { ...base, date: toCompactDate(hktYesterday) };
    }

    if (preset.dateMode === "month") {
      return {
        ...base,
        year: hktToday.year - 1,
        month: hktToday.month,
        station: preset.requiresStation ? climateStation : undefined,
      };
    }

    if (preset.dateMode === "day") {
      return {
        ...base,
        year: hktToday.year,
        month: hktToday.month,
        day: hktToday.day,
        station: preset.requiresStation ? climateStation : undefined,
      };
    }

    return base;
  }, [climateStation, hktToday.day, hktToday.month, hktToday.year, hktYesterday, lang, preset]);

  const openDataQuery = api.weather.openData.useQuery(openDataParams, {
    staleTime: 5 * 60_000,
  });

  const tideHeightsQuery = api.weather.tideHeights.useQuery(
    {
      station: tideStation,
      year: hktToday.year,
      month: hktToday.month,
      day: hktToday.day,
    },
    { staleTime: 60 * 60_000, enabled: tideMode === "heights" },
  );

  const tideTimesQuery = api.weather.tideTimes.useQuery(
    {
      station: tideStation,
      year: hktToday.year,
      month: hktToday.month,
      day: hktToday.day,
    },
    { staleTime: 60 * 60_000, enabled: tideMode === "times" },
  );

  const openDataRows = useMemo(() => {
    const fields = openDataQuery.data?.fields ?? [];
    const rows = openDataQuery.data?.data ?? [];
    return { fields, rows };
  }, [openDataQuery.data?.data, openDataQuery.data?.fields]);

  const tideData = tideMode === "heights" ? tideHeightsQuery.data : tideTimesQuery.data;
  const tideLoading = tideMode === "heights" ? tideHeightsQuery.isLoading : tideTimesQuery.isLoading;
  const tideError = tideMode === "heights" ? tideHeightsQuery.error : tideTimesQuery.error;

  useEffect(() => {
    const onRefresh = () => {
      void localQuery.refetch();
      void tipsQuery.refetch();
      void earthquakeQuery.refetch();
      void lunarQuery.refetch();
      void openDataQuery.refetch();
      void tideHeightsQuery.refetch();
      void tideTimesQuery.refetch();
    };
    window.addEventListener("tw:refresh", onRefresh);
    return () => window.removeEventListener("tw:refresh", onRefresh);
  }, [earthquakeQuery, localQuery, lunarQuery, openDataQuery, tideHeightsQuery, tideTimesQuery, tipsQuery]);

  return (
    <AppShell header={<Topbar />}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Explore</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[rgb(var(--muted))]">
            Extra Observatory datasets — local brief, tips, tremors, lunar calendar, tides, and open tables.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <Panel
            className="lg:col-span-6"
            title="Local forecast"
            meta={
              localQuery.data?.updateTime
                ? formatHktDateTime(localQuery.data.updateTime)
                : undefined
            }
          >
            {localQuery.isLoading ? (
              <div className="h-24 animate-pulse bg-[rgb(var(--fg)/0.06)]" />
            ) : localQuery.error ? (
              <p className="text-sm text-[rgb(var(--signal-red))]">Local forecast unavailable</p>
            ) : (
              <div className="space-y-3 text-sm leading-relaxed">
                {localQuery.data?.forecastPeriod ? (
                  <div className="font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                    {localQuery.data.forecastPeriod}
                  </div>
                ) : null}
                {localQuery.data?.forecastDesc ? <p>{localQuery.data.forecastDesc}</p> : null}
                {localQuery.data?.outlook ? (
                  <p className="text-[rgb(var(--muted))]">{localQuery.data.outlook}</p>
                ) : null}
                {localQuery.data?.tcInfo ? (
                  <p className="border-l-4 border-[rgb(var(--signal-red))] pl-3">
                    {localQuery.data.tcInfo}
                  </p>
                ) : null}
                {localQuery.data?.fireDangerWarning ? (
                  <p className="border-l-4 border-[rgb(var(--signal-amber))] pl-3">
                    {localQuery.data.fireDangerWarning}
                  </p>
                ) : null}
              </div>
            )}
          </Panel>

          <Panel
            className="lg:col-span-6"
            title="Special weather tips"
            meta={`${tipsQuery.data?.tips.length ?? 0} items`}
          >
            {tipsQuery.isLoading ? (
              <div className="h-24 animate-pulse bg-[rgb(var(--fg)/0.06)]" />
            ) : tipsQuery.error ? (
              <p className="text-sm text-[rgb(var(--signal-red))]">Tips unavailable</p>
            ) : tipsQuery.data?.tips.length ? (
              <div className="space-y-3">
                {tipsQuery.data.tips.map((line, index) => (
                  <p
                    key={`${index}-${line.slice(0, 10)}`}
                    className="border-l-4 border-[rgb(var(--signal-amber))] pl-3 text-sm leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[rgb(var(--muted))]">None</p>
            )}
          </Panel>

          <Panel
            className="lg:col-span-6"
            title="Earthquake"
            meta={
              earthquakeQuery.data?.quick.updateTime
                ? formatHktDateTime(earthquakeQuery.data.quick.updateTime)
                : undefined
            }
          >
            {earthquakeQuery.isLoading ? (
              <div className="h-24 animate-pulse bg-[rgb(var(--fg)/0.06)]" />
            ) : earthquakeQuery.error ? (
              <p className="text-sm text-[rgb(var(--signal-red))]">Earthquake data unavailable</p>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <div className="section-label">Quick message</div>
                  <div className="mt-2 font-display text-2xl font-bold">
                    M {earthquakeQuery.data?.quick.mag ?? "—"}
                  </div>
                  <div className="mt-1 text-[rgb(var(--muted))]">
                    {earthquakeQuery.data?.quick.region ?? ""}
                  </div>
                </div>

                {earthquakeQuery.data?.felt?.updateTime ? (
                  <div>
                    <div className="section-label">Locally felt</div>
                    <div className="mt-2 font-display text-xl font-bold">
                      M {earthquakeQuery.data.felt.mag ?? "—"}
                    </div>
                    <div className="mt-1 text-[rgb(var(--muted))]">
                      {earthquakeQuery.data.felt.region ?? ""}
                    </div>
                    {earthquakeQuery.data.felt.details ? (
                      <p className="mt-2 text-xs leading-relaxed text-[rgb(var(--muted))]">
                        {earthquakeQuery.data.felt.details}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </Panel>

          <Panel className="lg:col-span-6" title="Lunar date" meta={lunarDate}>
            {lunarQuery.isLoading ? (
              <div className="h-24 animate-pulse bg-[rgb(var(--fg)/0.06)]" />
            ) : lunarQuery.error ? (
              <p className="text-sm text-[rgb(var(--signal-red))]">Lunar date unavailable</p>
            ) : (
              <div>
                <div className="font-display text-2xl font-bold">{lunarQuery.data?.LunarYear}</div>
                <div className="mt-1 text-[rgb(var(--muted))]">{lunarQuery.data?.LunarDate}</div>
              </div>
            )}
          </Panel>

          <Panel className="lg:col-span-12" title={t(lang, "label.tides")} meta={hktToday.iso}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Tabs>
                <TabsButton
                  active={tideMode === "heights"}
                  onClick={() => setTideMode("heights")}
                >
                  {t(lang, "label.tide_heights")}
                </TabsButton>
                <TabsButton active={tideMode === "times"} onClick={() => setTideMode("times")}>
                  {t(lang, "label.tide_times")}
                </TabsButton>
              </Tabs>

              <select
                value={tideStation}
                onChange={(event) => setTideStation(event.target.value)}
                className="border border-[rgb(var(--rule))] bg-[rgb(var(--bg))] px-3 py-1.5 font-data text-xs uppercase tracking-[0.08em]"
              >
                {TIDE_STATIONS.map((entry) => (
                  <option key={entry.code} value={entry.code}>
                    {entry.label} ({entry.code})
                  </option>
                ))}
              </select>
            </div>

            {tideLoading ? (
              <div className="mt-4 h-32 animate-pulse bg-[rgb(var(--fg)/0.06)]" />
            ) : tideError ? (
              <p className="mt-4 text-sm text-[rgb(var(--signal-red))]">Tide data unavailable</p>
            ) : (
              <div className="mt-4 overflow-auto border border-[rgb(var(--rule))]">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-[rgb(var(--bg))] font-data text-[0.65rem] uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                    <tr>
                      {(tideData?.fields ?? []).map((field) => (
                        <th key={field} className="px-3 py-2 font-medium">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(tideData?.data ?? []).map((row, index) => (
                      <tr key={index} className="border-t border-[rgb(var(--rule))]">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 font-data text-xs">
                            {typeof cell === "string" || typeof cell === "number"
                              ? String(cell)
                              : JSON.stringify(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <Panel className="lg:col-span-12" title="Open data table">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Tabs>
                {OPENDATA_PRESETS.map((entry) => (
                  <TabsButton
                    key={entry.dataType}
                    active={entry.dataType === preset.dataType}
                    onClick={() => setPreset(entry)}
                  >
                    {entry.dataType}
                  </TabsButton>
                ))}
              </Tabs>

              <div className="flex flex-wrap items-center gap-2 font-data text-[0.65rem] uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                <span>{preset.label}</span>
                {preset.dateMode === "day" ? <span>{hktToday.iso}</span> : null}
                {preset.dateMode === "month" ? (
                  <span>
                    {hktToday.year - 1}-{String(hktToday.month).padStart(2, "0")}
                  </span>
                ) : null}
                {preset.dateMode === "yesterday" ? <span>{hktYesterday}</span> : null}
                {preset.requiresStation ? (
                  <select
                    value={climateStation}
                    onChange={(event) => setClimateStation(event.target.value)}
                    className="border border-[rgb(var(--rule))] bg-[rgb(var(--bg))] px-2 py-1 font-data text-[0.65rem] uppercase tracking-[0.08em] text-[rgb(var(--fg))]"
                  >
                    {CLIMATE_STATIONS.map((entry) => (
                      <option key={entry.code} value={entry.code}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => openDataQuery.refetch()}
                >
                  {t(lang, "action.refresh")}
                </Button>
              </div>
            </div>

            {openDataQuery.isLoading ? (
              <div className="mt-4 h-44 animate-pulse bg-[rgb(var(--fg)/0.06)]" />
            ) : openDataQuery.error ? (
              <p className="mt-4 text-sm text-[rgb(var(--signal-red))]">Open data unavailable</p>
            ) : (
              <div className="mt-4 overflow-auto border border-[rgb(var(--rule))]">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-[rgb(var(--bg))] font-data text-[0.65rem] uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                    <tr>
                      {openDataRows.fields.map((field) => (
                        <th key={field} className="px-3 py-2 font-medium">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {openDataRows.rows.slice(0, 64).map((row, index) => (
                      <tr key={index} className="border-t border-[rgb(var(--rule))]">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 font-data text-xs">
                            {typeof cell === "string" || typeof cell === "number"
                              ? String(cell)
                              : JSON.stringify(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
