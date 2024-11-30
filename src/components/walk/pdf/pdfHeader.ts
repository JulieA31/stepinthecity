import jsPDF from "jspdf";
import { getImageForWalk } from "@/utils/walkImages";

export const addHeader = async (pdf: jsPDF, walkTitle: string, pageWidth: number, margin: number) => {
  const maxImageWidth = pageWidth - (2 * margin);
  const maxHeaderHeight = pdf.internal.pageSize.height * 0.25;
  
  try {
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

    if (imageHeight > maxHeaderHeight) {
      imageHeight = maxHeaderHeight;
      imageWidth = imageHeight / aspectRatio;
    }

    const xPosition = margin + (maxImageWidth - imageWidth) / 2;
    pdf.addImage(base64data, "JPEG", xPosition, margin, imageWidth, imageHeight);
    
    return margin + imageHeight + 15;
  } catch (error) {
    console.error("Error adding header image:", error);
    return margin + 10;
  }
};