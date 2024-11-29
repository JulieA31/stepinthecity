import { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer } from "@react-google-maps/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation && isLoaded && map && open) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setPosition(newPosition);
          
          if (userMarker) {
            userMarker.setMap(null);
          }

          const newUserMarker = new window.google.maps.Marker({
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
            title: "Votre position"
          });
          setUserMarker(newUserMarker);
          map.setCenter(newPosition);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  }, [map, open, isLoaded]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng && map && isLoaded) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setSelectedPosition(newPosition);

      if (marker) {
        marker.setMap(null);
      }

      const newMarker = new window.google.maps.Marker({
        map,
        position: newPosition,
        animation: window.google.maps.Animation.DROP
      });
      setMarker(newMarker);

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: position,
          destination: newPosition,
          travelMode: window.google.maps.TravelMode.WALKING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error("Erreur lors du calcul de l'itinéraire:", status);
          }
        }
      );
    }
  }, [position, map, marker, isLoaded]);

  const handleConfirm = () => {
    if (selectedPosition) {
      onLocationSelect(selectedPosition.lat, selectedPosition.lng);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[600px]">
        <DialogTitle>Sélectionnez un emplacement</DialogTitle>
        <div className="h-[500px] relative">
          <LoadScript 
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            onLoad={() => setIsLoaded(true)}
          >
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={position}
              zoom={13}
              onClick={handleMapClick}
              onLoad={map => setMap(map)}
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </LoadScript>
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