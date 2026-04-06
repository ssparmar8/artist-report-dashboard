# Artist Report Dashboard

A production-grade React.js dashboard built from **real Dataverse data** (`cr917_artistreports`), tracking 4 Latin artists: **Bad Bunny, Rauw Alejandro, Becky G, and Carlos Vives**.

---

## Features

- **Roster Overview** — KPI metrics, listener comparison charts, genre distribution, top album streams, awards & upcoming tours
- **Artist Detail** — deep-dive panel with tabbed sections: Overview, Discography, Tours, Fan Signals, News
- **Real data** — streaming milestones, awards, tour dates, fan signals, social posts all sourced directly from Dataverse export
- **Interactive charts** — built with Chart.js (bar, doughnut, horizontal bar charts)
- **Dark theme** — refined dark UI with DM Serif Display + DM Sans typography

---

## Tech Stack

| Package | Version |
|---|---|
| React | 18.x |
| Chart.js | 4.x |
| react-chartjs-2 | 5.x |
| react-scripts | 5.x |

---

## Getting Started

### Prerequisites
- Node.js >= 14
- npm >= 6

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm start
```

App opens at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output goes to the `build/` folder.

---

## Project Structure

```
artist-report-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ArtistCard.jsx        # Sidebar artist card
│   │   ├── ArtistDetail.jsx      # Tabbed detail panel
│   │   ├── MetricCard.jsx        # KPI metric card
│   │   ├── RosterCharts.jsx      # Listeners, genre, album stream charts
│   │   └── StreamingChart.jsx    # Per-artist top tracks bar chart
│   ├── data/
│   │   └── artistData.js         # Real Dataverse artist data
│   ├── App.jsx                   # Main app with routing
│   ├── App.css                   # Global styles
│   └── index.js                  # React entry point
├── package.json
└── README.md
```

---

## Data Source

All data is extracted from the Dataverse table `cr917_artistreports` (exported as `ExportedFiles_e1bf298c-c008-4353-87d6-36d61ecc220b.zip`). Fields used:

| Dataverse Field | Used For |
|---|---|
| `cr917_profile` | Artist bio, age, country, genres, roles |
| `cr917_discography` | Albums, streaming milestones, chart positions |
| `cr917_events` | Tour dates, venues, status |
| `cr917_fan_signals` | Community signals, intensity scores |
| `cr917_award_recognition` | Awards won/nominated |
| `cr917_social_activity` | Social posts, view counts |
| `cr917_news_announcement` | Recent news headlines |
| `cr917_popularity` | Monthly listeners, top track streams |

---

## Connecting to Live Dataverse

To replace the static data with live Dataverse API calls, update `src/data/artistData.js` to fetch from:

```
https://<your-org>.api.crm.dynamics.com/api/data/v9.2/cr917_artistreports
```

Use the `@microsoft/mgt-react` or `@azure/msal-react` libraries for authentication.
