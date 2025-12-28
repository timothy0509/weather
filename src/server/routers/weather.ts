import { z } from "zod";

import { DEFAULT_STATION, type Language } from "@/lib/settings";
import { createHkoService } from "@/server/hko/service";
import { publicProcedure, router } from "@/server/trpc";

const languageSchema = z.union([z.literal("en"), z.literal("tc"), z.literal("sc")]);

export const weatherRouter = router({
  now: publicProcedure
    .input(
      z.object({
        lang: languageSchema.default("en"),
        station: z.string().default(DEFAULT_STATION),
      }),
    )
    .query(async ({ input }) => {
      const service = createHkoService(fetch);
      return service.now(input.lang as Language, input.station);
    }),

  forecast9d: publicProcedure
    .input(z.object({ lang: languageSchema.default("en") }))
    .query(async ({ input }) => {
      const service = createHkoService(fetch);
      return service.forecast9d(input.lang as Language);
    }),

  localForecast: publicProcedure
    .input(z.object({ lang: languageSchema.default("en") }))
    .query(async ({ input }) => {
      const service = createHkoService(fetch);
      return service.localForecast(input.lang as Language);
    }),

  warnings: publicProcedure
    .input(z.object({ lang: languageSchema.default("en") }))
    .query(async ({ input }) => {
      const service = createHkoService(fetch);
      return service.warnings(input.lang as Language);
    }),

  rainfallStations: publicProcedure
    .input(z.object({ lang: languageSchema.default("en") }))
    .query(async ({ input }) => {
      const service = createHkoService(fetch);
      return service.rainfallStations(input.lang as Language);
    }),

  rainfallDistricts: publicProcedure
    .input(z.object({ lang: languageSchema.default("en") }))
    .query(async ({ input }) => {
      const service = createHkoService(fetch);
      return service.rainfallDistricts(input.lang as Language);
    }),
});
