import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SavedWalk as SavedWalkType, WalkMemory } from "@/types/walk";
import WalkMemories from "./WalkMemories";
import AddMemoryForm from "./AddMemoryForm";

interface SavedWalkProps {
  walk: SavedWalkType;
  memories: WalkMemory[];
  onDelete: (walkId: string) => void;
  onAddMemory: {
    selectedWalk: string | null;
    setSelectedWalk: (walkId: string | null) => void;
    newMemory: { description: string; file: File | null };
    setNewMemory: (memory: { description: string; file: File | null }) => void;
    handleAddMemory: () => void;
  };
}

const SavedWalk = ({ walk, memories, onDelete, onAddMemory }: SavedWalkProps) => {
  const [showAddMemory, setShowAddMemory] = useState(false);

  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">{walk.walk_title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{walk.city}</p>
        
        <WalkMemories memories={memories} />
      </CardContent>

      <CardFooter className="flex justify-between gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Supprimer</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le parcours et tous les souvenirs associés seront supprimés définitivement.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(walk.id)}>
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button 
          variant="outline" 
          onClick={() => {
            onAddMemory.setSelectedWalk(walk.id);
            setShowAddMemory(true);
          }}
        >
          Ajouter un souvenir
        </Button>
      </CardFooter>

      <AddMemoryForm
        isOpen={showAddMemory}
        onClose={() => {
          setShowAddMemory(false);
          onAddMemory.setSelectedWalk(null);
          onAddMemory.setNewMemory({ description: "", file: null });
        }}
        memory={onAddMemory.newMemory}
        setMemory={onAddMemory.setNewMemory}
        onSubmit={() => {
          onAddMemory.handleAddMemory();
          setShowAddMemory(false);
        }}
      />
    </Card>
  );
};

export default SavedWalk;