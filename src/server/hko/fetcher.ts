import { HkoError, type Fetcher } from "@/server/hko/client";

export function fetchWithTimeout(fetcher: Fetcher, timeoutMs: number): Fetcher {
  return async (input, init) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetcher(input, {
        ...init,
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new HkoError(`HKO request timed out after ${timeoutMs}ms`);
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  };
}
