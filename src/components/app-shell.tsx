import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function AppShell({
  children,
  header,
}: {
  children: ReactNode;
  header: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div
        className={cn(
          "pointer-events-none fixed inset-0",
          "bg-[radial-gradient(1100px_circle_at_20%_10%,rgb(var(--accent)/0.12),transparent_60%),radial-gradient(900px_circle_at_80%_20%,rgb(168_85_247/0.10),transparent_55%),radial-gradient(650px_circle_at_50%_90%,rgb(16_185_129/0.08),transparent_55%)]",
        )}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="sticky top-4 z-30 mb-6">
          <div className="pointer-events-auto">
            <div
              className={cn(
                "rounded-[calc(var(--radius)+10px)] border border-[rgb(var(--border))]",
                "bg-[rgb(var(--card)/0.65)] shadow-[0_20px_60px_-50px_rgb(var(--shadow)/0.85)]",
                "backdrop-blur-xl",
                "px-4 py-3 sm:px-5",
              )}
            >
              {header}
            </div>
          </div>
        </div>
        <main className="relative">{children}</main>
      </div>
    </div>
  );
}
