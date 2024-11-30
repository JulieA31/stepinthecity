import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useGeolocation = (isLoaded: boolean, map: google.maps.Map | null, open: boolean) => {
  const [position, setPosition] = useState<google.maps.LatLngLiteral>({
    lat: 48.8566,
    lng: 2.3522
  });
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation && isLoaded && map && open) {
      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      const geoSuccess = (pos: GeolocationPosition) => {
        const newPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        
        setPosition(newPosition);
        
        if (map) {
          map.panTo(newPosition);
          map.setZoom(15);
        }
      };

      const geoError = (error: GeolocationPositionError) => {
        console.error("Erreur de géolocalisation:", error);
        toast({
          title: "Erreur de géolocalisation",
          description: "Impossible d'obtenir votre position actuelle avec précision",
          variant: "destructive",
        });
      };

      navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    }
  }, [map, open, isLoaded, toast]);

  return position;
};