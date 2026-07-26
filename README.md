# TimoWeather

Hong Kong weather dashboard powered by [Hong Kong Observatory](https://www.hko.gov.hk/) open data.

## Data sources

All weather data comes from the free, public HKO Open Data API — no API key required.

| Endpoint | Use |
|---|---|
| `weather.php` (`rhrread`, `fnd`, `flw`, `warnsum`, `warningInfo`, `swt`) | Current conditions, forecast, warnings |
| `hourlyRainfall.php` | Per-station hourly rainfall |
| `earthquake.php` | Earthquake alerts |
| `lunardate.php` | Lunar calendar |
| `opendata.php` | Sun/moon times, tides, visibility, lightning, climate |
| HKO radar imagery | Live weather radar (see `/radar`) |
| `tc_list.xml` | Tropical cyclone track (shown when typhoon signal active) |

See [docs/HKO_API_Reference.md](docs/HKO_API_Reference.md) for full API documentation.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test      # run tests
npm run build # production build
```

## Stack

- Next.js 16 (App Router)
- tRPC + TanStack React Query
- Tailwind CSS 4
- Hong Kong Observatory open data (`data.weather.gov.hk`)
