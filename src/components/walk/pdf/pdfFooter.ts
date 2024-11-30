import jsPDF from "jspdf";

export const addFooter = async (pdf: jsPDF, pageWidth: number, pageHeight: number) => {
  const margin = 20;
  const footerHeight = 30;
  const yPosition = pageHeight - footerHeight;
  
  try {
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
    const logoHeight = 20;
    const logoWidth = 40;
    const logoX = margin;
    const logoY = yPosition + (footerHeight - logoHeight) / 2;

    pdf.addImage(base64Logo, "PNG", logoX, logoY, logoWidth, logoHeight);

    // Ajouter le texte
    pdf.setFont("Inter");
    pdf.setFontSize(10);
    pdf.setTextColor("#6B7280");
    
    const websiteText = "Step In The City";
    const websiteUrl = "https://stepinthecity.me";
    
    const textX = logoX + logoWidth + 10;
    const textY = yPosition + footerHeight / 2;

    pdf.text(websiteText, textX, textY);
    pdf.setTextColor("#FF69B4");
    pdf.text(websiteUrl, textX + pdf.getTextWidth(websiteText) + 5, textY);

    // Ajouter une ligne de séparation
    pdf.setDrawColor("#E5E7EB");
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  } catch (error) {
    console.error("Error adding footer:", error);
  }
};