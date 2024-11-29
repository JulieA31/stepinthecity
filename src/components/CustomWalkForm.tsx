import { useState } from "react";
import { Clock, MapPin, Users, Filter, Repeat, Navigation2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Step } from "@/types/walk";
import { useToast } from "@/components/ui/use-toast";

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

  const generateSteps = (duration: string, type: string): Step[] => {
    const steps: Step[] = [];
    
    switch (type) {
      case "historical":
        steps.push(
          {
            title: "Monument historique 1",
            description: "Un lieu chargé d'histoire",
            duration: "45min",
            position: { lat: 48.8584, lng: 2.2945 }
          },
          {
            title: "Site archéologique",
            description: "Découverte des vestiges",
            duration: "45min",
            position: { lat: 48.8738, lng: 2.2950 }
          }
        );
        break;
      case "cultural":
        steps.push(
          {
            title: "Musée principal",
            description: "Collections remarquables",
            duration: "1h",
            position: { lat: 48.8606, lng: 2.3376 }
          },
          {
            title: "Galerie d'art",
            description: "Art contemporain",
            duration: "45min",
            position: { lat: 48.8634, lng: 2.3275 }
          }
        );
        break;
      case "nature":
        steps.push(
          {
            title: "Parc principal",
            description: "Espace vert paisible",
            duration: "45min",
            position: { lat: 48.8417, lng: 2.2911 }
          },
          {
            title: "Jardin botanique",
            description: "Collection de plantes",
            duration: "45min",
            position: { lat: 48.8666, lng: 2.3333 }
          }
        );
        break;
      case "food":
        steps.push(
          {
            title: "Marché local",
            description: "Produits frais et locaux",
            duration: "45min",
            position: { lat: 48.8494, lng: 2.3783 }
          },
          {
            title: "Restaurant traditionnel",
            description: "Cuisine locale",
            duration: "1h",
            position: { lat: 48.8647, lng: 2.3475 }
          }
        );
        break;
      default:
        steps.push(
          {
            title: "Point d'intérêt 1",
            description: "Description du lieu",
            duration: "30min",
            position: { lat: 48.8584, lng: 2.2945 }
          },
          {
            title: "Point d'intérêt 2",
            description: "Description du lieu",
            duration: "30min",
            position: { lat: 48.8738, lng: 2.2950 }
          }
        );
    }
    
    return steps;
  };

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

    const steps = generateSteps(duration, type);
    
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