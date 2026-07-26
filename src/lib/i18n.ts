import type { Language } from "@/lib/settings";

export type I18nKey =
  | "app.title"
  | "app.region"
  | "action.refresh"
  | "action.retry"
  | "action.close"
  | "label.now"
  | "label.warnings"
  | "label.warnings.none"
  | "label.warnings.active"
  | "label.warnings.details"
  | "label.forecast_9d"
  | "label.rainfall"
  | "label.rainfall.districts"
  | "label.rainfall.stations"
  | "label.rainfall.past_hour_district"
  | "label.rainfall.past_hour_stations"
  | "label.humidity"
  | "label.low"
  | "label.updated"
  | "label.selected"
  | "label.station"
  | "label.search_stations"
  | "label.no_stations_found"
  | "label.stations"
  | "action.toggle_theme"
  | "label.theme_light"
  | "label.theme_dark"
  | "label.maintenance"
  | "label.lightning"
  | "label.lightning.active"
  | "label.rain_probability"
  | "label.wind"
  | "label.sea_temp"
  | "label.soil_temp"
  | "label.mintemp_00_09"
  | "label.rainfall_00_12"
  | "label.rainfall_last_month"
  | "label.rainfall_ytd"
  | "label.sunrise"
  | "label.sun_transit"
  | "label.sunset"
  | "label.tides"
  | "label.tide_heights"
  | "label.tide_times"
  | "label.radar"
  | "label.typhoon"
  | "label.typhoon.view_map"
  | "nav.board"
  | "nav.explore"
  | "nav.radar";

type Dict = Record<I18nKey, string>;

