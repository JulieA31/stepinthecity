import { Volume2, Clock, Users, MapPin } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

interface WalkCardProps {
  walk: any;
  audioEnabled: boolean;
  onAudioToggle: (title: string) => void;
  onClick: () => void;
  getImageForWalk: (title: string) => string;
  city: string;
}

const WalkCard = ({ walk, audioEnabled, onAudioToggle, onClick, getImageForWalk, city }: WalkCardProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleAudioToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const audioPath = `/audio/${walk.title.toLowerCase().replace(/ /g, '-')}.mp3`;
    console.log('Tentative de lecture audio:', audioPath);
    
    if (!audioRef.current) {
      console.log('Création d\'un nouvel élément audio');
      audioRef.current = new Audio(audioPath);
      
      audioRef.current.onerror = (e) => {
        console.error('Erreur de chargement audio:', e);
        toast({
          title: "Erreur",
          description: "La narration audio n'est pas disponible pour ce parcours.",
          variant: "destructive"
        });
        setIsPlaying(false);
      };
    }

    if (isPlaying) {
      console.log('Pause de l\'audio');
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        console.log('Tentative de lecture');
        await audioRef.current.play();
        console.log('Lecture démarrée avec succès');
        setIsPlaying(true);
        onAudioToggle(walk.title);
      } catch (error) {
        console.error('Erreur lors de la lecture:', error);
        toast({
          title: "Erreur",
          description: "Impossible de lancer la narration audio.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div 
      className="card hover:scale-105 transition-transform duration-200 cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden"
      onClick={onClick}
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
            onClick={handleAudioToggle}
            className={`p-2 rounded-full transition-colors ${
              isPlaying ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
            aria-label={isPlaying ? "Arrêter la narration" : "Lancer la narration"}
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
  );
};

export default WalkCard;