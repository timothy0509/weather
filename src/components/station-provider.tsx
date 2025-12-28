"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { api } from "@/app/providers";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_STATION,
  readStoredString,
  writeStoredString,
} from "@/lib/settings";

type StationContextValue = {
  lang: string;
  station: string;
  stations: string[];
  setStation: (next: string) => void;
};

const StationContext = createContext<StationContextValue | null>(null);

export function StationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState(() =>
    readStoredString("tw_lang", DEFAULT_LANGUAGE),
  );
  const [station, setStation] = useState(() =>
    readStoredString("tw_station", DEFAULT_STATION),
  );

  useEffect(() => {
    const handler = () => {
      setLang(readStoredString("tw_lang", DEFAULT_LANGUAGE));
      setStation(readStoredString("tw_station", DEFAULT_STATION));
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    writeStoredString("tw_station", station);
  }, [station]);

  const nowQuery = api.weather.now.useQuery(
    { lang: lang as never, station },
    { staleTime: 60_000 },
  );

  const stations = useMemo(() => nowQuery.data?.stations ?? [], [nowQuery.data?.stations]);

  const selectedStation = useMemo(() => {
    if (stations.length === 0) return station;
    if (stations.includes(station)) return station;
    if (stations.includes(DEFAULT_STATION)) return DEFAULT_STATION;
    return stations[0] ?? station;
  }, [station, stations]);

  const value = useMemo(
    () => ({
      lang,
      station: selectedStation,
      stations,
      setStation,
    }),
    [lang, selectedStation, stations],
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
