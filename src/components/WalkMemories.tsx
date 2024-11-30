import { WalkMemory } from "@/types/walk";
import { Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";

interface WalkMemoriesProps {
  memories: WalkMemory[];
  onDeleteMemory?: (memoryId: string) => void;
}

const WalkMemories = ({ memories, onDeleteMemory }: WalkMemoriesProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!memories?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Mes Souvenirs</h3>
      <div className="grid gap-4">
        {memories.map((memory) => (
          <div key={memory.id} className="relative group">
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={memory.photo_url}
                  alt="Souvenir"
                  className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => setSelectedImage(memory.photo_url)}
                />
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <div className="relative">
                  <img
                    src={memory.photo_url}
                    alt="Souvenir en grand format"
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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