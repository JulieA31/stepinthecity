import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMemoryUpload } from "@/hooks/useMemoryUpload";
import { WalkCard } from "@/components/WalkCard";

interface SavedWalk {
  id: string;
  walk_title: string;
  city: string;
  created_at: string;
}

interface WalkMemory {
  id: string;
  photo_url: string;
  description: string;
  created_at: string;
}

const MyWalks = () => {
  const [savedWalks, setSavedWalks] = useState<SavedWalk[]>([]);
  const [memories, setMemories] = useState<{ [key: string]: WalkMemory[] }>({});
  const [selectedWalk, setSelectedWalk] = useState<string | null>(null);
  const [newMemory, setNewMemory] = useState<{ description: string; file: File | null }>({
    description: "",
    file: null,
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      fetchSavedWalks();
    };

    checkUser();
  }, [navigate]);

  const fetchSavedWalks = async () => {
    const { data, error } = await supabase
      .from("saved_walks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos parcours enregistrés",
        variant: "destructive",
      });
      return;
    }

    setSavedWalks(data);
    data.forEach((walk) => fetchWalkMemories(walk.id));
  };

  const fetchWalkMemories = async (walkId: string) => {
    const { data, error } = await supabase
      .from("walk_memories")
      .select("*")
      .eq("saved_walk_id", walkId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les souvenirs",
        variant: "destructive",
      });
      return;
    }

    setMemories((prev) => ({ ...prev, [walkId]: data }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewMemory((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const addMemory = async () => {
    if (!selectedWalk || !newMemory.file) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un souvenir",
        variant: "destructive",
      });
      return;
    }

    const file = newMemory.file;
    const fileExt = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("walk_memories")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Erreur",
        description: "Impossible d'uploader la photo",
        variant: "destructive",
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("walk_memories")
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("walk_memories").insert({
      saved_walk_id: selectedWalk,
      photo_url: publicUrl,
      description: newMemory.description,
      user_id: session.user.id
    });

    if (dbError) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le souvenir",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Souvenir ajouté avec succès",
    });

    setNewMemory({ description: "", file: null });
    fetchWalkMemories(selectedWalk);
  };

  const deleteWalk = async (walkId: string) => {
    const { error } = await supabase
      .from("saved_walks")
      .delete()
      .eq("id", walkId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le parcours",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Parcours supprimé avec succès",
    });

    fetchSavedWalks();
  };

  return (
    <div className="min-h-screen bg-secondary pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-text mb-8">Mon Carnet de Route</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedWalks.map((walk) => (
            <Card key={walk.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">{walk.walk_title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteWalk(walk.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{walk.city}</p>
                
                <div className="space-y-4">
                  {memories[walk.id]?.map((memory) => (
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

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => setSelectedWalk(walk.id)}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Ajouter un souvenir
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un souvenir</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="photo">Photo</Label>
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newMemory.description}
                          onChange={(e) =>
                            setNewMemory((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <Button onClick={addMemory} className="w-full">
                        Sauvegarder
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyWalks;