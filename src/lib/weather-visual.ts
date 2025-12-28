export type TempTone = "cold" | "cool" | "mild" | "warm" | "hot";

export function getTempTone(tempC: number | null | undefined): TempTone {
  if (tempC === null || tempC === undefined || Number.isNaN(tempC)) return "mild";
  if (tempC < 18) return "cold";
  if (tempC <= 23) return "cool";
  if (tempC <= 27) return "mild";
  if (tempC <= 32) return "warm";
  return "hot";
}

export function toneColor(tone: TempTone) {
  return `rgb(var(--wx-${tone}))`;
}

export function toneSoftBg(tone: TempTone) {
  return `rgb(var(--wx-${tone}) / 0.16)`;
}
