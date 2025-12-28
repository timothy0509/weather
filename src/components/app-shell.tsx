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
        <div className="sticky top-0 z-30 -mx-4 mb-6 bg-[rgb(var(--bg)/0.60)] px-4 pb-4 pt-2 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="pointer-events-auto">{header}</div>
        </div>
        <main className="relative">{children}</main>
      </div>
    </div>
  );
}
