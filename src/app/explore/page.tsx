"use client";

import { useMemo, useState } from "react";

import { api } from "@/app/providers";
import { AppShell } from "@/components/app-shell";
import { Topbar } from "@/components/topbar";
import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsButton } from "@/components/ui/tabs";
import { t } from "@/lib/i18n";
import { formatHktDateTime } from "@/lib/time";

const OPENDATA_PRESETS = [
  { label: "Sunrise/sunset (SRS)", dataType: "SRS", requiresDate: true },
  { label: "Moonrise/moonset (MRS)", dataType: "MRS", requiresDate: true },
  { label: "Visibility (LTMV)", dataType: "LTMV", requiresDate: false },
  { label: "Lightning count (LHL)", dataType: "LHL", requiresDate: false },
] as const;

type Preset = (typeof OPENDATA_PRESETS)[number];

export default function ExplorePage() {
  const { lang } = useStationContext();

  const lunarDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const localQuery = api.weather.localForecast.useQuery({ lang });
  const tipsQuery = api.weather.specialWeatherTips.useQuery({ lang });
  const earthquakeQuery = api.weather.earthquake.useQuery();
  const lunarQuery = api.weather.lunarDate.useQuery({ date: lunarDate });

  const [preset, setPreset] = useState<Preset>(OPENDATA_PRESETS[0]);

  const now = useMemo(() => new Date(), []);
  const openDataParams = useMemo(() => {
    return {
      dataType: preset.dataType,
      year: preset.requiresDate ? now.getFullYear() : undefined,
      month: preset.requiresDate ? now.getMonth() + 1 : undefined,
      day: preset.requiresDate ? now.getDate() : undefined,
      lang,
    };
  }, [lang, now, preset.dataType, preset.requiresDate]);

  const openDataQuery = api.weather.openData.useQuery(openDataParams, {
    staleTime: 5 * 60_000,
  });

  const openDataRows = useMemo(() => {
    const fields = openDataQuery.data?.fields ?? [];
    const rows = openDataQuery.data?.data ?? [];
    return { fields, rows };
  }, [openDataQuery.data?.data, openDataQuery.data?.fields]);

  return (
    <AppShell header={<Topbar />}>
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-12">
          <div className="text-sm font-semibold">Explore</div>
          <div className="mt-1 text-xs text-[rgb(var(--muted))]">
            Extra datasets from the Hong Kong Observatory Open Data APIs.
          </div>
        </Card>

        <Card className="p-6 lg:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Local Forecast (flw)</div>
            <div className="text-xs text-[rgb(var(--muted))]">
              {localQuery.data?.updateTime ? formatHktDateTime(localQuery.data.updateTime) : ""}
            </div>
          </div>

          {localQuery.isLoading ? (
            <div className="mt-4 h-24 animate-pulse rounded-2xl bg-[rgb(var(--fg)/0.06)]" />
          ) : localQuery.error ? (
            <div className="mt-4 text-sm text-red-500">Failed to load local forecast.</div>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              {localQuery.data?.forecastPeriod ? (
                <div className="text-xs text-[rgb(var(--muted))]">{localQuery.data.forecastPeriod}</div>
              ) : null}
              {localQuery.data?.forecastDesc ? <p>{localQuery.data.forecastDesc}</p> : null}
              {localQuery.data?.outlook ? (
                <p className="text-[rgb(var(--muted))]">{localQuery.data.outlook}</p>
              ) : null}
              {localQuery.data?.tcInfo ? (
                <p className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] px-4 py-3">
                  {localQuery.data.tcInfo}
                </p>
              ) : null}
              {localQuery.data?.fireDangerWarning ? (
                <p className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] px-4 py-3">
                  {localQuery.data.fireDangerWarning}
                </p>
              ) : null}
              {localQuery.data?.generalSituation ? (
                <p className="text-xs text-[rgb(var(--muted))]">{localQuery.data.generalSituation}</p>
              ) : null}
            </div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Special Weather Tips (swt)</div>
            <div className="text-xs text-[rgb(var(--muted))]">{tipsQuery.data?.tips.length ?? 0} items</div>
          </div>

          {tipsQuery.isLoading ? (
            <div className="mt-4 h-24 animate-pulse rounded-2xl bg-[rgb(var(--fg)/0.06)]" />
          ) : tipsQuery.error ? (
            <div className="mt-4 text-sm text-red-500">Failed to load tips.</div>
          ) : tipsQuery.data?.tips.length ? (
            <div className="mt-4 space-y-2">
              {tipsQuery.data.tips.map((line, index) => (
                <div
                  key={`${index}-${line.slice(0, 10)}`}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] px-4 py-3 text-sm"
                >
                  {line}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm text-[rgb(var(--muted))]">None</div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Earthquake</div>
            <div className="text-xs text-[rgb(var(--muted))]">
              {earthquakeQuery.data?.quick.updateTime
                ? formatHktDateTime(earthquakeQuery.data.quick.updateTime)
                : ""}
            </div>
          </div>

          {earthquakeQuery.isLoading ? (
            <div className="mt-4 h-24 animate-pulse rounded-2xl bg-[rgb(var(--fg)/0.06)]" />
          ) : earthquakeQuery.error ? (
            <div className="mt-4 text-sm text-red-500">Failed to load earthquake data.</div>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <div className="text-xs text-[rgb(var(--muted))]">Quick Earthquake Message (qem)</div>
                <div className="mt-1 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] px-4 py-3">
                  <div className="font-medium">M {earthquakeQuery.data?.quick.mag ?? "1"}</div>
                  <div className="text-[rgb(var(--muted))]">{earthquakeQuery.data?.quick.region ?? ""}</div>
                </div>
              </div>

              {earthquakeQuery.data?.felt?.updateTime ? (
                <div>
                  <div className="text-xs text-[rgb(var(--muted))]">Locally Felt Earth Tremor (feltearthquake)</div>
                  <div className="mt-1 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] px-4 py-3">
                    <div className="font-medium">M {earthquakeQuery.data.felt.mag ?? "1"}</div>
                    <div className="text-[rgb(var(--muted))]">{earthquakeQuery.data.felt.region ?? ""}</div>
                    {earthquakeQuery.data.felt.details ? (
                      <div className="mt-2 text-xs text-[rgb(var(--muted))]">{earthquakeQuery.data.felt.details}</div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Lunar Date</div>
            <div className="text-xs text-[rgb(var(--muted))]">{lunarDate}</div>
          </div>

          {lunarQuery.isLoading ? (
            <div className="mt-4 h-24 animate-pulse rounded-2xl bg-[rgb(var(--fg)/0.06)]" />
          ) : lunarQuery.error ? (
            <div className="mt-4 text-sm text-red-500">Failed to load lunar date.</div>
          ) : (
            <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] px-4 py-3 text-sm">
              <div className="font-medium">{lunarQuery.data?.LunarYear}</div>
              <div className="mt-1 text-[rgb(var(--muted))]">{lunarQuery.data?.LunarDate}</div>
            </div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold">Open Data Table</div>
              <div className="mt-1 text-xs text-[rgb(var(--muted))]">
                Generic &quot;fields + data&quot; viewer.
              </div>
            </div>

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
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[rgb(var(--muted))]">
            <span>dataType: {preset.dataType}</span>
            {preset.requiresDate ? (
              <span>
                date: {openDataParams.year}-{String(openDataParams.month).padStart(2, "0")}-
                {String(openDataParams.day).padStart(2, "0")}
              </span>
            ) : null}
            <Button type="button" size="sm" variant="ghost" onClick={() => openDataQuery.refetch()}>
              {t(lang, "action.refresh")}
            </Button>
          </div>

          {openDataQuery.isLoading ? (
            <div className="mt-4 h-44 animate-pulse rounded-2xl bg-[rgb(var(--fg)/0.06)]" />
          ) : openDataQuery.error ? (
            <div className="mt-4 text-sm text-red-500">Failed to load OpenData dataset.</div>
          ) : (
            <div className="mt-4 overflow-auto rounded-2xl border border-[rgb(var(--border))]">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[rgb(var(--fg)/0.03)] text-xs text-[rgb(var(--muted))]">
                  <tr>
                    {openDataRows.fields.map((field) => (
                      <th key={field} className="px-4 py-3 font-medium">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {openDataRows.rows.slice(0, 64).map((row, index) => (
                    <tr key={index} className="border-t border-[rgb(var(--border))]">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3">
                          {typeof cell === "string" || typeof cell === "number" ? String(cell) : JSON.stringify(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
