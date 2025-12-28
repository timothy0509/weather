import { AppShell } from "@/components/app-shell";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <AppShell header={<Topbar />}>
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="p-6 lg:col-span-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-[rgb(var(--muted))]">Now · Hong Kong Observatory</div>
              <div className="mt-2 text-5xl font-semibold tracking-tight">20°</div>
              <div className="mt-2 text-sm text-[rgb(var(--muted))]">Humidity 64% · Updated 14:00</div>
            </div>
            <div className="rounded-2xl bg-[rgb(var(--fg)/0.06)] px-4 py-3 text-sm">
              Fine
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-5">
          <div className="text-sm font-semibold">Warnings</div>
          <div className="mt-3 text-sm text-[rgb(var(--muted))]">
            Warnings will appear here when active.
          </div>
        </Card>

        <Card className="p-6 lg:col-span-12">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">9‑day forecast</div>
            <div className="text-xs text-[rgb(var(--muted))]">Premium strip coming next</div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--fg)/0.03)] p-4"
              >
                <div className="text-xs text-[rgb(var(--muted))]">Day {index + 1}</div>
                <div className="mt-2 text-lg font-semibold">23°</div>
                <div className="mt-1 text-xs text-[rgb(var(--muted))]">Low 17°</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
