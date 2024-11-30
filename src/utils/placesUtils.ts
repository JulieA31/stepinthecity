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
  // Vitesse moyenne de marche : 5km/h soit environ 80m/min
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

export const generatePlacesForType = async (
  location: google.maps.LatLngLiteral,
  themeType: string,
  duration: string,
): Promise<Step[]> => {
  const targetDuration = parseInt(duration);
  const placeTypes = getPlaceTypesByTheme(themeType);
  const desiredStepsCount = getStepsCountByDuration(targetDuration);

  try {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"]
    });

    await loader.load();
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    const searchPromises = placeTypes.map(type => 
      new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
        const request = {
          location: new google.maps.LatLng(location.lat, location.lng),
          radius: Math.min(targetDuration * 40, 2000), // Rayon basé sur la durée (max 2km)
          type: type as google.maps.places.PlaceType,
          rankBy: google.maps.places.RankBy.RATING
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            resolve([]); // En cas d'erreur, on continue avec un tableau vide
          }
        });
      })
    );

    const allResults = await Promise.all(searchPromises);
    const uniquePlaces = new Map<string, google.maps.places.PlaceResult>();
    
    allResults.flat().forEach(place => {
      if (place.place_id && !uniquePlaces.has(place.place_id)) {
        uniquePlaces.set(place.place_id, place);
      }
    });

    const sortedPlaces = Array.from(uniquePlaces.values())
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, desiredStepsCount);

    const steps: Step[] = await Promise.all(
      sortedPlaces.map(async place => {
        const placeDetails = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
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
            lat: place.geometry?.location?.lat() || location.lat,
            lng: place.geometry?.location?.lng() || location.lng
          }
        };
      })
    );

    const totalDuration = calculateTotalDuration(steps);
    if (Math.abs(totalDuration - targetDuration) > 10) {
      // Ajuster les durées proportionnellement
      const ratio = targetDuration / totalDuration;
      steps.forEach(step => {
        const currentDuration = parseInt(step.duration);
        step.duration = `${Math.round(currentDuration * ratio)}min`;
      });
    }

    return steps;
  } catch (error) {
    console.error("Erreur lors de la recherche des lieux:", error);
    return [];
  }
};