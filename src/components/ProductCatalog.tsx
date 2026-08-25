import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Product, CategoryId, Collection, SubCategoryLevel1, SubCategoryLevel2, StoreInfo, GenderCategory } from '../types';
import { formatPriceFCFA, buildWhatsAppLink, generateSingleProductWhatsAppMsg } from '../utils/helpers';
import { Search, ArrowLeft, ShieldCheck, Sparkles, Trash2, Plus, Droplets, Edit2 } from 'lucide-react';
import { EditableText } from './editor/EditableText';
import { EditableImage } from './editor/EditableImage';
import { useVisualEditor } from '../context/VisualEditorContext';
import { ProductFormModal } from './modals/ProductFormModal';
import { SubCategoryFormModal } from './modals/SubCategoryFormModal';
import { SubCategoryDeleteModal } from './modals/SubCategoryDeleteModal';
import { ProductDeleteModal } from './modals/ProductDeleteModal';

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
  storeInfo?: StoreInfo;
  isAdminLoggedIn?: boolean;
  onAddProduct?: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct?: (product: Product) => void;
  onDeleteProduct?: (id: string) => void;
  onAddSubCatLvl1?: (cat: Omit<SubCategoryLevel1, 'id' | 'order'>) => void;
  onUpdateSubCatLvl1?: (cat: SubCategoryLevel1) => void;
  onDeleteSubCatLvl1?: (id: string) => void;
  onAddSubCatLvl2?: (cat: Omit<SubCategoryLevel2, 'id' | 'order'>) => void;
  onUpdateSubCatLvl2?: (cat: SubCategoryLevel2) => void;
  onDeleteSubCatLvl2?: (id: string) => void;
}

// ─── DATA DEFAULTS ─────────────────────────────────────────────────────────────

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

const ANONYM_COLLECTIONS = [
  { id: 'anonym-invitation', label: 'ANONYM INVITATION' },
];

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

// ─── NAV BUTTON WITH LIVE EDIT SUPPORT ────────────────────────────────────────

