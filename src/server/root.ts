import { weatherRouter } from "@/server/routers/weather";
import { router } from "@/server/trpc";

export const appRouter = router({
  weather: weatherRouter,
});

export type AppRouter = typeof appRouter;
