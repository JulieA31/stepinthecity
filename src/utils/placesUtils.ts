import { Libraries, useLoadScript } from "@react-google-maps/api";

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
      type: type as google.maps.places.PlaceType[keyof google.maps.places.PlaceType],
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