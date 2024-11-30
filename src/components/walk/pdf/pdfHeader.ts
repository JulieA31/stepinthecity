import jsPDF from "jspdf";
import { getImageForWalk } from "@/utils/walkImages";

export const addHeader = async (pdf: jsPDF, walkTitle: string, pageWidth: number, margin: number) => {
  const maxImageWidth = pageWidth - (2 * margin);
  const maxHeaderHeight = pdf.internal.pageSize.height / 6; // Un sixième de la page
  
  try {
    // Ajouter le bandeau coloré avec une couleur plus claire
    pdf.setFillColor("#E5E7EB"); // Gris très clair pour que le logo soit visible
    pdf.rect(0, 0, 15, pageWidth, "F");
    
    // Ajouter le logo dans le bandeau
    const logoUrl = "/lovable-uploads/1d570795-c96a-447c-a27a-1b240ba72131.png";
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const base64Logo = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    // Dimensions du logo dans le bandeau (réduites de 10% supplémentaires)
    const logoHeight = 9.56;
    const logoWidth = 19.12;
    const logoX = 5;
    const logoY = 2.5;

    pdf.addImage(base64Logo, "PNG", logoX, logoY, logoWidth, logoHeight);
    
    // Ajouter le titre "Mon Carnet de Route"
    pdf.setFont("Playfair Display");
    pdf.setFontSize(16);
    pdf.setTextColor("#2D3436");
    const titleText = "Mon Carnet de Route";
    const titleWidth = pdf.getTextWidth(titleText);
    pdf.text(titleText, (pageWidth - titleWidth) / 2, 10);
    
    // Ajouter l'image de couverture
    const coverImageUrl = getImageForWalk(walkTitle);
    const coverResponse = await fetch(coverImageUrl);
    const coverBlob = await coverResponse.blob();
    const base64data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(coverBlob);
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
