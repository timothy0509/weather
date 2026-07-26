"use client";

import { useCallback, useEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { Check, MapPin } from "lucide-react";

import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchIcon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

export function StationCommand({
  stations,
  value,
  onSelectAction,
}: {
  stations: string[];
  value: string;
  onSelectAction: (next: string) => void;
}) {
  const { lang } = useStationContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectStation = useCallback(
    (station: string) => {
      onSelectAction(station);
      setOpen(false);
    },
    [onSelectAction],
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`${t(lang, "label.station")}: ${value}`}
        >
          <MapPin className="h-3.5 w-3.5 text-[rgb(var(--muted))]" />
          <span className="max-w-[10rem] truncate sm:max-w-[14rem]">{value}</span>
          <span className="hidden text-xs text-[rgb(var(--muted))] sm:inline">⌘K</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-[18%] z-50 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2">
          <Dialog.Title className="sr-only">{t(lang, "label.station")}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {t(lang, "label.search_stations")}
          </Dialog.Description>
          <Card className="overflow-hidden p-0">
            <Command className="flex flex-col">
              <div className="flex items-center gap-3 border-b border-[rgb(var(--border))] px-4 py-3">
                <SearchIcon className="h-4 w-4 text-[rgb(var(--muted))]" />
                <Command.Input
                  placeholder={t(lang, "label.search_stations")}
                  autoFocus
                  className={cn(
                    "w-full bg-transparent text-sm outline-none",
                    "placeholder:text-[rgb(var(--muted))]",
                  )}
                />
              </div>
              <Command.List className="max-h-[320px] overflow-auto p-2">
                <Command.Empty className="px-3 py-6 text-sm text-[rgb(var(--muted))]">
                  {t(lang, "label.no_stations_found")}
                </Command.Empty>
                {stations.length > 0 ? (
                  <Command.Group
                    heading={t(lang, "label.stations")}
                    className="text-xs text-[rgb(var(--muted))]"
                  >
                    {stations.map((station) => {
                      const selected = station === value;
                      return (
                        <Command.Item
                          key={station}
                          value={station}
                          onSelect={selectStation}
                          className={cn(
                            "flex cursor-default select-none items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm",
                            "data-[selected='true']:bg-[rgb(var(--fg)/0.06)]",
                          )}
                        >
                          <span className="truncate">{station}</span>
                          {selected ? (
                            <Check
                              className="h-3.5 w-3.5 shrink-0 text-[rgb(var(--muted))]"
                              aria-label={t(lang, "label.selected")}
                            />
                          ) : null}
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                ) : null}
              </Command.List>
            </Command>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
