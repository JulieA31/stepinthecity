import jsPDF from "jspdf";
import { getImageForWalk } from "@/utils/walkImages";

export const addHeader = async (pdf: jsPDF, walkTitle: string, pageWidth: number, margin: number) => {
  const maxImageWidth = pageWidth - (2 * margin);
  const maxHeaderHeight = pdf.internal.pageSize.height / 6; // Un sixième de la page
  
  try {
    // Ajouter le bandeau coloré
    pdf.setFillColor("#6B7280"); // Utilisation de la couleur theme.DEFAULT du thème
    pdf.rect(0, 0, pageWidth, 15, "F");
    
    // Ajouter le titre "Mon Carnet de Route"
    pdf.setFont("Playfair Display");
    pdf.setFontSize(16);
    pdf.setTextColor("#FFFFFF");
    const titleText = "Mon Carnet de Route";
    const titleWidth = pdf.getTextWidth(titleText);
    pdf.text(titleText, (pageWidth - titleWidth) / 2, 10);
    
    // Ajouter l'image de couverture
    const coverImageUrl = getImageForWalk(walkTitle);
    const response = await fetch(coverImageUrl);
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
    let imageWidth = maxImageWidth;
    let imageHeight = imageWidth * aspectRatio;

    // Ajuster la hauteur si elle dépasse le maximum
    if (imageHeight > maxHeaderHeight) {
      imageHeight = maxHeaderHeight;
      imageWidth = imageHeight / aspectRatio;
    }

    const xPosition = margin + (maxImageWidth - imageWidth) / 2;
    pdf.addImage(base64data, "JPEG", xPosition, 20, imageWidth, imageHeight);
    
    return 20 + imageHeight + 15; // Retourne la position Y après l'image
  } catch (error) {
    console.error("Error adding header image:", error);
    return margin + 25;
  }
};