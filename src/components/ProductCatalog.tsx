import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Product, CategoryId, Collection, SubCategoryLevel1, SubCategoryLevel2 } from '../types';
import { formatPriceFCFA, buildWhatsAppLink, generateSingleProductWhatsAppMsg } from '../utils/helpers';
import { Search, ArrowLeft, MessageCircle, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  collections: Collection[];
  selectedCategory: CategoryId | 'accueil';
  onSelectCategory: (cat: CategoryId | 'accueil') => void;
  whatsappNumber: string;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  subCategoriesLvl1?: SubCategoryLevel1[];
  subCategoriesLvl2?: SubCategoryLevel2[];
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const BIJOUX_CIBLES = [
  { id: 'femme',   label: 'BIJOUX FEMME' },
  { id: 'homme',   label: 'BIJOUX HOMME' },
  { id: 'enfant',  label: 'BIJOUX ENFANT' },
  { id: 'couple',  label: 'BIJOUX COUPLE' },
  { id: 'animaux', label: 'BIJOUX ANIMAL' },
];

const BIJOUX_TYPES: Record<string, { id: string; label: string }[]> = {
  femme: [
    { id: 'colliers',      label: 'COLLIERS' },
    { id: 'bracelets',     label: 'BRACELETS' },
    { id: 'bagues',        label: 'BAGUES' },
    { id: 'boucles',       label: "BOUCLES D'OREILLES" },
    { id: 'chaines-pieds', label: 'CHAÎNES DE PIEDS' },
    { id: 'perles-hanche', label: 'PERLES DE HANCHE' },
    { id: 'autres',        label: 'AUTRES BIJOUX' },
  ],
  homme: [
    { id: 'colliers',  label: 'COLLIERS' },
    { id: 'bracelets', label: 'BRACELETS' },
    { id: 'bagues',    label: 'BAGUES' },
    { id: 'montres',   label: 'MONTRES' },
    { id: 'autres',    label: 'AUTRES BIJOUX' },
  ],
  enfant: [
    { id: 'colliers',  label: 'COLLIERS' },
    { id: 'bracelets', label: 'BRACELETS' },
    { id: 'bagues',    label: 'BAGUES' },
    { id: 'boucles',   label: "BOUCLES D'OREILLES" },
    { id: 'autres',    label: 'AUTRES BIJOUX' },
  ],
  couple: [
    { id: 'colliers',  label: 'COLLIERS' },
    { id: 'bracelets', label: 'BRACELETS' },
    { id: 'bagues',    label: 'BAGUES' },
    { id: 'autres',    label: 'AUTRES BIJOUX' },
  ],
  animaux: [
    { id: 'colliers',  label: 'COLLIERS' },
    { id: 'medailles', label: 'MÉDAILLES PERSONNALISÉES' },
    { id: 'autres',    label: 'AUTRES BIJOUX / ACCESSOIRES' },
  ],
};

const ACC_OCCASIONS = [
  { id: 'cadeaux',        label: 'CADEAUX' },
  { id: 'social',         label: 'ÉVÉNEMENTS SOCIAUX' },
  { id: 'pro',            label: 'ÉVÉNEMENTS PROFESSIONNELS' },
  { id: 'entreprises',    label: 'ENTREPRISES' },
  { id: 'anniversaire',   label: 'ANNIVERSAIRE' },
  { id: 'mariage',        label: 'MARIAGE' },
  { id: 'saint-valentin', label: 'SAINT-VALENTIN' },
];

const ACC_TYPES = [
  { id: 'verres',    label: 'VERRES PERSONNALISÉS' },
  { id: 'tasses',    label: 'TASSES PERSONNALISÉES' },
  { id: 'stylos',    label: 'STYLOS PERSONNALISÉS' },
  { id: 'portecles', label: 'PORTE-CLÉS PERSONNALISÉS' },
  { id: 'nounours',  label: 'NOUNOURS PERSONNALISÉS' },
  { id: 'bijoux',    label: 'BIJOUX PERSONNALISÉS' },
  { id: 'autres',    label: 'AUTRES ACCESSOIRES' },
];

// ANONYM (Parfums) — extensible collections list
// Admin can add more entries via backend; for now just ANONYM INVITATION
const ANONYM_COLLECTIONS = [
  { id: 'anonym-invitation', label: 'ANONYM INVITATION' },
];

// EMBALLAGES — 4 modes de navigation
const EMB_MODES = [
  { id: 'type',     label: "PAR TYPE D'EMBALLAGE" },
  { id: 'materiau', label: 'PAR MATÉRIAU' },
  { id: 'secteur',  label: "PAR SECTEUR D'ACTIVITÉ" },
  { id: 'occasion', label: 'PAR OCCASION' },
];

const EMB_SOUS_CATEGORIES: Record<string, { id: string; label: string }[]> = {
  type: [
    { id: 'boites',   label: 'BOÎTES' },
    { id: 'sachets',  label: 'SACHETS' },
    { id: 'sacs',     label: 'SACS' },
    { id: 'pots',     label: 'POTS' },
    { id: 'flacons',  label: 'FLACONS' },
    { id: 'autres',   label: 'AUTRES' },
  ],
  materiau: [
    { id: 'papier',        label: 'PAPIER' },
    { id: 'plastique',     label: 'PLASTIQUE' },
    { id: 'verre',         label: 'VERRE' },
    { id: 'aluminium',     label: 'ALUMINIUM' },
    { id: 'biodegradable', label: 'BIODÉGRADABLE' },
    { id: 'autres',        label: 'AUTRES' },
  ],
  secteur: [
    { id: 'restauration', label: 'RESTAURATION / ALIMENTATION' },
    { id: 'cosmetiques',  label: 'COSMÉTIQUES' },
    { id: 'boutiques',    label: 'BOUTIQUES' },
    { id: 'autres',       label: 'AUTRES ENTREPRISES' },
  ],
  occasion: [
    { id: 'mariage',       label: 'MARIAGE' },
    { id: 'anniversaire',  label: 'ANNIVERSAIRE' },
    { id: 'cadeaux',       label: 'CADEAUX' },
    { id: 'pro',           label: 'ÉVÉNEMENTS PROFESSIONNELS' },
    { id: 'autres',        label: 'AUTRES' },
  ],
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

/** Big black navigation button — text only, gold uppercase with distinct motion presets */
const NavBtn: React.FC<{
  label: string;
  onClick: () => void;
  index?: number;
  variant?: 'bijoux' | 'emballages' | 'anonym' | 'accessoires';
}> = ({ label, onClick, index = 0, variant = 'bijoux' }) => {
  const presets = {
    bijoux: { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
    emballages: { initial: { opacity: 0, scale: 0.92, y: 15 }, animate: { opacity: 1, scale: 1, y: 0 } },
    anonym: { initial: { opacity: 0, filter: 'blur(8px)', y: 10 }, animate: { opacity: 1, filter: 'blur(0px)', y: 0 } },
    accessoires: { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 } },
  };

  const anim = presets[variant] || presets.bijoux;

  return (
    <motion.button
      initial={anim.initial}
      animate={anim.animate}
      transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(212,175,55,0.25)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-[#0F0F0F] hover:bg-[#1A160C] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-2xl px-6 py-4 text-center font-serif font-bold text-base sm:text-lg text-[#D4AF37] uppercase tracking-widest transition-all duration-200 cursor-pointer"
    >
      {label}
    </motion.button>
  );
};

/** Back button */
const BackBtn: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:text-white bg-[#141414] px-4 py-2 rounded-full border border-[#D4AF37]/30 transition-all cursor-pointer"
  >
    <ArrowLeft className="w-4 h-4" />
    {label}
  </button>
);

/** Breadcrumb display */
const Breadcrumb: React.FC<{ parts: string[] }> = ({ parts }) => (
  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono uppercase tracking-wider flex-wrap">
    {parts.map((p, i) => (
      <span key={i} className={`${i === parts.length - 1 ? 'text-[#D4AF37]' : ''}`}>
        {i > 0 && <span className="mr-1.5 text-gray-700">›</span>}
        {p}
      </span>
    ))}
  </div>
);

/** Page wrapper with header and motion entrance */
const PageShell: React.FC<{
  back: { label: string; onClick: () => void };
  breadcrumb: string[];
  title: string;
  children: React.ReactNode;
}> = ({ back, breadcrumb, title, children }) => (
  <section id="catalogue" className="py-12 bg-[#080808] text-white min-h-0">
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <BackBtn label={back.label} onClick={back.onClick} />
        <Breadcrumb parts={breadcrumb} />
      </div>
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mb-8 pb-3 border-b border-[#D4AF37]/20">
        ← {title}
      </h2>
      {children}
    </motion.div>
  </section>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  collections,
  selectedCategory,
  whatsappNumber,
  onQuickView,
  subCategoriesLvl1 = [],
  subCategoriesLvl2 = [],
}) => {
  // Bijoux navigation
  const [bijouxCible, setBijouxCible] = useState<string | null>(null);
  const [bijouxType,  setBijouxType]  = useState<string | null>(null);

  // ANONYM (parfums) navigation
  const [anonymCollection, setAnonymCollection] = useState<string | null>(null);

  // Emballages navigation
  const [embMode,       setEmbMode]       = useState<string | null>(null);
  const [embSousFilter, setEmbSousFilter] = useState<string | null>(null);

  // Accessoires navigation
  const [accMode,      setAccMode]      = useState<string | null>(null);
  const [accSubFilter, setAccSubFilter] = useState<string | null>(null);

  // Legacy collection navigation
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);

  // Dynamic Level 1 and Level 2 resolvers
  const dynamicLvl1Bijoux = useMemo(() => {
    const list = subCategoriesLvl1.filter((c) => c.parentCategory === 'bijoux' && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name }));
    return BIJOUX_CIBLES;
  }, [subCategoriesLvl1]);

  const dynamicLvl2Bijoux = useMemo(() => {
    if (!bijouxCible) return [];
    const list = subCategoriesLvl2.filter((c) => c.level1Id === bijouxCible && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name }));
    return BIJOUX_TYPES[bijouxCible] || [];
  }, [subCategoriesLvl2, bijouxCible]);

  const dynamicLvl1Emballages = useMemo(() => {
    const list = subCategoriesLvl1.filter((c) => c.parentCategory === 'emballages' && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name }));
    return EMB_MODES;
  }, [subCategoriesLvl1]);

  const dynamicLvl2Emballages = useMemo(() => {
    if (!embMode) return [];
    const list = subCategoriesLvl2.filter((c) => c.level1Id === embMode && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name }));
    return EMB_SOUS_CATEGORIES[embMode] || [];
  }, [subCategoriesLvl2, embMode]);

  const dynamicLvl1Accessoires = useMemo(() => {
    const list = subCategoriesLvl1.filter((c) => c.parentCategory === 'accessoires' && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name }));
    return [...ACC_OCCASIONS, ...ACC_TYPES];
  }, [subCategoriesLvl1]);

  const dynamicLvl2Accessoires = useMemo(() => {
    if (!accMode) return [];
    const list = subCategoriesLvl2.filter((c) => c.level1Id === accMode && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name }));
    return [];
  }, [subCategoriesLvl2, accMode]);

  const dynamicLvl1Parfums = useMemo(() => {
    const list = subCategoriesLvl1.filter((c) => c.parentCategory === 'parfums' && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name }));
    return ANONYM_COLLECTIONS;
  }, [subCategoriesLvl1]);

  // Product-level filters (only shown when products are visible)
  const [searchQuery,          setSearchQuery]          = useState('');
  const [selectedQuickFilter,  setSelectedQuickFilter]  = useState<'tous' | 'disponible' | 'sur-commande' | 'epuise' | 'nouveautes'>('tous');
  const [sortBy,               setSortBy]               = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [viewMode,             setViewMode]             = useState<'list' | 'carousel'>('list');
  const [minPrice,             setMinPrice]             = useState('');
  const [maxPrice,             setMaxPrice]             = useState('');

  // Reset all nav when category changes at top level
  const resetAll = () => {
    setBijouxCible(null); setBijouxType(null);
    setAnonymCollection(null);
    setEmbMode(null);     setEmbSousFilter(null);
    setAccMode(null);     setAccSubFilter(null);
    setActiveCollection(null);
    setSearchQuery('');   setSelectedQuickFilter('tous');
    setMinPrice('');      setMaxPrice('');
  };


  // ── filtered collections (legacy) ─────────────────────────────────────────
  const filteredCollections = useMemo(() => {
    if (selectedCategory === 'accueil') return [];
    return collections
      .filter((c) => (!c.category || c.category === selectedCategory) && c.visible !== false)
      .sort((a, b) => a.order - b.order);
  }, [collections, selectedCategory]);

  // ── products: bijoux ─────────────────────────────────────────────────────
  // ── products: bijoux ─────────────────────────────────────────────────────
  const bijouxProducts = useMemo(() => {
    const allBijoux = products.filter((p) => p.category === 'bijoux');
    if (!bijouxCible && !bijouxType) return allBijoux;

    return allBijoux.filter((p) => {
      // 1. Filter by target gender if specified
      if (bijouxCible && bijouxCible !== 'all') {
        if (bijouxCible === 'femme'  && p.gender !== 'femme'  && p.gender !== 'mixte') return false;
        if (bijouxCible === 'homme'  && p.gender !== 'homme'  && p.gender !== 'mixte') return false;
        if (bijouxCible === 'couple' && p.gender !== 'couple') return false;
        if (bijouxCible === 'enfant' && p.gender !== 'enfant' && p.gender !== 'mixte') return false;
      }

      // 2. Filter by jewellery type if specified
      if (bijouxType && bijouxType !== 'all' && bijouxType !== 'autres') {
        const cleanType = bijouxType.replace(/^(femme|homme|enfant|couple|animaux)-/, '').toLowerCase();
        const sub = (p.subCategory || '').toLowerCase();
        // Direct subCategory match first
        const isDirectMatch =
          sub === cleanType ||
          sub.includes(cleanType) ||
          (cleanType === 'boucles' && (sub === 'boucles' || sub === 'boucles-oreilles')) ||
          (cleanType === 'colliers' && sub.includes('collier'));

        if (!isDirectMatch) {
          const name = (p.name || '').toLowerCase();
          const mat  = (p.material || '').toLowerCase();
          const text = `${name} ${sub} ${mat}`;

          const kws: Record<string, string[]> = {
            colliers:       ['collier', 'chaîne', 'chaine', 'pendentif', 'sautoir', 'médaillon', 'medaillon'],
            bracelets:      ['bracelet', 'jonc', 'gourmette', 'manchette'],
            bagues:         ['bague', 'anneau', 'chevalière', 'chevaliere', 'alliance'],
            boucles:        ['boucle', 'créole', 'creole', 'puce', 'pendantes', 'boucles-oreilles'],
            'chaines-pieds':['pied', 'anklet', 'cheville'],
            'perles-hanche':['perle', 'baya', 'hanche', 'taille'],
            montres:        ['montre', 'chrono', 'cadran'],
            medailles:      ['médaille', 'medaille', 'plaque', 'écusson', 'ecusson'],
            manchettes:     ['manchette', 'bouton', 'boutons'],
          };
          const keywords = kws[cleanType] || [cleanType];
          if (!keywords.some((k) => text.includes(k))) return false;
        }
      }

      return true;
    });
  }, [products, bijouxCible, bijouxType]);

  // ── products: emballages ─────────────────────────────────────────────────
  const embProducts = useMemo(() => {
    const allEmb = products.filter((p) => p.category === 'emballages');
    if (!embMode || embMode === 'all') return allEmb;
    if (!embSousFilter || embSousFilter === 'all') return allEmb;

    const filterClean = (embSousFilter || '').toLowerCase().replace(/^(emb|type|materiau|secteur|occasion)-/, '');

    const keywordMap: Record<string, string[]> = {
      // Types
      boites:        ['boîte', 'boite', 'coffret', 'écrin', 'ecrin', 'box', 'étui', 'etui'],
      sachets:       ['sachet', 'pochon', 'pochette', 'bag', 'velours'],
      sacs:          ['sac', 'kraft', 'caba', 'tote', 'shopping'],
      pots:          ['pot', 'bocal', 'jarre'],
      flacons:       ['flacon', 'bouteille', 'fiole', 'spray', 'vaporisateur'],
      
      // Matériaux
      papier:        ['papier', 'kraft', 'carton'],
      plastique:     ['plastique', 'pvc', 'poly'],
      verre:         ['verre', 'cristal'],
      aluminium:     ['aluminium', 'alu', 'métal', 'metal'],
      biodegradable: ['biodégradable', 'eco', 'écologique', 'recyclé', 'kraft'],
      
      // Secteurs
      restauration:  ['restauration', 'alimentaire', 'repas', 'burger', 'nourriture'],
      cosmetiques:   ['cosmétique', 'cosmetique', 'beauté', 'beaute', 'soin'],
      boutiques:     ['boutique', 'magasin', 'shop', 'vente'],

      // Occasions
      mariage:       ['mariage', 'noces'],
      anniversaire:  ['anniversaire', 'fête', 'fete'],
      cadeaux:       ['cadeau', 'offrir', 'surprise'],
      pro:           ['professionnel', 'entreprise', 'pro', 'event'],
    };

    const keywords = keywordMap[filterClean] || [filterClean];

    const filtered = allEmb.filter((p) => {
      const sub = (p.subCategory || '').toLowerCase();
      if (sub === filterClean || sub.includes(filterClean)) return true;
      const text = `${p.name} ${sub} ${p.description || ''} ${p.material || ''}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    });

    return filtered.length > 0 ? filtered : allEmb;
  }, [products, embSousFilter, embMode]);

  // ── products: parfums ───────────────────────────────────────────────────
  const parfumProducts = useMemo(() => {
    const allParfums = products.filter((p) => p.category === 'parfums');
    if (!anonymCollection || anonymCollection === 'all') return allParfums;

    const filtered = allParfums.filter((p) => {
      if (p.collectionIds?.includes(anonymCollection)) return true;
      const sub = (p.subCategory || '').toLowerCase();
      const colClean = anonymCollection.toLowerCase().replace('anonym-', '');
      if (sub === anonymCollection.toLowerCase() || sub === colClean) return true;
      const text = `${p.name} ${sub} ${p.description || ''}`.toLowerCase();
      return text.includes(colClean);
    });

    return filtered.length > 0 ? filtered : allParfums;
  }, [products, anonymCollection]);

  // ── products: accessoires ─────────────────────────────────────────────────
  const accProducts = useMemo(() => {
    const allAcc = products.filter((p) => p.category === 'accessoires');
    if (!accMode && !accSubFilter) return allAcc;
    if (accMode === 'all' && (!accSubFilter || accSubFilter === 'all')) return allAcc;

    const filterClean = (accSubFilter && accSubFilter !== 'all' ? accSubFilter : accMode || '').toLowerCase().replace(/^(acc|cadeaux|social|pro|entreprises|anniversaire|mariage|saint-valentin)-/, '');
    if (!filterClean || filterClean === 'all') return allAcc;

    const keywordMap: Record<string, string[]> = {
      // Types
      verres:         ['verre', 'gobelet', 'cup', 'chope'],
      tasses:         ['tasse', 'mug', 'bol', 'thermos'],
      stylos:         ['stylo', 'crayon', 'plume', 'pen'],
      portecles:      ['porte-clés', 'porte clés', 'porte clef', 'porte-clef', 'porte-cles', 'clé', 'clef', 'keyring'],
      nounours:       ['nounours', 'peluche', 'ours', 'doudou'],
      bijoux:         ['bijou', 'bracelet', 'collier', 'plaque'],

      // Occasions
      cadeaux:        ['cadeau', 'offrir', 'coffret', 'souvenir'],
      social:         ['social', 'événement', 'evenement', 'fête', 'fete'],
      pro:            ['professionnel', 'entreprise', 'pro', 'business'],
      entreprises:    ['entreprise', 'société', 'societe', 'bureau', 'goodies'],
      anniversaire:   ['anniversaire', 'fête', 'fete'],
      mariage:        ['mariage', 'noces', 'union'],
      'saint-valentin':['valentin', 'amour', 'coeur', 'cœur'],
    };

    const keywords = keywordMap[filterClean] || [filterClean];

    const filtered = allAcc.filter((p) => {
      const sub = (p.subCategory || '').toLowerCase();
      if (sub === filterClean || sub.includes(filterClean)) return true;
      const text = `${p.name} ${sub} ${p.description || ''} ${p.material || ''}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    });

    return filtered.length > 0 ? filtered : allAcc;
  }, [products, accSubFilter, accMode]);

  // ── products: legacy collection ───────────────────────────────────────────
  const collectionProducts = useMemo(() => {
    if (!activeCollection) return [];
    return products.filter(
      (p) => activeCollection.productIds.includes(p.id) || p.collectionIds?.includes(activeCollection.id),
    );
  }, [products, activeCollection]);

  function applyFilters(inputList: Product[]) {
    let list = [...inputList];

    // 1. Quick status filter
    if (selectedQuickFilter === 'disponible') {
      list = list.filter((p) => (p.availability || 'disponible') === 'disponible');
    } else if (selectedQuickFilter === 'sur-commande') {
      list = list.filter((p) => p.availability === 'en-arrivage' || (p.availability as any) === 'sur-commande');
    } else if (selectedQuickFilter === 'epuise') {
      list = list.filter((p) => p.availability === 'epuise');
    } else if (selectedQuickFilter === 'nouveautes') {
      list = list.filter(
        (p) =>
          p.isFeatured ||
          (p.badge &&
            (p.badge.toLowerCase().includes('nouveau') ||
              p.badge.toLowerCase().includes('nouvelle') ||
              p.badge.toLowerCase().includes('nouveauté') ||
              p.badge.toLowerCase().includes('offre') ||
              p.badge.toLowerCase().includes('spéciale')))
      );
    }

    // 2. Price Min filter
    if (minPrice.trim() !== '') {
      const min = Number(minPrice);
      if (!isNaN(min) && min >= 0) {
        list = list.filter((p) => (Number(p.price) || 0) >= min);
      }
    }

    // 3. Price Max filter
    if (maxPrice.trim() !== '') {
      const max = Number(maxPrice);
      if (!isNaN(max) && max >= 0) {
        list = list.filter((p) => (Number(p.price) || 0) <= max);
      }
    }

    // 4. Text search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.refCode.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.material || '').toLowerCase().includes(q)
      );
    }

    // 5. Sorting
    return list.sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      if (sortBy === 'price-asc')  return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name')       return a.name.localeCompare(b.name);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }

  // Guard: do not render catalogue content for Accueil page
  if (selectedCategory === 'accueil') return null;

  // ─────────────────────────────────────────────────────────────────────────
  // PRODUCT LIST VIEW — shown only at the deepest navigation level
  // ─────────────────────────────────────────────────────────────────────────
  const renderProductList = (
    rawList: Product[],
    backLabel: string,
    title: string,
    breadcrumb: string[],
    onBack: () => void,
  ) => {
    const list = applyFilters(rawList);
    const hasActiveFilters = Boolean(
      selectedQuickFilter !== 'tous' || searchQuery.trim() || minPrice.trim() || maxPrice.trim()
    );

    return (
      <section id="catalogue" className="py-12 bg-[#080808] text-white min-h-0">
        <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back + breadcrumb */}
          <div className="flex items-center justify-between mb-4">
            <BackBtn label={backLabel} onClick={onBack} />
            <Breadcrumb parts={breadcrumb} />
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight mb-4 pb-3 border-b border-[#D4AF37]/20 flex items-center justify-between">
            <span>{title}</span>
            <span className="text-xs font-sans text-gray-400 font-normal">
              {list.length} produit{list.length > 1 ? 's' : ''} {hasActiveFilters ? `trouvé(s) sur ${rawList.length}` : ''}
            </span>
          </h2>

          {/* ── FILTERS — only here, at product level ── */}
          <div className="bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-2xl p-4 mb-6 space-y-3 shadow-lg">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, référence (#001...), description..."
                className="w-full bg-black/80 border border-gray-800 rounded-xl pl-10 pr-8 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter + Sort + View Mode */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {([
                  { v: 'tous',         label: `Tous (${rawList.length})` },
                  { v: 'disponible',   label: '🟢 Disponible' },
                  { v: 'sur-commande', label: '🟡 Sur commande' },
                  { v: 'epuise',       label: '🔴 Épuisé' },
                  { v: 'nouveautes',   label: '✨ Nouveau' },
                ] as const).map(({ v, label }) => (
                  <button
                    key={v}
                    onClick={() => setSelectedQuickFilter(v)}
                    className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                      selectedQuickFilter === v
                        ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                        : 'bg-black/60 text-gray-400 border-gray-800 hover:text-[#D4AF37] hover:border-[#D4AF37]/40'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 ml-auto shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-black/80 border border-gray-800 text-xs text-gray-400 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="featured">Tri : Vedettes</option>
                  <option value="price-asc">Prix ↑</option>
                  <option value="price-desc">Prix ↓</option>
                  <option value="name">Nom A-Z</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center bg-black/80 border border-gray-800 rounded-xl p-0.5">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Vue Liste WhatsApp"
                  >
                    Liste
                  </button>
                  <button
                    onClick={() => setViewMode('carousel')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      viewMode === 'carousel'
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Vue Carrousel Horizontal"
                  >
                    Défilant
                  </button>
                </div>
              </div>
            </div>

            {/* ── PRIX MIN / MAX & RACCOURCIS ── */}
            <div className="pt-2 border-t border-gray-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[#D4AF37] shrink-0 font-semibold">💰 Prix :</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))}
                    placeholder="Min (FCFA)"
                    className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <span className="text-gray-600 shrink-0">—</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))}
                    placeholder="Max (FCFA)"
                    className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                {(minPrice || maxPrice) && (
                  <button
                    onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                    className="shrink-0 text-rose-400 hover:text-rose-300 transition-colors px-2 py-1 rounded-lg border border-rose-950 bg-rose-950/40 text-[11px] font-semibold"
                    title="Effacer le filtre prix"
                  >
                    ✕ Effacer
                  </button>
                )}
              </div>

              {/* Raccourcis de prix rapides */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
                <button
                  type="button"
                  onClick={() => { setMinPrice(''); setMaxPrice('10000'); }}
                  className={`px-2 py-1 rounded-lg text-[10px] border transition-all cursor-pointer whitespace-nowrap ${
                    maxPrice === '10000' && !minPrice
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB] font-bold'
                      : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  &lt; 10.000 F
                </button>
                <button
                  type="button"
                  onClick={() => { setMinPrice('10000'); setMaxPrice('25000'); }}
                  className={`px-2 py-1 rounded-lg text-[10px] border transition-all cursor-pointer whitespace-nowrap ${
                    minPrice === '10000' && maxPrice === '25000'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB] font-bold'
                      : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  10k - 25k F
                </button>
                <button
                  type="button"
                  onClick={() => { setMinPrice('25000'); setMaxPrice(''); }}
                  className={`px-2 py-1 rounded-lg text-[10px] border transition-all cursor-pointer whitespace-nowrap ${
                    minPrice === '25000' && !maxPrice
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB] font-bold'
                      : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  &gt; 25.000 F
                </button>
              </div>
            </div>

            {/* Resume filtres actifs */}
            {hasActiveFilters && (
              <div className="pt-2 border-t border-gray-800/40 flex items-center justify-between text-[11px] text-amber-200/90">
                <span className="flex items-center gap-1 font-mono">
                  <span>🔍 Filtres actifs :</span>
                  {selectedQuickFilter !== 'tous' && (
                    <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-1.5 py-0.5 rounded text-[10px]">
                      {selectedQuickFilter}
                    </span>
                  )}
                  {(minPrice || maxPrice) && (
                    <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-1.5 py-0.5 rounded text-[10px]">
                      Prix: {minPrice || '0'} à {maxPrice || '∞'} FCFA
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-1.5 py-0.5 rounded text-[10px]">
                      "{searchQuery}"
                    </span>
                  )}
                </span>
                <button
                  onClick={() => {
                    setSelectedQuickFilter('tous');
                    setMinPrice('');
                    setMaxPrice('');
                    setSearchQuery('');
                  }}
                  className="text-rose-400 hover:underline font-semibold text-[11px] cursor-pointer"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── PRODUCT CARDS ── */}
        <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {list.length > 0 ? (
          viewMode === 'carousel' ? (
            /* Horizontal Carousel Scroll-X Mode */
            <div className="relative">
              <p className="text-[10px] text-gray-500 font-mono mb-2 flex items-center gap-1">
                <span>👉 Glissez horizontalement pour voir tous les modèles ({list.length})</span>
              </p>
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar">
                {list.map((product) => {
                  const isNouveau = product.isFeatured || product.badge?.toLowerCase().includes('nouveau');
                  const availStatus = product.availability || 'disponible';
                  return (
                    <div
                      key={product.id}
                      onClick={() => onQuickView(product)}
                      className="group shrink-0 w-[200px] sm:w-[230px] bg-[#111111] hover:bg-[#161616] border border-gray-800/80 hover:border-[#D4AF37]/50 rounded-2xl p-3 flex flex-col justify-between transition-all cursor-pointer shadow-xl snap-start"
                    >
                      <div>
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black mb-3 border border-gray-800">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop';
                            }}
                          />
                          {product.refCode && (
                            <span className="absolute top-1 left-1 font-mono text-[8px] font-bold text-black bg-[#D4AF37] px-1.5 py-0.5 rounded">
                              #{product.refCode}
                            </span>
                          )}
                          {/* Badge Statut — coin supérieur droit */}
                          <span className={`absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                            availStatus === 'epuise'
                              ? 'bg-rose-950/90 text-rose-400 border border-rose-700/60'
                              : availStatus === 'sur-commande' || availStatus === 'en-arrivage'
                              ? 'bg-amber-950/90 text-amber-400 border border-amber-700/60'
                              : availStatus === 'nouveau'
                              ? 'bg-black/90 text-[#F3E5AB] border border-[#D4AF37]/60'
                              : 'bg-emerald-950/90 text-emerald-400 border border-emerald-700/60'
                          }`}>
                            {availStatus === 'epuise' ? '🔴 Épuisé' : availStatus === 'sur-commande' || availStatus === 'en-arrivage' ? '🟡 Sur Cmd' : availStatus === 'nouveau' ? '✨ Nouveau' : '🟢 Dispo'}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors text-xs line-clamp-1">
                          {product.name}
                        </h3>
                        {isNouveau && (
                          <span className="inline-block mt-0.5 text-[8px] font-bold text-black bg-[#D4AF37] px-1.5 py-0.5 rounded-full">✨ Nouveau</span>
                        )}
                        <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5 font-sans leading-tight">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-800/80 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F3E5AB] font-serif">
                          {formatPriceFCFA(product.price)}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(product);
                          }}
                          className="w-8 h-8 rounded-lg bg-[#1A160C] hover:bg-[#D4AF37] border border-[#D4AF37]/40 text-[#D4AF37] hover:text-black flex items-center justify-center font-bold text-sm transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Vertical List Mode (WhatsApp Business Style) */
            <div className="space-y-3">
              {list.map((product) => {
                const whatsappUrl = buildWhatsAppLink(whatsappNumber, generateSingleProductWhatsAppMsg(product));
                const availStatus = product.availability || 'disponible';
                const isNouveau = product.isFeatured || product.badge?.toLowerCase().includes('nouveau');
                return (
                  <div
                    key={product.id}
                    onClick={() => onQuickView(product)}
                    className="group bg-[#111111] hover:bg-[#161616] border border-gray-800/80 hover:border-[#D4AF37]/50 rounded-2xl p-3 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-md"
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-black shrink-0 border border-gray-800">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h3 className="font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors text-xs sm:text-sm line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-1 font-sans">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                          <span className="text-xs font-bold text-[#F3E5AB] font-serif">
                            {formatPriceFCFA(product.price)}
                          </span>
                          {/* Badge statut disponibilité */}
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                            availStatus === 'epuise'
                              ? 'bg-rose-950/80 text-rose-400 border-rose-700/60'
                              : availStatus === 'en-arrivage'
                              ? 'bg-amber-950/80 text-amber-400 border-amber-700/60'
                              : 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                          }`}>
                            {availStatus === 'epuise' ? '🔴 Épuisé' : availStatus === 'en-arrivage' ? '🟡 Sur commande' : '🟢 Disponible'}
                          </span>
                          {/* Badge Nouveau */}
                          {isNouveau && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                              ✨ Nouveau
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                      className="w-9 h-9 rounded-xl bg-[#1A160C] hover:bg-[#D4AF37] border border-[#D4AF37]/40 text-[#D4AF37] hover:text-black flex items-center justify-center font-bold text-lg transition-all shrink-0 shadow-sm"
                      title="Voir les détails & commander"
                    >
                      +
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="text-center py-16 bg-[#0F0F0F] rounded-3xl border border-gray-800">
            <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-serif font-bold text-white mb-1">Aucun produit trouvé</h3>
            <p className="text-xs text-gray-400 mb-4">Réinitialisez les filtres pour voir tous les articles.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedQuickFilter('tous'); setMinPrice(''); setMaxPrice(''); }}
              className="bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-[#F3E5AB] transition-all cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>
        )}
        </div>
      </section>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BIJOUX — Level 3: Products
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'bijoux' && bijouxCible && bijouxType) {
    const cibleLabel = bijouxCible === 'all' ? 'TOUS LES BIJOUX' : (dynamicLvl1Bijoux.find((c) => c.id === bijouxCible)?.label || bijouxCible.toUpperCase());
    const typeLabel  = bijouxType === 'all' ? 'TOUS LES MODÈLES' : (dynamicLvl2Bijoux.find((t) => t.id === bijouxType)?.label || bijouxType.toUpperCase());
    return renderProductList(
      bijouxProducts,
      `← BIJOUX`,
      bijouxType === 'all' ? cibleLabel : `${cibleLabel} › ${typeLabel}`,
      ['BIJOUX', cibleLabel, typeLabel],
      () => { setBijouxType(null); if (bijouxCible === 'all') setBijouxCible(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BIJOUX — Level 2: Types (boutons texte uniquement)
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'bijoux' && bijouxCible) {
    const cibleObj = dynamicLvl1Bijoux.find((c) => c.id === bijouxCible);
    const types = dynamicLvl2Bijoux;
    return (
      <PageShell
        back={{ label: '← BIJOUX', onClick: () => setBijouxCible(null) }}
        breadcrumb={['BIJOUX', cibleObj?.label || '']}
        title={cibleObj?.label || ''}
      >
        <div className="space-y-3">
          <NavBtn
            label={`✨ TOUS LES ${cibleObj?.label || 'BIJOUX'}`}
            index={0}
            variant="bijoux"
            onClick={() => { setBijouxType('all'); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
          />
          {types.map((t, idx) => (
            <NavBtn
              key={t.id}
              label={t.label}
              index={idx + 1}
              variant="bijoux"
              onClick={() => { setBijouxType(t.id); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
          ))}
        </div>
      </PageShell>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BIJOUX — Level 1: Cibles (boutons texte uniquement)
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'bijoux') {
    const totalBijouxCount = products.filter((p) => p.category === 'bijoux').length;
    return (
      <section id="catalogue" className="py-16 bg-[#080808] text-white min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">BIJOUX</h2>
            <p className="text-xs text-gray-500">Pour qui souhaitez-vous découvrir nos bijoux ?</p>
          </motion.div>
          <div className="space-y-3">
            <NavBtn
              label={`✨ TOUS LES BIJOUX (${totalBijouxCount})`}
              index={0}
              variant="bijoux"
              onClick={() => { setBijouxCible('all'); setBijouxType('all'); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
            {dynamicLvl1Bijoux.map((c, idx) => (
              <NavBtn key={c.id} label={c.label} index={idx + 1} variant="bijoux" onClick={() => setBijouxCible(c.id)} />
            ))}
          </div>
        </motion.div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACCESSOIRES — Level 3: Products
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'accessoires' && accMode && accSubFilter) {
    const parentLabel = accMode === 'all' ? 'TOUS LES ACCESSOIRES' : (dynamicLvl1Accessoires.find((o) => o.id === accMode)?.label || accMode.toUpperCase());
    const subLabel = accSubFilter === 'all' ? 'TOUS LES MODÈLES' : (dynamicLvl2Accessoires.find((s) => s.id === accSubFilter)?.label || accSubFilter.toUpperCase());
    return renderProductList(
      accProducts,
      `← ACCESSOIRES`,
      accSubFilter === 'all' ? parentLabel : `${parentLabel} › ${subLabel}`,
      ['ACCESSOIRES', parentLabel, subLabel],
      () => { setAccSubFilter(null); if (accMode === 'all') setAccMode(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACCESSOIRES — Level 2: Sous-catégories (boutons texte)
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'accessoires' && accMode) {
    const modeObj = dynamicLvl1Accessoires.find((m) => m.id === accMode);
    const sousCats = dynamicLvl2Accessoires;
    if (sousCats.length > 0) {
      return (
        <PageShell
          back={{ label: '← ACCESSOIRES', onClick: () => setAccMode(null) }}
          breadcrumb={['ACCESSOIRES', modeObj?.label || '']}
          title={modeObj?.label || ''}
        >
          <div className="space-y-3">
            <NavBtn
              label={`✨ TOUS LES ACCESSOIRES ${modeObj?.label || ''}`}
              index={0}
              variant="accessoires"
              onClick={() => { setAccSubFilter('all'); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
            {sousCats.map((s, idx) => (
              <NavBtn
                key={s.id}
                label={s.label}
                index={idx + 1}
                variant="accessoires"
                onClick={() => { setAccSubFilter(s.id); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
              />
            ))}
          </div>
        </PageShell>
      );
    } else {
      // If no Level 2 subcategories exist for this Level 1 item, render products directly
      return renderProductList(
        accProducts,
        '← ACCESSOIRES',
        modeObj?.label || accMode.toUpperCase(),
        ['ACCESSOIRES', modeObj?.label || ''],
        () => { setAccMode(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACCESSOIRES — Level 1: Subcategories (boutons texte)
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'accessoires') {
    const totalAccCount = products.filter((p) => p.category === 'accessoires').length;
    return (
      <section id="catalogue" className="py-16 bg-[#080808] text-white min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">ACCESSOIRES</h2>
            <p className="text-xs text-gray-500">Sélectionnez une catégorie d'accessoires.</p>
          </div>
          <div className="space-y-3">
            <NavBtn
              label={`✨ TOUS LES ACCESSOIRES (${totalAccCount})`}
              index={0}
              variant="accessoires"
              onClick={() => { setAccMode('all'); setAccSubFilter('all'); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
            {dynamicLvl1Accessoires.map((item, idx) => (
              <NavBtn
                key={item.id}
                label={item.label}
                index={idx + 1}
                variant="accessoires"
                onClick={() => { setAccMode(item.id); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
              />
            ))}
          </div>
        </motion.div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ANONYM — Product fiche (after clicking a collection)
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'parfums' && anonymCollection) {
    const colLabel = anonymCollection === 'all' ? 'TOUS LES PARFUMS ANONYM' : (ANONYM_COLLECTIONS.find((c) => c.id === anonymCollection)?.label || anonymCollection.toUpperCase());
    return renderProductList(
      parfumProducts,
      '← ANONYM',
      colLabel,
      ['ANONYM', colLabel],
      () => { setAnonymCollection(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ANONYM — Level 1: Collections (boutons texte)
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'parfums') {
    const adminParfumsCollections = collections.filter((c) => c.category === 'parfums' && c.visible !== false);
    const totalParfumsCount = products.filter((p) => p.category === 'parfums').length;
    return (
      <section id="catalogue" className="py-16 bg-[#080808] text-white min-h-0">
        <motion.div
          initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">ANONYM</h2>
            <p className="text-xs text-gray-500 italic">L'univers olfactif ANONYM — Sélectionnez une référence.</p>
          </div>
          <div className="space-y-3">
            <NavBtn
              label={`✨ TOUS LES PARFUMS ANONYM (${totalParfumsCount})`}
              index={0}
              variant="anonym"
              onClick={() => { setAnonymCollection('all'); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
            {dynamicLvl1Parfums.map((c, idx) => (
              <NavBtn key={c.id} label={c.label} index={idx + 1} variant="anonym" onClick={() => setAnonymCollection(c.id)} />
            ))}
            {adminParfumsCollections
              .filter((c) => !dynamicLvl1Parfums.some((s) => s.id === c.id))
              .map((c, idx) => (
                <NavBtn key={c.id} label={c.name.toUpperCase()} index={dynamicLvl1Parfums.length + idx + 1} variant="anonym" onClick={() => setAnonymCollection(c.id)} />
              ))}
          </div>
        </motion.div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EMBALLAGES — Level 3: Products
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'emballages' && embMode && embSousFilter) {
    const modeLabel = embMode === 'all' ? 'TOUS LES EMBALLAGES' : (EMB_MODES.find((m) => m.id === embMode)?.label || embMode.toUpperCase());
    const sousLabel = embSousFilter === 'all' ? 'TOUS LES PRODUITS' : (EMB_SOUS_CATEGORIES[embMode]?.find((s) => s.id === embSousFilter)?.label || embSousFilter.toUpperCase());
    return renderProductList(
      embProducts,
      `← EMBALLAGES`,
      embSousFilter === 'all' ? modeLabel : `${modeLabel} › ${sousLabel}`,
      ['EMBALLAGES', modeLabel, sousLabel],
      () => { setEmbSousFilter(null); if (embMode === 'all') setEmbMode(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EMBALLAGES — Level 2: Sous-catégories (boutons texte)
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'emballages' && embMode) {
    const modeObj = EMB_MODES.find((m) => m.id === embMode);
    const sousCats = EMB_SOUS_CATEGORIES[embMode] || [];
    return (
      <PageShell
        back={{ label: '← EMBALLAGES', onClick: () => setEmbMode(null) }}
        breadcrumb={['EMBALLAGES', modeObj?.label || '']}
        title={modeObj?.label || ''}
      >
        <div className="space-y-3">
          <NavBtn
            label={`✨ TOUS LES EMBALLAGES ${modeObj?.label || ''}`}
            index={0}
            variant="emballages"
            onClick={() => { setEmbSousFilter('all'); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
          />
          {sousCats.map((s, idx) => (
            <NavBtn
              key={s.id}
              label={s.label}
              index={idx + 1}
              variant="emballages"
              onClick={() => { setEmbSousFilter(s.id); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
          ))}
        </div>
      </PageShell>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EMBALLAGES — Level 1: 4 modes de navigation (boutons texte)
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'emballages') {
    const totalEmbCount = products.filter((p) => p.category === 'emballages').length;
    return (
      <section id="catalogue" className="py-16 bg-[#080808] text-white min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">EMBALLAGES</h2>
            <p className="text-xs text-gray-500">Comment souhaitez-vous rechercher votre emballage ?</p>
          </div>
          <div className="space-y-3">
            <NavBtn
              label={`✨ TOUS LES EMBALLAGES (${totalEmbCount})`}
              index={0}
              variant="emballages"
              onClick={() => { setEmbMode('all'); setEmbSousFilter('all'); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
            {EMB_MODES.map((m, idx) => (
              <NavBtn key={m.id} label={m.label} index={idx + 1} variant="emballages" onClick={() => setEmbMode(m.id)} />
            ))}
          </div>
        </motion.div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LEGACY: Collection products (parfums, emballages)
  // ─────────────────────────────────────────────────────────────────────────
  if (activeCollection) {
    return renderProductList(
      collectionProducts,
      '← COLLECTIONS',
      activeCollection.name.toUpperCase(),
      [selectedCategory.toUpperCase(), activeCollection.name.toUpperCase()],
      () => { setActiveCollection(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LEGACY: Collections list (parfums, emballages) — boutons texte
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section id="catalogue" className="py-16 bg-[#080808] text-white min-h-0">
      <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">
            {selectedCategory.toUpperCase()}
          </h2>
          <p className="text-xs text-gray-500">Sélectionnez une collection.</p>
        </div>
        <div className="space-y-3">
          {filteredCollections.map((col) => (
            <NavBtn
              key={col.id}
              label={col.name.toUpperCase()}
              onClick={() => setActiveCollection(col)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
