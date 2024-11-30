import { useState, useCallback } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MapMarkers from "./map/MapMarkers";
import { useGeolocation } from "./map/useGeolocation";

const GOOGLE_MAPS_API_KEY = "AIzaSyC806xlYYv2CYq2euqLnD4_cMrKrUTZGNI";

interface LocationMapProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationMap = ({ open, onOpenChange, onLocationSelect }: LocationMapProps) => {
  const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { toast } = useToast();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const position = useGeolocation(isLoaded, map, open);

  useEffect(() => {
    if (!open) {
      setDirections(null);
      setSelectedPosition(null);
    }
  }, [open]);

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
  }, [position, isLoaded, map, toast]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng && map) {
      const clickedPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      
      setSelectedPosition(clickedPosition);
      calculateRoute(clickedPosition);
    }
  }, [map, calculateRoute]);

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
      <DialogContent className="sm:max-w-[800px] h-[600px]">
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
            <MapMarkers
              position={position}
              selectedPosition={selectedPosition}
              setSelectedPosition={setSelectedPosition}
            />
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