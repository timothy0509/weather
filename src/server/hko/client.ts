import { z } from "zod";

import type { Language } from "@/lib/settings";

const WEATHER_ENDPOINT =
  "https://data.weather.gov.hk/weatherAPI/opendata/weather.php";
const HOURLY_RAINFALL_ENDPOINT =
  "https://data.weather.gov.hk/weatherAPI/opendata/hourlyRainfall.php";

export type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export class HkoError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "HkoError";
  }
}

const temperatureReadingSchema = z.object({
  place: z.string(),
  value: z.number(),
  unit: z.string(),
});

const humidityReadingSchema = z.object({
  unit: z.string(),
  value: z.number(),
  place: z.string(),
});

const rainfallDistrictSchema = z.object({
  unit: z.string().optional(),
  place: z.string(),
  max: z.number().nullable().optional(),
  min: z.number().nullable().optional(),
  main: z.union([z.string(), z.boolean()]).optional(),
});

const currentWeatherSchema = z.object({
  icon: z.array(z.number()).optional().default([]),
  iconUpdateTime: z.string().optional().default(""),
  updateTime: z.string(),
  warningMessage: z.array(z.string()).optional().default([]),
  temperature: z
    .object({
      data: z.array(temperatureReadingSchema).default([]),
      recordTime: z.string().optional().default(""),
    })
    .optional(),
  humidity: z
    .object({
      data: z.array(humidityReadingSchema).default([]),
      recordTime: z.string().optional().default(""),
    })
    .optional(),
  rainfall: z
    .object({
      data: z.array(rainfallDistrictSchema).default([]),
      startTime: z.string().optional().default(""),
      endTime: z.string().optional().default(""),
    })
    .optional(),
  uvindex: z
    .object({
      data: z
        .array(
          z.object({
            place: z.string(),
            value: z.number(),
            desc: z.string().optional(),
          }),
        )
        .optional()
        .default([]),
      recordDesc: z.string().optional().default(""),
    })
    .optional(),
});

const forecastDaySchema = z.object({
  forecastDate: z.string(),
  week: z.string(),
  forecastWind: z.string().optional().default(""),
  forecastWeather: z.string().optional().default(""),
  forecastMaxtemp: z.object({ value: z.number(), unit: z.string() }),
  forecastMintemp: z.object({ value: z.number(), unit: z.string() }),
  forecastMaxrh: z.object({ value: z.number(), unit: z.string() }).optional(),
  forecastMinrh: z.object({ value: z.number(), unit: z.string() }).optional(),
  ForecastIcon: z.number().optional(),
  PSR: z.string().optional(),
});

const forecastSchema = z.object({
  generalSituation: z.string().optional().default(""),
  weatherForecast: z.array(forecastDaySchema).default([]),
  updateTime: z.string().optional().default(""),
});

const localForecastSchema = z.object({
  generalSituation: z.string().optional().default(""),
  forecastPeriod: z.string().optional().default(""),
  forecastDesc: z.string().optional().default(""),
  outlook: z.string().optional().default(""),
  updateTime: z.string().optional().default(""),
});

const hourlyRainfallItemSchema = z.object({
  automaticWeatherStation: z.string(),
  automaticWeatherStationID: z.string(),
  value: z.string(),
  unit: z.string().optional().default("mm"),
});

const hourlyRainfallSchema = z.object({
  obsTime: z.string(),
  hourlyRainfall: z.array(hourlyRainfallItemSchema).default([]),
});

export type CurrentWeather = z.infer<typeof currentWeatherSchema>;
export type Forecast = z.infer<typeof forecastSchema>;
export type LocalForecast = z.infer<typeof localForecastSchema>;
export type HourlyRainfall = z.infer<typeof hourlyRainfallSchema>;

async function fetchJson(fetcher: Fetcher, url: string) {
  const response = await fetcher(url, {
    headers: {
      "user-agent": "TimoWeather/1.0",
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new HkoError(`HKO request failed: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function fetchCurrentWeather(fetcher: Fetcher, lang: Language) {
  const url = `${WEATHER_ENDPOINT}?dataType=rhrread&lang=${lang}`;
  const json = await fetchJson(fetcher, url);
  return currentWeatherSchema.parse(json);
}

export async function fetchForecast(fetcher: Fetcher, lang: Language) {
  const url = `${WEATHER_ENDPOINT}?dataType=fnd&lang=${lang}`;
  const json = await fetchJson(fetcher, url);
  return forecastSchema.parse(json);
}

export async function fetchLocalForecast(fetcher: Fetcher, lang: Language) {
  const url = `${WEATHER_ENDPOINT}?dataType=flw&lang=${lang}`;
  const json = await fetchJson(fetcher, url);
  return localForecastSchema.parse(json);
}

const warningInfoSchema = z.object({
  details: z
    .array(
      z.object({
        warningStatementCode: z.string().optional(),
        subtype: z.string().optional(),
        updateTime: z.string().optional(),
        contents: z.array(z.string()).optional().default([]),
      }),
    )
    .optional()
    .default([]),
});

export type WarningInfo = z.infer<typeof warningInfoSchema>;

export async function fetchWarningInfo(fetcher: Fetcher, lang: Language) {
  const url = `${WEATHER_ENDPOINT}?dataType=warningInfo&lang=${lang}`;
  const json = await fetchJson(fetcher, url);
  return warningInfoSchema.parse(json);
}

const warningSummarySchema = z.record(
  z.string(),
  z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    type: z.string().optional(),
    actionCode: z.string().optional(),
    issueTime: z.string().optional(),
    expireTime: z.string().optional(),
    updateTime: z.string().optional(),
  }),
);

export type WarningSummary = z.infer<typeof warningSummarySchema>;

export async function fetchWarningSummary(fetcher: Fetcher, lang: Language) {
  const url = `${WEATHER_ENDPOINT}?dataType=warnsum&lang=${lang}`;
  const json = await fetchJson(fetcher, url);
  return warningSummarySchema.parse(json);
}

export async function fetchHourlyRainfall(fetcher: Fetcher, lang: Language) {
  const url = `${HOURLY_RAINFALL_ENDPOINT}?lang=${lang}`;
  const json = await fetchJson(fetcher, url);
  return hourlyRainfallSchema.parse(json);
}
