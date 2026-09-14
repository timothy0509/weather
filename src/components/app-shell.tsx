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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius)] focus:bg-[rgb(var(--fg))] focus:px-4 focus:py-3 focus:font-data focus:text-xs focus:uppercase focus:tracking-[0.14em] focus:text-[rgb(var(--bg))]"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 border-b-2 border-[rgb(var(--fg))] bg-[rgb(var(--header-bg))] shadow-[0_1px_0_rgb(var(--rule))] backdrop-blur-md">
        <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          {header}
        </div>
      </header>
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <main id="main" tabIndex={-1} className="relative mt-6 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
