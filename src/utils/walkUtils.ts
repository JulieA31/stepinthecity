import { Step } from "@/types/walk";

const generatePointsOfInterest = (type: string, center: { lat: number; lng: number }, duration: string): Step[] => {
  // Convertir la durée en nombre de points d'intérêt
  const pointsCount = {
    "30": 2,  // 30 minutes
    "60": 3,  // 1 heure
    "120": 4, // 2 heures
    "180": 5  // 3 heures
  }[duration] || 3;

  // Ajuster le rayon en fonction de la durée (en degrés, ~1km = 0.01)
  const radiusMap = {
    "30": 0.01,    // ~1km pour 30min
    "60": 0.015,   // ~1.5km pour 1h
    "120": 0.02,   // ~2km pour 2h
    "180": 0.025   // ~2.5km pour 3h
  };
  
  const radius = radiusMap[duration as keyof typeof radiusMap] || 0.015;

  // Points d'intérêt historiques pour Toulouse
  const historicalPOIs = [
    {
      title: "Basilique Saint-Sernin",
      description: "Plus grande église romane d'Europe",
      duration: "30min",
      position: { lat: 43.6088, lng: 1.4417 },
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Capitole de Toulouse",
      description: "Hôtel de ville historique et théâtre",
      duration: "45min",
      position: { lat: 43.6045, lng: 1.4440 },
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Couvent des Jacobins",
      description: "Chef d'œuvre de l'art gothique",
      duration: "40min",
      position: { lat: 43.6033, lng: 1.4402 },
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Cathédrale Saint-Étienne",
      description: "Cathédrale gothique méridionale",
      duration: "35min",
      position: { lat: 43.6004, lng: 1.4442 },
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Église Notre-Dame de la Dalbade",
      description: "Église gothique avec portail Renaissance",
      duration: "25min",
      position: { lat: 43.5989, lng: 1.4428 },
      imageUrl: "/placeholder.svg"
    }
  ];

  // Filtrer les points selon le type
  let availablePoints = type === "historical" ? historicalPOIs : historicalPOIs;

  // Calculer la distance par rapport au centre
  const calculateDistance = (point: { position: { lat: number; lng: number } }) => {
    const dlat = point.position.lat - center.lat;
    const dlng = point.position.lng - center.lng;
    return Math.sqrt(dlat * dlat + dlng * dlng);
  };

  // Trier les points par distance et sélectionner les plus proches
  const sortedPoints = availablePoints
    .sort((a, b) => calculateDistance(a) - calculateDistance(b))
    .slice(0, pointsCount);

  return sortedPoints;
};

export const generateStepsForType = (type: string, startLocation: { lat: number; lng: number }, duration: string): Step[] => {
  return generatePointsOfInterest(type, startLocation, duration);
};