import { Step } from "@/types/walk";
import { generateStepsForType } from "./walkUtils";

interface RouteOptions {
  startLocation: google.maps.LatLngLiteral;
  endLocation?: google.maps.LatLngLiteral | null;
  duration: string;
  type: string;
  routeType: string;
}

export const generateRoute = ({ 
  startLocation, 
  endLocation, 
  duration, 
  type, 
  routeType 
}: RouteOptions): Step[] => {
  // Générer les points d'intérêt en fonction du type et de la durée
  const steps = generateStepsForType(type, startLocation, duration);
  
  // Créer le tableau final des étapes
  const finalSteps: Step[] = [];
  
  // Ajouter le point de départ
  finalSteps.push({
    title: "Point de départ",
    description: "Début de votre parcours",
    duration: "0min",
    position: startLocation,
    imageUrl: "/placeholder.svg"
  });
  
  // Ajouter les points d'intérêt
  finalSteps.push(...steps);
  
  // Pour une boucle, ajouter le point de départ comme point d'arrivée
  if (routeType === "loop") {
    finalSteps.push({
      title: "Retour au point de départ",
      description: "Fin de votre parcours",
      duration: "0min",
      position: startLocation,
      imageUrl: "/placeholder.svg"
    });
  } 
  // Pour un parcours point à point, ajouter le point d'arrivée spécifié
  else if (routeType === "point-to-point" && endLocation) {
    finalSteps.push({
      title: "Point d'arrivée",
      description: "Fin de votre parcours",
      duration: "0min",
      position: endLocation,
      imageUrl: "/placeholder.svg"
    });
  }
  
  return finalSteps;
};