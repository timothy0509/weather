"use client";

import { useMemo } from "react";

import { LanguageToggle } from "@/components/language-toggle";
import { StationCommand } from "@/components/station-command";
import { useStationContext } from "@/components/station-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPanel,
  DropdownMenuItemButton,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const { station, stations, setStation } = useStationContext();

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
          <StationDropdown
            station={stationLabel}
            stations={stations}
            onSelect={setStation}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <div className="hidden items-center gap-2 sm:flex">
          <LanguageToggle />
          <ThemeToggle />
          <StationDropdown station={stationLabel} stations={stations} onSelect={setStation} />
        </div>

        <div className="flex items-center gap-2 sm:hidden">
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
