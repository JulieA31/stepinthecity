import jsPDF from "jspdf";

export const addFooter = async (pdf: jsPDF, pageWidth: number, pageHeight: number) => {
  const margin = 20;
  const footerHeight = 30;
  const yPosition = pageHeight - footerHeight;
  
  try {
    // Ajouter une ligne de séparation
    pdf.setDrawColor("#E5E7EB");
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);

    // Ajouter le logo
    const logoUrl = "/lovable-uploads/1d570795-c96a-447c-a27a-1b240ba72131.png";
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const base64Logo = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    // Calculer les dimensions du logo
    const logoHeight = 12; // Réduit la hauteur du logo
    const logoWidth = 24; // Maintient le ratio
    
    // Centrer les éléments horizontalement
    const totalWidth = pageWidth - (2 * margin);
    const contentWidth = logoWidth + pdf.getTextWidth("Step In The City") + 5 + pdf.getTextWidth("https://stepinthecity.me");
    const startX = margin + (totalWidth - contentWidth) / 2;
    
    const logoX = startX;
    const logoY = yPosition + (footerHeight - logoHeight) / 2 + 1; // Ajuste la position verticale

    pdf.addImage(base64Logo, "PNG", logoX, logoY, logoWidth, logoHeight);

    // Ajouter le texte
    pdf.setFont("Inter");
    pdf.setFontSize(10);
    pdf.setTextColor("#6B7280");
    
    const websiteText = "Step In The City";
    const websiteUrl = "https://stepinthecity.me";
    
    const textY = yPosition + footerHeight / 2;
    const textX = logoX + logoWidth + 5;

    pdf.text(websiteText, textX, textY);
    pdf.setTextColor("#FF69B4");
    pdf.text(websiteUrl, textX + pdf.getTextWidth(websiteText) + 5, textY);
  } catch (error) {
    console.error("Error adding footer:", error);
  }
};