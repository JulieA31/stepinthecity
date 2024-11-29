import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { Step } from "@/types/walk";
import { calculateDirectionsRoute, getStepPosition } from "@/utils/mapUtils";

interface WalkMapProps {
  steps: Step[];
  walkTitle: string;
  isLoaded: boolean;
}

const WalkMap = ({ steps, walkTitle, isLoaded }: WalkMapProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 48.8566, lng: 2.3522 });

  const calculateRoute = useCallback(async () => {
    if (!isLoaded || !window.google) return;

    const stepsWithPositions = steps.map(step => ({
      ...step,
      position: getStepPosition(step, walkTitle)
    }));

    const validSteps = stepsWithPositions.filter(
      step => step.position && 
      typeof step.position.lat === 'number' && 
      typeof step.position.lng === 'number'
    );

    if (validSteps.length < 2) return;

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
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  }, [steps, walkTitle, isLoaded]);

  useEffect(() => {
    calculateRoute();
  }, [calculateRoute]);

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={13}
      options={{
        gestureHandling: 'cooperative',
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default WalkMap;