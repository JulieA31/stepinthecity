import { GoogleMap, DirectionsRenderer, MarkerF } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { Step } from "@/types/walk";
import { calculateDirectionsRoute } from "@/utils/mapUtils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface WalkMapProps {
  steps: Step[];
  walkTitle: string;
  isLoaded: boolean;
  onRouteCalculated?: (durationInMinutes: number) => void;
}

const WalkMap = ({ steps, walkTitle, isLoaded, onRouteCalculated }: WalkMapProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 48.8566, lng: 2.3522 });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const calculateRoute = useCallback(async () => {
    if (!steps || steps.length < 2) {
      console.log("Cannot calculate route: insufficient steps");
      return;
    }

    const validSteps = steps.filter(
      step => step.position && 
      typeof step.position.lat === 'number' && 
      typeof step.position.lng === 'number'
    );

    if (validSteps.length < 2) {
      console.log("Not enough valid steps with positions");
      return;
    }

    const origin = validSteps[0].position!;
    const destination = validSteps[validSteps.length - 1].position!;
    const waypoints = validSteps.slice(1, -1).map(step => ({
      location: step.position as google.maps.LatLngLiteral,
      stopover: true
    }));

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const result = await calculateDirectionsRoute(
        directionsService,
        origin,
        destination,
        waypoints
      );
      setDirections(result);
      setCenter(origin);

      // Calculer la durée totale en minutes à partir des données de l'itinéraire
      if (result.routes[0] && onRouteCalculated) {
        const totalDurationInSeconds = result.routes[0].legs.reduce(
          (total, leg) => total + (leg.duration?.value || 0),
          0
        );
        const totalDurationInMinutes = Math.round(totalDurationInSeconds / 60);
        onRouteCalculated(totalDurationInMinutes);
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  }, [steps, onRouteCalculated]);

  useEffect(() => {
    if (steps.length > 0) {
      calculateRoute();
    }
  }, [calculateRoute, steps]);

  const CustomMarker = ({ step, index }: { step: Step; index: number }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div>
          <MarkerF
            position={step.position!}
            options={{
              label: {
                text: `${index + 1}`,
                color: "white",
                fontWeight: "bold"
              }
            }}
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-white p-0 shadow-lg rounded-lg overflow-hidden">
        <div className="relative h-32 w-full">
          <img
            src={step.imageUrl || "/placeholder.svg"}
            alt={step.title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{step.duration}</p>
          <p className="text-sm text-gray-700">{step.description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "100%",
        minHeight: "400px"
      }}
      center={center}
      zoom={13}
      onLoad={setMap}
      options={{
        gestureHandling: 'cooperative',
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {directions && <DirectionsRenderer directions={directions} />}
      {steps.map((step, index) => 
        step.position && (
          <CustomMarker 
            key={index}
            step={step}
            index={index}
          />
        )
      )}
    </GoogleMap>
  );
};

export default WalkMap;