import { useState, useCallback, useEffect } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MapMarkers from "./map/MapMarkers";

const GOOGLE_MAPS_API_KEY = "AIzaSyC806xlYYv2CYq2euqLnD4_cMrKrUTZGNI";

interface LocationMapProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationMap = ({ open, onOpenChange, onLocationSelect }: LocationMapProps) => {
  const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { toast } = useToast();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const getCurrentPosition = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedPosition(pos);
          if (map) {
            map.panTo(pos);
            map.setZoom(15);
          }
          toast({
            title: "Position trouvée",
            description: "Votre position a été localisée avec succès",
          });
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
  }, [map, toast]);

  useEffect(() => {
    if (open) {
      getCurrentPosition();
    }
  }, [open, getCurrentPosition]);

  const handleMarkerDrag = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setSelectedPosition({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  }, []);

  const handleConfirm = () => {
    if (selectedPosition) {
      onLocationSelect(selectedPosition.lat, selectedPosition.lng);
      onOpenChange(false);
      toast({
        title: "Position confirmée",
        description: "La position a été enregistrée avec succès",
      });
    }
  };

  if (!isLoaded) {
    return <div>Chargement...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[600px]">
        <DialogTitle>Sélectionnez votre position</DialogTitle>
        <div className="h-[500px] relative">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={selectedPosition || { lat: 48.8566, lng: 2.3522 }}
            zoom={15}
            onLoad={setMap}
            onClick={handleMarkerDrag}
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
              selectedPosition={selectedPosition}
              onMarkerDragEnd={handleMarkerDrag}
            />
          </GoogleMap>
          {selectedPosition && (
            <Button
              className="absolute bottom-4 right-4 z-[1000] bg-primary hover:bg-primary/90"
              onClick={handleConfirm}
            >
              Confirmer la position
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationMap;