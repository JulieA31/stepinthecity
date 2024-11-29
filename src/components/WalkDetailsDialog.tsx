import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useState, useEffect, useCallback } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyC806xlYYv2CYq2euqLnD4_cMrKrUTZGNI";

interface Step {
  title: string;
  description: string;
  duration: string;
  position?: google.maps.LatLngLiteral;
}

interface WalkDetailsDialogProps {
  walk: any;
  isOpen: boolean;
  onClose: () => void;
  getImageForWalk: (title: string) => string;
  getStepsForWalk: (title: string) => Step[];
}

const WalkDetailsDialog = ({
  walk,
  isOpen,
  onClose,
  getImageForWalk,
  getStepsForWalk,
}: WalkDetailsDialogProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 48.8566,
    lng: 2.3522
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const calculateRoute = useCallback((stepsWithPositions: Step[]) => {
    if (!isLoaded || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();
    const waypoints = stepsWithPositions
      .slice(1, -1)
      .filter(step => step.position)
      .map(step => ({
        location: step.position as google.maps.LatLngLiteral,
        stopover: true
      }));

    if (stepsWithPositions[0]?.position && stepsWithPositions[stepsWithPositions.length - 1]?.position) {
      directionsService.route(
        {
          origin: stepsWithPositions[0].position,
          destination: stepsWithPositions[stepsWithPositions.length - 1].position,
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.WALKING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          }
        }
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    if (walk && isOpen && isLoaded) {
      const steps = getStepsForWalk(walk.title);
      const stepsWithPositions = steps.map(step => {
        switch(walk.title) {
          case "Sur les pas de Victor Hugo":
            if (step.title === "Place des Vosges") return { ...step, position: { lat: 48.8554, lng: 2.3671 } };
            if (step.title === "Notre-Dame de Paris") return { ...step, position: { lat: 48.8530, lng: 2.3499 } };
            if (step.title === "Panthéon") return { ...step, position: { lat: 48.8462, lng: 2.3464 } };
            if (step.title === "Café Procope") return { ...step, position: { lat: 48.8527, lng: 2.3394 } };
            break;
          case "Lisbonne historique":
            if (step.title === "Château São Jorge") return { ...step, position: { lat: 38.7139, lng: -9.1334 } };
            if (step.title === "Cathédrale de Lisbonne") return { ...step, position: { lat: 38.7098, lng: -9.1325 } };
            if (step.title === "Place du Commerce") return { ...step, position: { lat: 38.7075, lng: -9.1364 } };
            if (step.title === "Tour de Belém") return { ...step, position: { lat: 38.6916, lng: -9.2159 } };
            break;
        }
        return step;
      });

      if (stepsWithPositions[0]?.position) {
        setCenter(stepsWithPositions[0].position);
      }

      calculateRoute(stepsWithPositions);
    }
  }, [walk, isOpen, isLoaded, getStepsForWalk, calculateRoute]);

  if (!walk) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{walk.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <div 
            className="h-64 w-full bg-cover bg-center rounded-lg mb-6"
            style={{ 
              backgroundImage: `url(${getImageForWalk(walk.title)}?auto=format&fit=crop&w=1200&q=80)`,
            }}
          />
          
          <div className="mt-4">
            <p className="text-gray-600 mb-6">{walk.description}</p>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="text-primary" size={20} />
                <span>{walk.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-primary" size={20} />
                <span>{walk.difficulty}</span>
              </div>
            </div>

            <div className="h-[400px] w-full mb-8 rounded-lg overflow-hidden">
              <LoadScript 
                googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                onLoad={() => setIsLoaded(true)}
              >
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={center}
                  zoom={13}
                >
                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
              </LoadScript>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Étapes du parcours</h3>
              {getStepsForWalk(walk.title).map((step, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h4 className="text-lg font-medium mb-2">{step.title}</h4>
                  <p className="text-gray-600 mb-2">{step.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span>{step.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalkDetailsDialog;