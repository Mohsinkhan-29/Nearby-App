import axios from "axios";

const API_BASE = "https://nearby-app-2u95.onrender.com/api" ;

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export async function fetchPlaces({ lat, lng, mood, radius }) {
  const { data } = await client.get("/places", {
    params: { lat, lng, mood, radius },
  });
  return data;
}

export async function fetchPlaceDetails(placeId) {
  const { data } = await client.get(`/places/${placeId}`);
  return data;
}

export async function fetchSavedPlaces() {
  const res = await fetch(`${API_BASE}/saved-places`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("Failed to fetch saved places");
  return res.json();
}

export async function saveSavedPlace(place) {
  const res = await fetch(`${API_BASE}/saved-places`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      placeId: place.id,
      name: place.name,
      category: place.category,
      lat: place.lat,
      lng: place.lng,
    }),
  });
  if (!res.ok) throw new Error("Failed to save place");
  return res.json();
}

export async function deleteSavedPlace(placeId) {
  const res = await fetch(`${API_BASE}/saved-places/${placeId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("Failed to remove saved place");
}