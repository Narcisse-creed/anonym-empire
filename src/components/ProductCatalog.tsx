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
  <section id="catalogue" className="py-12 bg-[#080808] text-white min-h-screen">
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto px-4 sm:px-6"
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
  const [accMode,      setAccMode]      = useState<'occasion' | 'type' | null>(null);
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
  const [selectedQuickFilter,  setSelectedQuickFilter]  = useState<'tous' | 'disponible' | 'promotion' | 'nouveautes'>('tous');
  const [sortBy,               setSortBy]               = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [viewMode,             setViewMode]             = useState<'list' | 'carousel'>('list');

  // Reset all nav when category changes at top level
  const resetAll = () => {
    setBijouxCible(null); setBijouxType(null);
    setAnonymCollection(null);
    setEmbMode(null);     setEmbSousFilter(null);
    setAccMode(null);     setAccSubFilter(null);
    setActiveCollection(null);
    setSearchQuery('');   setSelectedQuickFilter('tous');
  };


  // ── filtered collections (legacy) ────────────────────────────────────────
  const filteredCollections = useMemo(() =>
    collections
      .filter((col) => {
        if (col.visible === false) return false;
        if (selectedCategory !== 'all' && selectedCategory !== 'accueil') {
          if (col.category && col.category !== selectedCategory) return false;
        }
        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  [collections, selectedCategory]);

  // ── products: bijoux ─────────────────────────────────────────────────────
  const bijouxProducts = useMemo(() => {
    if (!bijouxType || !bijouxCible) return [];
    let list = products.filter((p) => {
      if (p.category !== 'bijoux') return false;
      if (bijouxCible === 'femme'  && p.gender !== 'femme'  && p.gender !== 'mixte') return false;
      if (bijouxCible === 'homme'  && p.gender !== 'homme'  && p.gender !== 'mixte') return false;
      if (bijouxCible === 'couple' && p.gender !== 'couple') return false;
      if (bijouxCible === 'enfant' && p.gender !== 'enfant' && p.gender !== 'mixte') return false;
      if (bijouxType !== 'autres') {
        const name = p.name.toLowerCase();
        const sub  = (p.subCategory || '').toLowerCase();
        const kws: Record<string, string[]> = {
          colliers:       ['collier', 'chaîne', 'chaine', 'pendentif', 'sautoir'],
          bracelets:      ['bracelet', 'jonc', 'gourmette'],
          bagues:         ['bague', 'anneau', 'chevalière'],
          boucles:        ['boucle', 'créole', 'puce'],
          'chaines-pieds':['pied', 'anklet'],
          'perles-hanche':['perle', 'baya', 'hanche'],
          montres:        ['montre', 'chrono'],
          medailles:      ['médaille', 'medaille', 'plaque'],
        };
        const keywords = kws[bijouxType] || [];
        if (keywords.length && !keywords.some((k) => name.includes(k) || sub.includes(k))) return false;
      }
      return true;
    });
    if (list.length === 0) list = products.filter((p) => p.category === 'bijoux');
    return applyFilters(list);
  }, [products, bijouxCible, bijouxType, selectedQuickFilter, searchQuery, sortBy]);

  // ── products: accessoires ─────────────────────────────────────────────────
  const accProducts = useMemo(() => {
    if (!accSubFilter) return [];
    let list = products.filter((p) => p.category === 'accessoires');
    if (list.length === 0) list = products;
    return applyFilters(list);
  }, [products, accSubFilter, selectedQuickFilter, searchQuery, sortBy]);

  // ── products: legacy collection ───────────────────────────────────────────
  const collectionProducts = useMemo(() => {
    if (!activeCollection) return [];
    let list = products.filter(
      (p) => activeCollection.productIds.includes(p.id) || p.collectionIds?.includes(activeCollection.id),
    );
    if (list.length === 0 && activeCollection.category)
      list = products.filter((p) => p.category === activeCollection.category);
    return applyFilters(list);
  }, [products, activeCollection, selectedQuickFilter, searchQuery, sortBy]);

  function applyFilters(list: Product[]) {
    if (selectedQuickFilter === 'disponible') list = list.filter((p) => p.availability === 'disponible');
    if (selectedQuickFilter === 'promotion')  list = list.filter((p) => p.badge?.toLowerCase().includes('offre') || p.priceVariable);
    if (selectedQuickFilter === 'nouveautes') list = list.filter((p) => p.badge?.toLowerCase().includes('nouveau') || p.isFeatured);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.refCode.toLowerCase().includes(q));
    }
    return list.sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
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
    list: Product[],
    backLabel: string,
    title: string,
    breadcrumb: string[],
    onBack: () => void,
  ) => (
    <section id="catalogue" className="py-12 bg-[#080808] text-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back + breadcrumb */}
        <div className="flex items-center justify-between mb-4">
          <BackBtn label={backLabel} onClick={onBack} />
          <Breadcrumb parts={breadcrumb} />
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight mb-4 pb-3 border-b border-[#D4AF37]/20">
          {title}
        </h2>

        {/* ── FILTERS — only here, at product level ── */}
        <div className="bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-2xl p-4 mb-6 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full bg-black/80 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Filter + Sort + View Mode */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {([ 
                { v: 'tous',       label: `Tous (${list.length})` },
                { v: 'disponible', label: '🟢 Disponible' },
                { v: 'promotion',  label: '🔥 Offre' },
                { v: 'nouveautes', label: '✨ Nouveau' },
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
        </div>

        {/* ── PRODUCT CARDS ── */}
        {list.length > 0 ? (
          viewMode === 'carousel' ? (
            /* Horizontal Carousel Scroll-X Mode */
            <div className="relative">
              <p className="text-[10px] text-gray-500 font-mono mb-2 flex items-center gap-1">
                <span>👉 Glissez horizontalement pour voir tous les modèles ({list.length})</span>
              </p>
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar">
                {list.map((product) => {
                  const isEpuise = product.availability === 'epuise';
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
                        </div>

                        <h3 className="font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors text-xs line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5 font-sans leading-tight">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#F3E5AB] font-serif block">
                            {formatPriceFCFA(product.price)}
                          </span>
                          {product.availability === 'disponible' && (
                            <span className="text-[9px] text-emerald-400 font-medium block">● Disponible</span>
                          )}
                          {product.availability === 'epuise' && (
                            <span className="text-[9px] text-rose-400 font-medium block">● Épuisé</span>
                          )}
                        </div>

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
                const isEpuise = product.availability === 'epuise';
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
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-xs font-bold text-[#F3E5AB] font-serif">
                            {formatPriceFCFA(product.price)}
                          </span>
                          {product.availability === 'disponible' && (
                            <span className="text-[10px] text-emerald-400 font-medium">● Disponible</span>
                          )}
                          {product.availability === 'epuise' && (
                            <span className="text-[10px] text-rose-400 font-medium">● Épuisé</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: WhatsApp Business Style + Button */}
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
              onClick={() => { setSearchQuery(''); setSelectedQuickFilter('tous'); }}
              className="bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-[#F3E5AB] transition-all cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </section>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // BIJOUX — Level 3: Products
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'bijoux' && bijouxCible && bijouxType) {
    const cibleLabel = dynamicLvl1Bijoux.find((c) => c.id === bijouxCible)?.label || bijouxCible.toUpperCase();
    const typeLabel  = dynamicLvl2Bijoux.find((t) => t.id === bijouxType)?.label || bijouxType.toUpperCase();
    return renderProductList(
      bijouxProducts,
      `← ${cibleLabel}`,
      `${cibleLabel} › ${typeLabel}`,
      ['BIJOUX', cibleLabel, typeLabel],
      () => { setBijouxType(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
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
          {types.map((t, idx) => (
            <NavBtn
              key={t.id}
              label={t.label}
              index={idx}
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
    return (
      <section id="catalogue" className="py-16 bg-[#080808] text-white min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto px-4 sm:px-6"
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
            {dynamicLvl1Bijoux.map((c, idx) => (
              <NavBtn key={c.id} label={c.label} index={idx} variant="bijoux" onClick={() => setBijouxCible(c.id)} />
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
    const parentLabel = dynamicLvl1Accessoires.find((o) => o.id === accMode)?.label || accMode.toUpperCase();
    const subLabel = dynamicLvl2Accessoires.find((s) => s.id === accSubFilter)?.label || accSubFilter.toUpperCase();
    return renderProductList(
      accProducts,
      `← ${parentLabel}`,
      subLabel,
      ['ACCESSOIRES', parentLabel, subLabel],
      () => { setAccSubFilter(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
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
            {sousCats.map((s, idx) => (
              <NavBtn
                key={s.id}
                label={s.label}
                index={idx}
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
    return (
      <section id="catalogue" className="py-16 bg-[#080808] text-white min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto px-4 sm:px-6"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">ACCESSOIRES</h2>
            <p className="text-xs text-gray-500">Sélectionnez une catégorie d'accessoires.</p>
          </div>
          <div className="space-y-3">
            {dynamicLvl1Accessoires.map((item, idx) => (
              <NavBtn
                key={item.id}
                label={item.label}
                index={idx}
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
    const colLabel = ANONYM_COLLECTIONS.find((c) => c.id === anonymCollection)?.label || anonymCollection.toUpperCase();
    const colObj = collections.find(
      (c) => c.id === anonymCollection || c.name.toLowerCase().includes('invitation'),
    );
    let parfumProducts = colObj
      ? products.filter((p) => colObj.productIds.includes(p.id) || p.collectionIds?.includes(colObj.id))
      : products.filter((p) => p.category === 'parfums');
    if (parfumProducts.length === 0) parfumProducts = products.filter((p) => p.category === 'parfums');
    parfumProducts = applyFilters(parfumProducts);
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
    return (
      <section id="catalogue" className="py-16 bg-[#080808] text-white min-h-screen">
        <motion.div
          initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto px-4 sm:px-6"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">ANONYM</h2>
            <p className="text-xs text-gray-500 italic">L'univers olfactif ANONYM — Sélectionnez une référence.</p>
          </div>
          <div className="space-y-3">
            {dynamicLvl1Parfums.map((c, idx) => (
              <NavBtn key={c.id} label={c.label} index={idx} variant="anonym" onClick={() => setAnonymCollection(c.id)} />
            ))}
            {adminParfumsCollections
              .filter((c) => !dynamicLvl1Parfums.some((s) => s.id === c.id))
              .map((c, idx) => (
                <NavBtn key={c.id} label={c.name.toUpperCase()} index={dynamicLvl1Parfums.length + idx} variant="anonym" onClick={() => setAnonymCollection(c.id)} />
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
    const modeLabel = EMB_MODES.find((m) => m.id === embMode)?.label || embMode.toUpperCase();
    const sousLabel = EMB_SOUS_CATEGORIES[embMode]?.find((s) => s.id === embSousFilter)?.label || embSousFilter.toUpperCase();
    let embProducts = products.filter((p) => p.category === 'emballages');
    if (embProducts.length === 0) embProducts = products;
    embProducts = applyFilters(embProducts);
    return renderProductList(
      embProducts,
      `← ${modeLabel}`,
      sousLabel,
      ['EMBALLAGES', modeLabel, sousLabel],
      () => { setEmbSousFilter(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
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
          {sousCats.map((s, idx) => (
            <NavBtn
              key={s.id}
              label={s.label}
              index={idx}
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
    return (
      <section id="catalogue" className="py-16 bg-[#080808] text-white min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto px-4 sm:px-6"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">EMBALLAGES</h2>
            <p className="text-xs text-gray-500">Comment souhaitez-vous rechercher votre emballage ?</p>
          </div>
          <div className="space-y-3">
            {EMB_MODES.map((m, idx) => (
              <NavBtn key={m.id} label={m.label} index={idx} variant="emballages" onClick={() => setEmbMode(m.id)} />
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
    <section id="catalogue" className="py-16 bg-[#080808] text-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
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
