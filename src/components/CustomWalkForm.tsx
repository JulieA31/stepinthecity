import { useState } from "react";
import { MapPin, Navigation2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Step } from "@/types/walk";
import { useToast } from "@/components/ui/use-toast";
import { generateRoute } from "@/utils/routeGenerator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FormOptions from "./FormOptions";

interface CustomWalkFormProps {
  onGenerate: (steps: Step[], targetDuration: number) => void;
  startLocation: { lat: number; lng: number } | null;
  endLocation: { lat: number; lng: number } | null;
  setShowMap: (show: boolean) => void;
  routeType: string;
  setRouteType: (type: string) => void;
}

const CustomWalkForm = ({ 
  onGenerate, 
  startLocation, 
  endLocation, 
  setShowMap, 
  routeType, 
  setRouteType 
}: CustomWalkFormProps) => {
  const [duration, setDuration] = useState("60");
  const [type, setType] = useState("all");
  const [actualDuration, setActualDuration] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!startLocation) {
      toast({
        title: "Point de départ manquant",
        description: "Veuillez sélectionner un point de départ sur la carte",
        variant: "destructive"
      });
      return;
    }

    if (routeType === "point-to-point" && !endLocation) {
      toast({
        title: "Point d'arrivée manquant",
        description: "Veuillez sélectionner un point d'arrivée sur la carte",
        variant: "destructive"
      });
      return;
    }

    const steps = generateRoute({
      startLocation,
      endLocation,
      duration,
      type,
      routeType
    });

    onGenerate(steps, parseInt(duration));
    
    toast({
      title: "Parcours généré",
      description: "Votre parcours personnalisé a été généré avec succès !",
    });
  };

  return (
    <div className="card mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-display text-text mb-6">
          Critères de personnalisation
        </h2>
        
        <div className="mb-6">
          {actualDuration && actualDuration > parseInt(duration) + 10 && (
            <Alert variant="destructive" className="transform-none">
              <AlertDescription>
                ⚠️ Ce parcours dure {actualDuration} minutes, soit {actualDuration - parseInt(duration)} minutes de plus que la durée souhaitée.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <FormOptions
          duration={duration}
          setDuration={setDuration}
          type={type}
          setType={setType}
          routeType={routeType}
          setRouteType={setRouteType}
        />
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Point de départ
            </label>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setShowMap(true)}
            >
              <MapPin size={18} />
              {startLocation ? "Changer le point de départ" : "Choisir sur la carte"}
            </Button>
            {startLocation && (
              <p className="text-sm text-gray-500 mt-1">
                Position : {startLocation.lat.toFixed(4)}, {startLocation.lng.toFixed(4)}
              </p>
            )}
          </div>

          {routeType === "point-to-point" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Point d'arrivée
              </label>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setShowMap(true)}
              >
                <Navigation2 size={18} />
                {endLocation ? "Changer le point d'arrivée" : "Choisir sur la carte"}
              </Button>
              {endLocation && (
                <p className="text-sm text-gray-500 mt-1">
                  Position : {endLocation.lat.toFixed(4)}, {endLocation.lng.toFixed(4)}
                </p>
              )}
            </div>
          )}
        </div>
        
        <Button 
          className="mt-8 w-full"
          onClick={handleGenerate}
        >
          Générer mon parcours
        </Button>
      </div>
    </div>
  );
};

export default CustomWalkForm;