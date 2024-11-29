import { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import LocationMap from "@/components/LocationMap";
import WalkMap from "@/components/WalkMap";
import CustomWalkForm from "@/components/CustomWalkForm";
import { Step } from "@/types/walk";
import { Clock } from "lucide-react";

const GOOGLE_MAPS_API_KEY = "AIzaSyC806xlYYv2CYq2euqLnD4_cMrKrUTZGNI";

const Custom = () => {
  const [routeType, setRouteType] = useState("loop");
  const [showMap, setShowMap] = useState(false);
  const [startLocation, setStartLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [endLocation, setEndLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [generatedSteps, setGeneratedSteps] = useState<Step[]>([]);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const handleGenerateSteps = (steps: Step[]) => {
    setGeneratedSteps(steps);
    setIsMapVisible(true);
  };

  // Calculer la durée totale
  const totalDuration = generatedSteps.reduce((total, step) => {
    const duration = step.duration.replace('min', '');
    return total + parseInt(duration);
  }, 0);

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

        {isMapVisible && generatedSteps.length > 0 && (
          <>
            <div className="h-[600px] relative mt-8 rounded-lg overflow-hidden shadow-lg">
              {isLoaded ? (
                <WalkMap
                  steps={generatedSteps}
                  walkTitle="Parcours personnalisé"
                  isLoaded={isLoaded}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  Chargement de la carte...
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne de gauche - Itinéraire */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-display mb-4">Itinéraire</h2>
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="text-primary" size={20} />
                  <span className="text-lg">Durée totale : {totalDuration} minutes</span>
                </div>
                <div className="space-y-4">
                  {generatedSteps.map((step, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <span className="text-gray-600">{step.duration}</span>
                      </div>
                      <h3 className="font-medium mt-1">{step.title}</h3>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colonne de droite - Points d'intérêt */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-display mb-6">Points d'intérêt</h2>
                <div className="space-y-6">
                  {generatedSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={step.imageUrl || "https://images.unsplash.com/photo-1472396961693-142e6e269027"}
                          alt={step.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">{step.title}</h3>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
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