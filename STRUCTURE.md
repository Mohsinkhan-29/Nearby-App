# Project Structure

```
smart-nearby-places/
│
├── PROJECT.md                  # what the app does, stack, design system
├── STRUCTURE.md                # this file
├── README.md                   # quick setup instructions
│
├── client/                     # React (Vite) frontend
│   ├── index.html              # HTML shell, loads Google Fonts (Fraunces + Inter)
│   ├── vite.config.js          # dev server + /api proxy → localhost:5000
│   ├── tailwind.config.js      # color tokens (night/moss/mist/gold/sand/etc), fonts
│   ├── postcss.config.js       # tailwind + autoprefixer
│   ├── package.json
│   │
│   └── src/
│       ├── main.jsx            # React root, wraps App in BrowserRouter
│       ├── App.jsx             # route table: / , /discover , /place/:placeId
│       ├── index.css           # ONLY css file — just the 3 @tailwind directives
│       │
│       ├── pages/
│       │   ├── Splash.jsx      # "/" — onboarding screen, Get started → /discover
│       │   ├── Home.jsx        # "/discover" — header, mood pills, top picks, list
│       │   └── PlaceDetails.jsx# "/place/:placeId" — hero, tabs, sticky CTA
│       │
│       ├── components/
│       │   ├── MoodSelector.jsx# horizontal mood pill row
│       │   ├── FilterBar.jsx   # open-now checkbox, min rating, sort dropdown
│       │   ├── PlaceCard.jsx   # two variants: "row" (list) and "grid" (top picks)
│       │   ├── PlacesList.jsx  # loading skeletons / empty / error / list states
│       │   └── BottomNav.jsx   # fixed Discover/Category/Saved/Profile bar
│       │
│       ├── hooks/
│       │   ├── useLocation.js  # wraps navigator.geolocation, exposes status/coords
│       │   └── usePlaces.js    # calls services/api.js, exposes places/status/error
│       │
│       ├── services/
│       │   └── api.js          # axios instance, fetchPlaces() + fetchPlaceDetails()
│       │
│       └── utils/
│           ├── moodConfig.js   # MOODS list + moodToType() → Google place type
│           └── distance.js     # haversineDistance() + formatDistance()
│
└── server/                     # Express backend
    ├── index.js                # app setup, cors, /api/places mount, error handler
    ├── package.json
    ├── .env.example             # PORT, GOOGLE_PLACES_API_KEY, CLIENT_ORIGIN
    │
    ├── routes/
    │   └── places.js           # GET / and GET /:placeId → controller
    │
    ├── controllers/
    │   └── placesController.js # validates query params, calls the service
    │
    └── services/
        └── googlePlaces.js     # holds the API key, calls Google Places API (New)
```

## How a request flows (nearby search)

```
Home.jsx
  → usePlaces hook
    → services/api.js  (axios GET /api/places?lat&lng&mood&radius)
      → [Vite proxy in dev] → server/index.js
        → routes/places.js
          → controllers/placesController.js (validates lat/lng)
            → services/googlePlaces.js (attaches GOOGLE_PLACES_API_KEY)
              → Google Places API :searchNearby
            ← simplified places[] array
          ← res.json({ places })
      ← axios response
  ← places, status, error returned to Home.jsx
```

## How a request flows (place details)

```
PlaceCard → Link to /place/:placeId
  → PlaceDetails.jsx
    → services/api.js fetchPlaceDetails(placeId)
      → GET /api/places/:placeId
        → placesController.getPlaceDetails
          → googlePlaces.getDetails(placeId)
            → Google Places API GET /v1/places/:placeId
          ← { name, address, rating, phone, website, ... }
```

## Naming conventions used

- Pages = route-level components, live in `pages/`, one per route in `App.jsx`.
- Components = reusable pieces with no routing awareness, live in `components/`.
- Hooks = stateful logic extracted out of components, prefixed `use`, live in `hooks/`.
- All styling is Tailwind utility classes inline in JSX — no `.css`/`.module.css`
  files per component.
