import { Loader } from "@googlemaps/js-api-loader";
import { Step } from "@/types/walk";

const GOOGLE_MAPS_API_KEY = "AIzaSyC806xlYYv2CYq2euqLnD4_cMrKrUTZGNI";

const getPlaceTypesByTheme = (theme: string): string[] => {
  switch (theme) {
    case "nature":
      return ["park", "natural_feature"];
    case "cultural":
      return ["museum", "art_gallery"];
    case "food":
      return ["restaurant", "cafe", "bakery"];
    case "historical":
      return ["church", "hindu_temple", "mosque", "synagogue", "city_hall"];
    case "all":
    default:
      return ["tourist_attraction", "point_of_interest"];
  }
};

const getDurationByDistance = (distance: number): number => {
  return Math.round(distance / 80);
};

const calculateTotalDuration = (steps: Step[]): number => {
  return steps.reduce((total, step) => {
    const duration = parseInt(step.duration);
    return isNaN(duration) ? total : total + duration;
  }, 0);
};

const getStepsCountByDuration = (duration: number): number => {
  if (duration <= 30) return 2;
  if (duration <= 60) return 3;
  if (duration <= 120) return 4;
  return 5;
};

interface RouteOptions {
  startLocation: google.maps.LatLngLiteral;
  endLocation?: google.maps.LatLngLiteral | null;
  duration: string;
  type: string;
  routeType: string;
}

export const generateRoute = async ({
  startLocation,
  endLocation,
  duration,
  type,
  routeType
}: RouteOptions): Promise<Step[]> => {
  const targetDuration = parseInt(duration);
  const placeTypes = getPlaceTypesByTheme(type);
  const desiredStepsCount = getStepsCountByDuration(targetDuration);

  console.log("Generating places with parameters:", {
    location: startLocation,
    type,
    duration,
    placeTypes,
    desiredStepsCount
  });

  try {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"]
    });

    await loader.load();
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    const searchPromises = placeTypes.map(placeType => 
      new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(startLocation.lat, startLocation.lng),
          radius: 5000, // Augmenté à 5km pour avoir plus de résultats
          type: placeType as google.maps.places.PlaceType,
          rankBy: google.maps.places.RankBy.DISTANCE
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
      })
    );

    const allResults = await Promise.all(searchPromises.map(p => p.catch(e => {
      console.error("Search error:", e);
      return [];
    })));
    
    const uniquePlaces = new Map<string, google.maps.places.PlaceResult>();
    
    allResults.flat().forEach(place => {
      if (place.place_id && !uniquePlaces.has(place.place_id)) {
        uniquePlaces.set(place.place_id, place);
      }
    });

    const sortedPlaces = Array.from(uniquePlaces.values())
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, desiredStepsCount);

    if (sortedPlaces.length === 0) {
      throw new Error("Aucun lieu trouvé dans cette zone");
    }

    const steps: Step[] = await Promise.all(
      sortedPlaces.map(async (place, index) => {
        const stepDuration = Math.round(targetDuration / (sortedPlaces.length));
        
        return {
          title: place.name || `Point d'intérêt ${index + 1}`,
          description: place.vicinity || "Lieu intéressant à visiter",
          duration: `${stepDuration}min`,
          position: {
            lat: place.geometry?.location?.lat() || startLocation.lat,
            lng: place.geometry?.location?.lng() || startLocation.lng
          }
        };
      })
    );

    if (steps.length === 0) {
      throw new Error("Impossible de générer un parcours dans cette zone");
    }

    return steps;
  } catch (error) {
    console.error("Erreur lors de la génération des lieux:", error);
    throw error;
  }
};