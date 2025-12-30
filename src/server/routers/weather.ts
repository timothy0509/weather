import { z } from "zod";

import { DEFAULT_STATION, type Language } from "@/lib/settings";
import { fetchWithTimeout } from "@/server/hko/fetcher";
import { createHkoService } from "@/server/hko/service";
import { publicProcedure, router } from "@/server/trpc";

const languageSchema = z.union([z.literal("en"), z.literal("tc"), z.literal("sc")]);

export const weatherRouter = router({
  dashboard: publicProcedure
    .input(
      z.object({
        lang: languageSchema.default("en"),
        station: z.string().default(DEFAULT_STATION),
      }),
    )
    .query(async ({ input }) => {
      const service = createHkoService(fetchWithTimeout(fetch, 8000));
      const lang = input.lang as Language;
      const [now, forecast9d, warnings, localForecast, swt] = await Promise.all([
        service.now(lang, input.station),
        service.forecast9d(lang),
        service.warnings(lang),
        service.localForecast(lang),
        service.specialWeatherTips(lang),
      ]);

      return { now, forecast9d, warnings, localForecast, swt };
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
