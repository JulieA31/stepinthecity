export const getImageForWalk = (title: string) => {
  const imageMap: { [key: string]: string } = {
    "Sur les pas de Victor Hugo": "/lovable-uploads/00ff1698-cc1b-43bb-be54-594a21634a90.png",
    "Les classiques de Paris": "/lovable-uploads/84b16743-6931-4157-9ce5-f52dc2c22cbd.png",
    "Balade gastronomique": "/lovable-uploads/d47de2a6-5b1a-40bd-86da-20acfad3f35a.png",
    "Lisbonne historique": "/lovable-uploads/68af49fb-4c88-402f-99c2-e06a4af91c2a.png",
    "Sur les rails du Tram 28": "/lovable-uploads/ae74de2f-fbb8-4777-bf21-bfbe98673652.png",
    "Saveurs portugaises": "/lovable-uploads/f5dfb482-1199-4209-92d5-fc8b14882694.png",
    "Route des vins": "https://images.unsplash.com/photo-1469041797191-50ace28483c3",
    "Porto médiéval": "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2",
    "Porto artistique": "https://images.unsplash.com/photo-1487252665478-49b61b47f302",
    "Sur les pas de César": "https://images.unsplash.com/photo-1603888613934-ee2f7d143dd0?auto=format&fit=crop&w=1200&q=80",
    "Rome baroque": "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80",
    "Vatican et spiritualité": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80"
  };
  return imageMap[title] || "https://images.unsplash.com/photo-1472396961693-142e6e269027";
};
