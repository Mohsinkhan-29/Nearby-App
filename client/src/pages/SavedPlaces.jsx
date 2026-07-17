import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bookmark } from "lucide-react";
import PlaceCard from "../components/PlaceCard.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useSavedPlaces } from "../hooks/useSavedPlaces.js";

export default function SavedPlaces() {
  const navigate = useNavigate();

  const { savedPlaces, status, removePlace } = useSavedPlaces();

  return (
    <div className="mx-auto max-w-md pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="text-ink"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>

        <h1 className="font-display text-2xl text-ink">
          Saved Places
        </h1>
      </div>

      <div className="mt-5 px-5">
        {status === "loading" && (
          <p className="text-sm text-ink/50">
            Loading your saved places...
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-clay">
            Couldn't load saved places.
          </p>
        )}

        {status === "success" && savedPlaces.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-mist py-14 text-center">
            <Bookmark size={22} className="text-ink/30" />
            <p className="text-sm text-ink/50">
              Places you bookmark will show up here.
            </p>
          </div>
        )}

        {status === "success" && savedPlaces.length > 0 && (
          <div className="flex flex-col gap-3">
            {savedPlaces.map((place) => (
              <div key={place.id} className="relative">
                <PlaceCard
                  place={place}
                  onClick={() => navigate(`/place/${place.id}`)}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePlace(place.id);
                  }}
                  className="absolute right-3 top-3 rounded-full bg-paper/90 p-1.5 text-clay shadow transition hover:bg-paper"
                  aria-label="Remove from saved"
                >
                  <Bookmark
                    size={14}
                    fill="currentColor"
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}