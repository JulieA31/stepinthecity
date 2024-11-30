import { WalkMemory } from "@/types/walk";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface WalkMemoriesProps {
  memories: WalkMemory[];
  onDeleteMemory?: (memoryId: string) => void;
}

const WalkMemories = ({ memories, onDeleteMemory }: WalkMemoriesProps) => {
  if (!memories?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Mes Souvenirs</h3>
      <div className="grid gap-4">
        {memories.map((memory) => (
          <div key={memory.id} className="relative group">
            <img
              src={memory.photo_url}
              alt="Souvenir"
              className="w-full h-48 object-cover rounded-lg"
            />
            {memory.description && (
              <p className="mt-2 text-sm text-gray-600">{memory.description}</p>
            )}
            {onDeleteMemory && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDeleteMemory(memory.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalkMemories;