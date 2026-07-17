import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlaceDetails } from "../services/api";
import { useSavedPlaces } from "../hooks/useSavedPlaces.js";
import {
  ArrowLeft, Heart, Star, MapPin, Phone, Globe, Clock, ChevronDown,
  UtensilsCrossed, ShoppingBag, Bike, Coffee, IceCream, Baby, Users,
  CreditCard, Smartphone, ParkingCircle, Accessibility, DoorOpen,
  Fuel, School, Building2, Shirt, Navigation, ExternalLink, Landmark,
  Loader2
} from "lucide-react";

// Maps the "icon" string returned by the API to an actual lucide-react component


const ICON_MAP = {
  MapPin, Landmark, CreditCard, Shirt, Building2, School, Fuel, Coffee,
};

const TONE_CLASSES = {
  accent: "bg-rose-100 text-rose-500",
  green: "bg-emerald-50 text-emerald-700",
  neutral: "bg-stone-100 text-stone-500",
};

function Pin({ children, size = 34, tone = "accent" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full ${TONE_CLASSES[tone]}`}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}

function SectionCard({ title, children, right }) {
  return (
    <div className="mb-3.5 rounded-[20px] border border-stone-200 bg-white px-[18px] pb-5 pt-[18px]">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="font-serif text-[17px] font-semibold text-stone-900">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function Row({ icon, label, value, tone = "neutral" }) {
  return (
    <div className="flex items-center gap-3 py-[9px]">
      <Pin size={30} tone={tone}>{icon}</Pin>
      <span className="flex-1 text-[13.5px] text-stone-500">{label}</span>
      <span className="text-[13.5px] font-semibold text-stone-900">{value}</span>
    </div>
  );
}

// --- helpers to turn raw API data into display-ready values ---

function formatOpeningHours(openingHours) {
  // API returns ["Monday: 8:00 AM – 1:00 AM", ...]
  if (!Array.isArray(openingHours)) return [];
  return openingHours.map((line) => {
    const idx = line.indexOf(":");
    return [line.slice(0, idx), line.slice(idx + 1).trim()];
  });
}

function formatNextClose(nextCloseTime) {
  if (!nextCloseTime) return null;
  try {
    return new Date(nextCloseTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return null;
  }
}

function formatPriceRange(priceRange) {
  if (!priceRange || !priceRange.start || !priceRange.end) return null;
  return `${priceRange.currency} ${Number(priceRange.start).toLocaleString()} – ${Number(priceRange.end).toLocaleString()}`;
}

const SERVICE_ROWS = [
  { key: "dineIn", icon: <UtensilsCrossed size={14} />, label: "Dine in" },
  { key: "takeout", icon: <ShoppingBag size={14} />, label: "Takeout" },
  { key: "delivery", icon: <Bike size={14} />, label: "Delivery" },
  { key: "coffee", icon: <Coffee size={14} />, label: "Coffee" },
  { key: "dessert", icon: <IceCream size={14} />, label: "Dessert" },
  { key: "kids", icon: <Baby size={14} />, label: "For kids" },
  { key: "breakfast", icon: <UtensilsCrossed size={14} />, label: "Breakfast" },
  { key: "lunch", icon: <UtensilsCrossed size={14} />, label: "Lunch" },
  { key: "dinner", icon: <UtensilsCrossed size={14} />, label: "Dinner" },
  { key: "groups", icon: <Users size={14} />, label: "Good for groups" },
];

export default function PlaceDetail() {
  const { placeId: routeId } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoursOpen, setHoursOpen] = useState(false);
  const navigate = useNavigate();

  const { isSaved, toggleSaved } = useSavedPlaces();

  useEffect(() => {
    const placeId = routeId;
    let cancelled = false;

    async function fetchPlace() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlaceDetails(placeId);
        if (!cancelled) setPlace(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load place");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPlace();
    return () => { cancelled = true; };
  }, [routeId]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[420px] flex-col items-center justify-center gap-2.5 bg-[#F6F1E6] font-sans text-stone-500">
        <Loader2 size={26} className="animate-spin" />
        <span className="text-[13.5px]">Loading place…</span>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[420px] flex-col items-center justify-center gap-2.5 bg-[#F6F1E6] p-6 text-center font-sans text-stone-500">
        <span className="text-sm font-semibold text-stone-900">Couldn't load this place</span>
        <span className="text-[12.5px]">{error}</span>
      </div>
    );
  }

  const days = formatOpeningHours(place.openingHours);
  const nextClose = formatNextClose(place.nextCloseTime);
  const priceRange = formatPriceRange(place.priceRange);
  const services = SERVICE_ROWS.filter((s) => place.services?.[s.key]);
  const nearby = place.nearby || [];

  const saved = isSaved(place.id);


  function handleToggleSave() {
    toggleSaved({
      id: place.id,
      name: place.name,
      category: place.category,
      lat: place.location?.latitude ?? null,
      lng: place.location?.longitude ?? null,
    });
  }

  return (
    <div
      className="mx-auto min-h-full max-w-[420px] bg-[#F6F1E6] pb-[90px] text-stone-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header / hero */}
      <div className="relative bg-[#152420] px-[18px] pb-[46px] pt-[18px]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/[0.12] text-white"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={handleToggleSave}
            className={`flex h-[38px] w-[38px] items-center justify-center rounded-full text-white ${saved ? "bg-rose-500" : "bg-white/[0.12]"
              }`}
            aria-label="Save place"
          >
            <Heart size={17} fill={saved ? "#fff" : "none"} />
          </button>
        </div>

        <div className="mt-[22px]">
          <span className="mb-2.5 inline-block rounded-full bg-white/10 px-2.5 py-[5px] text-[11.5px] font-semibold tracking-wide text-emerald-50">
            {place.category}
          </span>
          <h1 className="mb-2 font-serif text-[26px] font-semibold leading-[1.15] text-white">
            {place.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3.5">
            {typeof place.rating === "number" && (
              <div className="flex items-center gap-[5px]">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-[13.5px] font-semibold text-white">{place.rating}</span>
                <span className="text-[12.5px] text-stone-400">
                  ({place.totalRatings?.toLocaleString?.() ?? place.totalRatings})
                </span>
              </div>
            )}
            <span
              className={`flex items-center gap-1 text-[12.5px] font-semibold ${place.openNow ? "text-emerald-400" : "text-red-400"
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${place.openNow ? "bg-emerald-400" : "bg-red-400"}`}
              />
              {place.openNow
                ? `Open${nextClose ? ` · closes ${nextClose}` : ""}`
                : "Closed now"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-[26px] px-4">

        {/* About */}
        <SectionCard title="About">
          {place.description ? (
            <p className="text-[13.5px] leading-relaxed text-stone-500">{place.description}</p>
          ) : null}
          <p className={`flex items-start gap-1.5 text-[12.5px] text-stone-500 ${place.description ? "mt-2.5" : ""}`}>
            <MapPin size={14} className="mt-0.5 shrink-0 text-rose-500" />
            {place.shortAddress || place.address}
          </p>
        </SectionCard>

        {/* Price range */}
        {priceRange && (
          <SectionCard title="Price range">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-serif text-xl font-semibold">{priceRange}</span>
              <span className="text-[12.5px] text-stone-500">per person</span>
            </div>
          </SectionCard>
        )}

        {/* Services */}
        {services.length > 0 && (
          <SectionCard title="Services">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {services.map((s) => (
                <Row key={s.key} icon={s.icon} label={s.label} value="Yes" />
              ))}
            </div>
          </SectionCard>
        )}

        {/* Facilities */}
        <SectionCard title="Facilities">
          <Row
            icon={<Accessibility size={14} />}
            label="Wheelchair accessible"
            value={place.facilities?.wheelchairAccessible ? "Yes" : "No"}
            tone={place.facilities?.wheelchairAccessible ? "green" : "neutral"}
          />
          <Row
            icon={<DoorOpen size={14} />}
            label="Restroom on site"
            value={place.facilities?.restroom ? "Yes" : "No"}
            tone={place.facilities?.restroom ? "green" : "neutral"}
          />
          <Row
            icon={<ParkingCircle size={14} />}
            label="Parking"
            value={
              place.facilities?.parkingOptions?.freeParkingLot && place.facilities?.parkingOptions?.freeStreetParking
                ? "Free lot & street"
                : place.facilities?.parkingOptions?.freeParkingLot
                  ? "Free lot"
                  : place.facilities?.parkingOptions?.freeStreetParking
                    ? "Free street"
                    : place.facilities?.parking ? "Available" : "Not available"
            }
            tone={place.facilities?.parking ? "green" : "neutral"}
          />
          <Row
            icon={<CreditCard size={14} />}
            label="Cards accepted"
            value={
              place.facilities?.paymentOptions?.acceptsCreditCards || place.facilities?.paymentOptions?.acceptsDebitCards
                ? "Credit & debit"
                : "Not accepted"
            }
            tone={place.facilities?.paymentOptions?.acceptsCreditCards ? "green" : "neutral"}
          />
          <Row
            icon={<Smartphone size={14} />}
            label="Contactless"
            value={place.facilities?.paymentOptions?.acceptsNfc ? "NFC / tap to pay" : "Not available"}
            tone={place.facilities?.paymentOptions?.acceptsNfc ? "green" : "neutral"}
          />
        </SectionCard>

        {/* Hours */}
        {days.length > 0 && (
          <SectionCard
            title="Hours"
            right={
              <button
                onClick={() => setHoursOpen((o) => !o)}
                className="flex items-center gap-[3px] text-[12.5px] font-semibold text-rose-500"
              >
                Weekly
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${hoursOpen ? "rotate-180" : ""}`}
                />
              </button>
            }
          >
            <div className={`flex items-center gap-3 ${hoursOpen ? "mb-3.5" : ""}`}>
              <Pin size={30} tone={place.openNow ? "green" : "neutral"}><Clock size={14} /></Pin>
              <div className={`text-[13.5px] font-semibold ${place.openNow ? "text-emerald-700" : "text-stone-500"}`}>
                {place.openNow ? `Open now${nextClose ? ` · closes ${nextClose}` : ""}` : "Closed now"}
              </div>
            </div>
            {hoursOpen && (
              <div className="border-t border-stone-200 pt-2.5">
                {days.map(([day, hrs]) => (
                  <div key={day} className="flex justify-between py-1.5 text-[13px]">
                    <span className="text-stone-500">{day}</span>
                    <span className="font-medium">{hrs}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {/* Contact */}
        <SectionCard title="Contact">
          {place.phone && <Row icon={<Phone size={14} />} label="Phone" value={place.phone} />}
          {place.website && (
            <Row
              icon={<Globe size={14} />}
              label="Website"
              value={
                <a href={place.website} target="_blank" rel="noreferrer" className="text-stone-900 no-underline">
                  {place.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              }
            />
          )}
          {place.googleMapsLinks?.placeUri && (
            <Row
              icon={<Navigation size={14} />}
              label="Google Maps"
              value={
                <a
                  href={place.googleMapsLinks.placeUri}
                  target="_blank"
                  rel="noreferrer"
                  className="flex text-stone-900"
                >
                  <ExternalLink size={13} />
                </a>
              }
            />
          )}
        </SectionCard>

        {/* Nearby landmarks */}
        {nearby.length > 0 && (
          <SectionCard title="Nearby">
            {nearby.map((l) => {
              const Icon = ICON_MAP[l.icon] || MapPin;
              return (
                <div key={l.id} className="flex items-center gap-3 py-[9px]">
                  <Pin size={30} tone="neutral"><Icon size={15} /></Pin>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{l.name}</div>
                    <div className="text-[11.5px] text-stone-500">{l.relationship}</div>
                  </div>
                  <span className="text-[12.5px] font-semibold text-stone-500">{l.distance} m</span>
                </div>
              );
            })}
          </SectionCard>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-1/2 flex w-full max-w-[420px] -translate-x-1/2 gap-2.5 border-t border-stone-200 bg-white px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3">
        <button
          onClick={handleToggleSave}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-stone-200 text-rose-500 ${saved ? "bg-rose-100" : "bg-[#F6F1E6]"
            }`}
          aria-label="Save place"
        >
          <Heart size={19} fill={saved ? "#E15C6D" : "none"} />
        </button>
        {place.phone && (
          <a
            href={`tel:${place.phone}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-stone-200 bg-[#F6F1E6] text-sm font-semibold text-stone-900 no-underline"
          >
            <Phone size={16} /> Call
          </a>
        )}
        <a
          href={place.googleMapsLinks?.directionsUri || place.googleMaps || "#"}
          target="_blank"
          rel="noreferrer"
          className="flex flex-[1.4] items-center justify-center gap-2 rounded-full bg-[#152420] text-sm font-semibold text-white no-underline"
        >
          <Navigation size={16} /> Directions
        </a>
      </div>
    </div>
  );
}