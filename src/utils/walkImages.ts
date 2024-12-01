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
    "Lyon à travers les siècles": "/lovable-uploads/052190c5-0d22-4d5a-a57c-8c1afe789006.png",
    "Lyon entre Rhône et Saône": "/lovable-uploads/c7cf9ecb-7db7-4a9f-a203-3bfcfb30c3e5.png",
    "Le goût de Lyon": "/lovable-uploads/d5fe661b-ffde-4a9f-8fe0-0ea742ee45a0.png",
    "Sur les pas de Guignol": "/lovable-uploads/c612c987-4f0b-4d1d-b90d-2656adec4d8d.png",
    "Toulouse à travers les siècles": "/lovable-uploads/3ab9757a-9939-4153-aa29-de40517ba020.png",
    "Toulouse, cité de l'espace et de l'innovation": "/lovable-uploads/785fa524-1371-4e95-a9be-9c0f408890db.png",
    "À la découverte des saveurs de la Ville Rose": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    "Toulouse, capitale du rugby": "/lovable-uploads/c62ff07e-4ff7-4090-abf8-743da501d09b.png",
    "Nice, entre mer et Histoire": "/lovable-uploads/c8bcd89d-184f-45eb-ab0d-e29b5fc7ffea.png",
    "Nice, muse des peintres et des artistes": "/lovable-uploads/668b53d3-ee46-4b49-9289-72c06f55db81.png",
    "Nice au naturel": "/lovable-uploads/931ba2b3-3c22-458c-80d3-69e1efa58937.png"
  };
  return imageMap[title] || "https://images.unsplash.com/photo-1472396961693-142e6e269027";
};