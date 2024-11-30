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

  const clearMarkers = useCallback(() => {
    if (currentMarker) {
      currentMarker.setMap(null);
      setCurrentMarker(null);
    }
    if (selectedMarker) {
      selectedMarker.setMap(null);
      setSelectedMarker(null);
    }
  }, [currentMarker, selectedMarker]);

  useEffect(() => {
    if (!open) {
      clearMarkers();
      setDirections(null);
    }
  }, [open, clearMarkers]);

  useEffect(() => {
    if (navigator.geolocation && isLoaded && map && open && window.google) {
      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      const geoSuccess = (pos: GeolocationPosition) => {
        clearMarkers();
        
        const newPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        
        setPosition(newPosition);
        setSelectedPosition(newPosition);
        
        if (map) {
          map.panTo(newPosition);
          map.setZoom(15);

          const userMarker = new window.google.maps.Marker({
            position: newPosition,
            map,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            },
            title: "Votre position",
            optimized: true,
            clickable: false
          });

          setCurrentMarker(userMarker);
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
  }, [map, open, isLoaded, clearMarkers]);

  const calculateRoute = useCallback((destination: google.maps.LatLngLiteral) => {
    if (!isLoaded || !window.google || !map || !position) return;

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
      
      if (selectedMarker) {
        selectedMarker.setMap(null);
      }

      const newMarker = new window.google.maps.Marker({
        position: clickedPosition,
        map,
        animation: window.google.maps.Animation.DROP,
        optimized: true,
        clickable: false
      });
      
      setSelectedMarker(newMarker);
      calculateRoute(clickedPosition);
    }
  }, [map, isLoaded, selectedMarker, calculateRoute]);

  const handleConfirm = () => {
    if (selectedPosition) {
      onLocationSelect(selectedPosition.lat, selectedPosition.lng);
      onOpenChange(false);
      toast({
        title: "Position confirmée",
        description: "La position a été enregistrée avec succès",
      });
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
      <DialogContent className="sm:max-w-[800px] h-[600px] transform-none">
        <DialogTitle>Sélectionnez un emplacement</DialogTitle>
        <div className="h-[500px] relative">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={position}
            zoom={15}
            onClick={handleMapClick}
            onLoad={setMap}
            options={{
              gestureHandling: 'greedy',
              disableDoubleClickZoom: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              zoomControl: true,
              clickableIcons: false,
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