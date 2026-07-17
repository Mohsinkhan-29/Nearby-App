import { useCallback, useEffect, useState } from "react";
import { fetchPlaces } from "../services/api.js";

export function usePlaces({ coords, mood, radius = 1500 }) {
  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!coords || !mood) return;
    setStatus("loading");
    setError(null);
    try {
      const data = await fetchPlaces({
        lat: coords.lat,
        lng: coords.lng,
        mood,
        radius,
      });
      setPlaces(data.places || []);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Something went wrong fetching places.");
      setStatus("error");
    }
  }, [coords, mood, radius]);

  useEffect(() => {
    load();
  }, [load]);

  return { places, status, error, reload: load };
}
