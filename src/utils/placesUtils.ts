import { Loader } from "@googlemaps/js-api-loader";
import { 
  victorHugoSteps, 
  classiquesParisSteps, 
  baladeGastronomiqueSteps 
} from "@/data/walks/paris";
import { 
  romeAntiqueSteps, 
  romeBaroqueSteps, 
  vaticanSteps 
} from "@/data/walks/rome";
import { 
  lisbonneHistoriqueSteps, 
  tramSteps, 
  saveursSteps 
} from "@/data/walks/lisbonne";

const GOOGLE_MAPS_API_KEY = "AIzaSyC806xlYYv2CYq2euqLnD4_cMrKrUTZGNI";

const getPresetSteps = (type: string) => {
  switch (type) {
    case "historical":
      return [...romeAntiqueSteps, ...lisbonneHistoriqueSteps];
    case "cultural":
      return [...victorHugoSteps, ...romeBaroqueSteps, ...tramSteps];
    case "nature":
      return [...classiquesParisSteps]; // Pour l'exemple, utilise les classiques qui incluent des jardins
    case "food":
      return [...baladeGastronomiqueSteps, ...saveursSteps];
    default:
      return [...classiquesParisSteps, ...romeBaroqueSteps, ...tramSteps];
  }
};

const filterStepsByDuration = (steps: any[], targetDuration: number) => {
  let totalDuration = 0;
  return steps.filter(step => {
    const stepDuration = parseInt(step.duration) || 30;
    if (totalDuration + stepDuration <= targetDuration) {
      totalDuration += stepDuration;
      return true;
    }
    return false;
  });
};

const findNearbySteps = (steps: any[], location: google.maps.LatLngLiteral, maxDistance: number = 0.02) => {
  return steps.filter(step => {
    const dlat = step.position.lat - location.lat;
    const dlng = step.position.lng - location.lng;
    const distance = Math.sqrt(dlat * dlat + dlng * dlng);
    return distance <= maxDistance;
  });
};

export const generatePlacesForType = async (
  location: google.maps.LatLngLiteral,
  themeType: string,
  duration: string
): Promise<any[]> => {
  // Récupérer les étapes préréglées selon le type
  const presetSteps = getPresetSteps(themeType);
  
  // Filtrer les étapes proches de la localisation
  const nearbySteps = findNearbySteps(presetSteps, location);
  
  // Filtrer selon la durée souhaitée
  const targetDuration = parseInt(duration);
  const filteredSteps = filterStepsByDuration(nearbySteps, targetDuration);

  // Si pas assez d'étapes trouvées, compléter avec des points d'intérêt via l'API Places
  if (filteredSteps.length < 2) {
    try {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      const request = {
        location,
        radius: 2000,
        type: themeType === "food" ? "restaurant" : "tourist_attraction"
      };

      const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error(`Places search failed with status: ${status}`));
          }
        });
      });

      const additionalSteps = results.slice(0, 3).map(place => ({
        title: place.name,
        description: `Note: ${place.rating}/5 (${place.user_ratings_total} avis)`,
        duration: "30min",
        position: {
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0
        }
      }));

      return [...filteredSteps, ...additionalSteps];
    } catch (error) {
      console.error("Erreur lors de la recherche des lieux:", error);
    }
  }

  return filteredSteps;
};