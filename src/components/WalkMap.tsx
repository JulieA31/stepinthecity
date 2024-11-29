import { GoogleMap, DirectionsRenderer, MarkerF } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { Step } from "@/types/walk";
import { calculateDirectionsRoute } from "@/utils/mapUtils";

interface WalkMapProps {
  steps: Step[];
  walkTitle: string;
  isLoaded: boolean;
}

const WalkMap = ({ steps, walkTitle, isLoaded }: WalkMapProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 48.8566, lng: 2.3522 });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const calculateRoute = useCallback(async () => {
    if (!steps || steps.length < 2) {
      console.log("Cannot calculate route: insufficient steps");
      return;
    }

    console.log("Calculating route with steps:", steps);

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
      console.log("Route calculated successfully:", result);
      setDirections(result);
      setCenter(origin);
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  }, [steps]);

  useEffect(() => {
    if (steps.length > 0) {
      console.log("Steps changed, recalculating route");
      calculateRoute();
    }
  }, [calculateRoute, steps]);

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
          <MarkerF
            key={index}
            position={step.position}
            label={{
              text: (index + 1).toString(),
              color: "white",
              fontWeight: "bold"
            }}
            title={`${step.title} (${step.duration})`}
          />
        )
      )}
    </GoogleMap>
  );
};

export default WalkMap;