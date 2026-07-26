export const TIDE_STATIONS = [
  { code: "QUB", label: "Quarry Bay" },
  { code: "CLK", label: "Chek Lap Kok" },
  { code: "CCH", label: "Cheung Chau" },
  { code: "CMW", label: "Chi Ma Wan" },
  { code: "KCT", label: "Kwai Chung" },
  { code: "KLW", label: "Ko Lau Wan" },
  { code: "LOP", label: "Lok On Pai" },
  { code: "MWC", label: "Ma Wan" },
  { code: "SPW", label: "Shek Pik" },
  { code: "TAO", label: "Tai O" },
  { code: "TBT", label: "Tsim Bei Tsui" },
  { code: "TMW", label: "Tai Miu Wan" },
  { code: "TPK", label: "Tai Po Kau" },
  { code: "WAG", label: "Waglan Island" },
] as const;

export const CLIMATE_STATIONS = [
  { code: "HKO", label: "Hong Kong Observatory" },
  { code: "KP", label: "King's Park" },
  { code: "CCH", label: "Cheung Chau" },
  { code: "HKA", label: "Hong Kong Airport" },
  { code: "HKP", label: "Hong Kong Park" },
  { code: "HKS", label: "Hong Kong Space Museum" },
  { code: "KSC", label: "Kowloon City" },
  { code: "KTG", label: "Kai Tak" },
  { code: "NGP", label: "Ngong Ping" },
  { code: "SHA", label: "Sha Tin" },
  { code: "SKG", label: "Shek Kong" },
  { code: "SKW", label: "Shek Wu Hui" },
  { code: "SSP", label: "Sham Shui Po" },
  { code: "STY", label: "Stanley" },
  { code: "TC", label: "Ta Kwu Ling" },
  { code: "TPO", label: "Tai Po" },
  { code: "TW", label: "Tsing Yi" },
  { code: "TWN", label: "Tsuen Wan" },
  { code: "WGL", label: "Waglan Island" },
  { code: "WTS", label: "Wong Tai Sin" },
] as const;

export type TideStationCode = (typeof TIDE_STATIONS)[number]["code"];
export type ClimateStationCode = (typeof CLIMATE_STATIONS)[number]["code"];
