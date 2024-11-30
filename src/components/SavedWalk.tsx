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
import PhotoAlbum from "./walk/PhotoAlbum";
import { classiquesParisSteps, baladeGastronomiqueSteps } from "@/data/walks/paris";
import { lisbonneHistoriqueSteps, tramSteps, saveursSteps } from "@/data/walks/lisbonne";
import { romeAntiqueSteps, romeBaroqueSteps, vaticanSteps } from "@/data/walks/rome";

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

const formatCityName = (city: string) => {
  const cityMap: { [key: string]: string } = {
    'paris': 'Paris',
    'rome': 'Rome',
    'lisbonne': 'Lisbonne'
  };
  return cityMap[city.toLowerCase()] || city;
};

const getStepsForWalk = (walkTitle: string) => {
  const stepsMap: { [key: string]: any[] } = {
    'Les classiques de Paris': classiquesParisSteps,
    'Balade gastronomique': baladeGastronomiqueSteps,
    'Lisbonne historique': lisbonneHistoriqueSteps,
    'Le tram 28': tramSteps,
    'Saveurs de Lisbonne': saveursSteps,
    'La Rome antique': romeAntiqueSteps,
    'La Rome baroque': romeBaroqueSteps,
    'Le Vatican': vaticanSteps
  };
  return stepsMap[walkTitle] || [];
};

const SavedWalk = ({ walk, memories, onDelete, onAddMemory }: SavedWalkProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const steps = getStepsForWalk(walk.walk_title);

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
          <div className="flex items-center gap-2">
            <PhotoAlbum walk={walk} memories={memories} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(walk.id)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              {walk.photo_url && (
                <img
                  src={walk.photo_url}
                  alt={walk.walk_title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <p className="text-gray-600 mt-2">{formatCityName(walk.city)}</p>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">{walk.walk_title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Ville</h3>
                <p>{formatCityName(walk.city)}</p>
              </div>
              
              {steps.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Étapes du parcours</h3>
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        <p className="text-sm text-gray-500 mt-2">{step.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-4">Mes Souvenirs</h3>
                <WalkMemories 
                  memories={memories} 
                  onDeleteMemory={handleDeleteMemory}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
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