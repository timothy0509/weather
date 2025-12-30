import type {
  CurrentWeather,
  Forecast,
  HourlyRainfall,
  LocalForecast,
  WarningInfo,
  WarningSummary,
} from "@/server/hko/client";

export type RainfallValue = {
  label: string;
  amountMm: number | null;
  status: "ok" | "maintenance";
};

export function getStations(current: CurrentWeather): string[] {
  const stations = current.temperature?.data.map((entry) => entry.place) ?? [];
  return Array.from(new Set(stations)).sort((a, b) => a.localeCompare(b));
}

export function getStationTemperature(current: CurrentWeather, station: string) {
  return (
    current.temperature?.data.find((entry) => entry.place === station) ??
    current.temperature?.data[0] ??
    null
  );
}

export function getHumidity(current: CurrentWeather) {
  return current.humidity?.data[0] ?? null;
}

export function getDistrictRainfall(current: CurrentWeather): RainfallValue[] {
  const districts = current.rainfall?.data ?? [];

  return districts
    .map((entry) => ({
      label: entry.place,
      amountMm: entry.max ?? null,
      status:
        entry.main === true || entry.main === "TRUE" ? ("maintenance" as const) : ("ok" as const),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getStationRainfall(hourly: HourlyRainfall): RainfallValue[] {
  return hourly.hourlyRainfall
    .map((entry) => {
      if (entry.value === "M") {
        return {
          label: entry.automaticWeatherStation,
          amountMm: null,
          status: "maintenance" as const,
        };
      }

      return {
        label: entry.automaticWeatherStation,
        amountMm: Number(entry.value),
        status: "ok" as const,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getForecastDays(forecast: Forecast) {
  return forecast.weatherForecast;
}

export function getLocalForecastText(local: LocalForecast) {
  return {
    generalSituation: local.generalSituation,
    tcInfo: local.tcInfo,
    fireDangerWarning: local.fireDangerWarning,
    forecastPeriod: local.forecastPeriod,
    forecastDesc: local.forecastDesc,
    outlook: local.outlook,
    updateTime: local.updateTime,
  };
}

export function mergeWarnings(summary: WarningSummary, info: WarningInfo) {
  const entries = Object.entries(summary).map(([key, value]) => ({
    key,
    ...value,
  }));

  const details = info.details ?? [];

  return entries
    .map((entry) => {
      const match = details.find(
        (detail) =>
          detail.warningStatementCode === entry.key ||
          detail.warningStatementCode === entry.code,
      );

      return {
        ...entry,
        contents: match?.contents ?? [],
        detailUpdateTime: match?.updateTime ?? entry.updateTime ?? "",
      };
    })
    .sort((a, b) => a.key.localeCompare(b.key));
}
