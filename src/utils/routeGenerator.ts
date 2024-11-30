import { Step } from "@/types/walk";
import { generateRoute as generatePlacesRoute } from "./placesUtils";

interface RouteOptions {
  startLocation: google.maps.LatLngLiteral;
  endLocation?: google.maps.LatLngLiteral | null;
  duration: string;
  type: string;
  routeType: string;
}

const getTypeDescription = (type: string) => {
  const descriptions = {
    "historical": "Un parcours à travers l'histoire avec des monuments et sites historiques remarquables",
    "cultural": "Une immersion dans la culture locale à travers musées et lieux culturels",
    "nature": "Une balade au cœur de la nature et des espaces verts",
    "food": "Un voyage gustatif à travers les meilleurs spots gastronomiques",
    "all": "Un parcours varié combinant différents points d'intérêt"
  };
  return descriptions[type as keyof typeof descriptions] || descriptions.all;
};

const getDurationDescription = (duration: string) => {
  const descriptions = {
    "30": "Une courte balade de 30 minutes",
    "60": "Une promenade d'une heure",
    "120": "Une exploration de 2 heures",
    "180": "Une découverte approfondie de 3 heures"
  };
  return descriptions[duration as keyof typeof descriptions] || descriptions["60"];
};

export const generateRoute = async ({ 
  startLocation, 
  endLocation, 
  duration, 
  type, 
  routeType 
}: RouteOptions): Promise<Step[]> => {
  const steps = await generatePlacesRoute({
    startLocation,
    endLocation,
    duration,
    type,
    routeType
  });
  
  const finalSteps: Step[] = [];
  
  // Point de départ avec description personnalisée
  finalSteps.push({
    title: "Point de départ",
    description: `${getDurationDescription(duration)}. ${getTypeDescription(type)}. ${
      routeType === "loop" 
        ? "Ce parcours en boucle vous ramènera à votre point de départ." 
        : "Ce parcours vous mènera jusqu'à votre destination finale."
    }`,
    duration: "0min",
    position: startLocation
  });
  
  // Points d'intérêt avec leurs descriptions
  finalSteps.push(...steps);
  
  // Point d'arrivée
  if (routeType === "loop") {
    finalSteps.push({
      title: "Retour au point de départ",
      description: "Vous êtes revenu à votre point de départ. Nous espérons que vous avez apprécié ce parcours !",
      duration: "0min",
      position: startLocation
    });
  } else if (routeType === "point-to-point" && endLocation) {
    finalSteps.push({
      title: "Point d'arrivée",
      description: "Vous êtes arrivé à destination. Nous espérons que vous avez apprécié ce parcours !",
      duration: "0min",
      position: endLocation
    });
  }
  
  return finalSteps;
};