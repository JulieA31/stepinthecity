import { useState } from "react";
import WalkDetailsDialog from "@/components/WalkDetailsDialog";
import WalkCard from "@/components/WalkCard";
import { getImageForWalk } from "@/utils/walkImages";
import { 
  lisbonneHistoriqueSteps, 
  tramSteps, 
  saveursSteps, 
  victorHugoSteps,
  romeAntiqueSteps,
  romeBaroqueSteps,
  vaticanSteps 
} from "@/data/walkSteps";
import { touristicCities, cityItineraries } from "@/components/LocationSelector";

const countryFlags: { [key: string]: string } = {
  France: "🇫🇷",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  "United Kingdom": "🇬🇧",
  Portugal: "🇵🇹"
};

const Predefined = () => {
  const [audioEnabled, setAudioEnabled] = useState<{ [key: string]: boolean }>({});
  const [selectedWalk, setSelectedWalk] = useState<any | null>(null);

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
      "Saveurs portugaises": saveursSteps,
      "Rome antique": romeAntiqueSteps,
      "Rome baroque": romeBaroqueSteps,
      "Vatican et spiritualité": vaticanSteps
    };
    return stepsMap[title] || [];
  };

  return (
    <div className="min-h-screen bg-secondary pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-text mb-8">Tous les parcours prédéfinis</h1>
        
        {Object.entries(touristicCities).map(([country, cities]) => (
          <div key={country} className="mb-12">
            <h2 className="text-3xl font-display text-text mb-6">
              <span className="mr-2">{countryFlags[country]}</span>
              {country}
            </h2>
            {cities.map(city => {
              const itineraries = cityItineraries[city as keyof typeof cityItineraries];
              if (!itineraries) return null;
              
              return (
                <div key={city} className="mb-8">
                  <h3 className="text-2xl font-display text-text mb-4">{city}</h3>
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
                </div>
              );
            })}
          </div>
        ))}

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