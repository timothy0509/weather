"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useIsFetching } from "@tanstack/react-query";
import { RotateCw } from "lucide-react";

import { LanguageToggle } from "@/components/language-toggle";
import { StationCommand } from "@/components/station-command";
import { useStationContext } from "@/components/station-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import type { Language } from "@/lib/settings";

export function Topbar({ isRefreshing = false }: { isRefreshing?: boolean }) {
  const { lang, station, stations, setStation } = useStationContext();
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 items-end gap-4">
        <div className="min-w-0">
          <div className="font-display text-[28px] font-black leading-none tracking-tight">
            {t(lang, "app.title")}
          </div>
          <div className="font-data mt-1 text-xs uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
            {t(lang, "app.region")} · HKO
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="mb-0.5 flex items-center gap-1 border-l border-[rgb(var(--rule))] pl-4"
        >
          <NavLink href="/" active={pathname === "/"}>
            {t(lang, "nav.board")}
          </NavLink>
          <NavLink href="/explore" active={pathname?.startsWith("/explore") ?? false}>
            {t(lang, "nav.explore")}
          </NavLink>
          <NavLink href="/radar" active={pathname?.startsWith("/radar") ?? false}>
            {t(lang, "nav.radar")}
          </NavLink>
        </nav>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <RefreshButton forcedSpinning={isRefreshing} />
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
      aria-current={active ? "page" : undefined}
      className={cn(
        "font-data inline-flex min-h-[44px] items-center border-b-2 px-3 py-3 text-xs uppercase tracking-[0.14em] transition",
        active
          ? "border-[rgb(var(--fg))] font-semibold text-[rgb(var(--fg))]"
          : "border-transparent text-[rgb(var(--muted))] hover:border-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
      )}
    >
      {children}
    </Link>
  );
}

function RefreshButton({ forcedSpinning = false }: { forcedSpinning?: boolean }) {
  const { lang } = useStationContext();
  const fetchingCount = useIsFetching();
  const spinning = forcedSpinning || fetchingCount > 0;

  return (
    <span className="inline-flex items-center" aria-live="polite">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          window.dispatchEvent(new CustomEvent("tw:refresh"));
        }}
        aria-label={t(lang, "action.refresh")}
        aria-busy={spinning || undefined}
      >
        <RotateCw className={cn("h-4 w-4", spinning && "animate-spin")} aria-hidden />
        <span className="hidden sm:inline">{t(lang, "action.refresh")}</span>
        <span className="sr-only">{spinning ? refreshingText(lang) : ""}</span>
      </Button>
    </span>
  );
}

function refreshingText(lang: Language): string {
  if (lang === "tc") return "更新中";
  if (lang === "sc") return "刷新中";
  return "Refreshing";
}
