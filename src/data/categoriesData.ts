import { SubCategoryLevel1, SubCategoryLevel2 } from '../types';

export const INITIAL_SUBCATEGORIES_LVL1: SubCategoryLevel1[] = [
  // Bijoux Cibles
  { id: 'femme', name: 'BIJOUX FEMME', parentCategory: 'bijoux', order: 1, visible: true, icon: '💃' },
  { id: 'homme', name: 'BIJOUX HOMME', parentCategory: 'bijoux', order: 2, visible: true, icon: '🕺' },
  { id: 'enfant', name: 'BIJOUX ENFANT', parentCategory: 'bijoux', order: 3, visible: true, icon: '👶' },
  { id: 'couple', name: 'BIJOUX COUPLE', parentCategory: 'bijoux', order: 4, visible: true, icon: '👩‍❤️‍👨' },
  { id: 'animaux', name: 'BIJOUX ANIMAL', parentCategory: 'bijoux', order: 5, visible: true, icon: '🐾' },

  // Emballages Modes
  { id: 'type', name: "PAR TYPE D'EMBALLAGE", parentCategory: 'emballages', order: 1, visible: true, icon: '📦' },
  { id: 'materiau', name: 'PAR MATÉRIAU', parentCategory: 'emballages', order: 2, visible: true, icon: '📜' },
  { id: 'secteur', name: "PAR SECTEUR D'ACTIVITÉ", parentCategory: 'emballages', order: 3, visible: true, icon: '🏢' },
  { id: 'occasion', name: 'PAR OCCASION', parentCategory: 'emballages', order: 4, visible: true, icon: '🎉' },

  // ANONYM Parfums
  { id: 'anonym-invitation', name: 'ANONYM INVITATION', parentCategory: 'parfums', order: 1, visible: true, icon: '👑' },

  // Accessoires Occasions & Types
  { id: 'cadeaux', name: 'CADEAUX', parentCategory: 'accessoires', order: 1, visible: true, icon: '🎁' },
  { id: 'social', name: 'ÉVÉNEMENTS SOCIAUX', parentCategory: 'accessoires', order: 2, visible: true, icon: '🥂' },
  { id: 'pro', name: 'ÉVÉNEMENTS PROFESSIONNELS', parentCategory: 'accessoires', order: 3, visible: true, icon: '💼' },
  { id: 'entreprises', name: 'ENTREPRISES', parentCategory: 'accessoires', order: 4, visible: true, icon: '🏢' },
  { id: 'anniversaire', name: 'ANNIVERSAIRE', parentCategory: 'accessoires', order: 5, visible: true, icon: '🎂' },
  { id: 'mariage', name: 'MARIAGE', parentCategory: 'accessoires', order: 6, visible: true, icon: '💍' },
  { id: 'saint-valentin', name: 'SAINT-VALENTIN', parentCategory: 'accessoires', order: 7, visible: true, icon: '❤️' },
];

