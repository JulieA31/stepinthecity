import { Step } from "@/types/walk";
import { Loader } from "@googlemaps/js-api-loader";

const GOOGLE_MAPS_API_KEY = "AIzaSyC806xlYYv2CYq2euqLnD4_cMrKrUTZGNI";

interface PlacesByTheme {
  [key: string]: google.maps.places.PlaceResult[];
}

const placeTypesByTheme: { [key: string]: string[] } = {
  nature: ["park", "natural_feature"],
  cultural: ["museum", "art_gallery"],
  food: ["restaurant", "cafe", "bakery"],
  historical: ["church", "synagogue", "mosque", "city_hall", "landmark"],
  all: ["tourist_attraction", "point_of_interest"]
};

const getThemeForPlace = (place: google.maps.places.PlaceResult): string => {
  const types = place.types || [];
  
  if (types.some(type => ["park", "natural_feature"].includes(type))) {
    return "nature";
  }
  if (types.some(type => ["restaurant", "cafe", "bakery"].includes(type))) {
    return "food";
  }
  if (types.some(type => ["museum", "art_gallery"].includes(type))) {
    return "cultural";
  }
  if (types.some(type => ["church", "synagogue", "mosque", "city_hall", "landmark"].includes(type))) {
    return "historical";
  }
  
  return "all";
};

const searchPlacesNearby = async (
  service: google.maps.places.PlacesService,
  location: google.maps.LatLng,
  type: string
): Promise<google.maps.places.PlaceResult[]> => {
  return new Promise((resolve, reject) => {
    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius: 10000, // 10km
      type: type as unknown as google.maps.places.PlaceType
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results);
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]);
      } else {
        reject(new Error(`Places API error: ${status}`));
      }
    });
  });
};

const getPlaceDetails = async (
  service: google.maps.places.PlacesService,
  placeId: string
): Promise<google.maps.places.PlaceResult> => {
  return new Promise((resolve, reject) => {
    service.getDetails(
      { placeId, fields: ["name", "formatted_address", "photos", "rating", "types"] },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error(`Place Details API error: ${status}`));
        }
      }
    );
  });
};

const calculateStepDuration = (totalDuration: number, stepsCount: number): number => {
  return Math.floor(totalDuration / stepsCount);
};

export const generateRoute = async ({
  startLocation,
  endLocation,
  duration,
  type,
  routeType
}: {
  startLocation: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number } | null;
  duration: string;
  type: string;
  routeType: string;
}): Promise<Step[]> => {
  try {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"]
    });

    await loader.load();
    
    const mapDiv = document.createElement("div");
    const service = new google.maps.places.PlacesService(mapDiv);
    const location = new google.maps.LatLng(startLocation.lat, startLocation.lng);
    
    const searchTypes = type === "all" 
      ? Object.values(placeTypesByTheme).flat()
      : placeTypesByTheme[type] || placeTypesByTheme.all;
    
    const placesPromises = searchTypes.map(placeType => 
      searchPlacesNearby(service, location, placeType)
    );
    
    const allPlacesResults = await Promise.all(placesPromises);
    const allPlaces = allPlacesResults.flat();
    
    // Dédupliquer et filtrer par thème
    const uniquePlaces = Array.from(
      new Map(allPlaces.map(place => [place.place_id, place])).values()
    ).filter(place => type === "all" || getThemeForPlace(place) === type);
    
    // Trier par note et proximité
    const sortedPlaces = uniquePlaces.sort((a, b) => {
      const ratingDiff = (b.rating || 0) - (a.rating || 0);
      if (ratingDiff !== 0) return ratingDiff;
      
      const distanceA = google.maps.geometry.spherical.computeDistanceBetween(
        location,
        a.geometry?.location as google.maps.LatLng
      );
      const distanceB = google.maps.geometry.spherical.computeDistanceBetween(
        location,
        b.geometry?.location as google.maps.LatLng
      );
      return distanceA - distanceB;
    });

    const targetDuration = parseInt(duration);
    const stepsCount = Math.min(
      Math.ceil(targetDuration / 30),
      sortedPlaces.length
    );
    
    const stepDuration = calculateStepDuration(targetDuration, stepsCount);
    
    const selectedPlaces = sortedPlaces.slice(0, stepsCount);
    
    const steps: Step[] = selectedPlaces.map((place, index) => ({
      title: place.name || `Point d'intérêt ${index + 1}`,
      description: place.vicinity || "Lieu intéressant à visiter",
      duration: `${stepDuration}min`,
      position: {
        lat: place.geometry?.location?.lat() || startLocation.lat,
        lng: place.geometry?.location?.lng() || startLocation.lng
      },
      imageUrl: place.photos?.[0]?.getUrl()
    }));

    if (steps.length === 0) {
      throw new Error("Aucun lieu trouvé dans cette zone pour le thème sélectionné");
    }

    return steps;
  } catch (error) {
    console.error("Erreur lors de la génération des lieux:", error);
    throw error;
  }
};