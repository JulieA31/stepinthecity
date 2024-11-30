import { Step } from "@/types/walk";
import { generateRoute as generatePlacesRoute } from "./placesUtils";

interface RouteOptions {
  startLocation: google.maps.LatLngLiteral;
  endLocation?: google.maps.LatLngLiteral | null;
  duration: string;
  type: string;
  routeType: string;
}

export const generateRoute = async ({
  startLocation,
  endLocation,
  duration,
  type,
  routeType
}: RouteOptions): Promise<Step[]> => {
  try {
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
      description: `Début de votre parcours ${type === "all" ? "découverte" : type}. ${
        routeType === "loop" 
          ? "Ce parcours en boucle vous ramènera à votre point de départ." 
          : "Ce parcours vous mènera jusqu'à votre destination finale."
      }`,
      duration: "0min",
      position: startLocation
    });

    // Points d'intérêt
    finalSteps.push(...steps);

    // Point d'arrivée pour les parcours point à point
    if (routeType === "point-to-point" && endLocation) {
      finalSteps.push({
        title: "Point d'arrivée",
        description: "Vous êtes arrivé à destination. Nous espérons que vous avez apprécié ce parcours !",
        duration: "0min",
        position: endLocation
      });
    }

    return finalSteps;
  } catch (error) {
    console.error("Erreur lors de la génération du parcours:", error);
    throw error;
  }
};