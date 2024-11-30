interface HistoricalPoint {
  title: string;
  description: string;
  duration: string;
  position: google.maps.LatLngLiteral;
  type: string;
}

export const getHistoricalPoints = (center: google.maps.LatLngLiteral): HistoricalPoint[] => {
  // Calcul de points d'intérêt dans un rayon autour du centre
  const radius = 0.015; // ~1.5km
  
  return [
    {
      title: "Basilique Saint-Sernin",
      description: "Plus grande église romane d'Europe",
      duration: "30min",
      position: {
        lat: center.lat + (Math.random() - 0.5) * radius,
        lng: center.lng + (Math.random() - 0.5) * radius
      },
      type: "religious"
    },
    {
      title: "Capitole de Toulouse",
      description: "Hôtel de ville historique",
      duration: "20min",
      position: {
        lat: center.lat + (Math.random() - 0.5) * radius,
        lng: center.lng + (Math.random() - 0.5) * radius
      },
      type: "government"
    },
    {
      title: "Couvent des Jacobins",
      description: "Chef d'œuvre de l'art gothique",
      duration: "25min",
      position: {
        lat: center.lat + (Math.random() - 0.5) * radius,
        lng: center.lng + (Math.random() - 0.5) * radius
      },
      type: "religious"
    },
    {
      title: "Église Notre-Dame de la Dalbade",
      description: "Église gothique méridionale",
      duration: "20min",
      position: {
        lat: center.lat + (Math.random() - 0.5) * radius,
        lng: center.lng + (Math.random() - 0.5) * radius
      },
      type: "religious"
    },
    {
      title: "Monument aux Morts",
      description: "Mémorial de la Première Guerre mondiale",
      duration: "15min",
      position: {
        lat: center.lat + (Math.random() - 0.5) * radius,
        lng: center.lng + (Math.random() - 0.5) * radius
      },
      type: "memorial"
    }
  ];
};