const DICTS: Record<Language, Dict> = {
  en: {
    "app.title": "TimoWeather",
    "app.region": "Hong Kong",
    "action.refresh": "Refresh",
    "action.retry": "Retry",
    "action.close": "Close",
    "label.now": "Now",
    "label.warnings": "Warnings",
    "label.warnings.none": "None",
    "label.warnings.active": "active",
    "label.warnings.details": "Details",
    "label.forecast_9d": "9-day forecast",
    "label.rainfall": "Rainfall",
    "label.rainfall.districts": "Districts",
    "label.rainfall.stations": "Stations",
    "label.rainfall.past_hour_district": "Past hour (district max)",
    "label.rainfall.past_hour_stations": "Past hour (automatic stations)",
    "label.humidity": "Humidity",
    "label.low": "Low",
    "label.updated": "Updated",
    "label.selected": "Selected",
    "label.station": "Station",
    "label.search_stations": "Search stations…",
    "label.no_stations_found": "No stations found.",
    "label.stations": "Stations",
    "action.toggle_theme": "Toggle theme",
    "label.theme_light": "Light",
    "label.theme_dark": "Dark",
    "label.maintenance": "Maintenance",
    "label.lightning": "Lightning",
    "label.lightning.active": "Lightning detected",
    "label.rain_probability": "Rain",
    "label.wind": "Wind",
    "label.sea_temp": "Sea temp",
    "label.soil_temp": "Soil temp",
    "label.mintemp_00_09": "Min temp 00–09",
    "label.rainfall_00_12": "Rainfall 00–12",
    "label.rainfall_last_month": "Last month",
    "label.rainfall_ytd": "Since Jan",
    "label.sunrise": "Sunrise",
    "label.sun_transit": "Solar noon",
    "label.sunset": "Sunset",
    "label.tides": "Tides",
    "label.tide_heights": "Hourly heights",
    "label.tide_times": "High / low",
    "label.radar": "Radar",
    "label.typhoon": "Tropical cyclone",
    "label.typhoon.view_map": "View track map",
    "nav.board": "Board",
    "nav.explore": "Explore",
    "nav.radar": "Radar",
  },
  tc: {
    "app.title": "TimoWeather",
    "app.region": "香港",
    "action.refresh": "更新",
    "action.retry": "重試",
    "action.close": "關閉",
    "label.now": "目前",
    "label.warnings": "警告",
    "label.warnings.none": "沒有",
    "label.warnings.active": "生效",
    "label.warnings.details": "詳情",
    "label.forecast_9d": "九天天氣預報",
    "label.rainfall": "雨量",
    "label.rainfall.districts": "地區",
    "label.rainfall.stations": "測站",
    "label.rainfall.past_hour_district": "過去一小時（地區最大）",
    "label.rainfall.past_hour_stations": "過去一小時（自動站）",
    "label.humidity": "濕度",
    "label.low": "最低",
    "label.updated": "更新",
    "label.selected": "已選",
    "label.station": "測站",
    "label.search_stations": "搜尋測站…",
    "label.no_stations_found": "找不到測站。",
    "label.stations": "測站",
    "action.toggle_theme": "切換主題",
    "label.theme_light": "淺色",
    "label.theme_dark": "深色",
    "label.maintenance": "維修",
    "label.lightning": "雷電",
    "label.lightning.active": "偵測到雷電",
    "label.rain_probability": "大雨機會",
    "label.wind": "風",
    "label.sea_temp": "海水溫度",
    "label.soil_temp": "土壤溫度",
    "label.mintemp_00_09": "凌晨最低溫",
    "label.rainfall_00_12": "上午雨量",
    "label.rainfall_last_month": "上月雨量",
    "label.rainfall_ytd": "年初至今",
    "label.sunrise": "日出",
    "label.sun_transit": "日中天",
    "label.sunset": "日落",
    "label.tides": "潮汐",
    "label.tide_heights": "每小時潮高",
    "label.tide_times": "高低潮",
    "label.radar": "雷達",
    "label.typhoon": "熱帶氣旋",
    "label.typhoon.view_map": "查看路徑圖",
    "nav.board": "主頁",
    "nav.explore": "探索",
    "nav.radar": "雷達",
  },
  sc: {
    "app.title": "TimoWeather",
    "app.region": "香港",
    "action.refresh": "刷新",
    "action.retry": "重试",
    "action.close": "关闭",
    "label.now": "当前",
    "label.warnings": "警告",
    "label.warnings.none": "无",
    "label.warnings.active": "生效",
    "label.warnings.details": "详情",
    "label.forecast_9d": "九天天气预报",
    "label.rainfall": "雨量",
    "label.rainfall.districts": "地区",
    "label.rainfall.stations": "测站",
    "label.rainfall.past_hour_district": "过去一小时（地区最大）",
    "label.rainfall.past_hour_stations": "过去一小时（自动站）",
    "label.humidity": "湿度",
    "label.low": "最低",
    "label.updated": "更新",
    "label.selected": "已选",
    "label.station": "测站",
    "label.search_stations": "搜索测站…",
    "label.no_stations_found": "找不到测站。",
    "label.stations": "测站",
    "action.toggle_theme": "切换主题",
    "label.theme_light": "浅色",
    "label.theme_dark": "深色",
    "label.maintenance": "维护",
    "label.lightning": "雷电",
    "label.lightning.active": "检测到雷电",
    "label.rain_probability": "大雨机会",
    "label.wind": "风",
    "label.sea_temp": "海水温度",
    "label.soil_temp": "土壤温度",
    "label.mintemp_00_09": "凌晨最低温",
    "label.rainfall_00_12": "上午雨量",
    "label.rainfall_last_month": "上月雨量",
    "label.rainfall_ytd": "年初至今",
    "label.sunrise": "日出",
    "label.sun_transit": "日中天",
    "label.sunset": "日落",
    "label.tides": "潮汐",
    "label.tide_heights": "每小时潮高",
    "label.tide_times": "高低潮",
    "label.radar": "雷达",
    "label.typhoon": "热带气旋",
    "label.typhoon.view_map": "查看路径图",
    "nav.board": "主页",
    "nav.explore": "探索",
    "nav.radar": "雷达",
  },
};

export function t(lang: Language, key: I18nKey): string {
  return DICTS[lang][key] ?? DICTS.en[key];
}
