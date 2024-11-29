import { MapPin, Clock, Users, Volume2 } from "lucide-react";
import { useState } from "react";

const walks = [
  {
    title: "Sur les pas de Victor Hugo",
    duration: "2h30",
    difficulty: "Facile",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    description: "Découvrez les lieux qui ont inspiré les plus grandes œuvres de Victor Hugo",
    hasAudio: true
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

  const toggleAudio = (title: string) => {
    setAudioEnabled(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="min-h-screen bg-secondary pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-12">
          <img 
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
            alt="Walking person logo" 
            className="w-24 h-24 object-cover rounded-full border-4 border-sage"
          />
        </div>

        <h1 className="text-4xl font-display text-text mb-8">Parcours prédéfinis à Paris</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {walks.map((walk, index) => (
            <div key={index} className="card hover:scale-105 transition-transform duration-200">
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
                      onClick={() => toggleAudio(walk.title)}
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
      </div>
    </div>
  );
};

export default Predefined;