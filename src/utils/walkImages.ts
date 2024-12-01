export const getImageForWalk = (title: string) => {
  const imageMap: { [key: string]: string } = {
    "Sur les pas de Victor Hugo": "/lovable-uploads/00ff1698-cc1b-43bb-be54-594a21634a90.png",
    "Les classiques de Paris": "/lovable-uploads/84b16743-6931-4157-9ce5-f52dc2c22cbd.png",
    "Balade gastronomique": "/lovable-uploads/d47de2a6-5b1a-40bd-86da-20acfad3f35a.png",
    "Lisbonne historique": "/lovable-uploads/68af49fb-4c88-402f-99c2-e06a4af91c2a.png",
    "Sur les rails du Tram 28": "/lovable-uploads/ae74de2f-fbb8-4777-bf21-bfbe98673652.png",
    "Saveurs portugaises": "/lovable-uploads/f5dfb482-1199-4209-92d5-fc8b14882694.png",
    "Sur les traces du passé": "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?auto=format&fit=crop&w=1200&q=80",
    "Entre terre et mer": "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1200&q=80",
    "Marseille et ses arts": "https://images.unsplash.com/photo-1589708532758-ddd0753b0f2f?auto=format&fit=crop&w=1200&q=80",
    "Sur les pas de César": "/lovable-uploads/9cca43e2-895d-425c-8241-4f75705a0235.png",
    "Rome baroque": "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80",
    "Vatican et spiritualité": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80",
    "Lyon à travers les siècles": "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
    "Lyon entre Rhône et Saône": "https://images.unsplash.com/photo-1438565434616-af9238b0a3dc?auto=format&fit=crop&w=1200&q=80",
    "Le goût de Lyon": "https://images.unsplash.com/photo-1466721591366-2d5fba72dc4d?auto=format&fit=crop&w=1200&q=80",
    "Sur les pas de Guignol": "https://images.unsplash.com/photo-1493962853295-c31c41d95b6d?auto=format&fit=crop&w=1200&q=80"
  };
  return imageMap[title] || "https://images.unsplash.com/photo-1472396961693-142e6e269027";
};