import { Step } from "@/types/walk";
import { getHistoricalPoints } from "./historicalPoints";

interface RouteOptions {
  startLocation: google.maps.LatLngLiteral;
  endLocation?: google.maps.LatLngLiteral | null;
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
    position: startLocation,
    imageUrl: "/placeholder.svg"
  });

  // Obtenir les points d'intérêt selon le type
  let points = [];
  if (type === "historical") {
    points = getHistoricalPoints(startLocation);
  }

  // Sélectionner le nombre approprié de points selon la durée
  const targetDuration = parseInt(duration);
  let currentDuration = 0;
  let selectedPoints = [];

  // Calculer le temps de marche approximatif entre les points (5 min par 400m)
  const calculateWalkingTime = (from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLon = (to.lng - from.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c * 1000; // Distance en mètres
    return Math.round(distance / 400 * 5); // 5 minutes par 400m
  };

  // Sélectionner les points en tenant compte du temps de marche
  let lastPosition = startLocation;
  for (const point of points) {
    const walkingTime = calculateWalkingTime(lastPosition, point.position);
    const pointDuration = parseInt(point.duration);
    
    if (currentDuration + pointDuration + walkingTime <= targetDuration - 10) {
      selectedPoints.push(point);
      currentDuration += pointDuration + walkingTime;
      lastPosition = point.position;
    }
  }

  // Si c'est une boucle, ajouter le temps de retour au point de départ
  if (routeType === "loop") {
    currentDuration += calculateWalkingTime(lastPosition, startLocation);
  } else if (endLocation) {
    currentDuration += calculateWalkingTime(lastPosition, endLocation);
  }

  // Vérifier si la durée totale est dans la plage acceptable (±10 minutes)
  if (Math.abs(currentDuration - targetDuration) > 10) {
    // Ajuster le nombre de points si nécessaire
    while (selectedPoints.length > 0 && currentDuration > targetDuration + 10) {
      const removedPoint = selectedPoints.pop();
      if (removedPoint) {
        currentDuration -= parseInt(removedPoint.duration);
        currentDuration -= calculateWalkingTime(
          selectedPoints[selectedPoints.length - 1]?.position || startLocation,
          removedPoint.position
        );
      }
    }
  }

  // Ajouter les points sélectionnés à l'itinéraire
  steps.push(...selectedPoints.map(point => ({
    title: point.title,
    description: point.description,
    duration: point.duration,
    position: point.position,
    imageUrl: point.imageUrl || "/placeholder.svg"
  })));

  // Ajouter le point d'arrivée
  if (routeType === "loop") {
    steps.push({
      title: "Point d'arrivée",
      description: "Fin du parcours (retour au point de départ)",
      duration: "0min",
      position: startLocation,
      imageUrl: "/placeholder.svg"
    });
  } else if (routeType === "point-to-point" && endLocation) {
    steps.push({
      title: "Point d'arrivée",
      description: "Fin du parcours",
      duration: "0min",
      position: endLocation,
      imageUrl: "/placeholder.svg"
    });
  }

  return steps;
};