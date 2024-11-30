import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SavedWalk, WalkMemory } from "@/types/walk";
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
import { useState } from "react";
import { EmailDialog } from "./email/EmailDialog";
import { generatePDF, downloadPDF } from "./pdf/generatePDF";

interface PhotoAlbumProps {
  walk: SavedWalk;
  memories: WalkMemory[];
}

const PhotoAlbum = ({ walk, memories }: PhotoAlbumProps) => {
  const { toast } = useToast();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const handleDownloadPDF = async () => {
    toast({
      title: "Génération du PDF",
      description: "Le PDF est en cours de génération...",
    });

    try {
      await downloadPDF(walk, memories);
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

  const handleSendEmail = async (email: string) => {
    try {
      const pdfBase64 = await generatePDF(walk, memories);
      if (!pdfBase64) {
        throw new Error("Impossible de générer le PDF");
      }

      const { error } = await supabase.functions.invoke('send-album-email', {
        body: {
          to: [email],
          subject: `Album photo : ${walk.walk_title}`,
          pdfBase64,
          albumTitle: walk.walk_title,
        },
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'album a été envoyé par email avec succès",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email",
        variant: "destructive",
      });
    }
  };

  return (
    <>
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
                  <DropdownMenuItem onClick={handleDownloadPDF}>
                    Télécharger en PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEmailDialogOpen(true)}>
                    Envoyer par email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p>Exporter mon album</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <EmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        onSend={handleSendEmail}
      />
    </>
  );
};

export default PhotoAlbum;