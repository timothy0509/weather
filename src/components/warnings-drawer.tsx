"use client";

import * as Dialog from "@radix-ui/react-dialog";

import { TriangleAlert } from "lucide-react";

import { useStationContext } from "@/components/station-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { formatHktDateTime } from "@/lib/time";

export type WarningEntry = {
  key: string;
  name?: string;
  type?: string;
  contents?: string[];
  detailUpdateTime?: string;
};

export function WarningsDrawer({
  warning,
  triggerLabel,
}: {
  warning: WarningEntry;
  triggerLabel?: string;
}) {
  const { lang } = useStationContext();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button type="button" variant="ghost" size="sm" className="justify-start">
          {triggerLabel ?? warning.name ?? warning.key}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-[min(440px,90vw)]">
          <div className="h-full p-4">
            <Card className="flex h-full flex-col p-0">
              <div className="flex items-start justify-between gap-3 border-b border-[rgb(var(--border))] p-5">
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgb(var(--border))]"
                    style={{ background: "rgb(var(--wx-warm) / 0.12)" }}
                    aria-hidden="true"
                  >
                    <TriangleAlert
                      className="h-5 w-5"
                      style={{ color: "rgb(var(--wx-warm))" }}
                    />
                  </div>
                  <div>
                    <div className="text-base font-semibold">
                      {warning.name ?? warning.key}
                    </div>
                    <div className="mt-1 text-xs text-[rgb(var(--muted))]">
                      {warning.detailUpdateTime
                        ? `${t(lang, "label.updated")} ${formatHktDateTime(warning.detailUpdateTime)}`
                        : ""}
                    </div>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <Button type="button" variant="ghost" size="sm">
                    {t(lang, "action.close")}
                  </Button>

                </Dialog.Close>
              </div>

              <div className="flex-1 overflow-auto p-5">
                {warning.contents?.length ? (
                  <div className="space-y-4">
                    {warning.contents.map((line, index) => (
                      <p
                        key={`${index}-${line.substring(0, 8)}`}
                        className={cn(
                          "text-sm leading-7",
                          index === 0 ? "font-medium" : "text-[rgb(var(--muted))]",
                        )}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-[rgb(var(--muted))]">No details available.</div>
                )}
              </div>
            </Card>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
