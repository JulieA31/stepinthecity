import jsPDF from "jspdf";

export const addFooter = async (pdf: jsPDF, pageWidth: number, pageHeight: number) => {
  const margin = 20;
  const footerHeight = 30;
  const yPosition = pageHeight - footerHeight;
  
  try {
    // Ajouter une ligne de séparation
    pdf.setDrawColor("#E5E7EB");
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);

    // Ajouter le texte
    pdf.setFont("Inter");
    pdf.setFontSize(10);
    pdf.setTextColor("#6B7280");
    
    const websiteText = "Step In The City";
    const websiteUrl = "https://stepinthecity.me";
    
    // Centrer le texte
    const textWidth = pdf.getTextWidth(websiteText) + 5 + pdf.getTextWidth(websiteUrl);
    const textX = (pageWidth - textWidth) / 2;
    const textY = yPosition + footerHeight / 2;

    pdf.text(websiteText, textX, textY);
    pdf.setTextColor("#FF69B4");
    pdf.text(websiteUrl, textX + pdf.getTextWidth(websiteText) + 5, textY);
  } catch (error) {
    console.error("Error adding footer:", error);
  }
};