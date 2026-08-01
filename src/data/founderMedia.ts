export interface FounderSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  description: string;
}

// Photos officielles haute définition de Lizie Fifamè ALLATIN (Fondatrice & CEO)
export const LIZIE_WHITE_SUIT_IMG = '/images/lizie-white-suit.jpg';
export const LIZIE_BLACK_OUTFIT_IMG = '/images/lizie-black-outfit.jpg';
export const LIZIE_OFFICE_CEO_IMG = '/images/lizie-office-ceo.jpg';

export const FOUNDER_SLIDES: FounderSlide[] = [
  {
    id: 'slide-ceo-white-suit',
    title: 'Lizie Fifamè ALLATIN',
    subtitle: 'Fondatrice & Directrice Générale — ANONYM',
    badge: 'Directrice Générale & CEO',
    imageUrl: LIZIE_WHITE_SUIT_IMG,
    description: "Inspirée par l'excellence et le prestige royal, Lizie Fifamè ALLATIN dirige ANONYM depuis Abomey-Calavi avec une vision claire : immortaliser vos histoires à travers des bijoux gravés d'exception.",
  },
  {
    id: 'slide-ceo-black-suit',
    title: 'Lizie Fifamè ALLATIN',
    subtitle: 'Fondatrice, Créatrice & Directrice Artistique',
    badge: 'Fondatrice & Visionnaire',
    imageUrl: LIZIE_BLACK_OUTFIT_IMG,
    description: "Chaque bijou et chaque coffret ANONYM est une signature de raffinement. L'alliance parfaite entre le chic moderne et la haute qualité inaltérable.",
  },
  {
    id: 'slide-ceo-office-leadership',
    title: 'Lizie Fifamè ALLATIN',
    subtitle: 'Maison de Création & Personnalisation',
    badge: 'Direction Exécutive & CEO',
    imageUrl: LIZIE_OFFICE_CEO_IMG,
    description: "Des créations uniques en acier inoxydable 316L garanti 1 an sans rouille ni noircissement, conçues sur-mesure pour sublimer vos moments précieux.",
  },
];
