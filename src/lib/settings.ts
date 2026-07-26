export type Language = "en" | "tc" | "sc";

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "tc", label: "繁體" },
  { value: "sc", label: "简体" },
];

export const DEFAULT_LANGUAGE: Language = "en";
export const DEFAULT_STATION = "Hong Kong Observatory";

const LANGUAGE_SET = new Set<string>(LANGUAGES.map((entry) => entry.value));

export function isLanguage(value: string): value is Language {
  return LANGUAGE_SET.has(value);
}

export function parseLanguage(value: string | null | undefined, fallback: Language = DEFAULT_LANGUAGE): Language {
  if (value && isLanguage(value)) return value;
  return fallback;
}

export function readStoredString(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

export function writeStoredString(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}
