"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuPanel,
  DropdownMenuTrigger,
  DropdownMenuItemButton,
} from "@/components/ui/dropdown-menu";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  type Language,
  readStoredString,
  writeStoredString,
} from "@/lib/settings";

export function LanguageToggle() {
  const [lang, setLang] = useState<Language>(() =>
    readStoredString("tw_lang", DEFAULT_LANGUAGE) as Language,
  );

  useEffect(() => {
    writeStoredString("tw_lang", lang);
  }, [lang]);

  const label = useMemo(
    () => LANGUAGES.find((entry) => entry.value === lang)?.label ?? "English",
    [lang],
  );

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
