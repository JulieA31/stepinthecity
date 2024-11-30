import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SavedWalk, WalkMemory } from "@/types/walk";

export const generatePDF = async (walk: SavedWalk, memories: WalkMemory[]): Promise<string | null> => {
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

export const downloadPDF = async (walk: SavedWalk, memories: WalkMemory[]): Promise<void> => {
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
};