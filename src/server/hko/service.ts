import { DEFAULT_STATION, type Language } from "@/lib/settings";
import {
  fetchCurrentWeather,
  fetchEarthquakeQuick,
  fetchFeltEarthquake,
  fetchForecast,
  fetchHourlyRainfall,
  fetchLocalForecast,
  fetchLunarDate,
  fetchOpenDataTable,
  fetchSpecialWeatherTips,
  fetchWarningInfo,
  fetchWarningSummary,
  type Fetcher,
  type OpenDataTable,
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
  uvIndex: {
    place: string;
    value: number;
    desc?: string;
    message?: string;
  } | null;
  tcMessage: string[];
  rainstormReminder: string;
  specialWxTips: string[];
  lightning: {
    startTime: string;
    endTime: string;
    data: { place: string; occur?: boolean }[];
  } | null;
  rainfallFrom00To12: string;
  rainfallLastMonth: string;
  rainfallJanuaryToLastMonth: string;
  mintempFrom00To09: string;
};

export type HkoForecastResult = {
  updateTime: string;
  days: ReturnType<typeof getForecastDays>;
  seaTemp: {
    place?: string;
    value?: number;
    unit?: string;
    recordTime?: string;
  } | null;
  soilTemp: {
    place?: string;
    value?: number;
    unit?: string;
    recordTime?: string;
    depth?: { value?: number; unit?: string };
  }[];
};

export type HkoLocalForecastResult = ReturnType<typeof getLocalForecastText>;

export type HkoSpecialWeatherTipsResult = {
  tips: string[];
};

export type HkoEarthquakeResult = {
  quick: Awaited<ReturnType<typeof fetchEarthquakeQuick>>;
  felt: Awaited<ReturnType<typeof fetchFeltEarthquake>>;
};

export type HkoLunarDateResult = Awaited<ReturnType<typeof fetchLunarDate>>;

export type HkoOpenDataResult = OpenDataTable;

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

const inflight = new Map<string, Promise<unknown>>();

async function cached<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
): Promise<T> {
  const existing = cache.get<T>(key);
  if (existing) return existing;

  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const startedAt = Date.now();

  const promise = load()
    .then((value) => {
      cache.set(key, value, ttlMs);
      return value;
    })
    .finally(() => {
      inflight.delete(key);
      const elapsedMs = Date.now() - startedAt;
      if (process.env.NODE_ENV !== "test") {
        console.info(`[hko] ${key} ${elapsedMs}ms`);
      }
    });

  inflight.set(key, promise);
  return promise;
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

       const uvIndex = current.uvindex?.data?.[0]
         ? {
             place: current.uvindex.data[0].place,
             value: current.uvindex.data[0].value,
             desc: current.uvindex.data[0].desc,
             message: current.uvindex.data[0].message,
           }
         : null;

       return {
         updateTime: current.updateTime,
         iconCode: current.icon?.[0] ?? null,
         iconUpdateTime: current.iconUpdateTime,
         station: resolvedStation,
         temperature,
         humidity: getHumidity(current),
         stations,
         warningMessages: current.warningMessage ?? [],
         uvIndex,
         tcMessage: current.tcmessage ?? [],
         rainstormReminder: current.rainstormReminder ?? "",
         specialWxTips: current.specialWxTips ?? [],
         lightning: current.lightning
           ? {
               startTime: current.lightning.startTime ?? "",
               endTime: current.lightning.endTime ?? "",
               data: current.lightning.data ?? [],
             }
           : null,
         rainfallFrom00To12: current.rainfallFrom00To12 ?? "",
         rainfallLastMonth: current.rainfallLastMonth ?? "",
         rainfallJanuaryToLastMonth: current.rainfallJanuaryToLastMonth ?? "",
         mintempFrom00To09: current.mintempFrom00To09 ?? "",
       };
    },

    forecast9d: async (lang: Language): Promise<HkoForecastResult> => {
      const forecast = await cached(cacheKey("forecast", lang), 30 * 60_000, () =>
        fetchForecast(fetcher, lang),
      );

      return {
        updateTime: forecast.updateTime,
        days: getForecastDays(forecast),
        seaTemp: forecast.seaTemp ?? null,
        soilTemp: forecast.soilTemp ?? [],
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

    specialWeatherTips: async (lang: Language): Promise<HkoSpecialWeatherTipsResult> => {
      const result = await cached(cacheKey("swt", lang), 10 * 60_000, () =>
        fetchSpecialWeatherTips(fetcher, lang),
      );

      return { tips: result.swt };
    },

    earthquake: async (): Promise<HkoEarthquakeResult> => {
      const [quick, felt] = await Promise.all([
        cached("earthquake:qem", 30 * 60_000, () => fetchEarthquakeQuick(fetcher)),
        cached("earthquake:feltearthquake", 30 * 60_000, () => fetchFeltEarthquake(fetcher)),
      ]);

      return { quick, felt };
    },

    lunarDate: async (date: string): Promise<HkoLunarDateResult> => {
      return cached(`lunardate:${date}`, 24 * 60 * 60_000, () => fetchLunarDate(fetcher, date));
    },

    openData: async (
      input: {
        dataType: string;
        station?: string;
        year?: number;
        month?: number;
        day?: number;
        hour?: number;
        lang?: Language;
      },
    ): Promise<HkoOpenDataResult> => {
      const key = [
        "opendata",
        input.dataType,
        input.station ?? "",
        input.year ?? "",
        input.month ?? "",
        input.day ?? "",
        input.hour ?? "",
        input.lang ?? "",
      ].join(":");

      return cached(key, 10 * 60_000, () =>
        fetchOpenDataTable(fetcher, { ...input, rformat: "json" }),
      );
    },
  };
}
