interface HistoricalPoint {
  title: string;
  description: string;
  duration: string;
  position: google.maps.LatLngLiteral;
  type: string;
  imageUrl?: string;
}

export const getHistoricalPoints = (center: google.maps.LatLngLiteral): HistoricalPoint[] => {
  // Calcul de points d'intérêt dans un rayon autour du centre
  const radius = 0.015; // ~1.5km
  
  return [
    {
      title: "Basilique Saint-Sernin",
      description: "Plus grande église romane d'Europe, classée au patrimoine mondial de l'UNESCO",
      duration: "30",
      position: {
        lat: center.lat + (Math.random() - 0.5) * radius,
        lng: center.lng + (Math.random() - 0.5) * radius
      },
      type: "religious",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Basilique_Saint-Sernin_de_Toulouse_02.jpg/800px-Basilique_Saint-Sernin_de_Toulouse_02.jpg"
    },
    {
      title: "Capitole de Toulouse",
      description: "Hôtel de ville historique et théâtre emblématique de la ville",
      duration: "20",
      position: {
        lat: center.lat + (Math.random() - 0.5) * radius,
        lng: center.lng + (Math.random() - 0.5) * radius
      },
      type: "government",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Toulouse_Capitole_Night_Wikimedia_Commons.jpg/800px-Toulouse_Capitole_Night_Wikimedia_Commons.jpg"
    },
    {
      title: "Couvent des Jacobins",
      description: "Chef d'œuvre de l'art gothique méridional avec son célèbre palmier",
      duration: "25",
      position: {
        lat: center.lat + (Math.random() - 0.5) * radius,
        lng: center.lng + (Math.random() - 0.5) * radius
      },
      type: "religious",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Toulouse_couvent_jacobins.jpg/800px-Toulouse_couvent_jacobins.jpg"
    },
    {
      title: "Église Notre-Dame de la Dalbade",
      description: "Église gothique méridionale avec son portail Renaissance",
      duration: "20",
      position: {
        lat: center.lat + (Math.random() - 0.5) * radius,
        lng: center.lng + (Math.random() - 0.5) * radius
      },
      type: "religious",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Toulouse_-_%C3%89glise_Notre-Dame_de_la_Dalbade_-_Fa%C3%A7ade.jpg/800px-Toulouse_-_%C3%89glise_Notre-Dame_de_la_Dalbade_-_Fa%C3%A7ade.jpg"
    },
    {
      title: "Monument aux Morts",
      description: "Mémorial dédié aux victimes de la Première Guerre mondiale",
      duration: "15",
      position: {
        lat: center.lat + (Math.random() - 0.5) * radius,
        lng: center.lng + (Math.random() - 0.5) * radius
      },
      type: "memorial",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Monument_aux_morts_Toulouse.jpg/800px-Monument_aux_morts_Toulouse.jpg"
    },
    {
      title: "Hôtel d'Assézat",
      description: "Magnifique hôtel particulier de la Renaissance",
      duration: "25",
      position: {
        lat: center.lat + (Math.random() - 0.5) * radius,
        lng: center.lng + (Math.random() - 0.5) * radius
      },
      type: "historical",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/H%C3%B4tel_d%27Ass%C3%A9zat_Toulouse.jpg/800px-H%C3%B4tel_d%27Ass%C3%A9zat_Toulouse.jpg"
    }
  ];
};