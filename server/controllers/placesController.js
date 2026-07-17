import { searchNearby, getDetails } from "../services/googlePlaces.js";

// GET /api/places
export async function getNearbyPlaces(req, res, next) {
  try {
    const { lat, lng, mood, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: "lat and lng are required",
      });
    }

    const places = await searchNearby({
      lat: Number(lat),
      lng: Number(lng),
      type: mood || "restaurant",
      radius: Number(radius) || 1500,
    });

    res.json({ places });
  } catch (err) {
    next(err);
  }
}

// GET /api/places/:placeId
export async function getPlaceDetails(req, res, next) {
  try {
    const { placeId } = req.params;

    const place = await getDetails(placeId);

    res.json(place);
  } catch (err) {
    next(err);
  }
}