import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { Step } from "@/types/walk";
import { calculateDirectionsRoute } from "@/utils/mapUtils";

interface WalkMapProps {
  steps: Step[];
  walkTitle: string;
  isLoaded: boolean;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "400px"
};

const defaultCenter = { lat: 48.8566, lng: 2.3522 };

const WalkMap = ({ steps, walkTitle, isLoaded }: WalkMapProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(defaultCenter);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("Map loaded successfully");
    setMap(map);
  }, []);

  const calculateRoute = useCallback(async () => {
    if (!isLoaded || !steps || steps.length < 2) {
      console.log("Cannot calculate route: map not loaded or insufficient steps");
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
  }, [steps, isLoaded]);

  useEffect(() => {
    if (steps.length > 0) {
      console.log("Steps changed, recalculating route");
      calculateRoute();
    }
  }, [calculateRoute, steps]);

  if (!isLoaded) {
    console.log("Map is not loaded yet");
    return <div className="h-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      options={{
        gestureHandling: 'cooperative',
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default WalkMap;