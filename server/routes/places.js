import { Router } from "express";
import { getNearbyPlaces } from "../controllers/placesController.js";

const router = Router();

const priceMap = {
    PRICE_LEVEL_FREE: "Free",
    PRICE_LEVEL_INEXPENSIVE: "$",
    PRICE_LEVEL_MODERATE: "$$",
    PRICE_LEVEL_EXPENSIVE: "$$$",
    PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
};

router.get("/", getNearbyPlaces);

router.get("/:placeId", async (req, res) => {
    try {
        const { placeId } = req.params;

        const response = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}`,
            {
                headers: {
                    "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
                    "X-Goog-FieldMask": [
                        "id",
                        "displayName",
                        "formattedAddress",
                        "shortFormattedAddress",
                        "primaryTypeDisplayName",
                        "rating",
                        "userRatingCount",
                        "photos",
                        "reviews",
                        "websiteUri",
                        "googleMapsUri",
                        "nationalPhoneNumber",
                        "internationalPhoneNumber",
                        "priceLevel",
                        "location",

                        "regularOpeningHours",
                        "currentOpeningHours",

                        "accessibilityOptions",

                        "paymentOptions",

                        "parkingOptions",

                        "dineIn",
                        "takeout",
                        "delivery",
                        "curbsidePickup",
                        "reservable",
                        "servesBreakfast",
                        "servesLunch",
                        "servesDinner",
                        "servesBeer",
                        "servesWine",
                        "servesCocktails",
                        "servesCoffee",
                        "servesDessert",
                        "servesVegetarianFood",
                        "goodForChildren",
                        "goodForGroups",
                        "priceRange",
                        "googleMapsLinks",
                        "addressDescriptor",
                        "restroom",
                        "menuForChildren",
                        "outdoorSeating",
                        "liveMusic",
                        "servesBrunch",
                        "editorialSummary",
                        "businessStatus"
                    ].join(","),
                },
            }
        );

        const data = await response.json();


        // Uncomment this while debugging
        // console.log(JSON.stringify(data, null, 2));

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        const place = data;
        const relationshipMap = {
            BESIDE: "Beside",
            ACROSS_THE_ROAD: "Across the road",
            DOWN_THE_ROAD: "Down the road",
            AROUND_THE_CORNER: "Around the corner",
            WITHIN: "Within",
            OUTSKIRTS: "Nearby",
        };

        const iconMap = {
            bank: "Landmark",
            atm: "CreditCard",
            restaurant: "Utensils",
            cafe: "Coffee",
            coffee_shop: "Coffee",
            food: "Utensils",
            hospital: "Hospital",
            pharmacy: "Cross",
            hotel: "Hotel",
            school: "School",
            gas_station: "Fuel",
            shopping_mall: "ShoppingBag",
            clothing_store: "Shirt",
            store: "Store",
        };

        res.json({
            id: place.id,

            name: place.displayName?.text || "",

            category: place.primaryTypeDisplayName?.text || "",

            address: place.formattedAddress || "",

            shortAddress: place.shortFormattedAddress || "",

            description: place.editorialSummary?.text || "",

            rating: place.rating ?? 0,

            totalRatings: place.userRatingCount ?? 0,

            businessStatus: place.businessStatus || "",

            phone: place.nationalPhoneNumber || "",

            internationalPhone: place.internationalPhoneNumber || "",

            website: place.websiteUri || "",

            googleMaps: place.googleMapsUri || "",

            googleMapsLinks: place.googleMapsLinks || {},

            openNow:
                place.currentOpeningHours?.openNow ??
                place.regularOpeningHours?.openNow ??
                false,

            openingHours:
                place.regularOpeningHours?.weekdayDescriptions || [],

            nextCloseTime:
                place.currentOpeningHours?.nextCloseTime || null,

            location: {
                latitude: place.location?.latitude ?? null,
                longitude: place.location?.longitude ?? null,
            },

            priceLevel: priceMap[place.priceLevel] || "—",

            priceRange: {
                currency:
                    place.priceRange?.startPrice?.currencyCode || "PKR",

                start:
                    place.priceRange?.startPrice?.units || null,

                end:
                    place.priceRange?.endPrice?.units || null,
            },

            services: {
                dineIn: place.dineIn ?? false,
                takeout: place.takeout ?? false,
                delivery: place.delivery ?? false,
                curbsidePickup: place.curbsidePickup ?? false,

                reservable: place.reservable ?? false,

                breakfast: place.servesBreakfast ?? false,
                lunch: place.servesLunch ?? false,
                dinner: place.servesDinner ?? false,

                coffee: place.servesCoffee ?? false,
                dessert: place.servesDessert ?? false,

                beer: place.servesBeer ?? false,
                wine: place.servesWine ?? false,
                cocktails: place.servesCocktails ?? false,

                vegetarian: place.servesVegetarianFood ?? false,

                kids: place.goodForChildren ?? false,

                groups: place.goodForGroups ?? false,
            },

            facilities: {
                wheelchairAccessible:
                    place.accessibilityOptions
                        ?.wheelchairAccessibleEntrance ?? false,

                restroom:
                    place.accessibilityOptions
                        ?.wheelchairAccessibleRestroom ?? false,

                parking:
                    place.parkingOptions?.freeParkingLot ||
                    place.parkingOptions?.freeStreetParking ||
                    place.parkingOptions?.paidParkingLot ||
                    false,

                parkingOptions: place.parkingOptions || {},

                paymentOptions: place.paymentOptions || {},
            },

            nearby:
                place.addressDescriptor?.landmarks?.map((item) => ({
                    id: item.placeId,

                    name: item.displayName?.text || "",

                    type: item.types?.[0] || "",

                    category:
                        item.types?.[0]
                            ?.replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase()) || "",

                    relationship:
                        relationshipMap[item.spatialRelationship] ||
                        item.spatialRelationship,

                    distance: Math.round(
                        item.travelDistanceMeters ??
                        item.straightLineDistanceMeters ??
                        0
                    ),

                    straightDistance: Math.round(
                        item.straightLineDistanceMeters ?? 0
                    ),

                    travelDistance: Math.round(
                        item.travelDistanceMeters ?? 0
                    ),

                    icon: iconMap[item.types?.[0]] || "MapPin",
                })) || [],

            areas:
                place.addressDescriptor?.areas?.map((area) => ({
                    id: area.placeId,
                    name: area.displayName?.text,
                    containment: area.containment,
                })) || [],

            

        });
    } catch (err) {
        console.error("Google API Error:", err);

        res.status(500).json({
            error: "Failed to fetch place details",
        });
    }
});

export default router;