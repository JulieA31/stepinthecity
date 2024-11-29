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
          case "Sur les rails du Tram 28":
            if (step.title === "Praça Martim Moniz") return { ...step, position: { lat: 38.7157, lng: -9.1365 } };
            if (step.title === "Graça") return { ...step, position: { lat: 38.7164, lng: -9.1307 } };
            if (step.title === "Alfama") return { ...step, position: { lat: 38.7117, lng: -9.1332 } };
            if (step.title === "Baixa-Chiado") return { ...step, position: { lat: 38.7106, lng: -9.1390 } };
            break;
          case "Saveurs portugaises":
            if (step.title === "Mercado da Ribeira") return { ...step, position: { lat: 38.7067, lng: -9.1463 } };
            if (step.title === "Pastéis de Belém") return { ...step, position: { lat: 38.6975, lng: -9.2032 } };
            if (step.title === "Cervejaria Ramiro") return { ...step, position: { lat: 38.7208, lng: -9.1355 } };
            if (step.title === "Ginjinha") return { ...step, position: { lat: 38.7147, lng: -9.1394 } };
            break;
          case "Sur les pas de César":
            if (step.title === "Colisée") return { ...step, position: { lat: 41.8902, lng: 12.4922 } };
            if (step.title === "Arc de Constantin") return { ...step, position: { lat: 41.8898, lng: 12.4910 } };
            if (step.title === "Forum Romain") return { ...step, position: { lat: 41.8925, lng: 12.4853 } };
            if (step.title === "Mont Palatin") return { ...step, position: { lat: 41.8892, lng: 12.4875 } };
            break;
          case "Rome baroque":
            if (step.title === "Fontaine de Trevi") return { ...step, position: { lat: 41.9009, lng: 12.4833 } };
            if (step.title === "Panthéon") return { ...step, position: { lat: 41.8986, lng: 12.4769 } };
            if (step.title === "Place Navone") return { ...step, position: { lat: 41.8992, lng: 12.4730 } };
            if (step.title === "Escaliers de la Trinité des Monts") return { ...step, position: { lat: 41.9060, lng: 12.4833 } };
            break;
          case "Vatican et spiritualité":
            if (step.title === "Place Saint-Pierre") return { ...step, position: { lat: 41.9022, lng: 12.4567 } };
            if (step.title === "Musées du Vatican") return { ...step, position: { lat: 41.9067, lng: 12.4526 } };
            if (step.title === "Basilique Saint-Pierre") return { ...step, position: { lat: 41.9022, lng: 12.4533 } };
            if (step.title === "Château Saint-Ange") return { ...step, position: { lat: 41.9031, lng: 12.4663 } };
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