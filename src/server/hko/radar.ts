import type { Fetcher } from "@/server/hko/client";
import { RADAR_RANGES, type RadarRange } from "@/lib/hko-radar";

const RADAR_INDEX_URL =
  "https://www.hko.gov.hk/wxinfo/radars/temp_json/nradar_img.json";
const RADAR_BASE_URL = "https://www.hko.gov.hk/wxinfo/radars/";

type RadarIndexJson = {
  radar?: Record<string, { image?: string[] }>;
};

function extractLatestImagePath(images: string[]): string | null {
  if (!images.length) return null;

  const last = images[images.length - 1];
  const match = last.match(/"([^"]+\.jpg)"/);
  return match?.[1] ?? null;
}

function fallbackTimestamp(): string {
  const now = new Date();
  const hkt = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }),
  );
  const minutes = hkt.getMinutes();
  const rounded = Math.floor(minutes / 6) * 6;
  hkt.setMinutes(rounded, 0, 0);

  const year = hkt.getFullYear();
  const month = String(hkt.getMonth() + 1).padStart(2, "0");
  const day = String(hkt.getDate()).padStart(2, "0");
  const hour = String(hkt.getHours()).padStart(2, "0");
  const min = String(rounded).padStart(2, "0");

  return `${year}${month}${day}${hour}${min}`;
}

const FALLBACK_PATHS: Record<RadarRange, string> = {
  "256": "rad_256_png/2d256nradar_{ts}.jpg",
  "128": "rad_128_png/2d128nradar_{ts}.jpg",
  "64": "rad_064_png/2d064nradar_{ts}.jpg",
  "64-2km": "rad_2km_064_png/2d064_2km_nradar_{ts}.jpg",
};

function extractTimestamp(path: string): string | null {
  const match = path.match(/(\d{12})\.jpg$/);
  return match?.[1] ?? null;
}

function formatRadarTimestamp(ts: string): string {
  if (ts.length !== 12) return ts;
  return `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}T${ts.slice(8, 10)}:${ts.slice(10, 12)}:00+08:00`;
}

export type RadarResult = {
  range: RadarRange;
  imageUrl: string;
  timestamp: string;
  availableRanges: RadarRange[];
};

export async function fetchRadar(
  fetcher: Fetcher,
  range: RadarRange = "128",
): Promise<RadarResult> {
  const rangeMeta = RADAR_RANGES.find((entry) => entry.id === range) ?? RADAR_RANGES[1];
  let imagePath: string | null = null;
  let availableRanges: RadarRange[] = RADAR_RANGES.map((entry) => entry.id);

  try {
    const response = await fetcher(RADAR_INDEX_URL, {
      headers: { "user-agent": "TimoWeather/1.0", accept: "application/json" },
      cache: "no-store",
    });

    if (response.ok) {
      const json = (await response.json()) as RadarIndexJson;
      const images = json.radar?.[rangeMeta.rangeKey]?.image;
      if (images?.length) {
        imagePath = extractLatestImagePath(images);
      }

      availableRanges = RADAR_RANGES.filter((entry) => {
        const rangeImages = json.radar?.[entry.rangeKey]?.image;
        return Boolean(rangeImages?.length);
      }).map((entry) => entry.id);
    }
  } catch {
    // Fall through to timestamp-based fallback.
  }

  if (!imagePath) {
    const ts = fallbackTimestamp();
    imagePath = FALLBACK_PATHS[range].replace("{ts}", ts);
  }

  const ts = extractTimestamp(imagePath) ?? fallbackTimestamp();

  return {
    range,
    imageUrl: `${RADAR_BASE_URL}${imagePath}`,
    timestamp: formatRadarTimestamp(ts),
    availableRanges,
  };
}
