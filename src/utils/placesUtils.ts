import { Libraries, useLoadScript } from "@react-google-maps/api";
import { Step } from "@/types/walk";

const libraries: Libraries = ["places"];

export const useGooglePlaces = () => {
  return useLoadScript({
    googleMapsApiKey: "AIzaSyC806xlYYv2CYq2euqLnD4_cMrKrUTZGNI",
    libraries,
  });
};

export const searchNearbyPlaces = async (
  service: google.maps.places.PlacesService,
  location: google.maps.LatLng,
  type: string,
  radius: number = 500
): Promise<google.maps.places.PlaceResult[]> => {
  return new Promise((resolve, reject) => {
    const request = {
      location,
      radius,
      type: type as any, // Fix for PlaceType issue
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

export const getPlaceDetails = async (
  service: google.maps.places.PlacesService,
  placeId: string
): Promise<google.maps.places.PlaceResult> => {
  return new Promise((resolve, reject) => {
    const request = {
      placeId,
      fields: ["name", "formatted_address", "geometry", "photos", "rating", "types"],
    };

    service.getDetails(request, (result, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && result) {
        resolve(result);
      } else {
        reject(new Error(`Place details request failed with status: ${status}`));
      }
    });
  });
};

export const generateRoute = async (options: {
  startLocation: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number } | null;
  duration: string;
  type: string;
  routeType: string;
}): Promise<Step[]> => {
  // Simulation de génération de parcours
  const steps: Step[] = [
    {
      title: "Point de départ",
      description: "Votre parcours commence ici",
      duration: "0",
      position: options.startLocation
    }
  ];
  
  if (options.endLocation) {
    steps.push({
      title: "Point d'arrivée",
      description: "Votre parcours se termine ici",
      duration: options.duration,
      position: options.endLocation
    });
  }
  
  return steps;
};