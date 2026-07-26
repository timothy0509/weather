import type { ReactNode } from "react";

export function AppShell({
  children,
  header,
}: {
  children: ReactNode;
  header: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-30 -mx-4 border-b border-[rgb(var(--rule))] bg-[rgb(var(--bg)/0.92)] px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {header}
        </header>
        <main className="relative mt-6">{children}</main>
      </div>
    </div>
  );
}
