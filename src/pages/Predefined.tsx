import { MapPin, Clock, Users, Volume2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import WalkDetailsDialog from "@/components/WalkDetailsDialog";

const lisbonneHistoriqueSteps = [
  {
    title: "Château São Jorge",
    description: "Commencez par le château qui domine la ville. Profitez d'une vue panoramique sur Lisbonne et découvrez l'histoire de cette forteresse médiévale.",
    duration: "1h"
  },
  {
    title: "Cathédrale de Lisbonne",
    description: "Visitez la plus ancienne église de la ville, mélange de styles roman, gothique et baroque, témoin de l'histoire de Lisbonne depuis 1147.",
    duration: "45min"
  },
  {
    title: "Place du Commerce",
    description: "Admirez cette majestueuse place donnant sur le Tage, symbole de la reconstruction de Lisbonne après le tremblement de terre de 1755.",
    duration: "30min"
  },
  {
    title: "Tour de Belém",
    description: "Terminez par ce monument emblématique de l'âge d'or portugais, classé au patrimoine mondial de l'UNESCO.",
    duration: "45min"
  }
];

const tramSteps = [
  {
    title: "Praça Martim Moniz",
    description: "Point de départ du tram 28, découvrez ce quartier multiculturel et montez dans le célèbre tramway jaune.",
    duration: "15min"
  },
  {
    title: "Graça",
    description: "Premier arrêt dans ce quartier authentique offrant une vue imprenable sur la ville depuis le miradouro.",
    duration: "30min"
  },
  {
    title: "Alfama",
    description: "Explorez le plus ancien quartier de Lisbonne, ses ruelles étroites et ses façades d'azulejos.",
    duration: "45min"
  },
  {
    title: "Baixa-Chiado",
    description: "Descendez dans le quartier élégant du shopping et des cafés historiques comme le A Brasileira.",
    duration: "30min"
  }
];

const saveursSteps = [
  {
    title: "Mercado da Ribeira",
    description: "Démarrez au marché Time Out pour découvrir la gastronomie portugaise moderne et traditionnelle.",
    duration: "45min"
  },
  {
    title: "Pastéis de Belém",
    description: "Visite incontournable de la pâtisserie historique qui garde la recette secrète des pastéis de nata originaux.",
    duration: "30min"
  },
  {
    title: "Cervejaria Ramiro",
    description: "Dégustez les meilleurs fruits de mer de Lisbonne dans ce restaurant emblématique.",
    duration: "45min"
  },
  {
    title: "Ginjinha",
    description: "Terminez par une dégustation de la liqueur traditionnelle de cerise dans un des bars historiques.",
    duration: "30min"
  }
];

const victorHugoSteps = [
  {
    title: "Place des Vosges",
    description: "Visitez la maison de Victor Hugo, où il vécut de 1832 à 1848. C'est ici qu'il a écrit une grande partie des Misérables.",
    duration: "30min"
  },
  {
    title: "Notre-Dame de Paris",
    description: "La cathédrale qui a inspiré son chef-d'œuvre 'Notre-Dame de Paris'. Admirez l'architecture gothique qui a tant fasciné l'écrivain.",
    duration: "45min"
  },
  {
    title: "Panthéon",
    description: "Lieu de repos éternel de Victor Hugo depuis 1885. Sa tombe se trouve dans la crypte aux côtés d'autres grands hommes.",
    duration: "45min"
  },
  {
    title: "Café Procope",
    description: "Le plus vieux café de Paris, fréquenté par Victor Hugo. Il y retrouvait d'autres écrivains pour des discussions passionnées.",
    duration: "30min"
  }
];

const Predefined = () => {
  const [audioEnabled, setAudioEnabled] = useState<{ [key: string]: boolean }>({});
  const [selectedWalk, setSelectedWalk] = useState<any | null>(null);
  const location = useLocation();
  const { city, itineraries } = location.state || { city: "Paris", itineraries: [] };

  const getImageForWalk = (title: string) => {
    const imageMap: { [key: string]: string } = {
      "Sur les pas de Victor Hugo": "/lovable-uploads/00ff1698-cc1b-43bb-be54-594a21634a90.png",
      "Les classiques de Paris": "/lovable-uploads/84b16743-6931-4157-9ce5-f52dc2c22cbd.png",
      "Balade gastronomique": "/lovable-uploads/d47de2a6-5b1a-40bd-86da-20acfad3f35a.png",
      "Lisbonne historique": "/lovable-uploads/68af49fb-4c88-402f-99c2-e06a4af91c2a.png",
      "Sur les rails du Tram 28": "/lovable-uploads/ae74de2f-fbb8-4777-bf21-bfbe98673652.png",
      "Saveurs portugaises": "/lovable-uploads/e3d12aa4-a953-4b29-858d-2ab4ea55a7da.png",
      "Route des vins": "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
      "Porto médiéval": "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2",
      "Porto artistique": "https://images.unsplash.com/photo-1487252665478-49b61b47f302",
    };
    return imageMap[title] || "https://images.unsplash.com/photo-1472396961693-142e6e269027";
  };

  const getStepsForWalk = (title: string) => {
    const stepsMap: { [key: string]: any[] } = {
      "Sur les pas de Victor Hugo": victorHugoSteps,
      "Lisbonne historique": lisbonneHistoriqueSteps,
      "Sur les rails du Tram 28": tramSteps,
      "Saveurs portugaises": saveursSteps
    };
    return stepsMap[title] || [];
  };

  const toggleAudio = (title: string) => {
    setAudioEnabled(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="min-h-screen bg-secondary pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-text mb-8">Parcours prédéfinis à {city}</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itineraries.map((walk: any, index: number) => (
            <div 
              key={index} 
              className="card hover:scale-105 transition-transform duration-200 cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden"
              onClick={() => setSelectedWalk(walk)}
            >
              <div 
                className="h-48 w-full bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${getImageForWalk(walk.title)}?auto=format&fit=crop&w=800&q=80)`,
                }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-display text-text">{walk.title}</h2>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudio(walk.title);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      audioEnabled[walk.title] ? 'bg-primary text-white' : 'bg-gray-100'
                    }`}
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{walk.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {walk.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    {walk.difficulty}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <WalkDetailsDialog
          walk={selectedWalk}
          isOpen={selectedWalk !== null}
          onClose={() => setSelectedWalk(null)}
          getImageForWalk={getImageForWalk}
          getStepsForWalk={getStepsForWalk}
        />
      </div>
    </div>
  );
};

export default Predefined;
