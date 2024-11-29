import { useState } from "react";
import { useLocation } from "react-router-dom";
import WalkDetailsDialog from "@/components/WalkDetailsDialog";
import WalkCard from "@/components/WalkCard";
import { getImageForWalk } from "@/utils/walkImages";
import { lisbonneHistoriqueSteps, tramSteps, saveursSteps, victorHugoSteps } from "@/data/walkSteps";

const Predefined = () => {
  const [audioEnabled, setAudioEnabled] = useState<{ [key: string]: boolean }>({});
  const [selectedWalk, setSelectedWalk] = useState<any | null>(null);
  const location = useLocation();
  const { city, itineraries } = location.state || { city: "Paris", itineraries: [] };

  const toggleAudio = (title: string) => {
    setAudioEnabled(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
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

  return (
    <div className="min-h-screen bg-secondary pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-text mb-8">Parcours prédéfinis à {city}</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itineraries.map((walk: any, index: number) => (
            <WalkCard
              key={index}
              walk={walk}
              audioEnabled={audioEnabled[walk.title]}
              onAudioToggle={toggleAudio}
              onClick={() => setSelectedWalk(walk)}
              getImageForWalk={getImageForWalk}
              city={city}
            />
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