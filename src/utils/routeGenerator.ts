import { Step } from "@/types/walk";
import { generateRoute as generatePlacesRoute } from "./placesUtils";

interface RouteOptions {
  startLocation: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number } | null;
  duration: string;
  type: string;
  routeType: string;
}

export const generateRoute = async (options: RouteOptions): Promise<Step[]> => {
  try {
    const steps = await generatePlacesRoute(options);
    return steps;
  } catch (error) {
    console.error("Erreur lors de la génération du parcours:", error);
    throw error;
  }
};