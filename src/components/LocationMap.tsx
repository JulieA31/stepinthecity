import { useState, useEffect, useCallback } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const GOOGLE_MAPS_API_KEY = "AIzaSyC806xlYYv2CYq2euqLnD4_cMrKrUTZGNI";

interface LocationMapProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationMap = ({ open, onOpenChange, onLocationSelect }: LocationMapProps) => {
  const [position, setPosition] = useState<google.maps.LatLngLiteral>({
    lat: 48.8566,
    lng: 2.3522
  });
  const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentMarker, setCurrentMarker] = useState<google.maps.Marker | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<google.maps.Marker | null>(null);
  const { toast } = useToast();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    if (navigator.geolocation && isLoaded && map && open && window.google) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setPosition(newPosition);
          setSelectedPosition(newPosition);
          map.setCenter(newPosition);
          
          // Supprimer l'ancien marqueur de position actuelle s'il existe
          if (currentMarker) {
            currentMarker.setMap(null);
          }

          const userMarker = new window.google.maps.Marker({
            map,
            position: newPosition,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            },
            title: "Votre position",
            optimized: true
          });

          setCurrentMarker(userMarker);
          calculateRoute(newPosition);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          toast({
            title: "Erreur de géolocalisation",
            description: "Impossible d'obtenir votre position actuelle",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, [map, open, isLoaded]);

  const calculateRoute = useCallback((destination: google.maps.LatLngLiteral) => {
    if (!isLoaded || !window.google || !map) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: position,
        destination: destination,
        travelMode: window.google.maps.TravelMode.WALKING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Erreur lors du calcul de l'itinéraire:", status);
          toast({
            title: "Erreur de calcul d'itinéraire",
            description: "Impossible de calculer l'itinéraire vers ce point",
            variant: "destructive",
          });
        }
      }
    );
  }, [position, isLoaded, map]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng && map && isLoaded && window.google) {
      const clickedPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setSelectedPosition(clickedPosition);

      // Supprimer l'ancien marqueur sélectionné s'il existe
      if (selectedMarker) {
        selectedMarker.setMap(null);
      }

      // Ajouter le nouveau marqueur
      const newMarker = new window.google.maps.Marker({
        map,
        position: clickedPosition,
        animation: window.google.maps.Animation.DROP,
        optimized: true
      });
      
      setSelectedMarker(newMarker);
      calculateRoute(clickedPosition);
    }
  }, [map, isLoaded, selectedMarker, calculateRoute]);

  const handleConfirm = () => {
    if (selectedPosition) {
      onLocationSelect(selectedPosition.lat, selectedPosition.lng);
      toast({
        title: "Position confirmée",
        description: "La position a été enregistrée avec succès",
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Aucune position sélectionnée",
        description: "Veuillez cliquer sur la carte pour sélectionner une position",
        variant: "destructive",
      });
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[600px]">
        <DialogTitle>Sélectionnez un emplacement</DialogTitle>
        <div className="h-[500px] relative">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={position}
            zoom={13}
            onClick={handleMapClick}
            onLoad={setMap}
            options={{
              gestureHandling: 'greedy',
              disableDoubleClickZoom: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />}
          </GoogleMap>
          <Button
            className="absolute bottom-4 right-4 z-[1000]"
            onClick={handleConfirm}
            disabled={!selectedPosition}
          >
            Confirmer la position
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationMap;