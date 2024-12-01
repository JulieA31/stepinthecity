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
  vaticanSteps,
  surLesTracesDuPasseSteps,
  entreTerreMerSteps,
  marseilleArtsSteps,
  lyonSieclesSteps,
  lyonRhoneSaoneSteps,
  lyonGourmandSteps,
  lyonGuignolSteps,
  toulouseHistoriqueSteps,
  toulouseScienceSteps,
  toulouseGastronomieSteps,
  toulouseRugbySteps,
  niceHistoriqueSteps,
  niceArtistiqueSteps,
  niceNaturelSteps,
  veniseHistoriqueSteps,
  veniseRomantiqueSteps,
  veniseArtistiqueSteps,
  veniseNatureArtisanatSteps,
  mediciSteps,
  renaissanceSteps,
  panoramaSteps,
  gastronomieSteps
} from "@/data/walkSteps";
import { touristicCities, cityItineraries } from "@/data/cities";
import LocationSelector from "@/components/LocationSelector";

const Predefined = () => {
  const [audioEnabled, setAudioEnabled] = useState<{ [key: string]: boolean }>({});
  const [selectedWalk, setSelectedWalk] = useState<any | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("");

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
      "Sur les pas de César": romeAntiqueSteps,
      "Rome baroque": romeBaroqueSteps,
      "Vatican et spiritualité": vaticanSteps,
      "Sur les traces du passé": surLesTracesDuPasseSteps,
      "Entre terre et mer": entreTerreMerSteps,
      "Marseille et ses arts": marseilleArtsSteps,
      "Lyon à travers les siècles": lyonSieclesSteps,
      "Lyon entre Rhône et Saône": lyonRhoneSaoneSteps,
      "Le goût de Lyon": lyonGourmandSteps,
      "Sur les pas de Guignol": lyonGuignolSteps,
      "Toulouse à travers les siècles": toulouseHistoriqueSteps,
      "Toulouse, cité de l'espace et de l'innovation": toulouseScienceSteps,
      "À la découverte des saveurs de la Ville Rose": toulouseGastronomieSteps,
      "Toulouse, capitale du rugby": toulouseRugbySteps,
      "Nice, entre mer et Histoire": niceHistoriqueSteps,
      "Nice, muse des peintres et des artistes": niceArtistiqueSteps,
      "Nice au naturel": niceNaturelSteps,
      "Venise et son passé glorieux": veniseHistoriqueSteps,
      "Venise, la ville des amoureux": veniseRomantiqueSteps,
      "Venise et ses chefs-d'œuvre": veniseArtistiqueSteps,
      "Venise et ses îles": veniseNatureArtisanatSteps,
      "Sur les traces des Médicis": mediciSteps,
      "Florence, berceau de la Renaissance": renaissanceSteps,
      "Florence et ses panoramas": panoramaSteps,
      "Saveurs et délices de Florence": gastronomieSteps
    };
    return stepsMap[title] || [];
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const renderWalks = () => {
    if (selectedCity) {
      const itineraries = cityItineraries[selectedCity];
      if (!itineraries) return null;

      return (
        <div className="mb-8">
          <h3 className="text-2xl font-display text-text mb-4">{selectedCity}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itineraries.map((walk: any, index: number) => (
              <WalkCard
                key={index}
                walk={walk}
                audioEnabled={audioEnabled[walk.title]}
                onAudioToggle={toggleAudio}
                onClick={() => setSelectedWalk(walk)}
                getImageForWalk={getImageForWalk}
                city={selectedCity}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <>
        {Object.entries(touristicCities).map(([country, cities]) => (
          <div key={country} className="mb-12">
            <h2 className="text-3xl font-display text-text mb-6">
              <span className="mr-2">{countryFlags[country]}</span>
              {country}
            </h2>
            {cities.map(city => {
              const itineraries = cityItineraries[city];
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
      </>
    );
  };

  return (
    <div className="min-h-screen bg-secondary pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-text mb-8 text-center">Choisir ton parcours thématique</h1>
        
        <div className="mb-8">
          <LocationSelector onCitySelect={handleCitySelect} />
        </div>

        <div className="mt-8">
          {renderWalks()}
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

const countryFlags: { [key: string]: string } = {
  France: "🇫🇷",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  "United Kingdom": "🇬🇧",
  Portugal: "🇵🇹"
};

export default Predefined;
