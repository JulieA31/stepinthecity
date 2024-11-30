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

export const generateRoute = async ({
  startLocation,
  endLocation,
  duration,
  type,
  routeType
}: {
  startLocation: google.maps.LatLngLiteral;
  endLocation?: google.maps.LatLngLiteral | null;
  duration: string;
  type: string;
  routeType: string;
}): Promise<Step[]> => {
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
    
    const searchPromises = placeTypes.map(type => 
      new Promise<google.maps.places.PlaceResult[]>((resolve) => {
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(startLocation.lat, startLocation.lng),
          radius: Math.min(targetDuration * 80, 3000), // Augmenté le rayon max à 3km
          type: type,
          rankBy: google.maps.places.RankBy.DISTANCE
        };

        service.nearbySearch(request, (results, status) => {
          console.log(`Search results for type ${type}:`, { status, resultsCount: results?.length });
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            resolve([]);
          } else {
            console.warn(`No results for type ${type}:`, status);
            resolve([]);
          }
        });
      })
    );

    const allResults = await Promise.all(searchPromises);
    console.log("All search results completed:", allResults.map(r => r.length));
    
    const uniquePlaces = new Map<string, google.maps.places.PlaceResult>();
    
    allResults.flat().forEach(place => {
      if (place.place_id && !uniquePlaces.has(place.place_id)) {
        uniquePlaces.set(place.place_id, place);
      }
    });

    const sortedPlaces = Array.from(uniquePlaces.values())
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, desiredStepsCount);

    console.log("Sorted and filtered places:", sortedPlaces.length);

    if (sortedPlaces.length === 0) {
      throw new Error("Aucun lieu trouvé dans cette zone");
    }

    const steps: Step[] = await Promise.all(
      sortedPlaces.map(async place => {
        const placeDetails = await new Promise<google.maps.places.PlaceResult>((resolve) => {
          service.getDetails(
            { placeId: place.place_id!, fields: ['formatted_address', 'opening_hours', 'price_level'] },
            (result, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                resolve(result);
              } else {
                resolve({} as google.maps.places.PlaceResult);
              }
            }
          );
        });

        let description = "";
        if (place.rating) {
          description += `Note: ${place.rating}/5 (${place.user_ratings_total} avis). `;
        }
        if (placeDetails.formatted_address) {
          description += placeDetails.formatted_address;
        }

        const stepDuration = Math.round(targetDuration / desiredStepsCount);

        return {
          title: place.name || "Point d'intérêt",
          description,
          duration: `${stepDuration}min`,
          position: {
            lat: place.geometry?.location?.lat() || startLocation.lat,
            lng: place.geometry?.location?.lng() || startLocation.lng
          }
        };
      })
    );

    console.log("Final generated steps:", steps.length);

    if (steps.length === 0) {
      throw new Error("Impossible de générer un parcours dans cette zone");
    }

    const totalDuration = calculateTotalDuration(steps);
    if (Math.abs(totalDuration - targetDuration) > 10) {
      const ratio = targetDuration / totalDuration;
      steps.forEach(step => {
        const currentDuration = parseInt(step.duration);
        step.duration = `${Math.round(currentDuration * ratio)}min`;
      });
    }

    return steps;
  } catch (error) {
    console.error("Erreur lors de la génération des lieux:", error);
    throw error;
  }
};