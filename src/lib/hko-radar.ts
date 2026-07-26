export type RadarRange = "256" | "128" | "64" | "64-2km";

export const RADAR_RANGES: { id: RadarRange; label: string; rangeKey: string }[] = [
  { id: "256", label: "256 km", rangeKey: "range0" },
  { id: "128", label: "128 km", rangeKey: "range1" },
  { id: "64", label: "64 km", rangeKey: "range2" },
  { id: "64-2km", label: "64 km (2 km)", rangeKey: "range3" },
];
