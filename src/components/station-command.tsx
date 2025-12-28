"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchIcon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export function StationCommand({
  stations,
  value,
  onSelectAction,
}: {
  stations: string[];
  value: string;
  onSelectAction: (next: string) => void;
}) {
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

  const filteredStations = useMemo(() => stations, [stations]);

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
        <Button type="button" variant="ghost" size="sm">
          <SearchIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Station</span>
          <span className="text-xs text-[rgb(var(--muted))]">⌘K</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-[18%] z-50 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2">
          <Card className="overflow-hidden p-0">
            <Command className="flex flex-col">
              <div className="flex items-center gap-3 border-b border-[rgb(var(--border))] px-4 py-3">
                <SearchIcon className="h-4 w-4 text-[rgb(var(--muted))]" />
                <Command.Input
                  placeholder="Search stations…"
                  autoFocus
                  className={cn(
                    "w-full bg-transparent text-sm outline-none",
                    "placeholder:text-[rgb(var(--muted))]",
                  )}
                />
              </div>
              <Command.List className="max-h-[320px] overflow-auto p-2">
                <Command.Empty className="px-3 py-6 text-sm text-[rgb(var(--muted))]">
                  No stations found.
                </Command.Empty>
                <Command.Group heading="Stations" className="text-xs text-[rgb(var(--muted))]">
                  {filteredStations.map((station) => (
                    <Command.Item
                      key={station}
                      value={station}
                      onSelect={selectStation}
                      className={cn(
                        "flex cursor-default select-none items-center justify-between rounded-xl px-3 py-2 text-sm",
                        "data-[selected='true']:bg-[rgb(var(--fg)/0.06)]",
                      )}
                    >
                      <span className="truncate">{station}</span>
                      {station === value ? (
                        <span className="text-xs text-[rgb(var(--muted))]">Selected</span>
                      ) : null}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
