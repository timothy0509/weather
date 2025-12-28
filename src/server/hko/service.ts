import { DEFAULT_STATION, type Language } from "@/lib/settings";
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchHourlyRainfall,
  fetchLocalForecast,
  fetchWarningInfo,
  fetchWarningSummary,
  type Fetcher,
} from "@/server/hko/client";
import { createTtlCache } from "@/server/hko/cache";
import {
  getDistrictRainfall,
  getForecastDays,
  getHumidity,
  getLocalForecastText,
  getStationRainfall,
  getStations,
  getStationTemperature,
  mergeWarnings,
} from "@/server/hko/normalize";

const cache = createTtlCache();

export type HkoNowResult = {
  updateTime: string;
  iconCode: number | null;
  iconUpdateTime: string;
  station: string;
  temperature: { place: string; value: number; unit: string } | null;
  humidity: { place: string; value: number; unit: string } | null;
  stations: string[];
  warningMessages: string[];
};

export type HkoForecastResult = {
  updateTime: string;
  days: ReturnType<typeof getForecastDays>;
};

export type HkoLocalForecastResult = ReturnType<typeof getLocalForecastText>;

export type HkoWarningsResult = ReturnType<typeof mergeWarnings>;

export type HkoRainfallResult = {
  obsTime: string;
  stations: ReturnType<typeof getStationRainfall>;
};

export type HkoDistrictRainfallResult = {
  startTime: string;
  endTime: string;
  districts: ReturnType<typeof getDistrictRainfall>;
};

function cacheKey(name: string, lang: Language) {
  return `${name}:${lang}`;
}

async function cached<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
): Promise<T> {
  const existing = cache.get<T>(key);
  if (existing) return existing;
  const value = await load();
  cache.set(key, value, ttlMs);
  return value;
}

export function createHkoService(fetcher: Fetcher) {
  return {
    now: async (lang: Language, station: string): Promise<HkoNowResult> => {
      const current = await cached(cacheKey("now", lang), 60_000, () =>
        fetchCurrentWeather(fetcher, lang),
      );

      const stations = getStations(current);

      const resolvedStation =
        stations.length === 0
          ? station
          : stations.includes(station)
            ? station
            : stations.includes(DEFAULT_STATION)
              ? DEFAULT_STATION
              : stations[0] ?? station;

      const temperature = getStationTemperature(current, resolvedStation);

      return {
        updateTime: current.updateTime,
        iconCode: current.icon?.[0] ?? null,
        iconUpdateTime: current.iconUpdateTime,
        station: resolvedStation,
        temperature,
        humidity: getHumidity(current),
        stations,
        warningMessages: current.warningMessage ?? [],
      };
    },

    forecast9d: async (lang: Language): Promise<HkoForecastResult> => {
      const forecast = await cached(cacheKey("forecast", lang), 30 * 60_000, () =>
        fetchForecast(fetcher, lang),
      );

      return {
        updateTime: forecast.updateTime,
        days: getForecastDays(forecast),
      };
    },

    localForecast: async (lang: Language): Promise<HkoLocalForecastResult> => {
      const local = await cached(cacheKey("localForecast", lang), 10 * 60_000, () =>
        fetchLocalForecast(fetcher, lang),
      );

      return getLocalForecastText(local);
    },

    warnings: async (lang: Language): Promise<HkoWarningsResult> => {
      const [summary, info] = await Promise.all([
        cached(cacheKey("warnsum", lang), 120_000, () =>
          fetchWarningSummary(fetcher, lang),
        ),
        cached(cacheKey("warningInfo", lang), 120_000, () =>
          fetchWarningInfo(fetcher, lang),
        ),
      ]);

      return mergeWarnings(summary, info);
    },

    rainfallStations: async (lang: Language): Promise<HkoRainfallResult> => {
      const hourly = await cached(cacheKey("hourlyRainfall", lang), 5 * 60_000, () =>
        fetchHourlyRainfall(fetcher, lang),
      );

      return {
        obsTime: hourly.obsTime,
        stations: getStationRainfall(hourly),
      };
    },

    rainfallDistricts: async (lang: Language): Promise<HkoDistrictRainfallResult> => {
      const current = await cached(cacheKey("now", lang), 60_000, () =>
        fetchCurrentWeather(fetcher, lang),
      );

      return {
        startTime: current.rainfall?.startTime ?? "",
        endTime: current.rainfall?.endTime ?? "",
        districts: getDistrictRainfall(current),
      };
    },
  };
}
