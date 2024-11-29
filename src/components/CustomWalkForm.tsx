import { useState } from "react";
import { Clock, MapPin, Users, Filter, Repeat, Navigation2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Step } from "@/types/walk";
import { useToast } from "@/components/ui/use-toast";
import { generateStepsForType } from "@/utils/walkUtils";

interface CustomWalkFormProps {
  onGenerate: (steps: Step[]) => void;
  startLocation: { lat: number; lng: number } | null;
  endLocation: { lat: number; lng: number } | null;
  setShowMap: (show: boolean) => void;
  routeType: string;
}

const CustomWalkForm = ({ onGenerate, startLocation, endLocation, setShowMap, routeType }: CustomWalkFormProps) => {
  const [duration, setDuration] = useState("1h");
  const [type, setType] = useState("all");
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

    const steps = generateStepsForType(type, startLocation);
    
    if (startLocation) {
      steps.unshift({
        title: "Point de départ",
        description: "Début du parcours",
        duration: "0min",
        position: startLocation
      });
    }

    if (routeType === "point-to-point" && endLocation) {
      steps.push({
        title: "Point d'arrivée",
        description: "Fin du parcours",
        duration: "0min",
        position: endLocation
      });
    }

    onGenerate(steps);
  };

  return (
    <div className="card mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-display text-text mb-6">Critères de personnalisation</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
            <select 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="30min">30 minutes</option>
              <option value="1h">1 heure</option>
              <option value="2h">2 heures</option>
              <option value="3h">3 heures</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de balade</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="all">Tous les types</option>
              <option value="historical">Historique</option>
              <option value="cultural">Culturel</option>
              <option value="nature">Nature</option>
              <option value="food">Gastronomie</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de parcours</label>
            <select 
              value={routeType}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="loop">Boucle</option>
              <option value="point-to-point">Point à point</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Point de départ</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Point d'arrivée</label>
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
