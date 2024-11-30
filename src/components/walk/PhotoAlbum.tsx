import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SavedWalk, WalkMemory } from "@/types/walk";
import ShareButton from "./ShareButton";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        .select('id, share_link')
        .eq('saved_walk_id', walk.id);

      if (fetchError) {
        throw fetchError;
      }

      const existingAlbum = existingAlbums?.[0];
      if (existingAlbum?.share_link) {
        window.open(`${window.location.origin}/album/${existingAlbum.share_link}`, '_blank');
        return;
      }

      // Create a new album
      const { data: album, error: insertError } = await supabase
        .from('photo_albums')
        .insert({
          user_id: session.user.id,
          saved_walk_id: walk.id,
          title: walk.walk_title,
          location: walk.city,
          description: `Album photo de ma balade à ${walk.city}`,
        })
        .select('share_link')
        .single();

      if (insertError) throw insertError;

      window.open(`${window.location.origin}/album/${album.share_link}`, '_blank');

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

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Génération du PDF",
        description: "Le PDF est en cours de génération...",
      });

      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add title
      pdf.setFontSize(24);
      pdf.text(walk.walk_title, 20, 20);

      // Add city and date
      pdf.setFontSize(14);
      const date = format(new Date(walk.created_at), "d MMMM yyyy", { locale: fr });
      pdf.text(`${walk.city} - ${date}`, 20, 30);

      let yPosition = 50;

      // Add memories
      for (let i = 0; i < memories.length; i++) {
        const memory = memories[i];

        // Add some spacing between memories
        if (i > 0) {
          yPosition += 10;
        }

        // Check if we need a new page
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        try {
          // Convert image URL to base64
          const response = await fetch(memory.photo_url);
          const blob = await response.blob();
          const reader = new FileReader();

          await new Promise((resolve) => {
            reader.onloadend = async () => {
              const base64data = reader.result as string;
              
              // Add image
              pdf.addImage(
                base64data,
                "JPEG",
                20,
                yPosition,
                170,
                100
              );

              // Add description if exists
              if (memory.description) {
                pdf.setFontSize(12);
                pdf.text(memory.description, 20, yPosition + 110);
              }

              yPosition += 120;
              resolve(null);
            };
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Error processing image:", error);
          continue;
        }
      }

      // Save the PDF
      pdf.save(`Album_${walk.walk_title}.pdf`);

      toast({
        title: "Succès",
        description: "Le PDF a été généré avec succès",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Download className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={generatePhotoAlbum}>
                  Créer l'album en ligne
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  Télécharger en PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>Exporter mon album</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ShareButton walk={walk} />
    </div>
  );
};

export default PhotoAlbum;