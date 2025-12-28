export type Language = "en" | "tc" | "sc";

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "tc", label: "繁體" },
  { value: "sc", label: "简体" },
];

export const DEFAULT_LANGUAGE: Language = "en";
export const DEFAULT_STATION = "Hong Kong Observatory";

export function readStoredString(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

export function writeStoredString(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}
