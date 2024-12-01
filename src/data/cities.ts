export const touristicCities = {
  France: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
  Italy: ["Rome"],
  Portugal: ["Lisbonne"]
};

export const cityItineraries: { [key: string]: any[] } = {
  Paris: [
    {
      title: "Sur les pas de Victor Hugo",
      description: "Découvrez les lieux emblématiques qui ont marqué la vie et l'œuvre de Victor Hugo à Paris.",
      duration: "2h30",
      difficulty: "Facile"
    },
    {
      title: "Les classiques de Paris",
      description: "Un parcours incontournable pour découvrir les monuments les plus emblématiques de Paris.",
      duration: "5h",
      difficulty: "Modéré"
    },
    {
      title: "Balade gastronomique",
      description: "Une promenade gourmande à travers les quartiers historiques de Paris.",
      duration: "3h30",
      difficulty: "Facile"
    }
  ],
  Marseille: [
    {
      title: "Sur les traces du passé",
      description: "Découvrez l'histoire de Marseille, de la fondation grecque à la modernité, en parcourant ses lieux emblématiques.",
      duration: "2h30",
      difficulty: "Facile",
      city: "Marseille"
    },
    {
      title: "Entre terre et mer",
      description: "Une balade entre parcs, plages et corniche pour découvrir les plus beaux paysages naturels de Marseille.",
      duration: "3h",
      difficulty: "Modéré",
      city: "Marseille"
    },
    {
      title: "Marseille et ses arts",
      description: "Un parcours culturel à travers les lieux artistiques emblématiques de la cité phocéenne.",
      duration: "2h",
      difficulty: "Facile",
      city: "Marseille"
    }
  ],
  Lyon: [
    {
      title: "Lyon à travers les siècles",
      description: "Explorez Lyon, de l'Antiquité à la Renaissance, à travers ses quartiers emblématiques et ses monuments.",
      duration: "2h30",
      difficulty: "Facile",
      city: "Lyon"
    },
    {
      title: "Lyon entre Rhône et Saône",
      description: "Une balade entre les deux fleuves, du Parc de la Tête d'Or aux quais historiques.",
      duration: "3h",
      difficulty: "Modéré",
      city: "Lyon"
    },
    {
      title: "Le goût de Lyon",
      description: "Une promenade gourmande dans la capitale mondiale de la gastronomie.",
      duration: "2h",
      difficulty: "Facile",
      city: "Lyon"
    },
    {
      title: "Sur les pas de Guignol",
      description: "À la rencontre du célèbre personnage lyonnais et de son univers.",
      duration: "2h30",
      difficulty: "Facile",
      city: "Lyon"
    }
  ],
  Toulouse: [
    {
      title: "Toulouse à travers les siècles",
      description: "Explorez Toulouse, de l'époque romaine à l'âge d'or du pastel, en parcourant ses lieux emblématiques.",
      duration: "3h",
      difficulty: "Modéré",
      city: "Toulouse"
    },
    {
      title: "Toulouse, cité de l'espace et de l'innovation",
      description: "Un parcours à la découverte des sites scientifiques et technologiques de la ville rose.",
      duration: "3h30",
      difficulty: "Modéré",
      city: "Toulouse"
    },
    {
      title: "À la découverte des saveurs de la Ville Rose",
      description: "Une promenade gourmande à travers les lieux emblématiques de la gastronomie toulousaine.",
      duration: "2h30",
      difficulty: "Facile",
      city: "Toulouse"
    },
    {
      title: "Toulouse, capitale du rugby",
      description: "Un parcours pour découvrir l'histoire et la culture du rugby dans la ville rose.",
      duration: "3h",
      difficulty: "Modéré",
      city: "Toulouse"
    }
  ],
  Nice: [
    {
      title: "Nice, entre mer et Histoire",
      description: "Plongez dans le riche passé de Nice, de son époque médiévale à son rôle dans le rattachement à la France en 1860.",
      duration: "3h",
      difficulty: "Modéré",
      city: "Nice"
    },
    {
      title: "Nice, muse des peintres et des artistes",
      description: "Découvrez Nice sous un angle créatif, en suivant les pas des artistes qui ont été inspirés par sa lumière unique.",
      duration: "2h30",
      difficulty: "Facile",
      city: "Nice"
    },
    {
      title: "Nice au naturel",
      description: "Une balade relaxante à travers les plus beaux espaces verts et naturels de Nice.",
      duration: "3h",
      difficulty: "Modéré",
      city: "Nice"
    }
  ]
};
