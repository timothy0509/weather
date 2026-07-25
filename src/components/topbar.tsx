"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { RotateCw } from "lucide-react";

import { LanguageToggle } from "@/components/language-toggle";
import { StationCommand } from "@/components/station-command";
import { useStationContext } from "@/components/station-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

export function Topbar() {
  const { lang, station, stations, setStation } = useStationContext();
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 items-end gap-4">
        <div className="min-w-0">
          <div className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
            {t(lang, "app.title")}
          </div>
          <div className="font-data mt-0.5 text-[0.65rem] uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
            {t(lang, "app.region")} · HKO
          </div>
        </div>

        <nav className="mb-0.5 flex items-center gap-1 border-l border-[rgb(var(--rule))] pl-4">
          <NavLink href="/" active={pathname === "/"}>
            Board
          </NavLink>
          <NavLink href="/explore" active={pathname?.startsWith("/explore") ?? false}>
            Explore
          </NavLink>
        </nav>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <RefreshButton />
        <LanguageToggle />
        <ThemeToggle />
        <StationCommand stations={stations} value={station} onSelectAction={setStation} />
      </div>
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-data rounded-[var(--radius)] px-2 py-1 text-[0.7rem] uppercase tracking-[0.14em] transition",
        active
          ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
          : "text-[rgb(var(--muted))] hover:bg-[rgb(var(--fg)/0.06)] hover:text-[rgb(var(--fg))]",
      )}
    >
      {children}
    </Link>
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
      <RotateCw className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{t(lang, "action.refresh")}</span>
    </Button>
  );
}
