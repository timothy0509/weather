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

export function signalToneFg(tone: SignalTone) {
  if (tone === "amber") return "rgb(26 31 36)";
  return "rgb(250 248 242)";
}
