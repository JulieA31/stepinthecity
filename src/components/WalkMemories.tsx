import { WalkMemory } from "@/types/walk";

interface WalkMemoriesProps {
  memories: WalkMemory[];
}

const WalkMemories = ({ memories }: WalkMemoriesProps) => {
  if (!memories?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Mes Souvenirs</h3>
      <div className="grid gap-4">
        {memories.map((memory) => (
          <div key={memory.id} className="relative">
            <img
              src={memory.photo_url}
              alt="Souvenir"
              className="w-full h-48 object-cover rounded-lg"
            />
            {memory.description && (
              <p className="mt-2 text-sm text-gray-600">{memory.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalkMemories;