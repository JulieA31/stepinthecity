import { Card } from "@/components/ui/card";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface WalkCardProps {
  walk: {
    title: string;
    description: string;
    duration: string;
    difficulty: string;
  };
  audioEnabled: boolean;
  onAudioToggle: (title: string) => void;
  onClick: () => void;
  getImageForWalk: (title: string) => string;
  city: string;
}

const WalkCard = ({
  walk,
  audioEnabled,
  onAudioToggle,
  onClick,
  getImageForWalk,
  city
}: WalkCardProps) => {
  const { t } = useLanguage();

  const hasAudio = walk.title === "Les classiques de Paris" || 
                  walk.title === "Sur les pas de Victor Hugo" || 
                  walk.title === "Sur les pas de César";

  const getTranslationKey = (title: string) => {
    const keyMap: { [key: string]: string } = {
      "Les classiques de Paris": "classicsParis",
      "Sur les pas de Victor Hugo": "victorHugoSteps",
      "Balade gastronomique": "gastronomicWalk",
      "Sur les traces du passé": "marseilleHistory",
      "Entre terre et mer": "marseilleLandSea",
      "Marseille et ses arts": "marseilleArts",
      "Lyon à travers les siècles": "lyonHistory",
      "Lyon entre Rhône et Saône": "lyonRivers",
      "Le goût de Lyon": "lyonGastronomy",
      "Sur les pas de Guignol": "lyonGuignol",
      "Toulouse à travers les siècles": "toulouseHistory",
      "Toulouse, cité de l'espace et de l'innovation": "toulouseSpace",
      "À la découverte des saveurs de la Ville Rose": "toulouseGastronomy",
      "Toulouse, capitale du rugby": "toulouseRugby",
      "Nice, entre mer et Histoire": "niceHistory",
      "Nice, muse des peintres et des artistes": "niceArt",
      "Nice au naturel": "niceNature"
    };
    return keyMap[title] || title;
  };

  const getDescriptionKey = (title: string) => {
    return getTranslationKey(title) + "Desc";
  };

  return (
    <Card className="overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
      <div className="relative" onClick={onClick}>
        <img
          src={getImageForWalk(walk.title)}
          alt={t(getTranslationKey(walk.title))}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-medium leading-tight">
            {t(getTranslationKey(walk.title))}
          </h3>
          {hasAudio && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 -mt-1 -mr-2"
              onClick={(e) => {
                e.stopPropagation();
                onAudioToggle(walk.title);
              }}
            >
              {audioEnabled ? (
                <Volume2 className="h-5 w-5 text-primary" />
              ) : (
                <VolumeX className="h-5 w-5 text-gray-400" />
              )}
            </Button>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {t(getDescriptionKey(walk.title))}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{t("duration")}: {walk.duration}</span>
          <span>{t("difficulty")}: {t(walk.difficulty.toLowerCase())}</span>
        </div>
      </div>
    </Card>
  );
};

export default WalkCard;