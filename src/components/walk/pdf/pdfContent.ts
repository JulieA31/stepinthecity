import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SavedWalk, WalkMemory } from "@/types/walk";
import { 
  classiquesParisSteps, 
  baladeGastronomiqueSteps 
} from "@/data/walks/paris";
import { 
  lisbonneHistoriqueSteps, 
  tramSteps, 
  saveursSteps 
} from "@/data/walks/lisbonne";
import { 
  romeAntiqueSteps, 
  romeBaroqueSteps, 
  vaticanSteps 
} from "@/data/walks/rome";

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

export const addContent = async (
  pdf: jsPDF, 
  walk: SavedWalk, 
  memories: WalkMemory[], 
  startY: number,
  margin: number,
  contentWidth: number
) => {
  let yPosition = startY;

  // Titre du parcours
  pdf.setFont("Playfair Display");
  pdf.setFontSize(24);
  pdf.setTextColor("#2D3436");
  pdf.text(walk.walk_title, margin, yPosition);
  yPosition += 15;

  // Date et ville
  pdf.setFont("Inter");
  pdf.setFontSize(14);
  pdf.setTextColor("#6B7280");
  const date = format(new Date(walk.created_at), "d MMMM yyyy", { locale: fr });
  pdf.text(`${formatCityName(walk.city)} - ${date}`, margin, yPosition);
  yPosition += 20;

  // Étapes du parcours
  const steps = getStepsForWalk(walk.walk_title);
  if (steps && steps.length > 0) {
    pdf.setFont("Playfair Display");
    pdf.setFontSize(16);
    pdf.setTextColor("#2D3436");
    pdf.text("Étapes du parcours", margin, yPosition);
    yPosition += 10;

    pdf.setFont("Inter");
    pdf.setFontSize(12);
    for (const step of steps) {
      if (yPosition > pdf.internal.pageSize.height - 50) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setTextColor("#2D3436");
      pdf.text(step.title, margin, yPosition);
      yPosition += 6;

      pdf.setTextColor("#6B7280");
      const descriptionLines = pdf.splitTextToSize(step.description, contentWidth);
      pdf.text(descriptionLines, margin, yPosition);
      yPosition += (6 * descriptionLines.length);

      pdf.text(step.duration, margin, yPosition);
      yPosition += 10;
    }
  }

  return yPosition;
};