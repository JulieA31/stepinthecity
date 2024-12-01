import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WalkDetailsDialogProps {
  walk: any;
  isOpen: boolean;
  onClose: () => void;
  getImageForWalk: (title: string) => string;
  getStepsForWalk: (title: string) => any[];
}

const WalkDetailsDialog = ({
  walk,
  isOpen,
  onClose,
  getImageForWalk,
  getStepsForWalk,
}: WalkDetailsDialogProps) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const { t } = useLanguage();

  if (!walk) return null;

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

  const steps = getStepsForWalk(walk.title);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t(getTranslationKey(walk.title))}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <img
            src={getImageForWalk(walk.title)}
            alt={t(getTranslationKey(walk.title))}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {t("duration")}: {walk.duration}
                </p>
                <p className="text-sm font-medium">
                  {t("difficulty")}: {t(walk.difficulty.toLowerCase())}
                </p>
              </div>

              {hasAudio && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {t("audioGuide")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                  >
                    {audioEnabled ? (
                      <Volume2 className="h-5 w-5 text-primary" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("routeSteps")}</h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h4 className="font-medium">{t(step.title)}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t(step.description)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{step.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalkDetailsDialog;