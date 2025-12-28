"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { api } from "@/app/providers";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_STATION,
  type Language,
  readStoredString,
  writeStoredString,
} from "@/lib/settings";

type StationContextValue = {
  lang: Language;
  setLang: (next: Language) => void;
  station: string;
  stations: string[];
  setStation: (next: string) => void;
};

const StationContext = createContext<StationContextValue | null>(null);

export function StationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() =>
    readStoredString("tw_lang", DEFAULT_LANGUAGE) as Language,
  );
  const [station, setStation] = useState(() =>
    readStoredString("tw_station", DEFAULT_STATION),
  );

  useEffect(() => {
    const handler = () => {
      setLang(readStoredString("tw_lang", DEFAULT_LANGUAGE) as Language);
      setStation(readStoredString("tw_station", DEFAULT_STATION));
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    writeStoredString("tw_lang", lang);
  }, [lang]);

  const nowQuery = api.weather.now.useQuery(
    { lang, station },
    { staleTime: 60_000 },
  );

  const resolvedStation = nowQuery.data?.station ?? station;
  const stations = useMemo(() => nowQuery.data?.stations ?? [], [nowQuery.data?.stations]);

  useEffect(() => {
    writeStoredString("tw_station", resolvedStation);
  }, [resolvedStation]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      station: resolvedStation,
      stations,
      setStation,
    }),
    [lang, resolvedStation, stations],
  );

  return (
    <StationContext.Provider value={value}>{children}</StationContext.Provider>
  );
}

export function useStationContext() {
  const value = useContext(StationContext);
  if (!value) throw new Error("useStationContext must be used within StationProvider");
  return value;
}