export const INITIAL_SUBCATEGORIES_LVL2: SubCategoryLevel2[] = [
  // Bijoux Femme
  { id: 'femme-colliers', name: 'COLLIERS', level1Id: 'femme', parentCategory: 'bijoux', order: 1, visible: true },
  { id: 'femme-bracelets', name: 'BRACELETS', level1Id: 'femme', parentCategory: 'bijoux', order: 2, visible: true },
  { id: 'femme-bagues', name: 'BAGUES', level1Id: 'femme', parentCategory: 'bijoux', order: 3, visible: true },
  { id: 'femme-boucles', name: "BOUCLES D'OREILLES", level1Id: 'femme', parentCategory: 'bijoux', order: 4, visible: true },
  { id: 'femme-chaines-pieds', name: 'CHAÎNES DE PIEDS', level1Id: 'femme', parentCategory: 'bijoux', order: 5, visible: true },
  { id: 'femme-perles-hanche', name: 'PERLES DE HANCHE', level1Id: 'femme', parentCategory: 'bijoux', order: 6, visible: true },
  { id: 'femme-autres', name: 'AUTRES BIJOUX', level1Id: 'femme', parentCategory: 'bijoux', order: 7, visible: true },

  // Bijoux Homme
  { id: 'homme-colliers', name: 'COLLIERS', level1Id: 'homme', parentCategory: 'bijoux', order: 1, visible: true },
  { id: 'homme-bracelets', name: 'BRACELETS', level1Id: 'homme', parentCategory: 'bijoux', order: 2, visible: true },
  { id: 'homme-bagues', name: 'BAGUES', level1Id: 'homme', parentCategory: 'bijoux', order: 3, visible: true },
  { id: 'homme-montres', name: 'MONTRES', level1Id: 'homme', parentCategory: 'bijoux', order: 4, visible: true },
  { id: 'homme-autres', name: 'AUTRES BIJOUX', level1Id: 'homme', parentCategory: 'bijoux', order: 5, visible: true },

  // Bijoux Enfant
  { id: 'enfant-colliers', name: 'COLLIERS', level1Id: 'enfant', parentCategory: 'bijoux', order: 1, visible: true },
  { id: 'enfant-bracelets', name: 'BRACELETS', level1Id: 'enfant', parentCategory: 'bijoux', order: 2, visible: true },
  { id: 'enfant-bagues', name: 'BAGUES', level1Id: 'enfant', parentCategory: 'bijoux', order: 3, visible: true },
  { id: 'enfant-boucles', name: "BOUCLES D'OREILLES", level1Id: 'enfant', parentCategory: 'bijoux', order: 4, visible: true },

  // Bijoux Couple
  { id: 'couple-colliers', name: 'COLLIERS', level1Id: 'couple', parentCategory: 'bijoux', order: 1, visible: true },
  { id: 'couple-bracelets', name: 'BRACELETS', level1Id: 'couple', parentCategory: 'bijoux', order: 2, visible: true },
  { id: 'couple-bagues', name: 'BAGUES', level1Id: 'couple', parentCategory: 'bijoux', order: 3, visible: true },

  // Emballages Type
  { id: 'emb-boites', name: 'BOÎTES', level1Id: 'type', parentCategory: 'emballages', order: 1, visible: true },
  { id: 'emb-sachets', name: 'SACHETS', level1Id: 'type', parentCategory: 'emballages', order: 2, visible: true },
  { id: 'emb-sacs', name: 'SACS', level1Id: 'type', parentCategory: 'emballages', order: 3, visible: true },
  { id: 'emb-pots', name: 'POTS', level1Id: 'type', parentCategory: 'emballages', order: 4, visible: true },
  { id: 'emb-flacons', name: 'FLACONS', level1Id: 'type', parentCategory: 'emballages', order: 5, visible: true },

  // Emballages Matériau
  { id: 'emb-papier', name: 'PAPIER', level1Id: 'materiau', parentCategory: 'emballages', order: 1, visible: true },
  { id: 'emb-plastique', name: 'PLASTIQUE', level1Id: 'materiau', parentCategory: 'emballages', order: 2, visible: true },
  { id: 'emb-verre', name: 'VERRE', level1Id: 'materiau', parentCategory: 'emballages', order: 3, visible: true },
  { id: 'emb-biodegradable', name: 'BIODÉGRADABLE', level1Id: 'materiau', parentCategory: 'emballages', order: 4, visible: true },

  // Accessoires Types
  { id: 'acc-verres', name: 'VERRES PERSONNALISÉS', level1Id: 'cadeaux', parentCategory: 'accessoires', order: 1, visible: true },
  { id: 'acc-tasses', name: 'TASSES PERSONNALISÉES', level1Id: 'cadeaux', parentCategory: 'accessoires', order: 2, visible: true },
  { id: 'acc-stylos', name: 'STYLOS PERSONNALISÉS', level1Id: 'cadeaux', parentCategory: 'accessoires', order: 3, visible: true },
  { id: 'acc-portecles', name: 'PORTE-CLÉS PERSONNALISÉS', level1Id: 'cadeaux', parentCategory: 'accessoires', order: 4, visible: true },
];
