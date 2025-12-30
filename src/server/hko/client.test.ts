import { describe, expect, it } from "vitest";

import { fetchCurrentWeather, type Fetcher } from "@/server/hko/client";

function makeFetcher(payload: unknown): Fetcher {
  return async () =>
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" },
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
});
