import jsPDF from "jspdf";
import { SavedWalk, WalkMemory } from "@/types/walk";
import { addHeader } from "./pdfHeader";
import { addFooter } from "./pdfFooter";
import { addContent } from "./pdfContent";

export const generatePDF = async (walk: SavedWalk, memories: WalkMemory[]): Promise<string | null> => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Configuration initiale
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);

    // Ajouter le header
    let yPosition = await addHeader(pdf, walk.walk_title, pageWidth, margin);

    // Ajouter le contenu principal
    yPosition = await addContent(pdf, walk, memories, yPosition, margin, contentWidth);

    // Souvenirs
    if (memories.length > 0) {
      pdf.addPage();
      yPosition = margin;

      pdf.setFont("Playfair Display");
      pdf.setFontSize(16);
      pdf.setTextColor("#2D3436");
      pdf.text("Mes Souvenirs", margin, yPosition);
      yPosition += 15;

      for (const memory of memories) {
        try {
          if (yPosition > pdf.internal.pageSize.height - 70) {
            pdf.addPage();
            yPosition = margin;
          }

          const response = await fetch(memory.photo_url);
          const blob = await response.blob();
          const base64data = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });

          const img = new Image();
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = base64data;
          });
          
          const aspectRatio = img.height / img.width;
          const imageWidth = Math.min(contentWidth * 0.8, contentWidth);
          const imageHeight = imageWidth * aspectRatio;

          pdf.addImage(base64data, "JPEG", margin, yPosition, imageWidth, imageHeight);
          yPosition += imageHeight + 10;

          if (memory.description) {
            pdf.setFont("Inter");
            pdf.setFontSize(12);
            pdf.setTextColor("#6B7280");
            const descriptionLines = pdf.splitTextToSize(memory.description, contentWidth);
            pdf.text(descriptionLines, margin, yPosition);
            yPosition += (6 * descriptionLines.length) + 15;
          } else {
            yPosition += 15;
          }
        } catch (error) {
          console.error("Error processing memory image:", error);
          continue;
        }
      }
    }

    // Ajouter le footer sur chaque page
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      await addFooter(pdf, pageWidth, pageHeight);
    }

    return pdf.output('datauristring').split(',')[1];
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
};

export const downloadPDF = async (walk: SavedWalk, memories: WalkMemory[]): Promise<void> => {
  try {
    const pdfBase64 = await generatePDF(walk, memories);
    if (!pdfBase64) {
      throw new Error("Failed to generate PDF");
    }

    const binary = atob(pdfBase64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    
    const blob = new Blob([array], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Album_${walk.walk_title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
};