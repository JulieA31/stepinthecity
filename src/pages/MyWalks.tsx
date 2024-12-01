import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SavedWalk from "@/components/SavedWalk";
import { useToast } from "@/components/ui/use-toast";
import { SavedWalk as SavedWalkType, WalkMemory } from "@/types/walk";
import { useLanguage } from "@/contexts/LanguageContext";

const MyWalks = () => {
  const [walks, setWalks] = useState<SavedWalkType[]>([]);
  const [memories, setMemories] = useState<{ [key: string]: WalkMemory[] }>({});
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedWalk, setSelectedWalk] = useState<string | null>(null);
  const [newMemory, setNewMemory] = useState<{ description: string; file: File | null }>({
    description: "",
    file: null,
  });

  useEffect(() => {
    fetchWalks();
  }, []);

  const fetchWalks = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: walksData, error: walksError } = await supabase
      .from('saved_walks')
      .select('*')
      .order('created_at', { ascending: false });

    if (walksError) {
      console.error('Error fetching walks:', walksError);
      return;
    }

    if (walksData) {
      setWalks(walksData);
      // Fetch memories for each walk
      walksData.forEach(async (walk) => {
        const { data: memoriesData } = await supabase
          .from('walk_memories')
          .select('*')
          .eq('saved_walk_id', walk.id)
          .order('created_at', { ascending: false });

        if (memoriesData) {
          setMemories(prev => ({
            ...prev,
            [walk.id]: memoriesData
          }));
        }
      });
    }
  };

  const handleDelete = async (walkId: string) => {
    const { error } = await supabase
      .from('saved_walks')
      .delete()
      .eq('id', walkId);

    if (error) {
      toast({
        title: t("error"),
        description: t("errorDeletingRoute"),
        variant: "destructive",
      });
      return;
    }

    setWalks(walks.filter(walk => walk.id !== walkId));
    toast({
      title: t("success"),
      description: t("routeDeleted"),
    });
  };

  const handleAddMemory = async () => {
    if (!selectedWalk || !newMemory.file) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Upload the file to storage
    const fileExt = newMemory.file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('walk_memories')
      .upload(fileName, newMemory.file);

    if (uploadError) {
      toast({
        title: t("error"),
        description: t("errorUploadingPhoto"),
        variant: "destructive",
      });
      return;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('walk_memories')
      .getPublicUrl(fileName);

    // Create the memory record
    const { error: memoryError } = await supabase
      .from('walk_memories')
      .insert({
        user_id: session.user.id,
        saved_walk_id: selectedWalk,
        photo_url: publicUrl,
        description: newMemory.description
      });

    if (memoryError) {
      toast({
        title: t("error"),
        description: t("errorAddingPhoto"),
        variant: "destructive",
      });
      return;
    }

    // Refresh memories for this walk
    const { data: updatedMemories } = await supabase
      .from('walk_memories')
      .select('*')
      .eq('saved_walk_id', selectedWalk)
      .order('created_at', { ascending: false });

    if (updatedMemories) {
      setMemories(prev => ({
        ...prev,
        [selectedWalk]: updatedMemories
      }));
    }

    // Reset form
    setNewMemory({ description: "", file: null });
    setSelectedWalk(null);

    toast({
      title: t("success"),
      description: t("photoAdded"),
    });
  };

  if (!walks.length) {
    return (
      <div className="min-h-screen bg-secondary pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display text-text mb-8 text-center">
            {t("myRoutes")}
          </h1>
          <p className="text-center text-gray-600 mb-4">
            {t("noSavedRoutes")}
          </p>
          <div className="text-center">
            <a href="/predefined" className="text-primary hover:underline">
              {t("startExploring")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pt-32">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-display text-text mb-8 text-center">
          {t("myRoutes")}
        </h1>
        <div className="grid gap-8">
          {walks.map((walk) => (
            <SavedWalk
              key={walk.id}
              walk={walk}
              memories={memories[walk.id] || []}
              onDelete={() => handleDelete(walk.id)}
              onAddMemory={{
                selectedWalk,
                setSelectedWalk,
                newMemory,
                setNewMemory,
                handleAddMemory
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyWalks;