import { z } from "zod";

import { DEFAULT_STATION, type Language } from "@/lib/settings";
import { fetchWithTimeout } from "@/server/hko/fetcher";
import {
  createHkoService,
  type HkoForecastResult,
  type HkoLocalForecastResult,
  type HkoNowResult,
  type HkoSpecialWeatherTipsResult,
  type HkoWarningsResult,
} from "@/server/hko/service";
import { publicProcedure, router } from "@/server/trpc";

const languageSchema = z.union([z.literal("en"), z.literal("tc"), z.literal("sc")]);

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Unknown error";
}

export type DashboardSectionErrors = {
  now?: string;
  forecast9d?: string;
  warnings?: string;
  localForecast?: string;
  swt?: string;
};

export type DashboardResult = {
  now: HkoNowResult | null;
  forecast9d: HkoForecastResult | null;
  warnings: HkoWarningsResult | null;
  localForecast: HkoLocalForecastResult | null;
  swt: HkoSpecialWeatherTipsResult | null;
  errors: DashboardSectionErrors;
};

export const weatherRouter = router({
  dashboard: publicProcedure
    .input(
      z.object({
        lang: languageSchema.default("en"),
        station: z.string().default(DEFAULT_STATION),
      }),
    )
    .query(async ({ input }): Promise<DashboardResult> => {
      const service = createHkoService(fetchWithTimeout(fetch, 8000));
      const lang = input.lang as Language;

      const [now, forecast9d, warnings, localForecast, swt] = await Promise.allSettled([
        service.now(lang, input.station),
        service.forecast9d(lang),
        service.warnings(lang),
        service.localForecast(lang),
        service.specialWeatherTips(lang),
      ]);

      const errors: DashboardSectionErrors = {};

      if (now.status === "rejected") errors.now = errorMessage(now.reason);
      if (forecast9d.status === "rejected") errors.forecast9d = errorMessage(forecast9d.reason);
      if (warnings.status === "rejected") errors.warnings = errorMessage(warnings.reason);
      if (localForecast.status === "rejected") {
        errors.localForecast = errorMessage(localForecast.reason);
      }
      if (swt.status === "rejected") errors.swt = errorMessage(swt.reason);

      return {
        now: now.status === "fulfilled" ? now.value : null,
        forecast9d: forecast9d.status === "fulfilled" ? forecast9d.value : null,
        warnings: warnings.status === "fulfilled" ? warnings.value : null,
        localForecast: localForecast.status === "fulfilled" ? localForecast.value : null,
        swt: swt.status === "fulfilled" ? swt.value : null,
        errors,
      };
    }),

  now: publicProcedure
    .input(
      z.object({
        lang: languageSchema.default("en"),
        station: z.string().default(DEFAULT_STATION),
      }),
    )
    .query(async ({ input }) => {
      const service = createHkoService(fetchWithTimeout(fetch, 8000));
      return service.now(input.lang as Language, input.station);
    }),

  forecast9d: publicProcedure
    .input(z.object({ lang: languageSchema.default("en") }))
    .query(async ({ input }) => {
      const service = createHkoService(fetchWithTimeout(fetch, 8000));
      return service.forecast9d(input.lang as Language);
    }),

  localForecast: publicProcedure
    .input(z.object({ lang: languageSchema.default("en") }))
    .query(async ({ input }) => {
      const service = createHkoService(fetchWithTimeout(fetch, 8000));
      return service.localForecast(input.lang as Language);
    }),

  warnings: publicProcedure
    .input(z.object({ lang: languageSchema.default("en") }))
    .query(async ({ input }) => {
      const service = createHkoService(fetchWithTimeout(fetch, 8000));
      return service.warnings(input.lang as Language);
    }),

  rainfallStations: publicProcedure
    .input(z.object({ lang: languageSchema.default("en") }))
    .query(async ({ input }) => {
      const service = createHkoService(fetchWithTimeout(fetch, 8000));
      return service.rainfallStations(input.lang as Language);
    }),

  rainfallDistricts: publicProcedure
    .input(z.object({ lang: languageSchema.default("en") }))
    .query(async ({ input }) => {
      const service = createHkoService(fetchWithTimeout(fetch, 8000));
      return service.rainfallDistricts(input.lang as Language);
    }),

  specialWeatherTips: publicProcedure
    .input(z.object({ lang: languageSchema.default("en") }))
    .query(async ({ input }) => {
      const service = createHkoService(fetchWithTimeout(fetch, 8000));
      return service.specialWeatherTips(input.lang as Language);
    }),

  earthquake: publicProcedure.query(async () => {
    const service = createHkoService(fetchWithTimeout(fetch, 8000));
    return service.earthquake();
  }),

  lunarDate: publicProcedure
    .input(
      z.object({
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .default(new Date().toISOString().slice(0, 10)),
      }),
    )
    .query(async ({ input }) => {
      const service = createHkoService(fetchWithTimeout(fetch, 8000));
      return service.lunarDate(input.date);
    }),

  openData: publicProcedure
    .input(
      z.object({
        dataType: z.string().min(1),
        station: z.string().optional(),
        year: z.number().int().optional(),
        month: z.number().int().optional(),
        day: z.number().int().optional(),
        hour: z.number().int().optional(),
        lang: languageSchema.optional(),
      }),
    )
    .query(async ({ input }) => {
      const service = createHkoService(fetchWithTimeout(fetch, 8000));
      return service.openData({
        dataType: input.dataType,
        station: input.station,
        year: input.year,
        month: input.month,
        day: input.day,
        hour: input.hour,
        lang: input.lang as Language | undefined,
      });
    }),
});
