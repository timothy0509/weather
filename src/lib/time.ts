export function formatHktDateTime(value: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Calendar parts in Asia/Hong_Kong (not browser local / UTC). */
export function getHktDateParts(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  return {
    year,
    month,
    day,
    iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
}

/** Yesterday's calendar date in Asia/Hong_Kong as YYYY-MM-DD. */
export function getHktYesterdayIso(date: Date = new Date()) {
  const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  return getHktDateParts(yesterday).iso;
}

export function toCompactDate(iso: string) {
  return iso.replace(/-/g, "");
}

/** Short calendar date ("15 Oct" / "10月15日") from an HKO YYYYMMDD forecast date. */
export function formatForecastDay(iso: string, lang: string) {
  if (!/^\d{8}$/.test(iso)) return iso;

  const date = new Date(
    Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(4, 6)) - 1, Number(iso.slice(6, 8))),
  );
  const locale = lang === "tc" ? "zh-HK" : lang === "sc" ? "zh-CN" : "en-GB";

  return new Intl.DateTimeFormat(locale, { timeZone: "UTC", day: "numeric", month: "short" }).format(date);
}
