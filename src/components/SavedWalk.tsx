import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import WalkMemories from "./WalkMemories";
import AddMemoryForm from "./AddMemoryForm";
import { SavedWalk as SavedWalkType, WalkMemory } from "@/types/walk";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface SavedWalkProps {
  walk: SavedWalkType;
  memories: WalkMemory[];
  onDelete: (id: string) => void;
  onAddMemory: {
    selectedWalk: string | null;
    setSelectedWalk: (id: string | null) => void;
    newMemory: { description: string; file: File | null };
    setNewMemory: (memory: { description: string; file: File | null }) => void;
    handleAddMemory: () => void;
  };
}

const SavedWalk = ({ walk, memories, onDelete, onAddMemory }: SavedWalkProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteMemory = async (memoryId: string) => {
    const { error } = await supabase
      .from('walk_memories')
      .delete()
      .eq('id', memoryId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le souvenir",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Souvenir supprimé avec succès",
    });

    window.location.reload();
  };

  const handleAddMemoryAndClose = async () => {
    await onAddMemory.handleAddMemory();
    setIsDialogOpen(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">{walk.walk_title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(walk.id)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
        {walk.photo_url && (
          <div>
            <img
              src={walk.photo_url}
              alt={walk.walk_title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{walk.city}</p>
        
        <WalkMemories 
          memories={memories} 
          onDeleteMemory={handleDeleteMemory}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => {
                onAddMemory.setSelectedWalk(walk.id);
                setIsDialogOpen(true);
              }}
            >
              Ajouter un souvenir
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un souvenir</DialogTitle>
            </DialogHeader>
            <AddMemoryForm
              onFileChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onAddMemory.setNewMemory({
                    ...onAddMemory.newMemory,
                    file: e.target.files[0],
                  });
                }
              }}
              onDescriptionChange={(value) =>
                onAddMemory.setNewMemory({
                  ...onAddMemory.newMemory,
                  description: value,
                })
              }
              onSubmit={handleAddMemoryAndClose}
              description={onAddMemory.newMemory.description}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SavedWalk;