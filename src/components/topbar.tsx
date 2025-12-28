"use client";

import { useEffect, useMemo, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPanel,
  DropdownMenuItemButton,
} from "@/components/ui/dropdown-menu";
import { SearchIcon } from "@/components/ui/icon";

const DEFAULT_STATION = "Hong Kong Observatory";

const mockedStations = [
  "Hong Kong Observatory",
  "King's Park",
  "Sha Tin",
  "Chek Lap Kok",
  "Wong Chuk Hang",
  "Tuen Mun",
];

function readStoredStation(): string {
  if (typeof window === "undefined") return DEFAULT_STATION;
  return window.localStorage.getItem("tw_station") ?? DEFAULT_STATION;
}

export function Topbar() {
  const [station, setStation] = useState(readStoredStation);

  useEffect(() => {
    window.localStorage.setItem("tw_station", station);
  }, [station]);

  const stationLabel = useMemo(() => station, [station]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <div>
          <div className="text-sm font-semibold tracking-tight">TimoWeather</div>
          <div className="text-xs text-[rgb(var(--muted))]">Hong Kong</div>
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <StationDropdown station={stationLabel} onSelect={setStation} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle />
          <StationDropdown station={stationLabel} onSelect={setStation} />
        </div>

        <Button type="button" variant="ghost" size="sm">
          <SearchIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
          <span className="text-xs text-[rgb(var(--muted))]">⌘K</span>
        </Button>
      </div>
    </div>
  );
}

function StationDropdown({
  station,
  onSelect,
}: {
  station: string;
  onSelect: (next: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          <span className="max-w-[12rem] truncate">{station}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPanel align="end">
        {mockedStations.map((entry) => (
          <DropdownMenuItemButton key={entry} onSelect={() => onSelect(entry)}>
            {entry}
          </DropdownMenuItemButton>
        ))}
      </DropdownMenuPanel>
    </DropdownMenu>
  );
}
