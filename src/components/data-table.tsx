import { cn } from "@/lib/cn";

type DataTableProps = {
  fields: string[];
  rows: unknown[][];
  emptyLabel: string;
  maxHeightClass?: string;
};

function isNumericCell(value: unknown): boolean {
  if (typeof value === "number" && Number.isFinite(value)) return true;
  if (typeof value === "string" && value.trim() !== "") {
    return /^-?[\d,]+(\.\d+)?$/.test(value.trim());
  }
  return false;
}

function formatCell(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(formatCell).join(", ");
  return "—";
}

export function DataTable({
  fields,
  rows,
  emptyLabel,
  maxHeightClass = "max-h-[60vh]",
}: DataTableProps) {
  if (fields.length === 0 || rows.length === 0) {
    return (
      <div className="rounded-[var(--radius)] border border-[rgb(var(--rule))]">
        <p className="px-3 py-8 text-center text-sm text-[rgb(var(--muted))]">{emptyLabel}</p>
      </div>
    );
  }

  const numericCols = fields.map((_, col) =>
    rows.every((row) => {
      const cell = row[col];
      return cell == null || cell === "" || isNumericCell(cell);
    }),
  );

  return (
    <div
      className={cn(
        "overflow-auto rounded-[var(--radius)] border border-[rgb(var(--rule))]",
        maxHeightClass,
      )}
    >
      <table className="hidden w-full text-left text-sm sm:table">
        <thead className="sticky top-0 bg-[rgb(var(--bg))] font-data text-xs uppercase tracking-[0.1em] text-[rgb(var(--muted))]">
          <tr>
            {fields.map((field, index) => (
              <th
                key={`${field}-${index}`}
                scope="col"
                className={cn("px-3 py-2 font-medium", numericCols[index] && "text-right")}
              >
                {field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-[rgb(var(--rule))] transition-colors hover:bg-[rgb(var(--fg)/0.04)]"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "px-3 py-2 font-data text-xs tabular-nums",
                    numericCols[cellIndex] && "text-right",
                  )}
                >
                  {formatCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="divide-y divide-[rgb(var(--rule))] sm:hidden">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="space-y-1 px-3 py-3">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="flex items-baseline justify-between gap-3 text-xs">
                <dt className="font-data uppercase tracking-[0.08em] text-[rgb(var(--muted))]">
                  {fields[cellIndex] ?? `#${cellIndex + 1}`}
                </dt>
                <dd className="text-right font-data tabular-nums text-[rgb(var(--fg))]">
                  {formatCell(cell)}
                </dd>
              </div>
            ))}
          </div>
        ))}
      </dl>
    </div>
  );
}
