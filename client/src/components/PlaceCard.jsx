import { Link } from "react-router-dom";
import { Star, MapPin, Bookmark } from "lucide-react";

export default function PlaceCard({ place, variant = "row" }) {
  if (variant === "grid") {
    return (
      <Link
        to={`/place/${place.id}`}
        className="flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl bg-paper shadow-sm"
      >
        <div className="relative h-32 w-full bg-sand">
          {place.photoUrl ? (
            <img src={place.photoUrl} alt={place.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl">📍</div>
          )}
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-pill bg-paper/90 px-2 py-1 text-[11px] font-medium text-ink">
            <Bookmark size={12} /> Save
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1 px-3 py-2.5">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-sm font-semibold leading-tight text-ink">{place.name}</h3>
            <span className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-ink">
              <Star size={12} className="fill-gold text-gold" /> {place.rating ?? "—"}
            </span>
          </div>
          <p className="flex items-center gap-1 text-xs text-ink/50">
            <MapPin size={12} /> {place.address}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/place/${place.id}`}
      className="group flex overflow-hidden rounded-2xl bg-paper shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="h-24 w-24 shrink-0 bg-sand">
        {place.photoUrl ? (
          <img src={place.photoUrl} alt={place.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">📍</div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base leading-tight text-ink">{place.name}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-ink">
            <Star size={13} className="fill-gold text-gold" /> {place.rating ?? "—"}
          </span>
        </div>
        <p className="flex items-center gap-1 text-xs text-ink/50">
          <MapPin size={12} /> {place.address}
        </p>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-ink/50">{place.distance}</span>
          <span className={place.openNow ? "text-moss" : "text-ink/40"}>
            {place.openNow ? "Open" : "Closed"}
          </span>
        </div>
      </div>
    </Link>
  );
}
