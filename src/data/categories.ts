import { UniverseCategory } from '../types';

export const UNIVERSE_CATEGORIES: UniverseCategory[] = [
  {
    id: 'bijoux',
    title: 'Bijoux',
    subtitle: 'Colliers, bracelets, bagues & manchettes',
    description: 'Bijoux personnalisés sur mesure pour cadeaux, anniversaires, mariages, fiançailles et toutes les occasions précieuses. Chaque pièce est unique, gravée avec vos prénoms, dates et symboles.',
    iconName: 'Gem',
    image: '/images/products/model-001.jpg',
    itemCount: 211,
  },
  {
    id: 'emballages',
    title: 'Emballages',
    subtitle: 'Coffrets, boîtes & packaging professionnel',
    description: "Emballages personnalisés pour entreprises, restaurants, cosmétiques et événements. Affirmez votre identité professionnelle avec des packagings à votre image, adaptés à vos produits.",
    iconName: 'Package',
    image: '/images/emballages-card.jpg',
    itemCount: 8,
  },
  {
    id: 'parfums',
    title: 'ANONYM',
    subtitle: 'Identité olfactive & ANONYM INVITATION',
    description: "L'univers olfactif ANONYM. Une fragrance qui vous est propre, reconnaissable, qui définit votre présence. Découvrez ANONYM INVITATION, la porte d'entrée vers cet univers d'exception.",
    iconName: 'Sparkles',
    image: '/images/parfums-anonym-card.png',
    itemCount: 6,
  },
  {
    id: 'accessoires',
    title: 'Accessoires',
    subtitle: 'Verres, porte-clés & objets de marque',
    description: "Accessoires personnalisables pour mariages, anniversaires, événements d'entreprise et dîners d'affaires. Donnez à chaque moment une identité particulière et mémorable.",
    iconName: 'KeyRound',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    itemCount: 12,
  },
];
