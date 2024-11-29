import { Volume2, Clock, Users, MapPin } from "lucide-react";

interface WalkCardProps {
  walk: any;
  audioEnabled: boolean;
  onAudioToggle: (title: string) => void;
  onClick: () => void;
  getImageForWalk: (title: string) => string;
  city: string;
}

const WalkCard = ({ walk, audioEnabled, onAudioToggle, onClick, getImageForWalk, city }: WalkCardProps) => {
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
            onClick={(e) => {
              e.stopPropagation();
              onAudioToggle(walk.title);
            }}
            className={`p-2 rounded-full transition-colors ${
              audioEnabled ? 'bg-primary text-white' : 'bg-gray-100'
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
  );
};

export default WalkCard;