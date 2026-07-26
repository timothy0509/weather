import { describe, expect, it } from "vitest";

import {
  fetchCurrentWeather,
  fetchLunarDate,
  fetchOpenDataTable,
  fetchSpecialWeatherTips,
  fetchWarningSummary,
  tipsFromSwt,
  type Fetcher,
} from "@/server/hko/client";

function makeFetcher(payload: unknown, contentType = "application/json"): Fetcher {
  return async () =>
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": contentType },
    });
}

describe("fetchCurrentWeather", () => {
  it("treats empty string warningMessage as empty list", async () => {
    const payload = {
      updateTime: "2025-01-01T00:00:00+08:00",
      warningMessage: "",
      icon: [],
      iconUpdateTime: "",
    };

    const result = await fetchCurrentWeather(makeFetcher(payload), "en");
    expect(result.warningMessage).toEqual([]);
  });

  it("keeps list warningMessage as list", async () => {
    const payload = {
      updateTime: "2025-01-01T00:00:00+08:00",
      warningMessage: ["a", "b"],
      icon: [],
      iconUpdateTime: "",
    };

    const result = await fetchCurrentWeather(makeFetcher(payload), "en");
    expect(result.warningMessage).toEqual(["a", "b"]);
  });

  it("accepts empty-string uvindex", async () => {
    const payload = {
      updateTime: "2025-01-01T00:00:00+08:00",
      warningMessage: [],
      icon: [63],
      iconUpdateTime: "",
      uvindex: "",
      temperature: {
        data: [{ place: "King's Park", value: 28, unit: "C" }],
      },
    };

    const result = await fetchCurrentWeather(makeFetcher(payload), "en");
    expect(result.uvindex).toBeUndefined();
    expect(result.temperature?.data[0]?.value).toBe(28);
  });

  it("coerces string lightning occur values to booleans", async () => {
    const payload = {
      updateTime: "2026-07-26T15:00:00+08:00",
      warningMessage: [],
      icon: [64],
      iconUpdateTime: "",
      lightning: {
        data: [{ place: "Lantau", occur: "true" }],
        startTime: "2026-07-26T14:45:00+08:00",
        endTime: "2026-07-26T15:45:00+08:00",
      },
      temperature: {
        data: [{ place: "Hong Kong Observatory", value: 29, unit: "C" }],
      },
    };

    const result = await fetchCurrentWeather(makeFetcher(payload), "en");
    expect(result.lightning?.data[0]?.occur).toBe(true);
    expect(result.temperature?.data[0]?.value).toBe(29);
  });
});

describe("fetchSpecialWeatherTips", () => {
  it("accepts object tips with desc", async () => {
    const payload = {
      swt: [
        {
          desc: "Winds will strengthen.",
          updateTime: "2026-07-25T23:45:00+08:00",
        },
      ],
    };

    const result = await fetchSpecialWeatherTips(makeFetcher(payload), "en");
    expect(tipsFromSwt(result.swt)).toEqual(["Winds will strengthen."]);
  });

  it("still accepts plain string tips", async () => {
    const payload = { swt: ["Stay indoors."] };
    const result = await fetchSpecialWeatherTips(makeFetcher(payload), "en");
    expect(tipsFromSwt(result.swt)).toEqual(["Stay indoors."]);
  });
});

describe("fetchWarningSummary", () => {
  it("treats empty array warnsum as empty object", async () => {
    const result = await fetchWarningSummary(makeFetcher([]), "en");
    expect(result).toEqual({});
  });

  it("parses active tropical cyclone signal", async () => {
    const payload = {
      WTCSGNL: {
        name: "Tropical Cyclone Warning Signal",
        code: "TC8NW",
        actionCode: "ISSUE",
        type: "No. 8 Northwest Gale or Storm Signal",
        issueTime: "2026-07-25T22:10:00+08:00",
        updateTime: "2026-07-25T22:10:00+08:00",
      },
    };

    const result = await fetchWarningSummary(makeFetcher(payload), "en");
    expect(result.WTCSGNL?.code).toBe("TC8NW");
  });
});

describe("fetchLunarDate", () => {
  it("parses JSON even when content-type is text/html", async () => {
    const payload = {
      LunarYear: "丙午年，馬",
      LunarDate: "六月十三",
    };

    const result = await fetchLunarDate(makeFetcher(payload, "text/html; charset=UTF-8"), "2026-07-26");
    expect(result.LunarYear).toBe("丙午年，馬");
    expect(result.LunarDate).toBe("六月十三");
  });
});

describe("fetchOpenDataTable", () => {
  it("keeps tabular fields/data responses", async () => {
    const payload = {
      fields: ["Year", "Month", "Day", "Value"],
      data: [["2025", "7", "1", "28.1"]],
    };

    const result = await fetchOpenDataTable(makeFetcher(payload), {
      dataType: "CLMTEMP",
      rformat: "json",
    });
    expect(result.fields).toEqual(["Year", "Month", "Day", "Value"]);
    expect(result.data).toHaveLength(1);
  });

  it("normalizes flat RYES objects into key-value rows", async () => {
    const payload = {
      HongKongDesc: "Average ambient gamma radiation dose rate...",
      ChekLapKokMaxTemp: "34.0",
    };

    const result = await fetchOpenDataTable(makeFetcher(payload), {
      dataType: "RYES",
      date: "20260725",
      rformat: "json",
    });
    expect(result.fields).toEqual(["Key", "Value"]);
    expect(result.data).toEqual([
      ["HongKongDesc", "Average ambient gamma radiation dose rate..."],
      ["ChekLapKokMaxTemp", "34.0"],
    ]);
  });
});
