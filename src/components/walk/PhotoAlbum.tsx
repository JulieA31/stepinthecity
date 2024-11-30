import { Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SavedWalk, WalkMemory } from "@/types/walk";
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
import { useState } from "react";
import { EmailDialog } from "./email/EmailDialog";

interface PhotoAlbumProps {
  walk: SavedWalk;
  memories: WalkMemory[];
}

const PhotoAlbum = ({ walk, memories }: PhotoAlbumProps) => {
  const { toast } = useToast();
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  const generatePDF = async (): Promise<string | null> => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.setFontSize(24);
      pdf.text(walk.walk_title, 20, 20);

      pdf.setFontSize(14);
      const date = format(new Date(walk.created_at), "d MMMM yyyy", { locale: fr });
      pdf.text(`${walk.city} - ${date}`, 20, 30);

      let yPosition = 50;

      for (let i = 0; i < memories.length; i++) {
        const memory = memories[i];
        if (i > 0) yPosition += 10;
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        try {
          const response = await fetch(memory.photo_url);
          const blob = await response.blob();
          const base64data = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });

          pdf.addImage(base64data, "JPEG", 20, yPosition, 170, 100);

          if (memory.description) {
            pdf.setFontSize(12);
            pdf.text(memory.description, 20, yPosition + 110);
          }

          yPosition += 120;
        } catch (error) {
          console.error("Error processing image:", error);
          continue;
        }
      }

      return pdf.output('datauristring').split(',')[1];
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    toast({
      title: "Génération du PDF",
      description: "Le PDF est en cours de génération...",
    });

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.setFontSize(24);
      pdf.text(walk.walk_title, 20, 20);

      pdf.setFontSize(14);
      const date = format(new Date(walk.created_at), "d MMMM yyyy", { locale: fr });
      pdf.text(`${walk.city} - ${date}`, 20, 30);

      let yPosition = 50;

      for (let i = 0; i < memories.length; i++) {
        const memory = memories[i];
        if (i > 0) yPosition += 10;
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        try {
          const response = await fetch(memory.photo_url);
          const blob = await response.blob();
          const base64data = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });

          pdf.addImage(base64data, "JPEG", 20, yPosition, 170, 100);

          if (memory.description) {
            pdf.setFontSize(12);
            pdf.text(memory.description, 20, yPosition + 110);
          }

          yPosition += 120;
        } catch (error) {
          console.error("Error processing image:", error);
          continue;
        }
      }

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

  const handleSendEmail = async (email: string) => {
    try {
      const pdfBase64 = await generatePDF();
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
