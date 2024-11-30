import { Step } from "@/types/walk";
import { getHistoricalPoints } from "./historicalPoints";

interface RouteOptions {
  startLocation: google.maps.LatLngLiteral;
  endLocation?: google.maps.LatLngLiteral;
  duration: string;
  type: string;
  routeType: string;
}

export const generateRoute = ({ startLocation, endLocation, duration, type, routeType }: RouteOptions): Step[] => {
  const steps: Step[] = [];
  
  // Ajouter le point de départ
  steps.push({
    title: "Point de départ",
    description: "Début du parcours",
    duration: "0min",
    position: startLocation
  });

  // Obtenir les points d'intérêt selon le type
  let points = [];
  if (type === "historical") {
    points = getHistoricalPoints(startLocation);
  }
  // Vous pouvez ajouter d'autres types ici (cultural, nature, etc.)

  // Sélectionner le nombre approprié de points selon la durée
  const targetDuration = parseInt(duration);
  let currentDuration = 0;
  let selectedPoints = [];

  for (const point of points) {
    const pointDuration = parseInt(point.duration);
    if (currentDuration + pointDuration <= targetDuration - 10) { // -10 pour le temps de marche
      selectedPoints.push(point);
      currentDuration += pointDuration;
    }
  }

  // Ajouter les points sélectionnés à l'itinéraire
  steps.push(...selectedPoints.map(point => ({
    title: point.title,
    description: point.description,
    duration: point.duration,
    position: point.position
  })));

  // Ajouter le point d'arrivée
  if (routeType === "loop") {
    steps.push({
      title: "Point d'arrivée",
      description: "Fin du parcours (retour au point de départ)",
      duration: "0min",
      position: startLocation
    });
  } else if (routeType === "point-to-point" && endLocation) {
    steps.push({
      title: "Point d'arrivée",
      description: "Fin du parcours",
      duration: "0min",
      position: endLocation
    });
  }

  return steps;
};