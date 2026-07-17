import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places";

function client() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("Server is missing GOOGLE_PLACES_API_KEY"), {
      status: 500,
    });
  }
  return apiKey;
}

export async function searchNearby({ lat, lng, type, radius }) {
  const apiKey = client();

  const response = await axios.post(
    `${BASE_URL}:searchNearby`,
    {
      includedTypes: [type],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius,
        },
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.rating,places.location,places.currentOpeningHours.openNow,places.priceLevel,places.photos",
      },
    }
  );

  const places = (response.data.places || []).map((p) => ({
    id: p.id,
    name: p.displayName?.text,
    address: p.formattedAddress,
    rating: p.rating,
    openNow: p.currentOpeningHours?.openNow ?? null,
    priceLevel: p.priceLevel,
    location: p.location,
    photoUrl: p.photos?.[0]
      ? `${BASE_URL}/${p.photos[0].name}/media?maxWidthPx=400&key=${apiKey}`
      : null,
  }));

  return places;
}

export async function getDetails(placeId) {
  const apiKey = client();

  const response = await axios.get(`${BASE_URL}/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "id,displayName,formattedAddress,location,rating,internationalPhoneNumber,websiteUri,currentOpeningHours,regularOpeningHours,priceLevel,photos,reviews",
    },
  });

  const p = response.data;

  return {
    id: p.id,
    name: p.displayName?.text,
    address: p.formattedAddress,
    rating: p.rating,

    phone: p.internationalPhoneNumber,
    website: p.websiteUri,

    openNow: p.currentOpeningHours?.openNow ?? null,
    openingHours: p.regularOpeningHours?.weekdayDescriptions ?? [],

    priceLevel: p.priceLevel,

    location: p.location,

    photoUrl: p.photos?.[0]
      ? `${BASE_URL}/${p.photos[0].name}/media?maxWidthPx=800&key=${apiKey}`
      : null,

    photos:
      p.photos?.map((photo) => ({
        name: photo.name,
        url: `${BASE_URL}/${photo.name}/media?maxWidthPx=1200&key=${apiKey}`,
      })) ?? [],

    reviews: p.reviews ?? [],
  };
}