# Smart Nearby Places Recommender — Project Overview

A full-stack app that recommends nearby places based on the user's current
mood or intent (Coffee, Quick Bite, Work Spot, Nature, etc.), instead of
making them manually search. Built as a learning project covering REST APIs,
geolocation, a secure backend proxy pattern, and React/Express fundamentals.

## What it does

1. User opens the app → sees a splash screen → taps "Get started".
2. Browser geolocation grabs the user's current lat/lng.
3. User picks a mood (mapped to a Google Place type, e.g. Coffee → `cafe`).
4. The React frontend calls the Express backend at `/api/places`.
5. The backend attaches the Google Places API key (never exposed to the
   browser) and calls Google's Places API (New).
6. Results come back, get filtered/sorted, and render as cards.
7. Tapping a card opens a detail page with more info and a "Get Directions"
   action.

## Tech stack

| Layer    | Choice                                                |
|----------|--------------------------------------------------------|
| Frontend | React (Vite), React Router, Tailwind CSS, lucide-react, axios |
| Backend  | Node.js, Express, axios, dotenv, cors                 |
| External API | Google Places API (New) — `places.googleapis.com/v1` |
| Geolocation | Browser Geolocation API (`navigator.geolocation`)  |

**Styling note:** everything uses Tailwind utility classes directly in
components. There is no `styles/` folder or CSS Modules — the only CSS file
is `client/src/index.css`, which just loads Tailwind's three layers.

## Security model

The frontend never talks to Google directly. It only ever calls its own
Express backend (`/api/places...`), which is the one place that holds
`GOOGLE_PLACES_API_KEY` (via `server/.env`, not committed). This is the
"backend proxy pattern" — API keys never reach the browser or get bundled
into client JS.

## Key features implemented

- Mood-based search (mood → Google Place type mapping in `moodConfig.js`)
- Geolocation with permission-denied / error handling
- Filtering: open now, minimum rating
- Sorting: nearest, highest rated, alphabetical
- Distance calculation (Haversine formula, `utils/distance.js`)
- Loading skeletons and empty/error states
- Place detail page with tabs (Overview / Comments / Directions)

## Design system (current UI pass)

Reskinned to match a dark-green "tourist discovery app" reference design:

- **Colors** (`tailwind.config.js`): `night` (#16302B, header/CTA bg), `moss`
  (#1E4B40), `mist` (#F4F6F4, light section bg), `gold` (#F2B705, star
  ratings), `clay` (#C4632B, errors/accents), `sand` (borders/dividers),
  `paper` (white), `ink` (near-black text).
- **Fonts**: `Fraunces` (display/headings) + `Inter` (body), loaded via
  Google Fonts in `index.html`.
- **Screens**:
  - `Splash.jsx` — full-bleed photo, gradient overlay, "Get started" CTA.
  - `Home.jsx` — dark rounded-bottom header (greeting, search bar, mood
    pills), horizontal "Top picks" scroll, vertical "Nearby spots" list,
    fixed `BottomNav`.
  - `PlaceDetails.jsx` — hero image + thumbnail strip, stats row (Open /
    Ratings / Price), tabs, sticky "Get Directions" CTA.
- Images are currently `picsum.photos` placeholders until real
  `place.photoUrl` values flow through from the Google Places response.

## Stretch goals (not yet built)

- Search by city (fallback for denied location permission)
- Google Maps integration on the detail page
- Favorites via `localStorage`
- Dark mode
- Rate limiting on the backend
- Recently viewed / search history

## Running it

```bash
# Backend
cd server
npm install
cp .env.example .env   # add your Google Places API key
npm run dev

# Frontend
cd client
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:5000` in dev, so no CORS
configuration is needed locally beyond what's already in `server/index.js`.
