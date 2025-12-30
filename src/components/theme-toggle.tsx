"use client";

import { useTheme } from "next-themes";

import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@/components/ui/icon";
import { t } from "@/lib/i18n";

export function ThemeToggle() {
  const { lang } = useStationContext();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={t(lang, "action.toggle_theme")}
    >
      <SunIcon className="hidden h-4 w-4 dark:block" />
      <MoonIcon className="h-4 w-4 dark:hidden" />
      <span className="hidden sm:inline">
        <span className="hidden dark:inline">{t(lang, "label.theme_light")}</span>
        <span className="dark:hidden">{t(lang, "label.theme_dark")}</span>
      </span>
    </Button>
  );
}
