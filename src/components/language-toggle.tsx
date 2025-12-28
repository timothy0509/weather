"use client";

import { useMemo } from "react";

import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuPanel,
  DropdownMenuTrigger,
  DropdownMenuItemButton,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES } from "@/lib/settings";

export function LanguageToggle() {
  const { lang, setLang } = useStationContext();

  const label = useMemo(() => {
    return LANGUAGES.find((entry) => entry.value === lang)?.label ?? "English";
  }, [lang]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm">
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPanel align="end">
        {LANGUAGES.map((entry) => (
          <DropdownMenuItemButton
            key={entry.value}
            onSelect={() => setLang(entry.value)}
          >
            {entry.label}
          </DropdownMenuItemButton>
        ))}
      </DropdownMenuPanel>
    </DropdownMenu>
  );
}
