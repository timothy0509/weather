import { describe, expect, it } from "vitest";

import { getDistrictRainfall, getStationRainfall, mergeWarnings } from "@/server/hko/normalize";

describe("getStationRainfall", () => {
  it("maps maintenance values to null", () => {
    const result = getStationRainfall({
      obsTime: "2025-01-01T00:00:00+08:00",
      hourlyRainfall: [
        {
          automaticWeatherStation: "Foo",
          automaticWeatherStationID: "F001",
          value: "M",
          unit: "mm",
        },
        {
          automaticWeatherStation: "Bar",
          automaticWeatherStationID: "B001",
          value: "3.5",
          unit: "mm",
        },
      ],
    });

    expect(result).toEqual([
      { label: "Bar", amountMm: 3.5, status: "ok" },
      { label: "Foo", amountMm: null, status: "maintenance" },
    ]);
  });
});

describe("getDistrictRainfall", () => {
  it("marks 'main' entries as maintenance", () => {
    const result = getDistrictRainfall({
      updateTime: "2025-01-01T00:00:00+08:00",
      icon: [],
      iconUpdateTime: "",
      warningMessage: [],
      rainfall: {
        startTime: "",
        endTime: "",
        data: [
          { place: "Central", max: 1.2, main: true },
          { place: "Kowloon", max: 0.4, main: "TRUE" },
          { place: "NT", max: 0.0, main: false },
        ],
      },
    } as unknown as import("@/server/hko/client").CurrentWeather);

    expect(result).toEqual([
      { label: "Central", amountMm: 1.2, status: "maintenance" },
      { label: "Kowloon", amountMm: 0.4, status: "maintenance" },
      { label: "NT", amountMm: 0, status: "ok" },
    ]);
  });
});

describe("mergeWarnings", () => {
  it("merges details by warning code", () => {
    const result = mergeWarnings(
      {
        WFIRE: { name: "Fire", code: "WFIRE", updateTime: "2025-01-01T01:00:00+08:00" },
      },
      {
        details: [
          {
            warningStatementCode: "WFIRE",
            updateTime: "2025-01-01T02:00:00+08:00",
            contents: ["line1", "line2"],
          },
        ],
      },
    );

    expect(result[0]?.key).toBe("WFIRE");
    expect(result[0]?.contents).toEqual(["line1", "line2"]);
    expect(result[0]?.detailUpdateTime).toBe("2025-01-01T02:00:00+08:00");
  });
});
