import PlaceCard from "./PlaceCard.jsx";

function SkeletonRow() {
  return (
    <div className="flex animate-pulse overflow-hidden rounded-2xl bg-paper shadow-sm">
      <div className="h-24 w-24 shrink-0 bg-sand" />
      <div className="flex-1 space-y-2 px-4 py-4">
        <div className="h-4 w-2/3 rounded bg-sand" />
        <div className="h-3 w-1/2 rounded bg-sand" />
        <div className="h-3 w-1/3 rounded bg-sand" />
      </div>
    </div>
  );
}

export default function PlacesList({ status, error, places }) {
  if (status === "loading") {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="rounded-xl bg-clay/5 px-4 py-6 text-center text-sm text-clay">
        {error || "Couldn't load places. Try again in a moment."}
      </p>
    );
  }

  if (!places.length) {
    return (
      <p className="rounded-xl bg-paper px-4 py-8 text-center text-sm text-ink/60 shadow-sm">
        No spots found nearby. Try a different mood or a wider radius.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} variant="row" />
      ))}
    </div>
  );
}
