"use client";

import { useMemo } from "react";

import Link from "next/link";

import { Compass, MapPin, RotateCw } from "lucide-react";

import { LanguageToggle } from "@/components/language-toggle";
import { StationCommand } from "@/components/station-command";
import { useStationContext } from "@/components/station-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPanel,
  DropdownMenuItemButton,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const { lang, station, stations, setStation } = useStationContext();

  const stationLabel = useMemo(() => station, [station]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-3 sm:justify-start">
         <div className="flex items-center gap-3">
           <div
             className="h-9 w-9 rounded-2xl"
             style={{
               background:
                 "radial-gradient(60% 60% at 30% 20%, rgb(var(--wx-rain)/0.8), transparent 70%), radial-gradient(70% 70% at 80% 30%, rgb(var(--wx-storm)/0.65), transparent 70%), rgb(var(--fg)/0.06)",
             }}
             aria-hidden="true"
           />
           <div>
             <div className="text-sm font-semibold tracking-tight">{t(lang, "app.title")}</div>
             <div className="text-xs text-[rgb(var(--muted))]">{t(lang, "app.region")}</div>
           </div>

           <Button asChild type="button" variant="ghost" size="sm" className="hidden sm:inline-flex">
             <Link href="/explore" aria-label="Explore">
               <Compass className="h-4 w-4" />
               <span>Explore</span>
             </Link>
           </Button>
         </div>
         <div className="flex items-center gap-2 sm:hidden">
           <RefreshButton />
           <ThemeToggle />
           <StationDropdown
             station={stationLabel}
             stations={stations}
             onSelect={setStation}
           />
         </div>

      </div>

       <div className="flex items-center justify-between gap-2 sm:justify-end">
         <div className="hidden items-center gap-2 sm:flex">
           <RefreshButton />
           <LanguageToggle />
           <ThemeToggle />
           <StationDropdown station={stationLabel} stations={stations} onSelect={setStation} />
         </div>


         <div className="flex items-center gap-2 sm:hidden">
           <Button asChild type="button" variant="ghost" size="sm" aria-label="Explore">
             <Link href="/explore">
               <Compass className="h-4 w-4" />
             </Link>
           </Button>
           <LanguageToggle />
         </div>

        <StationCommand
          stations={stations}
          value={stationLabel}
          onSelectAction={setStation}
        />
      </div>
    </div>
  );
}

function RefreshButton() {
  const { lang } = useStationContext();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => {
        window.dispatchEvent(new CustomEvent("tw:refresh"));
      }}
      aria-label={t(lang, "action.refresh")}
    >
      <RotateCw className="h-4 w-4" />
      <span className="hidden sm:inline">{t(lang, "action.refresh")}</span>
    </Button>
  );
}

function StationDropdown({
  station,
  stations,
  onSelect,
}: {
  station: string;
  stations: string[];
  onSelect: (next: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <MapPin className="h-4 w-4 text-[rgb(var(--muted))]" />
          <span className="max-w-[12rem] truncate">{station}</span>
                  </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPanel align="end">
        {(stations.length ? stations : [station]).map((entry) => (
          <DropdownMenuItemButton key={entry} onSelect={() => onSelect(entry)}>
            {entry}
          </DropdownMenuItemButton>
        ))}
      </DropdownMenuPanel>
    </DropdownMenu>
  );
}
