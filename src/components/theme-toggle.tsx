"use client";

import { useTheme } from "next-themes";

import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@/components/ui/icon";
import { t } from "@/lib/i18n";

export function ThemeToggle() {
  const { lang } = useStationContext();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t(lang, "action.toggle_theme")}
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      <span className="hidden sm:inline">
        {isDark ? t(lang, "label.theme_light") : t(lang, "label.theme_dark")}
      </span>
    </Button>
  );
}
