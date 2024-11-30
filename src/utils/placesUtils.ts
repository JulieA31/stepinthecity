import { Loader } from "@googlemaps/js-api-loader";

const GOOGLE_MAPS_API_KEY = "AIzaSyC806xlYYv2CYq2euqLnD4_cMrKrUTZGNI";

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"]
});

export const findPlacesByType = async (
  location: google.maps.LatLngLiteral,
  type: string,
  radius: number = 2000
): Promise<google.maps.places.PlaceResult[]> => {
  await loader.load();
  const service = new google.maps.places.PlacesService(
    document.createElement('div')
  );

  return new Promise((resolve, reject) => {
    const request = {
      location,
      radius,
      type // Removed type assertion as it's not needed
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results);
      } else {
        reject(new Error(`Places search failed with status: ${status}`));
      }
    });
  });
};

export const generatePlacesForType = async (
  location: google.maps.LatLngLiteral,
  themeType: string,
  duration: string
): Promise<any[]> => {
  let places: google.maps.places.PlaceResult[] = [];
  const maxPlaces = {
    "30": 2,
    "60": 3,
    "120": 4,
    "180": 5
  }[duration] || 3;

  try {
    switch (themeType) {
      case "all":
        // Recherche des points d'intérêt touristiques
        places = await findPlacesByType(location, "tourist_attraction");
        break;
      case "nature":
        // Combine parcs et points d'eau
        const parks = await findPlacesByType(location, "park");
        places = parks;
        break;
      case "cultural":
        // Combine musées et points d'intérêt artistiques
        const museums = await findPlacesByType(location, "museum");
        const artGalleries = await findPlacesByType(location, "art_gallery");
        places = [...museums, ...artGalleries];
        break;
      default:
        places = await findPlacesByType(location, "tourist_attraction");
    }

    // Trie les lieux par note et popularité
    return places
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, maxPlaces)
      .map(place => ({
        title: place.name,
        description: `Note: ${place.rating}/5 (${place.user_ratings_total} avis)`,
        duration: "30min",
        position: {
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0
        },
        imageUrl: place.photos?.[0]?.getUrl() || "/placeholder.svg"
      }));
  } catch (error) {
    console.error("Erreur lors de la recherche des lieux:", error);
    return [];
  }
};