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
  const allSteps = {
    historical: [...romeAntiqueSteps, ...lisbonneHistoriqueSteps],
    cultural: [...victorHugoSteps, ...romeBaroqueSteps, ...tramSteps],
    nature: [...classiquesParisSteps],
    food: [...baladeGastronomiqueSteps, ...saveursSteps],
    all: [
      ...classiquesParisSteps,
      ...romeBaroqueSteps,
      ...tramSteps,
      ...baladeGastronomiqueSteps,
      ...saveursSteps
    ]
  };

  return allSteps[type as keyof typeof allSteps] || allSteps.all;
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

const findNearbySteps = (steps: any[], location: google.maps.LatLngLiteral, maxDistance: number = 0.1) => {
  return steps.filter(step => {
    if (!step.position) return false;
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

  // Si on a assez d'étapes, on les retourne
  if (filteredSteps.length >= 2) {
    return filteredSteps;
  }

  // Sinon, on complète avec l'API Places
  try {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"]
    });

    await loader.load();
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
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
      title: place.name || "Point d'intérêt",
      description: place.rating 
        ? `Note: ${place.rating}/5 (${place.user_ratings_total} avis)`
        : "Un lieu intéressant à découvrir",
      duration: "30min",
      position: {
        lat: place.geometry?.location?.lat() || location.lat,
        lng: place.geometry?.location?.lng() || location.lng
      }
    }));

    return [...filteredSteps, ...additionalSteps];
  } catch (error) {
    console.error("Erreur lors de la recherche des lieux:", error);
    return filteredSteps;
  }
};