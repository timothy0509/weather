"use client";

import { useEffect, useState } from "react";

import { api } from "@/app/providers";
import { AppShell } from "@/components/app-shell";
import { Topbar } from "@/components/topbar";
import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsButton } from "@/components/ui/tabs";
import { RADAR_RANGES, type RadarRange } from "@/lib/hko-radar";
import { t } from "@/lib/i18n";
import { formatHktDateTime } from "@/lib/time";

export default function RadarPage() {
  const { lang } = useStationContext();
  const [range, setRange] = useState<RadarRange>("128");

  const radarQuery = api.weather.radar.useQuery(
    { range },
    { staleTime: 3 * 60_000, refetchInterval: 3 * 60_000 },
  );

  useEffect(() => {
    const onRefresh = () => {
      void radarQuery.refetch();
    };
    window.addEventListener("tw:refresh", onRefresh);
    return () => window.removeEventListener("tw:refresh", onRefresh);
  }, [radarQuery]);

  const availableRanges = radarQuery.data?.availableRanges ?? RADAR_RANGES.map((r) => r.id);

  return (
    <AppShell header={<Topbar />}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {t(lang, "label.radar")}
            </h1>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">
              Hong Kong Observatory weather radar imagery
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Tabs>
              {RADAR_RANGES.filter((entry) => availableRanges.includes(entry.id)).map((entry) => (
                <TabsButton
                  key={entry.id}
                  active={range === entry.id}
                  onClick={() => setRange(entry.id)}
                >
                  {entry.label}
                </TabsButton>
              ))}
            </Tabs>
            <Button type="button" size="sm" variant="ghost" onClick={() => radarQuery.refetch()}>
              {t(lang, "action.refresh")}
            </Button>
          </div>
        </div>

        {radarQuery.isLoading ? (
          <div className="aspect-square max-h-[70vh] w-full animate-pulse bg-[rgb(var(--fg)/0.06)]" />
        ) : radarQuery.error ? (
          <p className="text-sm text-[rgb(var(--signal-red))]">Radar imagery unavailable</p>
        ) : (
          <div className="space-y-3">
            {radarQuery.data?.timestamp ? (
              <div className="font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
                {t(lang, "label.updated")} {formatHktDateTime(radarQuery.data.timestamp)}
              </div>
            ) : null}
            {radarQuery.data?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={radarQuery.data.imageUrl}
                alt={`HKO weather radar ${range}`}
                className="w-full max-h-[70vh] border border-[rgb(var(--rule))] object-contain bg-black"
              />
            ) : null}
            <a
              href="https://www.hko.gov.hk/en/wxinfo/radars/radar.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--signal-teal))] hover:underline"
            >
              HKO interactive radar viewer
            </a>
          </div>
        )}
      </div>
    </AppShell>
  );
}
