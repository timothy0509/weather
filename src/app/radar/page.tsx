"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { api } from "@/app/providers";
import { AppShell } from "@/components/app-shell";
import { Panel } from "@/components/panel";
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
  const imageUrl = radarQuery.data?.imageUrl;
  const showSkeleton = radarQuery.isLoading || (!radarQuery.error && !imageUrl);
  const updatedMeta = radarQuery.data?.timestamp
    ? `${t(lang, "label.updated")} ${formatHktDateTime(radarQuery.data.timestamp)}`
    : undefined;

  return (
    <AppShell header={<Topbar />}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {t(lang, "label.radar")}
          </h1>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">
            {t(lang, "label.radar.lede")}
          </p>
        </div>

        <Panel title={t(lang, "label.radar")} meta={updatedMeta}>
          <div className="flex flex-wrap items-center gap-2">
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

          {radarQuery.error ? (
            <p className="mt-4 text-sm text-[rgb(var(--signal-red))]">{t(lang, "error.radar")}</p>
          ) : (
            <div className="mt-4 space-y-3">
              <figure className="relative mx-auto aspect-square w-full max-w-[70vh] overflow-hidden rounded-[var(--radius)] border border-[rgb(var(--rule))] bg-[rgb(var(--fg)/0.04)]">
                {showSkeleton ? (
                  <div
                    className="absolute inset-0 animate-pulse bg-[rgb(var(--fg)/0.06)]"
                    aria-hidden
                  />
                ) : imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`HKO weather radar ${range}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 70vh"
                    className="object-contain"
                    priority
                  />
                ) : null}
              </figure>
              <a
                href="https://www.hko.gov.hk/en/wxinfo/radars/radar.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--signal-teal))] hover:underline"
              >
                {t(lang, "label.radar.viewer")}
              </a>
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
