import type { ComponentPropsWithoutRef } from "react";

import type { LucideIcon } from "lucide-react";
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun, Sun, Wind } from "lucide-react";

export type WeatherKind =
  | "sunny"
  | "cloudy"
  | "partly"
  | "rain"
  | "storm"
  | "fog"
  | "wind";

export type WeatherVisual = {
  kind: WeatherKind;
  label: string;
  Icon: LucideIcon;
};

function byKind(kind: WeatherKind): WeatherVisual {
  switch (kind) {
    case "sunny":
      return { kind, label: "Sunny", Icon: Sun };
    case "partly":
      return { kind, label: "Partly cloudy", Icon: CloudSun };
    case "rain":
      return { kind, label: "Rain", Icon: CloudRain };
    case "storm":
      return { kind, label: "Thunderstorms", Icon: CloudLightning };
    case "fog":
      return { kind, label: "Fog", Icon: CloudFog };
    case "wind":
      return { kind, label: "Wind", Icon: Wind };
    case "cloudy":
    default:
      return { kind: "cloudy", label: "Cloudy", Icon: Cloud };
  }
}

// HKO icon codes are numerous; we bucket into user-friendly categories.
export function getHkoWeatherVisual(iconCode: number | null | undefined): WeatherVisual {
  if (!iconCode) return byKind("cloudy");

  // Conservative grouping; refine once we observe more codes.
  if ([50, 51, 52].includes(iconCode)) return byKind("sunny");
  if ([53, 54].includes(iconCode)) return byKind("partly");
  if ([60, 61, 62, 63, 64].includes(iconCode)) return byKind("rain");
  if ([65, 66].includes(iconCode)) return byKind("storm");
  if ([70, 71, 72].includes(iconCode)) return byKind("fog");
  if ([80, 81].includes(iconCode)) return byKind("wind");
  if ([91, 92].includes(iconCode)) return byKind("cloudy");

  // Fallback: codes we don't know yet.
  return byKind("cloudy");
}

export function getWeatherKindTone(kind: WeatherKind) {
  if (kind === "storm") return "storm";
  if (kind === "rain") return "rain";
  if (kind === "fog" || kind === "wind") return "cool";
  if (kind === "sunny") return "warm";
  return "mild";
}

export const WeatherDecorIcons = {
  drizzle: CloudDrizzle,
} satisfies Record<string, LucideIcon>;

export type WeatherIconProps = ComponentPropsWithoutRef<"svg">;
