import { MapPin, Clock, Users, Volume2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const walks = [
  {
    title: "Sur les pas de Victor Hugo",
    duration: "2h30",
    difficulty: "Facile",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    description: "Découvrez les lieux qui ont inspiré les plus grandes œuvres de Victor Hugo",
    hasAudio: true,
    steps: victorHugoSteps
  },
  {
    title: "Les classiques de Paris",
    duration: "3h",
    difficulty: "Moyen",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    description: "Tour Eiffel, Louvre, Notre-Dame... Les incontournables de Paris",
    hasAudio: true
  },
  {
    title: "Balade gastronomique",
    duration: "2h",
    difficulty: "Facile",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
    description: "Découvrez les meilleures adresses culinaires de la capitale",
    hasAudio: true
  }
];

const Predefined = () => {
  const [audioEnabled, setAudioEnabled] = useState<{ [key: string]: boolean }>({});
  const [selectedWalk, setSelectedWalk] = useState<typeof walks[0] | null>(null);

  const toggleAudio = (title: string) => {
    setAudioEnabled(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="min-h-screen bg-secondary pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-text mb-8">Parcours prédéfinis à Paris</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {walks.map((walk, index) => (
            <div 
              key={index} 
              className="card hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => setSelectedWalk(walk)}
            >
              <img 
                src={walk.image} 
                alt={walk.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-display text-text">{walk.title}</h2>
                  {walk.hasAudio && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAudio(walk.title);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        audioEnabled[walk.title] ? 'bg-sage text-white' : 'bg-gray-100'
                      }`}
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
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
                    Paris
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={selectedWalk !== null} onOpenChange={() => setSelectedWalk(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedWalk && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display">{selectedWalk.title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <img 
                    src={selectedWalk.image} 
                    alt={selectedWalk.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                  <p className="text-gray-600 mb-6">{selectedWalk.description}</p>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Clock className="text-sage" size={20} />
                      <span>{selectedWalk.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-sage" size={20} />
                      <span>{selectedWalk.difficulty}</span>
                    </div>
                  </div>

                  {selectedWalk.steps && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Les étapes du parcours</h3>
                      {selectedWalk.steps.map((step, index) => (
                        <div key={index} className="border-l-2 border-sage pl-4 py-2">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-medium">{step.title}</h4>
                            <span className="text-sm text-gray-500">{step.duration}</span>
                          </div>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Predefined;