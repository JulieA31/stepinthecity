import { useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import LocationMap from "@/components/LocationMap";
import WalkMap from "@/components/WalkMap";
import CustomWalkForm from "@/components/CustomWalkForm";
import { Step } from "@/types/walk";

const GOOGLE_MAPS_API_KEY = "AIzaSyC806xlYYv2CYq2euqLnD4_cMrKrUTZGNI";

const Custom = () => {
  const [routeType, setRouteType] = useState("loop");
  const [showMap, setShowMap] = useState(false);
  const [startLocation, setStartLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [endLocation, setEndLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [generatedSteps, setGeneratedSteps] = useState<Step[]>([]);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const handleGenerateSteps = (steps: Step[]) => {
    console.log("Steps received in Custom:", steps);
    setGeneratedSteps(steps);
    setIsMapVisible(true);
  };

  return (
    <div className="min-h-screen bg-secondary pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-text mb-8 text-center">Créez votre parcours</h1>
        
        <CustomWalkForm
          onGenerate={handleGenerateSteps}
          startLocation={startLocation}
          endLocation={endLocation}
          setShowMap={setShowMap}
          routeType={routeType}
        />

        {isMapVisible && generatedSteps.length > 0 && (
          <div className="h-[600px] relative mt-8 rounded-lg overflow-hidden shadow-lg">
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <WalkMap
                steps={generatedSteps}
                walkTitle="Parcours personnalisé"
                isLoaded={true}
              />
            </LoadScript>
          </div>
        )}
      </div>

      <LocationMap
        open={showMap}
        onOpenChange={setShowMap}
        onLocationSelect={(lat, lng) => {
          if (!startLocation) {
            setStartLocation({ lat, lng });
          } else if (routeType === "point-to-point" && !endLocation) {
            setEndLocation({ lat, lng });
          }
          setShowMap(false);
        }}
      />
    </div>
  );
};

export default Custom;