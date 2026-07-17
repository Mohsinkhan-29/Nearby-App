import { useEffect, useState } from "react";

export function useLocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | denied | error

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation isn't supported in this browser.");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("success");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { coords, status, error, setCoords };
}
