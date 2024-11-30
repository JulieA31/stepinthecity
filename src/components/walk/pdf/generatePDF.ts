import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SavedWalk, WalkMemory } from "@/types/walk";
import { classiquesParisSteps, baladeGastronomiqueSteps } from "@/data/walks/paris";
import { lisbonneHistoriqueSteps, tramSteps, saveursSteps } from "@/data/walks/lisbonne";
import { romeAntiqueSteps, romeBaroqueSteps, vaticanSteps } from "@/data/walks/rome";
import { getImageForWalk } from "@/utils/walkImages";

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

const formatCityName = (city: string) => {
  const cityMap: { [key: string]: string } = {
    'paris': 'Paris',
    'rome': 'Rome',
    'lisbonne': 'Lisbonne'
  };
  return cityMap[city.toLowerCase()] || city;
};

// Fonction pour charger la police Playfair Display
const loadPlayfairDisplayFont = async () => {
  const response = await fetch('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
  const css = await response.text();
  const fontUrl = css.match(/url\((.*?)\)/)?.[1];
  if (fontUrl) {
    const fontResponse = await fetch(fontUrl);
    const fontArrayBuffer = await fontResponse.arrayBuffer();
    return fontArrayBuffer;
  }
  return null;
};

export const generatePDF = async (walk: SavedWalk, memories: WalkMemory[]): Promise<string | null> => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Ajout de la police Playfair Display
    const fontData = await loadPlayfairDisplayFont();
    if (fontData) {
      pdf.addFont(fontData, "PlayfairDisplay", "normal");
      pdf.setFont("PlayfairDisplay");
    }

    // Configuration initiale
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yPosition = margin;

    // Ajout de l'image de couverture
    try {
      const coverImageUrl = getImageForWalk(walk.walk_title);
      const response = await fetch(coverImageUrl);
      const blob = await response.blob();
      const base64data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const coverHeight = 60;
      pdf.addImage(base64data, "JPEG", margin, yPosition, contentWidth, coverHeight);
      yPosition += coverHeight + 10;
    } catch (error) {
      console.error("Error adding cover image:", error);
    }

    // Titre du parcours
    pdf.setFontSize(24);
    pdf.text(walk.walk_title, margin, yPosition);
    yPosition += 10;

    // Date et ville avec icône
    pdf.setFontSize(14);
    const date = format(new Date(walk.created_at), "d MMMM yyyy", { locale: fr });
    pdf.addImage("/lovable-uploads/map-pin.png", "PNG", margin, yPosition - 5, 5, 5);
    pdf.text(`${formatCityName(walk.city)} - ${date}`, margin + 8, yPosition);
    yPosition += 20;

    // Étapes du parcours
    const steps = getStepsForWalk(walk.walk_title);
    if (steps && steps.length > 0) {
      pdf.setFontSize(16);
      pdf.addImage("/lovable-uploads/map.png", "PNG", margin, yPosition - 5, 5, 5);
      pdf.text("Étapes du parcours", margin + 8, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      for (const step of steps) {
        if (yPosition > pdf.internal.pageSize.height - 30) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFont("PlayfairDisplay", "bold");
        pdf.text(step.title, margin, yPosition);
        yPosition += 6;

        pdf.setFont("PlayfairDisplay", "normal");
        const descriptionLines = pdf.splitTextToSize(step.description, contentWidth);
        pdf.text(descriptionLines, margin, yPosition);
        yPosition += (6 * descriptionLines.length);

        pdf.addImage("/lovable-uploads/clock.png", "PNG", margin, yPosition - 5, 5, 5);
        pdf.text(step.duration, margin + 8, yPosition);
        yPosition += 10;
      }
    }

    // Souvenirs
    if (memories.length > 0) {
      pdf.addPage();
      yPosition = margin;

      pdf.setFontSize(16);
      pdf.addImage("/lovable-uploads/gallery.png", "PNG", margin, yPosition - 5, 5, 5);
      pdf.text("Mes Souvenirs", margin + 8, yPosition);
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

          const imgHeight = 60;
          pdf.addImage(base64data, "JPEG", margin, yPosition, contentWidth, imgHeight);
          yPosition += imgHeight + 5;

          if (memory.description) {
            pdf.setFontSize(12);
            const descriptionLines = pdf.splitTextToSize(memory.description, contentWidth);
            pdf.text(descriptionLines, margin, yPosition);
            yPosition += (6 * descriptionLines.length) + 10;
          } else {
            yPosition += 10;
          }
        } catch (error) {
          console.error("Error processing memory image:", error);
          continue;
        }
      }
    }

    return pdf.output('datauristring').split(',')[1];
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
};

export const downloadPDF = async (walk: SavedWalk, memories: WalkMemory[]): Promise<void> => {
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
};