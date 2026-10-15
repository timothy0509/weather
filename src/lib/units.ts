/**
 * HKO sends verbose unit words ("percent") straight from the API.
 * Render them the way people actually read them.
 */
export function formatUnit(unit: string | undefined | null): string {
  const key = unit?.trim().toLowerCase() ?? "";
  if (key === "percent" || key === "per cent") return "%";
  return unit?.trim() ?? "";
}
