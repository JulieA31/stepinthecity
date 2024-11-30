import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SavedWalk, WalkMemory } from "@/types/walk";
import ShareButton from "./ShareButton";

interface PhotoAlbumProps {
  walk: SavedWalk;
  memories: WalkMemory[];
}

const PhotoAlbum = ({ walk, memories }: PhotoAlbumProps) => {
  const { toast } = useToast();

  const generatePhotoAlbum = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer un album",
          variant: "destructive",
        });
        return;
      }

      // Check if an album already exists
      const { data: existingAlbums, error: fetchError } = await supabase
        .from('photo_albums')
        .select('id')
        .eq('saved_walk_id', walk.id);

      if (fetchError) throw fetchError;

      const existingAlbum = existingAlbums?.[0];
      
      if (existingAlbum) {
        window.open(`${window.location.origin}/album/${existingAlbum.id}`, '_blank');
        return;
      }

      // Create a new album
      const { data: album, error: insertError } = await supabase
        .from('photo_albums')
        .insert({
          user_id: session.user.id,
          saved_walk_id: walk.id,
          title: walk.walk_title,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      window.open(`${window.location.origin}/album/${album.id}`, '_blank');

      toast({
        title: "Succès",
        description: "Album photo créé avec succès",
      });
    } catch (error) {
      console.error('Error generating photo album:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'album photo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={generatePhotoAlbum}
        title="Générer l'album photo"
      >
        <Download className="h-5 w-5" />
      </Button>
      <ShareButton walk={walk} />
    </div>
  );
};

export default PhotoAlbum;