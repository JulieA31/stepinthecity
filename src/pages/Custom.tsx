import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import CustomWalkForm from "@/components/CustomWalkForm";
import { Step } from "@/types/walk";
import { Clock, MapPin } from "lucide-react";
import LocationMap from "@/components/LocationMap";

const Custom = () => {
  const [routeType, setRouteType] = useState("loop");
  const [startLocation, setStartLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [endLocation, setEndLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [generatedSteps, setGeneratedSteps] = useState<Step[]>([]);
  const [targetDuration, setTargetDuration] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const { toast } = useToast();

  const handleGenerateSteps = (steps: Step[], duration: number) => {
    setGeneratedSteps(steps);
    setTargetDuration(duration);
  };

  const getGoogleMapsUrl = (step: Step) => {
    if (!step.position) return "";
    const { lat, lng } = step.position;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
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
          setRouteType={setRouteType}
        />

        {generatedSteps.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-display mb-6">Votre itinéraire</h2>
            <div className="space-y-6">
              {generatedSteps.map((step, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <h3 className="font-medium text-lg">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-2">{step.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={16} className="mr-1" />
                      <span>{step.duration}</span>
                    </div>
                    <a
                      href={getGoogleMapsUrl(step)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
                    >
                      <MapPin size={16} />
                      <span>Voir sur Google Maps</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
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
        }}
      />
    </div>
  );
};

export default Custom;