import type { Fetcher } from "@/server/hko/client";
import { HkoError } from "@/server/hko/client";

const TC_LIST_URL = "https://www.weather.gov.hk/wxinfo/currwx/tc_list.xml";

export type TcTrackPoint = {
  index: number;
  intensity: string;
  maximumWind: string;
  time: string;
  latitude: string;
  longitude: string;
};

export type TcCyclone = {
  id: string;
  englishName: string;
  chineseName: string;
  trackUrl: string;
  bulletinTime: string;
  name: string;
  latestPast: TcTrackPoint | null;
  latestForecast: TcTrackPoint | null;
};

export type TcTrackResult = {
  cyclones: TcCyclone[];
};

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`, "i"));
  return match?.[1]?.trim() ?? "";
}

function extractAllBlocks(xml: string, tag: string): string[] {
  const blocks: string[] = [];
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "gi");
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

function parseTrackPoint(block: string): TcTrackPoint {
  return {
    index: Number(extractTag(block, "Index")) || 0,
    intensity: extractTag(block, "Intensity"),
    maximumWind: extractTag(block, "MaximumWind"),
    time: extractTag(block, "Time"),
    latitude: extractTag(block, "Latitude"),
    longitude: extractTag(block, "Longitude"),
  };
}

async function fetchTrackDetail(
  fetcher: Fetcher,
  trackUrl: string,
): Promise<{
  bulletinTime: string;
  name: string;
  latestPast: TcTrackPoint | null;
  latestForecast: TcTrackPoint | null;
}> {
  const response = await fetcher(trackUrl, {
    headers: { "user-agent": "TimoWeather/1.0", accept: "application/xml" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new HkoError(`TC track request failed: ${response.statusText}`, response.status);
  }

  const xml = await response.text();
  const pastBlocks = extractAllBlocks(xml, "PastInformation");
  const forecastBlocks = extractAllBlocks(xml, "ForecastInformation");

  const pastPoints = pastBlocks.map(parseTrackPoint).filter((p) => p.time);
  const forecastPoints = forecastBlocks.map(parseTrackPoint).filter((p) => p.time);

  return {
    bulletinTime: extractTag(xml, "BulletinTime"),
    name: extractTag(xml, "TropicalCycloneName"),
    latestPast: pastPoints.at(-1) ?? null,
    latestForecast: forecastPoints.at(-1) ?? null,
  };
}

export async function fetchTcTrack(fetcher: Fetcher): Promise<TcTrackResult> {
  const response = await fetcher(TC_LIST_URL, {
    headers: { "user-agent": "TimoWeather/1.0", accept: "application/xml" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new HkoError(`TC list request failed: ${response.statusText}`, response.status);
  }

  const xml = await response.text();
  const cycloneBlocks = extractAllBlocks(xml, "TropicalCyclone");

  const cyclones = await Promise.all(
    cycloneBlocks.map(async (block) => {
      const id = extractTag(block, "TropicalCycloneID");
      const englishName = extractTag(block, "TropicalCycloneEnglishName");
      const chineseName = extractTag(block, "TropicalCycloneChineseName");
      const trackUrl = extractTag(block, "TropicalCycloneURL");

      if (!trackUrl) {
        return {
          id,
          englishName,
          chineseName,
          trackUrl: "",
          bulletinTime: "",
          name: englishName,
          latestPast: null,
          latestForecast: null,
        };
      }

      try {
        const detail = await fetchTrackDetail(fetcher, trackUrl);
        return {
          id,
          englishName,
          chineseName,
          trackUrl,
          ...detail,
        };
      } catch {
        return {
          id,
          englishName,
          chineseName,
          trackUrl,
          bulletinTime: "",
          name: englishName,
          latestPast: null,
          latestForecast: null,
        };
      }
    }),
  );

  return { cyclones: cyclones.filter((c) => c.id || c.englishName) };
}