const NavBtn: React.FC<{
  label: string;
  onClick: () => void;
  index?: number;
  variant?: 'bijoux' | 'emballages' | 'anonym' | 'accessoires';
  isEditMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ label, onClick, index = 0, variant = 'bijoux', isEditMode = false, onEdit, onDelete }) => {
  const presets = {
    bijoux: { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
    emballages: { initial: { opacity: 0, scale: 0.92, y: 15 }, animate: { opacity: 1, scale: 1, y: 0 } },
    anonym: { initial: { opacity: 0, filter: 'blur(8px)', y: 10 }, animate: { opacity: 1, filter: 'blur(0px)', y: 0 } },
    accessoires: { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 } },
  };

  const anim = presets[variant] || presets.bijoux;

  return (
    <div className="relative group/btn w-full">
      <motion.button
        initial={anim.initial}
        animate={anim.animate}
        transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
        whileHover={{ scale: 1.015, boxShadow: '0 0 25px rgba(212,175,55,0.25)' }}
        whileTap={{ scale: 0.985 }}
        onClick={onClick}
        className="w-full bg-[#0F0F0F] hover:bg-[#1A160C] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-2xl px-6 py-4 text-center font-serif font-bold text-base sm:text-lg text-[#D4AF37] uppercase tracking-widest transition-all duration-200 cursor-pointer flex items-center justify-center relative"
      >
        <span>{label}</span>
      </motion.button>

      {/* Admin Action Badges (✏️ 🗑️) in Live Edit Mode */}
      {isEditMode && (onEdit || onDelete) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 bg-black/90 p-1.5 rounded-xl border border-[#D4AF37]/60 shadow-lg">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 rounded-lg bg-[#D4AF37] text-black hover:bg-[#F3E5AB] transition-colors cursor-pointer"
              title="Modifier cette sous-catégorie (Édition Directe)"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
              title="Supprimer cette sous-catégorie"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const BackBtn: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:text-[#996515] bg-white px-4 py-2 rounded-full border border-[#D4AF37]/40 transition-all cursor-pointer shadow-xs"
  >
    <ArrowLeft className="w-4 h-4" />
    {label}
  </button>
);

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

const PageShell: React.FC<{
  back: { label: string; onClick: () => void };
  breadcrumb: string[];
  title: string;
  children: React.ReactNode;
}> = ({ back, breadcrumb, title, children }) => (
  <section id="catalogue" className="py-12 bg-[#F8F6F2] text-[#1A1A1A] min-h-0">
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-center justify-between mb-4">
        <BackBtn label={back.label} onClick={back.onClick} />
        <Breadcrumb parts={breadcrumb} />
      </div>
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight mb-8 pb-3 border-b border-[#D4AF37]/20">
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
  storeInfo,
  isAdminLoggedIn = false,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddSubCatLvl1,
  onUpdateSubCatLvl1,
  onDeleteSubCatLvl1,
  onAddSubCatLvl2,
  onUpdateSubCatLvl2,
  onDeleteSubCatLvl2,
}) => {
  const { isEditMode, updateTextByPath, addCustomSection } = useVisualEditor();
  const canLiveEdit = isAdminLoggedIn && isEditMode;

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

  // Product filters
  const [searchQuery,          setSearchQuery]          = useState('');
  const [selectedQuickFilter,  setSelectedQuickFilter]  = useState<'tous' | 'disponible' | 'sur-commande' | 'epuise' | 'nouveautes'>('tous');
  const [sortBy,               setSortBy]               = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [viewMode,             setViewMode]             = useState<'list' | 'carousel'>('list');
  const [minPrice,             setMinPrice]             = useState('');
  const [maxPrice,             setMaxPrice]             = useState('');

  // ── MODAL STATES FOR LIVE IN-PLACE EDITING ─────────────────────────────────
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormPreselects, setProductFormPreselects] = useState<{
    category?: CategoryId;
    gender?: GenderCategory;
    subCategory?: string;
  }>({});

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [isSubCatModalOpen, setIsSubCatModalOpen] = useState(false);
  const [subCatModalLevel, setSubCatModalLevel] = useState<1 | 2>(1);
  const [editingSubCat, setEditingSubCat] = useState<SubCategoryLevel1 | SubCategoryLevel2 | null>(null);
  const [subCatModalPreselects, setSubCatModalPreselects] = useState<{
    parentCategory?: CategoryId;
    level1Id?: string;
  }>({});

  const [subCatToDelete, setSubCatToDelete] = useState<SubCategoryLevel1 | SubCategoryLevel2 | null>(null);
  const [subCatDeleteLevel, setSubCatDeleteLevel] = useState<1 | 2>(1);

  // ── DYNAMIC LEVEL 1 AND LEVEL 2 RESOLVERS ─────────────────────────────────
  const dynamicLvl1Bijoux = useMemo(() => {
    const list = subCategoriesLvl1.filter((c) => c.parentCategory === 'bijoux' && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name, raw: c }));
    return BIJOUX_CIBLES.map((c) => ({ ...c, raw: null }));
  }, [subCategoriesLvl1]);

  const dynamicLvl2Bijoux = useMemo(() => {
    if (!bijouxCible) return [];
    const list = subCategoriesLvl2.filter((c) => c.level1Id === bijouxCible && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name, raw: c }));
    const fallback = BIJOUX_TYPES[bijouxCible] || [];
    return fallback.map((c) => ({ ...c, raw: null }));
  }, [subCategoriesLvl2, bijouxCible]);

  const dynamicLvl1Emballages = useMemo(() => {
    const list = subCategoriesLvl1.filter((c) => c.parentCategory === 'emballages' && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name, raw: c }));
    return EMB_MODES.map((c) => ({ ...c, raw: null }));
  }, [subCategoriesLvl1]);

  const dynamicLvl2Emballages = useMemo(() => {
    if (!embMode) return [];
    const list = subCategoriesLvl2.filter((c) => c.level1Id === embMode && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name, raw: c }));
    const fallback = EMB_SOUS_CATEGORIES[embMode] || [];
    return fallback.map((c) => ({ ...c, raw: null }));
  }, [subCategoriesLvl2, embMode]);

  const dynamicLvl1Accessoires = useMemo(() => {
    const list = subCategoriesLvl1.filter((c) => c.parentCategory === 'accessoires' && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name, raw: c }));
    return [...ACC_OCCASIONS, ...ACC_TYPES].map((c) => ({ ...c, raw: null }));
  }, [subCategoriesLvl1]);

  const dynamicLvl2Accessoires = useMemo(() => {
    if (!accMode) return [];
    const list = subCategoriesLvl2.filter((c) => c.level1Id === accMode && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name, raw: c }));
    return [];
  }, [subCategoriesLvl2, accMode]);

  const dynamicLvl1Parfums = useMemo(() => {
    const list = subCategoriesLvl1.filter((c) => c.parentCategory === 'parfums' && c.visible !== false);
    if (list.length > 0) return list.sort((a, b) => a.order - b.order).map((c) => ({ id: c.id, label: c.name, raw: c }));
    return ANONYM_COLLECTIONS.map((c) => ({ ...c, raw: null }));
  }, [subCategoriesLvl1]);

  // ── FILTERED PRODUCTS COMPUTATIONS ────────────────────────────────────────
  const bijouxProducts = useMemo(() => {
    const allBijoux = products.filter((p) => p.category === 'bijoux');
    if (!bijouxCible && !bijouxType) return allBijoux;

    return allBijoux.filter((p) => {
      if (bijouxCible && bijouxCible !== 'all') {
        if (bijouxCible === 'femme'  && p.gender !== 'femme'  && p.gender !== 'mixte') return false;
        if (bijouxCible === 'homme'  && p.gender !== 'homme'  && p.gender !== 'mixte') return false;
        if (bijouxCible === 'couple' && p.gender !== 'couple') return false;
        if (bijouxCible === 'enfant' && p.gender !== 'enfant' && p.gender !== 'mixte') return false;
      }
      if (bijouxType && bijouxType !== 'all' && bijouxType !== 'autres') {
        const cleanType = bijouxType.replace(/^(femme|homme|enfant|couple|animaux)-/, '').toLowerCase();
        const sub = (p.subCategory || '').toLowerCase();
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

  const embProducts = useMemo(() => {
    const allEmb = products.filter((p) => p.category === 'emballages');
    if (!embMode || embMode === 'all') return allEmb;
    if (!embSousFilter || embSousFilter === 'all') return allEmb;

    const filterClean = (embSousFilter || '').toLowerCase().replace(/^(emb|type|materiau|secteur|occasion)-/, '');
    const keywordMap: Record<string, string[]> = {
      boites:        ['boîte', 'boite', 'coffret', 'écrin', 'ecrin', 'box', 'étui', 'etui'],
      sachets:       ['sachet', 'pochon', 'pochette', 'bag', 'velours'],
      sacs:          ['sac', 'kraft', 'caba', 'tote', 'shopping'],
      pots:          ['pot', 'bocal', 'jarre'],
      flacons:       ['flacon', 'bouteille', 'fiole', 'spray', 'vaporisateur'],
      papier:        ['papier', 'kraft', 'carton'],
      plastique:     ['plastique', 'pvc', 'poly'],
      verre:         ['verre', 'cristal'],
      aluminium:     ['aluminium', 'alu', 'métal', 'metal'],
      biodegradable: ['biodégradable', 'eco', 'écologique', 'recyclé', 'kraft'],
      restauration:  ['restauration', 'alimentaire', 'repas', 'burger', 'nourriture'],
      cosmetiques:   ['cosmétique', 'cosmetique', 'beauté', 'beaute', 'soin'],
      boutiques:     ['boutique', 'magasin', 'shop', 'vente'],
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

  const accProducts = useMemo(() => {
    const allAcc = products.filter((p) => p.category === 'accessoires');
    if (!accMode && !accSubFilter) return allAcc;
    if (accMode === 'all' && (!accSubFilter || accSubFilter === 'all')) return allAcc;

    const filterClean = (accSubFilter && accSubFilter !== 'all' ? accSubFilter : accMode || '').toLowerCase().replace(/^(acc|cadeaux|social|pro|entreprises|anniversaire|mariage|saint-valentin)-/, '');
    if (!filterClean || filterClean === 'all') return allAcc;

    const keywordMap: Record<string, string[]> = {
      verres:      ['verre', 'flûte', 'flute', 'gobelet'],
      tasses:      ['tasse', 'mug', 'thermos', 'gourde'],
      stylos:      ['stylo', 'plume', 'roller'],
      portecles:   ['porte-clé', 'porte-cle', 'keychain', 'porte cle'],
      nounours:    ['nounours', 'peluche', 'ourson', 'ours'],
      bijoux:      ['bijou', 'collier', 'bracelet', 'bague'],
      cadeaux:     ['cadeau', 'coffret', 'box', 'set'],
      social:      ['anniversaire', 'fête', 'mariage', 'baptême', 'soiree'],
      pro:         ['pro', 'bureau', 'entreprise', 'séminaire', 'conference'],
      entreprises: ['entreprise', 'société', 'marque', 'logo', 'corporate'],
    };

    const keywords = keywordMap[filterClean] || [filterClean];
    const filtered = allAcc.filter((p) => {
      const sub = (p.subCategory || '').toLowerCase();
      if (sub === filterClean || sub.includes(filterClean)) return true;
      const text = `${p.name} ${sub} ${p.description || ''} ${p.material || ''}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    });

    return filtered.length > 0 ? filtered : allAcc;
  }, [products, accMode, accSubFilter]);

  // ── FILTER & SORT HELPER ──────────────────────────────────────────────────
  function applyFilters(rawList: Product[]): Product[] {
    let list = [...rawList];

    if (selectedQuickFilter === 'disponible') {
      list = list.filter((p) => p.availability === 'disponible');
    } else if (selectedQuickFilter === 'sur-commande') {
      list = list.filter((p) => p.availability === 'sur-commande' || p.availability === 'en-arrivage');
    } else if (selectedQuickFilter === 'epuise') {
      list = list.filter((p) => p.availability === 'epuise');
    } else if (selectedQuickFilter === 'nouveautes') {
      list = list.filter((p) => p.isFeatured || (p.badge && p.badge.toLowerCase().includes('nouveau')));
    }

    if (minPrice.trim() !== '') {
      const min = Number(minPrice);
      if (!isNaN(min) && min >= 0) list = list.filter((p) => (Number(p.price) || 0) >= min);
    }

    if (maxPrice.trim() !== '') {
      const max = Number(maxPrice);
      if (!isNaN(max) && max >= 0) list = list.filter((p) => (Number(p.price) || 0) <= max);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.refCode.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.material || '').toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      if (sortBy === 'price-asc')  return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name')       return a.name.localeCompare(b.name);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }

  // ── HANDLERS FOR DIRECT LIVE ACTIONS ──────────────────────────────────────
  const handleOpenAddProduct = (cat?: CategoryId, g?: GenderCategory, sub?: string) => {
    setEditingProduct(null);
    setProductFormPreselects({
      category: cat || (selectedCategory as CategoryId),
      gender: g || (bijouxCible as GenderCategory) || 'femme',
      subCategory: sub || (bijouxType || embSousFilter || accSubFilter || 'colliers'),
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (prodData: Product | Omit<Product, 'id'>) => {
    if ('id' in prodData && prodData.id) {
      onUpdateProduct?.(prodData as Product);
    } else {
      onAddProduct?.(prodData as Omit<Product, 'id'>);
    }
  };

  const handleOpenAddSubCat = (level: 1 | 2, parentCat?: CategoryId, level1Id?: string) => {
    setEditingSubCat(null);
    setSubCatModalLevel(level);
    setSubCatModalPreselects({
      parentCategory: parentCat || (selectedCategory as CategoryId),
      level1Id: level1Id || (bijouxCible || embMode || accMode || ''),
    });
    setIsSubCatModalOpen(true);
  };

  const handleOpenEditSubCat = (cat: SubCategoryLevel1 | SubCategoryLevel2, level: 1 | 2) => {
    setEditingSubCat(cat);
    setSubCatModalLevel(level);
    setIsSubCatModalOpen(true);
  };

  const handleOpenDeleteSubCat = (cat: SubCategoryLevel1 | SubCategoryLevel2, level: 1 | 2) => {
    setSubCatToDelete(cat);
    setSubCatDeleteLevel(level);
  };

  const handleConfirmDeleteSubCat = (reassignToSubCatId?: string) => {
    if (!subCatToDelete) return;

    if (reassignToSubCatId) {
      // Reassign affected products
      const matching = products.filter((p) => p.subCategory === subCatToDelete.id || (subCatDeleteLevel === 1 && p.gender === subCatToDelete.id));
      matching.forEach((p) => {
        onUpdateProduct?.({
          ...p,
          subCategory: reassignToSubCatId,
        });
      });
    }

    if (subCatDeleteLevel === 1) {
      onDeleteSubCatLvl1?.(subCatToDelete.id);
    } else {
      onDeleteSubCatLvl2?.(subCatToDelete.id);
    }

    setSubCatToDelete(null);
  };

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
    activeSubCatKey?: string
  ) => {
    const list = applyFilters(rawList);
    const hasActiveFilters = Boolean(
      selectedQuickFilter !== 'tous' || searchQuery.trim() || minPrice.trim() || maxPrice.trim()
    );

    return (
      <section id="catalogue" className="py-12 bg-[#F8F6F2] text-[#1A1A1A] min-h-0">
        <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back + breadcrumb */}
          <div className="flex items-center justify-between mb-4">
            <BackBtn label={backLabel} onClick={onBack} />
            <Breadcrumb parts={breadcrumb} />
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 tracking-tight mb-4 pb-3 border-b border-[#D4AF37]/20 flex items-center justify-between">
            <span>{title}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-sans text-gray-600 font-normal">
                {list.length} produit{list.length > 1 ? 's' : ''} {hasActiveFilters ? `trouvé(s) sur ${rawList.length}` : ''}
              </span>
              {canLiveEdit && (
                <button
                  type="button"
                  onClick={() => handleOpenAddProduct(selectedCategory as CategoryId, bijouxCible as GenderCategory, activeSubCatKey)}
                  className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Nouveau Produit</span>
                </button>
              )}
            </div>
          </h2>

          {/* ── FILTERS ── */}
          <div className="bg-white border border-[#D4AF37]/25 rounded-2xl p-4 mb-6 space-y-3 shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, référence (#001...), description..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-8 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

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
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:text-[#D4AF37] hover:border-[#D4AF37]/40'
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
                  className="bg-gray-50 border border-gray-300 text-xs text-gray-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="featured">Tri : Vedettes</option>
                  <option value="price-asc">Prix ↑</option>
                  <option value="price-desc">Prix ↓</option>
                  <option value="name">Nom A-Z</option>
                </select>

                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl p-0.5">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      viewMode === 'list' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Liste
                  </button>
                  <button
                    onClick={() => setViewMode('carousel')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      viewMode === 'carousel' ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Défilant
                  </button>
                </div>
              </div>
            </div>

            {/* Price filter */}
            <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[#8A6A20] shrink-0 font-semibold">💰 Prix :</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))}
                    placeholder="Min (FCFA)"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <span className="text-gray-400 shrink-0">—</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))}
                    placeholder="Max (FCFA)"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                {(minPrice || maxPrice) && (
                  <button
                    onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                    className="shrink-0 text-rose-600 hover:text-rose-700 transition-colors px-2 py-1 rounded-lg border border-rose-200 bg-rose-50 text-[11px] font-semibold"
                  >
                    ✕ Effacer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── PRODUCT CARDS ── */}
        <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {list.length > 0 ? (
            viewMode === 'carousel' ? (
              <div className="relative">
                <p className="text-[10px] text-gray-500 font-mono mb-2">
                  👉 Glissez horizontalement pour voir tous les modèles ({list.length})
                </p>
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar">
                  {list.map((product) => {
                    const isNouveau = product.isFeatured || product.badge?.toLowerCase().includes('nouveau');
                    const availStatus = product.availability || 'disponible';
                    return (
                      <div
                        key={product.id}
                        onClick={() => onQuickView(product)}
                        className="group relative shrink-0 w-[200px] sm:w-[230px] bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#D4AF37]/50 rounded-2xl p-3 flex flex-col justify-between transition-all cursor-pointer shadow-sm snap-start"
                      >
                        {/* Live Edit Controls on card */}
                        {canLiveEdit && (
                          <div className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-black/85 p-1 rounded-xl shadow-md border border-[#D4AF37]/60">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditProduct(product);
                              }}
                              className="p-1 rounded-lg bg-[#D4AF37] text-black hover:bg-[#F3E5AB]"
                              title="Modifier ce produit"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setProductToDelete(product);
                              }}
                              className="p-1 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                              title="Supprimer ce produit"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <div>
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3 border border-gray-200">
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

                          <h3 className="font-serif font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors text-xs line-clamp-1">
                            {product.name}
                          </h3>
                          {isNouveau && (
                            <span className="inline-block mt-0.5 text-[8px] font-bold text-black bg-[#D4AF37] px-1.5 py-0.5 rounded-full">✨ Nouveau</span>
                          )}
                          <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 font-sans leading-tight">
                            {product.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-[#8A6A20] font-serif">
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
              <div className="space-y-3">
                {list.map((product) => {
                  const availStatus = product.availability || 'disponible';
                  const isNouveau = product.isFeatured || product.badge?.toLowerCase().includes('nouveau');
                  return (
                    <div
                      key={product.id}
                      onClick={() => onQuickView(product)}
                      className="group relative bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#D4AF37]/50 rounded-2xl p-3 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-sm"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
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
                          <h3 className="font-serif font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors text-xs sm:text-sm line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-1 font-sans">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                            <span className="text-xs font-bold text-[#8A6A20] font-serif">
                              {formatPriceFCFA(product.price)}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                              availStatus === 'epuise'
                                ? 'bg-rose-950/80 text-rose-400 border-rose-700/60'
                                : availStatus === 'en-arrivage'
                                ? 'bg-amber-950/80 text-amber-400 border-amber-700/60'
                                : 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                            }`}>
                              {availStatus === 'epuise' ? '🔴 Épuisé' : availStatus === 'en-arrivage' ? '🟡 Sur commande' : '🟢 Disponible'}
                            </span>
                            {isNouveau && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                                ✨ Nouveau
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        {canLiveEdit && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditProduct(product);
                              }}
                              className="p-2 rounded-xl bg-gray-100 hover:bg-[#D4AF37] text-gray-700 hover:text-black transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setProductToDelete(product);
                              }}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(product);
                          }}
                          className="w-9 h-9 rounded-xl bg-[#1A160C] hover:bg-[#D4AF37] border border-[#D4AF37]/40 text-[#D4AF37] hover:text-black flex items-center justify-center font-bold text-lg transition-all shrink-0 shadow-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm">
              <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-serif font-bold text-gray-900 mb-1">Aucun produit trouvé</h3>
              <p className="text-xs text-gray-600 mb-4">Réinitialisez les filtres pour voir tous les articles.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedQuickFilter('tous'); setMinPrice(''); setMaxPrice(''); }}
                className="bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-[#F3E5AB] transition-all cursor-pointer"
              >
                Réinitialiser
              </button>
            </div>
          )}

          {/* ── PROMINENT BOTTOM BUTTON: + AJOUTER UN PRODUIT ICI ── */}
          {canLiveEdit && (
            <div className="mt-10 pt-6 border-t border-[#D4AF37]/30 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenAddProduct(selectedCategory as CategoryId, bijouxCible as GenderCategory, activeSubCatKey)}
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:from-[#F3E5AB] hover:to-[#B8935F] text-black font-serif font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer"
              >
                <Plus className="w-5 h-5 text-black stroke-[3]" />
                <span>+ Ajouter un Produit ici ({title})</span>
              </button>
              <p className="text-[11px] text-gray-500 italic">
                Ce produit sera automatiquement classé dans {title}
              </p>
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
    return (
      <>
        {renderProductList(
          bijouxProducts,
          `← BIJOUX`,
          bijouxType === 'all' ? cibleLabel : `${cibleLabel} › ${typeLabel}`,
          ['BIJOUX', cibleLabel, typeLabel],
          () => { setBijouxType(null); if (bijouxCible === 'all') setBijouxCible(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
          bijouxType
        )}
        {renderModals()}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BIJOUX — Level 2: Types
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
              isEditMode={canLiveEdit}
              onEdit={t.raw ? () => handleOpenEditSubCat(t.raw!, 2) : undefined}
              onDelete={t.raw ? () => handleOpenDeleteSubCat(t.raw!, 2) : undefined}
              onClick={() => { setBijouxType(t.id); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
          ))}

          {/* + Ajouter une Sous-Catégorie Niveau 2 */}
          {canLiveEdit && (
            <button
              type="button"
              onClick={() => handleOpenAddSubCat(2, 'bijoux', bijouxCible)}
              className="w-full py-3.5 px-6 rounded-2xl border-2 border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#8A6A20] font-serif font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>+ Ajouter une Sous-Catégorie Niveau 2 (dans {cibleObj?.label || 'ce genre'})</span>
            </button>
          )}
        </div>
        {renderModals()}
      </PageShell>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BIJOUX — Level 1: Cibles
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'bijoux') {
    const totalBijouxCount = products.filter((p) => p.category === 'bijoux').length;
    const isBijouxStoryVisible = storeInfo?.pageTexts?.bijoux?.storyVisible !== false;
    return (
      <section id="catalogue" className="py-16 bg-[#F8F6F2] text-[#1A1A1A] min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-2">BIJOUX</h2>
            <p className="text-xs text-gray-600">Pour qui souhaitez-vous découvrir nos bijoux ?</p>
          </div>

          {/* Récit Bijoux */}
          {isBijouxStoryVisible && (
            <div className="bg-white rounded-3xl border border-[#D4AF37]/35 p-6 sm:p-10 shadow-sm mb-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              {isEditMode && (
                <div className="flex items-center justify-between gap-2 p-2.5 mb-6 bg-[#141414] border border-[#D4AF37] rounded-xl text-white text-xs">
                  <span className="text-[#F3E5AB] font-serif font-semibold">Section Histoire &amp; Récit Bijoux</span>
                  <button
                    onClick={() => {
                      if (window.confirm('Voulez-vous vraiment supprimer/masquer ce bloc Histoire sur la page Bijoux ?')) {
                        updateTextByPath('pageTexts.bijoux.storyVisible', 'false');
                      }
                    }}
                    className="px-2.5 py-1 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer la section</span>
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 text-[#8C5A2B] text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Bijoux Personnalisés</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A0F0A] tracking-tight">
                    <EditableText
                      path="pageTexts.bijoux.storyTitle"
                      value={storeInfo?.pageTexts?.bijoux?.storyTitle}
                      defaultValue="Une empreinte qui vous ressemble"
                      label="Titre Histoire Bijoux"
                    />
                  </h3>
                  <div className="space-y-3.5 text-sm sm:text-base text-gray-700 font-sans leading-relaxed">
                    <EditableText
                      path="pageTexts.bijoux.storyText1"
                      value={storeInfo?.pageTexts?.bijoux?.storyText1}
                      defaultValue="Chez ANONYM, chaque bijou commence par une histoire — la vôtre. Prénoms gravés, symboles choisis, dates qui comptent : nous transformons vos souvenirs en pièces d'exception, façonnées en acier inoxydable 316L pour traverser le temps sans jamais perdre leur éclat."
                      multiline={true}
                      label="Paragraphe — Histoire Bijoux"
                    />
                  </div>
                </div>
                <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/30 bg-gray-50 group">
                    <EditableImage
                      path="pageTexts.bijoux.storyImageUrl1"
                      src={storeInfo?.pageTexts?.bijoux?.storyImageUrl1}
                      defaultSrc="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop"
                      alt="Bijou Gravé ANONYM"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      label="Image Bijou 1"
                    />
                  </div>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/30 bg-gray-50 group mt-4 sm:mt-6">
                    <EditableImage
                      path="pageTexts.bijoux.storyImageUrl2"
                      src={storeInfo?.pageTexts?.bijoux?.storyImageUrl2}
                      defaultSrc="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop"
                      alt="Ambiance Bijoux ANONYM"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      label="Image Bijou 2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <NavBtn
              label={`✨ TOUS LES BIJOUX (${totalBijouxCount})`}
              index={0}
              variant="bijoux"
              onClick={() => { setBijouxCible('all'); setBijouxType('all'); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
            {dynamicLvl1Bijoux.map((c, idx) => (
              <NavBtn
                key={c.id}
                label={c.label}
                index={idx + 1}
                variant="bijoux"
                isEditMode={canLiveEdit}
                onEdit={c.raw ? () => handleOpenEditSubCat(c.raw!, 1) : undefined}
                onDelete={c.raw ? () => handleOpenDeleteSubCat(c.raw!, 1) : undefined}
                onClick={() => setBijouxCible(c.id)}
              />
            ))}

            {/* + Ajouter une Sous-Catégorie Niveau 1 */}
            {canLiveEdit && (
              <button
                type="button"
                onClick={() => handleOpenAddSubCat(1, 'bijoux')}
                className="w-full py-3.5 px-6 rounded-2xl border-2 border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#8A6A20] font-serif font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>+ Ajouter une Sous-Catégorie Niveau 1 (Bijoux)</span>
              </button>
            )}
          </div>
        </motion.div>
        {renderModals()}
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACCESSOIRES — Level 3: Products
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'accessoires' && accMode && accSubFilter) {
    const parentLabel = accMode === 'all' ? 'TOUS LES ACCESSOIRES' : (dynamicLvl1Accessoires.find((o) => o.id === accMode)?.label || accMode.toUpperCase());
    const subLabel = accSubFilter === 'all' ? 'TOUS LES MODÈLES' : (dynamicLvl2Accessoires.find((s) => s.id === accSubFilter)?.label || accSubFilter.toUpperCase());
    return (
      <>
        {renderProductList(
          accProducts,
          `← ACCESSOIRES`,
          accSubFilter === 'all' ? parentLabel : `${parentLabel} › ${subLabel}`,
          ['ACCESSOIRES', parentLabel, subLabel],
          () => { setAccSubFilter(null); if (accMode === 'all') setAccMode(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
          accSubFilter
        )}
        {renderModals()}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACCESSOIRES — Level 2: Sous-catégories
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
                isEditMode={canLiveEdit}
                onEdit={s.raw ? () => handleOpenEditSubCat(s.raw!, 2) : undefined}
                onDelete={s.raw ? () => handleOpenDeleteSubCat(s.raw!, 2) : undefined}
                onClick={() => { setAccSubFilter(s.id); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
              />
            ))}

            {canLiveEdit && (
              <button
                type="button"
                onClick={() => handleOpenAddSubCat(2, 'accessoires', accMode)}
                className="w-full py-3.5 px-6 rounded-2xl border-2 border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#8A6A20] font-serif font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>+ Ajouter une Sous-Catégorie Niveau 2 (dans {modeObj?.label || 'cette section'})</span>
              </button>
            )}
          </div>
          {renderModals()}
        </PageShell>
      );
    } else {
      return (
        <>
          {renderProductList(
            accProducts,
            '← ACCESSOIRES',
            modeObj?.label || accMode.toUpperCase(),
            ['ACCESSOIRES', modeObj?.label || ''],
            () => { setAccMode(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
            accMode
          )}
          {renderModals()}
        </>
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACCESSOIRES — Level 1: Subcategories
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'accessoires') {
    const totalAccCount = products.filter((p) => p.category === 'accessoires').length;
    const isAccStoryVisible = storeInfo?.pageTexts?.accessoires?.storyVisible !== false;
    return (
      <section id="catalogue" className="py-16 bg-[#F8F6F2] text-[#1A1A1A] min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-2">ACCESSOIRES</h2>
            <p className="text-xs text-gray-600">Sélectionnez une catégorie d'accessoires.</p>
          </div>

          {/* Récit Accessoires */}
          {isAccStoryVisible && (
            <div className="bg-white rounded-3xl border border-[#D4AF37]/35 p-6 sm:p-10 shadow-sm mb-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              {isEditMode && (
                <div className="flex items-center justify-between gap-2 p-2.5 mb-6 bg-[#141414] border border-[#D4AF37] rounded-xl text-white text-xs">
                  <span className="text-[#F3E5AB] font-serif font-semibold">Section Histoire &amp; Récit Accessoires</span>
                  <button
                    onClick={() => {
                      if (window.confirm('Voulez-vous vraiment supprimer/masquer ce bloc Histoire sur la page Accessoires ?')) {
                        updateTextByPath('pageTexts.accessoires.storyVisible', 'false');
                      }
                    }}
                    className="px-2.5 py-1 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer la section</span>
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 text-[#8C5A2B] text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Accessoires Personnalisables</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A0F0A] tracking-tight">
                    <EditableText
                      path="pageTexts.accessoires.storyTitle"
                      value={storeInfo?.pageTexts?.accessoires?.storyTitle}
                      defaultValue="L'élégance au quotidien"
                      label="Titre Histoire Accessoires"
                    />
                  </h3>
                  <div className="space-y-3.5 text-sm sm:text-base text-gray-700 font-sans leading-relaxed">
                    <EditableText
                      path="pageTexts.accessoires.storyText1"
                      value={storeInfo?.pageTexts?.accessoires?.storyText1}
                      defaultValue="Au-delà des bijoux, ANONYM imagine des accessoires qui allient praticité et raffinement — pensés pour accompagner votre quotidien tout en portant votre signature."
                      multiline={true}
                      label="Paragraphe — Histoire Accessoires"
                    />
                  </div>
                </div>
                <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/30 bg-gray-50 group">
                    <EditableImage
                      path="pageTexts.accessoires.storyImageUrl1"
                      src={storeInfo?.pageTexts?.accessoires?.storyImageUrl1}
                      defaultSrc="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop"
                      alt="Accessoire Personnalisé ANONYM"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      label="Image Accessoire 1"
                    />
                  </div>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/30 bg-gray-50 group mt-4 sm:mt-6">
                    <EditableImage
                      path="pageTexts.accessoires.storyImageUrl2"
                      src={storeInfo?.pageTexts?.accessoires?.storyImageUrl2}
                      defaultSrc="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop"
                      alt="Style Accessoire ANONYM"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      label="Image Accessoire 2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
                isEditMode={canLiveEdit}
                onEdit={item.raw ? () => handleOpenEditSubCat(item.raw!, 1) : undefined}
                onDelete={item.raw ? () => handleOpenDeleteSubCat(item.raw!, 1) : undefined}
                onClick={() => { setAccMode(item.id); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
              />
            ))}

            {canLiveEdit && (
              <button
                type="button"
                onClick={() => handleOpenAddSubCat(1, 'accessoires')}
                className="w-full py-3.5 px-6 rounded-2xl border-2 border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#8A6A20] font-serif font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>+ Ajouter une Sous-Catégorie Niveau 1 (Accessoires)</span>
              </button>
            )}
          </div>
        </motion.div>
        {renderModals()}
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ANONYM (PARFUMS) — Level 2: Products
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'parfums' && anonymCollection) {
    const colLabel = anonymCollection === 'all' ? 'TOUS LES PARFUMS ANONYM' : (dynamicLvl1Parfums.find((c) => c.id === anonymCollection)?.label || anonymCollection.toUpperCase());
    return (
      <>
        {renderProductList(
          parfumProducts,
          '← ANONYM',
          colLabel,
          ['ANONYM', colLabel],
          () => { setAnonymCollection(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
          anonymCollection
        )}
        {renderModals()}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ANONYM (PARFUMS) — Level 1: Collections
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'parfums') {
    const totalParfumsCount = products.filter((p) => p.category === 'parfums').length;
    const isStoryVisible = storeInfo?.pageTexts?.parfums?.storyVisible !== false;

    return (
      <section id="catalogue" className="py-16 bg-[#F8F6F2] text-[#1A1A1A] min-h-0">
        <motion.div
          initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-2">ANONYM</h2>
            <p className="text-xs text-gray-600 italic">L'univers olfactif ANONYM — Sélectionnez une référence.</p>
          </div>

          {/* Récit Parfums */}
          {isStoryVisible && (
            <div className="bg-white rounded-3xl border border-[#D4AF37]/35 p-6 sm:p-10 shadow-sm mb-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              {isEditMode && (
                <div className="flex items-center justify-between gap-2 p-2.5 mb-6 bg-[#141414] border border-[#D4AF37] rounded-xl text-white text-xs">
                  <span className="text-[#F3E5AB] font-serif font-semibold">Section Histoire &amp; Récit Parfums</span>
                  <button
                    onClick={() => {
                      if (window.confirm('Voulez-vous vraiment supprimer/masquer ce bloc Histoire sur la page Parfums ?')) {
                        updateTextByPath('pageTexts.parfums.storyVisible', 'false');
                      }
                    }}
                    className="px-2.5 py-1 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer la section</span>
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 text-[#8C5A2B] text-xs font-semibold uppercase tracking-wider">
                    <Droplets className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>L'Univers du Parfum</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A0F0A] tracking-tight">
                    <EditableText
                      path="pageTexts.parfums.storyTitle"
                      value={storeInfo?.pageTexts?.parfums?.storyTitle}
                      defaultValue="L'essence d'un nom"
                      label="Titre Histoire Parfums"
                    />
                  </h3>
                  <div className="space-y-3.5 text-sm sm:text-base text-gray-700 font-sans leading-relaxed">
                    <EditableText
                      path="pageTexts.parfums.storyText1"
                      value={storeInfo?.pageTexts?.parfums?.storyText1}
                      defaultValue="ANONYM n'est pas qu'un parfum, c'est une signature discrète. Le nom lui-même porte cette philosophie : rester en retrait, laisser le sillage parler à votre place."
                      multiline={true}
                      label="Paragraphe 1 — Histoire Parfums"
                    />
                  </div>
                </div>
                <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/30 bg-gray-50 group">
                    <EditableImage
                      path="pageTexts.parfums.storyImageUrl1"
                      src={storeInfo?.pageTexts?.parfums?.storyImageUrl1}
                      defaultSrc="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop"
                      alt="Parfum ANONYM"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      label="Image Flacon 1"
                    />
                  </div>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/30 bg-gray-50 group mt-4 sm:mt-6">
                    <EditableImage
                      path="pageTexts.parfums.storyImageUrl2"
                      src={storeInfo?.pageTexts?.parfums?.storyImageUrl2}
                      defaultSrc="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"
                      alt="Ambiance Olfactive ANONYM"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      label="Image Flacon 2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <NavBtn
              label={`✨ TOUS LES PARFUMS ANONYM (${totalParfumsCount})`}
              index={0}
              variant="anonym"
              onClick={() => { setAnonymCollection('all'); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
            {dynamicLvl1Parfums.map((c, idx) => (
              <NavBtn
                key={c.id}
                label={c.label}
                index={idx + 1}
                variant="anonym"
                isEditMode={canLiveEdit}
                onEdit={c.raw ? () => handleOpenEditSubCat(c.raw!, 1) : undefined}
                onDelete={c.raw ? () => handleOpenDeleteSubCat(c.raw!, 1) : undefined}
                onClick={() => setAnonymCollection(c.id)}
              />
            ))}

            {canLiveEdit && (
              <button
                type="button"
                onClick={() => handleOpenAddSubCat(1, 'parfums')}
                className="w-full py-3.5 px-6 rounded-2xl border-2 border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#8A6A20] font-serif font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>+ Ajouter une Gamme / Collection Parfum (Niv. 1)</span>
              </button>
            )}
          </div>
        </motion.div>
        {renderModals()}
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EMBALLAGES — Level 3: Products
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'emballages' && embMode && embSousFilter) {
    const modeLabel = embMode === 'all' ? 'TOUS LES EMBALLAGES' : (EMB_MODES.find((m) => m.id === embMode)?.label || embMode.toUpperCase());
    const sousLabel = embSousFilter === 'all' ? 'TOUS LES PRODUITS' : (EMB_SOUS_CATEGORIES[embMode]?.find((s) => s.id === embSousFilter)?.label || embSousFilter.toUpperCase());
    return (
      <>
        {renderProductList(
          embProducts,
          `← EMBALLAGES`,
          embSousFilter === 'all' ? modeLabel : `${modeLabel} › ${sousLabel}`,
          ['EMBALLAGES', modeLabel, sousLabel],
          () => { setEmbSousFilter(null); if (embMode === 'all') setEmbMode(null); setSearchQuery(''); setSelectedQuickFilter('tous'); },
          embSousFilter
        )}
        {renderModals()}
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EMBALLAGES — Level 2: Sous-catégories
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'emballages' && embMode) {
    const modeObj = EMB_MODES.find((m) => m.id === embMode);
    const sousCats = dynamicLvl2Emballages;
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
              isEditMode={canLiveEdit}
              onEdit={s.raw ? () => handleOpenEditSubCat(s.raw!, 2) : undefined}
              onDelete={s.raw ? () => handleOpenDeleteSubCat(s.raw!, 2) : undefined}
              onClick={() => { setEmbSousFilter(s.id); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
          ))}

          {canLiveEdit && (
            <button
              type="button"
              onClick={() => handleOpenAddSubCat(2, 'emballages', embMode)}
              className="w-full py-3.5 px-6 rounded-2xl border-2 border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#8A6A20] font-serif font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>+ Ajouter une Sous-Catégorie Niveau 2 (dans {modeObj?.label || 'cette section'})</span>
            </button>
          )}
        </div>
        {renderModals()}
      </PageShell>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EMBALLAGES — Level 1: Modes
  // ─────────────────────────────────────────────────────────────────────────
  if (selectedCategory === 'emballages') {
    const totalEmbCount = products.filter((p) => p.category === 'emballages').length;
    const isEmbStoryVisible = storeInfo?.pageTexts?.emballages?.storyVisible !== false;
    return (
      <section id="catalogue" className="py-16 bg-[#F8F6F2] text-[#1A1A1A] min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-2">EMBALLAGES</h2>
            <p className="text-xs text-gray-600">Comment souhaitez-vous rechercher votre emballage ?</p>
          </div>

          {/* Récit Emballages */}
          {isEmbStoryVisible && (
            <div className="bg-white rounded-3xl border border-[#D4AF37]/35 p-6 sm:p-10 shadow-sm mb-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              {isEditMode && (
                <div className="flex items-center justify-between gap-2 p-2.5 mb-6 bg-[#141414] border border-[#D4AF37] rounded-xl text-white text-xs">
                  <span className="text-[#F3E5AB] font-serif font-semibold">Section Histoire &amp; Récit Emballages</span>
                  <button
                    onClick={() => {
                      if (window.confirm('Voulez-vous vraiment supprimer/masquer ce bloc Histoire sur la page Emballages ?')) {
                        updateTextByPath('pageTexts.emballages.storyVisible', 'false');
                      }
                    }}
                    className="px-2.5 py-1 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer la section</span>
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 text-[#8C5A2B] text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Emballages Personnalisés</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A0F0A] tracking-tight">
                    <EditableText
                      path="pageTexts.emballages.storyTitle"
                      value={storeInfo?.pageTexts?.emballages?.storyTitle}
                      defaultValue="Le premier geste d'une histoire"
                      label="Titre Histoire Emballages"
                    />
                  </h3>
                  <div className="space-y-3.5 text-sm sm:text-base text-gray-700 font-sans leading-relaxed">
                    <EditableText
                      path="pageTexts.emballages.storyText1"
                      value={storeInfo?.pageTexts?.emballages?.storyText1}
                      defaultValue="Un cadeau se raconte avant même d'être ouvert. Nos emballages personnalisés sont pensés comme une extension de votre attention."
                      multiline={true}
                      label="Paragraphe — Histoire Emballages"
                    />
                  </div>
                </div>
                <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/30 bg-gray-50 group">
                    <EditableImage
                      path="pageTexts.emballages.storyImageUrl1"
                      src={storeInfo?.pageTexts?.emballages?.storyImageUrl1}
                      defaultSrc="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"
                      alt="Emballage Cadeau ANONYM"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      label="Image Emballage 1"
                    />
                  </div>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/30 bg-gray-50 group mt-4 sm:mt-6">
                    <EditableImage
                      path="pageTexts.emballages.storyImageUrl2"
                      src={storeInfo?.pageTexts?.emballages?.storyImageUrl2}
                      defaultSrc="https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800&auto=format&fit=crop"
                      alt="Finitions Emballage ANONYM"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      label="Image Emballage 2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <NavBtn
              label={`✨ TOUS LES EMBALLAGES (${totalEmbCount})`}
              index={0}
              variant="emballages"
              onClick={() => { setEmbMode('all'); setEmbSousFilter('all'); setSearchQuery(''); setSelectedQuickFilter('tous'); }}
            />
            {dynamicLvl1Emballages.map((m, idx) => (
              <NavBtn
                key={m.id}
                label={m.label}
                index={idx + 1}
                variant="emballages"
                isEditMode={canLiveEdit}
                onEdit={m.raw ? () => handleOpenEditSubCat(m.raw!, 1) : undefined}
                onDelete={m.raw ? () => handleOpenDeleteSubCat(m.raw!, 1) : undefined}
                onClick={() => setEmbMode(m.id)}
              />
            ))}

            {canLiveEdit && (
              <button
                type="button"
                onClick={() => handleOpenAddSubCat(1, 'emballages')}
                className="w-full py-3.5 px-6 rounded-2xl border-2 border-dashed border-[#D4AF37]/60 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#8A6A20] font-serif font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>+ Ajouter une Sous-Catégorie Niveau 1 (Emballages)</span>
              </button>
            )}
          </div>
        </motion.div>
        {renderModals()}
      </section>
    );
  }

  // Helper to render modals cleanly across all views
  function renderModals() {
    return (
      <>
        {/* Product Form Modal (Add / Edit) */}
        <ProductFormModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          editingProduct={editingProduct}
          initialCategory={productFormPreselects.category || (selectedCategory as CategoryId)}
          initialGender={productFormPreselects.gender || 'femme'}
          initialSubCategory={productFormPreselects.subCategory}
          collections={collections}
          subCategoriesLvl1={subCategoriesLvl1}
          subCategoriesLvl2={subCategoriesLvl2}
          productsCount={products.length}
          onSave={handleSaveProduct}
        />

        {/* Product Delete Confirmation Modal */}
        <ProductDeleteModal
          isOpen={Boolean(productToDelete)}
          onClose={() => setProductToDelete(null)}
          product={productToDelete}
          onConfirmDelete={() => {
            if (productToDelete) onDeleteProduct?.(productToDelete.id);
          }}
        />

        {/* SubCategory Form Modal (Add / Edit) */}
        <SubCategoryFormModal
          isOpen={isSubCatModalOpen}
          onClose={() => setIsSubCatModalOpen(false)}
          level={subCatModalLevel}
          editingSubCategory={editingSubCat}
          defaultParentCategory={subCatModalPreselects.parentCategory || (selectedCategory as CategoryId)}
          defaultLevel1Id={subCatModalPreselects.level1Id}
          subCategoriesLvl1={subCategoriesLvl1}
          onSaveLvl1={(cat) => {
            if ('id' in cat && cat.id) onUpdateSubCatLvl1?.(cat as SubCategoryLevel1);
            else onAddSubCatLvl1?.(cat as Omit<SubCategoryLevel1, 'id' | 'order'>);
          }}
          onSaveLvl2={(cat) => {
            if ('id' in cat && cat.id) onUpdateSubCatLvl2?.(cat as SubCategoryLevel2);
            else onAddSubCatLvl2?.(cat as Omit<SubCategoryLevel2, 'id' | 'order'>);
          }}
        />

        {/* SubCategory Delete Modal with Reassignment */}
        <SubCategoryDeleteModal
          isOpen={Boolean(subCatToDelete)}
          onClose={() => setSubCatToDelete(null)}
          subCategory={subCatToDelete}
          level={subCatDeleteLevel}
          affectedProductsCount={
            subCatToDelete
              ? products.filter((p) => p.subCategory === subCatToDelete.id || (subCatDeleteLevel === 1 && p.gender === subCatToDelete.id)).length
              : 0
          }
          availableReplacementSubCats={
            subCatDeleteLevel === 1
              ? subCategoriesLvl1.filter((c) => c.id !== subCatToDelete?.id && c.parentCategory === subCatToDelete?.parentCategory)
              : subCategoriesLvl2.filter((c) => c.id !== subCatToDelete?.id && c.parentCategory === subCatToDelete?.parentCategory)
          }
          onConfirmDelete={handleConfirmDeleteSubCat}
        />
      </>
    );
  }

  return (
    <section id="catalogue" className="py-16 bg-[#F8F6F2] text-[#1A1A1A] min-h-0">
      <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-2">
            {selectedCategory.toUpperCase()}
          </h2>
        </div>
      </div>
      {renderModals()}
    </section>
  );
};
