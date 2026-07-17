import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal, Bell, LogOut } from "lucide-react";
import MoodSelector from "../components/MoodSelector.jsx";
import FilterBar from "../components/FilterBar.jsx";
import PlacesList from "../components/PlacesList.jsx";
import PlaceCard from "../components/PlaceCard.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useLocation } from "../hooks/useLocation.js";
import { usePlaces } from "../hooks/usePlaces.js";
import { moodToType } from "../utils/moodConfig.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { coords, status: locationStatus, error: locationError } = useLocation();
  const [selectedMood, setSelectedMood] = useState("coffee");
  const [filters, setFilters] = useState({ openNow: false, minRating: 0 });
  const [sortBy, setSortBy] = useState("nearest");
  const [showFilters, setShowFilters] = useState(false);

  const [profileImage, setProfileImage] = useState(
    "https://picsum.photos/seed/avatar/80/80"
  );

  useEffect(() => {
    const saved = localStorage.getItem("profileImage");

    if (saved) {
      setProfileImage(saved);
    }
  }, []);

  const { places, status, error } = usePlaces({
    coords,
    mood: moodToType(selectedMood),
  });

  const visiblePlaces = useMemo(() => {
    let result = places.filter((p) => {
      if (filters.openNow && !p.openNow) return false;
      if ((p.rating ?? 0) < filters.minRating) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
      return (a.distanceValue ?? 0) - (b.distanceValue ?? 0);
    });

    return result;
  }, [places, filters, sortBy]);

  const topPicks = useMemo(
    () => [...visiblePlaces].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 5),
    [visiblePlaces]
  );

  return (
    <div className="mx-auto max-w-md pb-28">
      <div className="rounded-b-[2rem] bg-night px-5 pb-6 pt-8 text-paper">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-full bg-paper/20">
              <img
                src={profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm text-paper/70">
              Hi, <span className="font-medium text-paper">{user?.name?.split(" ")[0] || "there"}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full bg-paper/10 p-2" aria-label="Notifications">
              <Bell size={16} />
            </button>
            <button
              onClick={logout}
              className="rounded-full bg-paper/10 p-2"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
        <h1 className="mt-5 font-display text-3xl leading-tight">
          Discover amazing
          <br />
          spots nearby
        </h1>

        <div className="mt-5 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-pill bg-paper px-4 py-3">
            <Search size={16} className="text-ink/40" />
            <span className="flex-1 truncate text-sm text-ink/40">
              {locationStatus === "success" ? "Current location" : "Detecting location…"}
            </span>
            <button className="rounded-pill bg-night px-4 py-1.5 text-xs font-semibold text-paper">
              Search
            </button>
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="shrink-0 rounded-full bg-paper/10 p-3"
            aria-label="Filters"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      {locationStatus === "error" && (
        <p className="mt-4 px-5 text-sm text-clay">
          {locationError || "Couldn't get your location — showing default results."}
        </p>
      )}

      <div className="mt-5 px-5">
        <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />
      </div>

      {showFilters && (
        <div className="mt-4 px-5">
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      )}

      {status === "success" && topPicks.length > 0 && (
        <div className="mt-6">
          <h2 className="px-5 font-display text-lg text-ink">Top picks</h2>
          <div className="mt-5">
            <div className="mb-4 flex items-center justify-between px-5">
              <div>
                <h2 className="text-xl font-semibold text-ink">
                  ⭐ Top Picks
                </h2>
                <p className="mt-1 text-sm text-ink/60">
                  Highest-rated places near you
                </p>
              </div>

              <span className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-ink/70">
                {topPicks.length} Places
              </span>
            </div>

            <div className="scrollbar-hide flex gap-4 overflow-x-auto px-5 pb-3">
              {topPicks.map((place) => (
                <div
                  key={place.id}
                  className="w-[270px] shrink-0 transition duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <div className="overflow-hidden rounded-3xl shadow-sm transition hover:shadow-xl">
                    <PlaceCard
                      place={place}
                      onClick={() => navigate(`/place/${place.id}`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 px-5">
        <h2 className="font-display text-lg text-ink">Nearby</h2>
        <div className="mt-3">
          {status === "loading" && (
            <p className="text-sm text-ink/50">Finding places near you…</p>
          )}
          {status === "error" && (
            <p className="text-sm text-clay">{error || "Couldn't load places."}</p>
          )}
          {status === "success" && visiblePlaces.length === 0 && (
            <p className="text-sm text-ink/50">No places match your filters yet.</p>
          )}
          {status === "success" && visiblePlaces.length > 0 && (
            <PlacesList places={visiblePlaces} />
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}