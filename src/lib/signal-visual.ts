export type SignalTone = "amber" | "red" | "black" | "teal" | "ink";

export function getSignalTone(code?: string | null, key?: string | null): SignalTone {
  const token = `${code ?? ""} ${key ?? ""}`.toUpperCase();

  if (/TC10|TC9/.test(token)) return "black";
  if (/TC8|WRAINB|WFIRER|WHOT/.test(token)) return "red";
  if (/TC3|TC1|WRAINA|WRAINR|WFIREY|WTS|WL|WCOLD|CANCEL|WTCSGNL/.test(token)) {
    if (/WRAINR|WCOLD/.test(token)) return "red";
    return "amber";
  }
  if (/WRAIN|FLOOD|TSUNAMI|RAIN/.test(token)) return "teal";
  if (/TC|WFIRE/.test(token)) return "amber";
  return "ink";
}

export function signalToneBg(tone: SignalTone) {
  switch (tone) {
    case "amber":
      return "rgb(var(--signal-amber))";
    case "red":
      return "rgb(var(--signal-red))";
    case "black":
      return "rgb(var(--signal-black))";
    case "teal":
      return "rgb(var(--signal-teal))";
    default:
      return "rgb(var(--fg))";
  }
}

export type ThemeMode = "light" | "dark";

/**
 * Theme-aware foreground for a signal tone.
 * Returns a CSS-var reference so the browser resolves the correct
 * ink/paper value per `.dark` (see --sig-*-fg in globals.css).
 * All pairs target >=4.5:1 contrast against their signal bg.
 */
export function signalToneFg(tone: SignalTone) {
  return signalToneFgVar(tone);
}

export function signalToneFgVar(tone: SignalTone) {
  switch (tone) {
    case "amber":
      return "rgb(var(--sig-amber-fg))";
    case "red":
      return "rgb(var(--sig-red-fg))";
    case "black":
      return "rgb(var(--sig-black-fg))";
    case "teal":
      return "rgb(var(--sig-teal-fg))";
    default:
      return "rgb(var(--sig-ink-fg))";
  }
}

const PAPER = "#FAF8F2";
const INK = "#1A1F24";
const DARK_INK = "#12161A";

/**
 * Concrete {bg, fg} hex pair for a tone + theme mode.
 * Useful for canvas, SVG, or other non-CSS contexts.
 * Amber: ink both themes. Red/teal/black: paper in light, ink in dark.
 */
export function signalTonePair(tone: SignalTone, mode: ThemeMode = "light"): { bg: string; fg: string } {
  if (mode === "dark") {
    switch (tone) {
      case "amber":
        return { bg: "#F0B428", fg: INK };
      case "red":
        return { bg: "#E64650", fg: DARK_INK };
      case "teal":
        return { bg: "#78BEC4", fg: DARK_INK };
      case "black":
        return { bg: "#ECE8DE", fg: DARK_INK };
      default:
        return { bg: "#ECE8DE", fg: DARK_INK };
    }
  }
  switch (tone) {
    case "amber":
      return { bg: "#E5A100", fg: INK };
    case "red":
      return { bg: "#C8102E", fg: PAPER };
    case "teal":
      return { bg: "#0B6E7A", fg: PAPER };
    case "black":
      return { bg: "#111111", fg: PAPER };
    default:
      return { bg: INK, fg: PAPER };
  }
}
