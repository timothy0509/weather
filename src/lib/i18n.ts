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
  | "label.rainfall.place"
  | "label.rainfall.amount"
  | "label.rainfall.empty"
  | "label.rainfall.show_all"
  | "label.rainfall.show_less"
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
  | "label.board"
  | "label.local_forecast"
  | "label.signals"
  | "label.signals.all_clear"
  | "label.tip"
  | "label.no_details"
  | "label.explore.title"
  | "label.explore.lede"
  | "label.special_tips"
  | "label.special_tips.none"
  | "label.earthquake"
  | "label.earthquake.quick"
  | "label.earthquake.felt"
  | "label.lunar_date"
  | "label.open_data"
  | "label.table.empty"
  | "label.items"
  | "label.radar.lede"
  | "label.radar.viewer"
  | "label.local_forecast.brief"
  | "error.tips.unavailable"
  | "error.earthquake"
  | "error.lunar"
  | "error.tide"
  | "error.open_data"
  | "error.radar"
  | "error.warnings"
  | "error.tips"
  | "error.now"
  | "error.forecast_9d"
  | "error.local_forecast"
  | "error.board"
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
    "label.rainfall.place": "Place",
    "label.rainfall.amount": "Rainfall (mm, past hour)",
    "label.rainfall.empty": "No rainfall recorded in the past hour.",
    "label.rainfall.show_all": "Show all",
    "label.rainfall.show_less": "Show less",
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
    "label.board": "Weather board",
    "label.local_forecast": "Local forecast",
    "label.signals": "Signals",
    "label.signals.all_clear": "All clear",
    "label.tip": "Special tip",
    "label.no_details": "No details available.",
    "label.explore.title": "Explore",
    "label.explore.lede":
      "Extra Observatory datasets — full local forecast, tips, tremors, lunar calendar, tides, and open tables.",
    "label.special_tips": "Special weather tips",
    "label.special_tips.none": "None",
    "label.earthquake": "Earthquake",
    "label.earthquake.quick": "Quick message",
    "label.earthquake.felt": "Locally felt",
    "label.lunar_date": "Lunar date",
    "label.open_data": "Open data table",
    "label.table.empty": "No rows in this table.",
    "label.items": "items",
    "label.radar.lede": "Hong Kong Observatory weather radar imagery",
    "label.radar.viewer": "HKO interactive radar viewer",
    "label.local_forecast.brief": "Read the full text under Explore",
    "error.tips.unavailable": "Tips unavailable",
    "error.earthquake": "Earthquake data unavailable",
    "error.lunar": "Lunar date unavailable",
    "error.tide": "Tide data unavailable",
    "error.open_data": "Open data unavailable",
    "error.radar": "Radar imagery unavailable",
    "error.warnings": "HKO warnings unavailable",
    "error.tips": "HKO tips unavailable",
    "error.now": "Current observation unavailable",
    "error.forecast_9d": "9-day forecast unavailable",
    "error.local_forecast": "Local forecast unavailable",
    "error.board": "Weather board failed to load",
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
    "label.rainfall.place": "地點",
    "label.rainfall.amount": "雨量（毫米，過去一小時）",
    "label.rainfall.empty": "過去一小時沒有錄得雨量。",
    "label.rainfall.show_all": "顯示全部",
    "label.rainfall.show_less": "收起",
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
    "label.board": "天氣主頁",
    "label.local_forecast": "本地天氣預報",
    "label.signals": "警告信號",
    "label.signals.all_clear": "一切正常",
    "label.tip": "特別提示",
    "label.no_details": "暫無詳情。",
    "label.explore.title": "探索",
    "label.explore.lede": "更多天文台數據：完整本地預報、提示、地震、農曆、潮汐和開放數據表。",
    "label.special_tips": "特別天氣提示",
    "label.special_tips.none": "沒有",
    "label.earthquake": "地震",
    "label.earthquake.quick": "地震速報",
    "label.earthquake.felt": "本地有感",
    "label.lunar_date": "農曆",
    "label.open_data": "開放數據表",
    "label.table.empty": "這個表格沒有資料。",
    "label.items": "項",
    "label.radar.lede": "香港天文台天氣雷達圖像",
    "label.radar.viewer": "天文台互動雷達瀏覽器",
    "label.local_forecast.brief": "完整內容請到探索頁閱讀",
    "error.tips.unavailable": "未能載入提示",
    "error.earthquake": "未能載入地震資料",
    "error.lunar": "未能載入農曆資料",
    "error.tide": "未能載入潮汐資料",
    "error.open_data": "未能載入開放數據",
    "error.radar": "未能載入雷達圖像",
    "error.warnings": "未能載入天文台警告",
    "error.tips": "未能載入天文台提示",
    "error.now": "未能載入即時觀測",
    "error.forecast_9d": "未能載入九天天氣預報",
    "error.local_forecast": "未能載入本地天氣預報",
    "error.board": "天氣主頁載入失敗",
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
    "label.rainfall.place": "地点",
    "label.rainfall.amount": "雨量（毫米，过去一小时）",
    "label.rainfall.empty": "过去一小时没有录得雨量。",
    "label.rainfall.show_all": "显示全部",
    "label.rainfall.show_less": "收起",
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
    "label.board": "天气主页",
    "label.local_forecast": "本地天气预报",
    "label.signals": "警告信号",
    "label.signals.all_clear": "一切正常",
    "label.tip": "特别提示",
    "label.no_details": "暂无详情。",
    "label.explore.title": "探索",
    "label.explore.lede": "更多天文台数据：完整本地预报、提示、地震、农历、潮汐和开放数据表。",
    "label.special_tips": "特别天气提示",
    "label.special_tips.none": "无",
    "label.earthquake": "地震",
    "label.earthquake.quick": "地震速报",
    "label.earthquake.felt": "本地有感",
    "label.lunar_date": "农历",
    "label.open_data": "开放数据表",
    "label.table.empty": "这个表格没有数据。",
    "label.items": "项",
    "label.radar.lede": "香港天文台天气雷达图像",
    "label.radar.viewer": "天文台互动雷达浏览器",
    "label.local_forecast.brief": "完整内容请到探索页阅读",
    "error.tips.unavailable": "未能加载提示",
    "error.earthquake": "未能加载地震数据",
    "error.lunar": "未能加载农历数据",
    "error.tide": "未能加载潮汐数据",
    "error.open_data": "未能加载开放数据",
    "error.radar": "未能加载雷达图像",
    "error.warnings": "未能加载天文台警告",
    "error.tips": "未能加载天文台提示",
    "error.now": "未能加载实时观测",
    "error.forecast_9d": "未能加载九天天气预报",
    "error.local_forecast": "未能加载本地天气预报",
    "error.board": "天气主页加载失败",
    "nav.board": "主页",
    "nav.explore": "探索",
    "nav.radar": "雷达",
  },
};

export function t(lang: Language, key: I18nKey): string {
  return DICTS[lang][key] ?? DICTS.en[key];
}
