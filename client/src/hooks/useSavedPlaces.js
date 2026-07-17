import { useCallback, useEffect, useState } from "react";
import {
  fetchSavedPlaces,
  saveSavedPlace,
  deleteSavedPlace,
} from "../services/api.js";

export function useSavedPlaces() {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetchSavedPlaces()
      .then((data) => {
        setSavedPlaces(
          data.map((p) => ({
            ...p,
            id: p.place_id,
          }))
        );
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  const isSaved = useCallback(
    (placeId) => savedPlaces.some((p) => p.id === placeId),
    [savedPlaces]
  );

  const savePlace = useCallback(async (place) => {
    setSavedPlaces((prev) =>
      prev.some((p) => p.id === place.id) ? prev : [...prev, place]
    );

    try {
      await saveSavedPlace(place);
    } catch {
      setSavedPlaces((prev) => prev.filter((p) => p.id !== place.id));
    }
  }, []);

  const removePlace = useCallback(
    async (placeId) => {
      const previous = savedPlaces;

      setSavedPlaces((prev) => prev.filter((p) => p.id !== placeId));

      try {
        await deleteSavedPlace(placeId);
      } catch {
        setSavedPlaces(previous);
      }
    },
    [savedPlaces]
  );

  const toggleSaved = useCallback(
    (place) =>
      isSaved(place.id)
        ? removePlace(place.id)
        : savePlace(place),
    [isSaved, removePlace, savePlace]
  );

  return {
    savedPlaces,
    status,
    isSaved,
    savePlace,
    removePlace,
    toggleSaved,
  };
}