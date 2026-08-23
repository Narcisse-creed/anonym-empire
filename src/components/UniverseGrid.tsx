import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UNIVERSE_CATEGORIES } from '../data/categories';
import { StoreInfo, CategoryId } from '../types';
import { Home, Gem, Sparkles, Package, ShoppingBag, ChevronLeft, ShieldCheck, Award, Truck } from 'lucide-react';
import { EditableText } from './editor/EditableText';

interface UniverseGridProps {
  activeCategory: CategoryId | 'accueil' | 'contact';
  showGrid: boolean;
  onSelectCategory: (cat: CategoryId | 'accueil' | 'contact') => void;
  onBackToGrid: () => void;
  storeInfo?: StoreInfo;
}

// Rich media per card
const CARD_MEDIA: Record<string, { image: string; desc: string; itemCount?: number }> = {
  accueil: {
    image: '/images/lizie-white-suit.jpg',
    desc: 'Maison de Création & Direction',
  },
  bijoux: {
    image: '/images/products/model-001.jpg',
    desc: 'Colliers, bracelets, bagues & manchettes personnalisés',
    itemCount: 211,
  },
  emballages: {
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    desc: 'Coffrets, boîtes & packaging professionnel de prestige',
    itemCount: 8,
  },
  parfums: {
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop',
    desc: "L'univers olfactif ANONYM INVITATION",
    itemCount: 6,
  },
  accessoires: {
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    desc: 'Verres, tasses, stylos & objets de marque sur-mesure',
    itemCount: 12,
  },
};

const getIconLarge = (iconName: string) => {
  const cls = 'w-7 h-7 text-[#D4AF37]';
  switch (iconName) {
    case 'Gem':      return <Gem className={cls} />;
    case 'Sparkles': return <Sparkles className={cls} />;
    case 'Package':  return <Package className={cls} />;
    case 'KeyRound': return <ShoppingBag className={cls} />;
    default:         return <Gem className={cls} />;
  }
};

// All 5 items definition
const ALL_ITEMS = [
  {
    id: 'accueil' as const,
    title: 'À PROPOS',
    subtitle: 'Maison de Création & Direction',
    iconName: 'Home',
  },
  ...UNIVERSE_CATEGORIES.map((cat) => ({
    id: cat.id,
    title: cat.title.toUpperCase(),
    subtitle: cat.subtitle,
    iconName: cat.iconName,
  })),
];

export const UniverseGrid: React.FC<UniverseGridProps> = ({
  activeCategory,
  showGrid,
  onSelectCategory,
  onBackToGrid,
  storeInfo,
}) => {
  const activeItem = ALL_ITEMS.find((i) => i.id === activeCategory);

  return (
    <section
      id="universe-nav"
      className="bg-[#F0EDE7] border-b border-[#D4AF37]/20 sticky top-20 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md"
    >
      <AnimatePresence mode="wait">
        {showGrid ? (
          /* ── GRID VIEW : 5 large visual cards ── */
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 space-y-4 sm:space-y-6"
          >
            {/* ── §4 CRITICAL MANDATORY REQUIREMENT: 5 cards ALWAYS aligned horizontally on 1 single line on ALL devices (flex flex-nowrap overflow-x-auto, NO vertical stack/wrap allowed) ── */}
            <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden gap-3 sm:gap-4 lg:gap-6 pb-3 scrollbar-thin scrollbar-thumb-[#D4AF37]/50 scrollbar-track-black/60 items-stretch snap-x snap-mandatory">
              {ALL_ITEMS.map((item, idx) => {
                const media = CARD_MEDIA[item.id] || { image: '', desc: '' };
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    onClick={() => onSelectCategory(item.id)}
                    className="group relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 hover:border-[#D4AF37] bg-[#0F0F0F] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] cursor-pointer flex flex-col justify-end min-h-[220px] sm:min-h-[250px] lg:min-h-[290px] xl:min-h-[330px] min-w-[170px] sm:min-w-[190px] md:min-w-0 md:flex-1 shrink-0 snap-start focus:outline-none"
                    aria-label={`Ouvrir la section ${item.title}`}
                  >
                    {/* Background image */}
                    <img
                      src={media.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop';
                      }}
                      className="absolute inset-0 w-full h-full object-cover object-center opacity-55 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

                    {/* Item count badge */}
                    {media.itemCount !== undefined && (
                      <span className="absolute top-3 right-3 bg-black/80 text-[#D4AF37] text-[9px] sm:text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-[#D4AF37]/40 backdrop-blur-sm">
                        {media.itemCount} Modèles
                      </span>
                    )}

                    {/* Card body */}
                    <div className="relative z-10 p-4 sm:p-5 lg:p-6 flex flex-col items-center text-center space-y-2">
                      {/* Icon circle */}
                      <div className="w-11 h-11 lg:w-13 lg:h-13 rounded-full bg-black/80 border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_14px_rgba(212,175,55,0.45)] group-hover:scale-110 transition-transform duration-300">
                        {item.id === 'accueil'
                          ? <Home className="w-5 h-5 lg:w-6 lg:h-6 text-[#D4AF37]" />
                          : getIconLarge(item.iconName)}
                      </div>

                      {/* Title */}
                      <EditableText
                        path={`pageTexts.universe.${item.id}.title`}
                        value={storeInfo?.pageTexts?.[item.id]?.title}
                        defaultValue={item.title}
                        as="h3"
                        className="text-sm sm:text-base lg:text-lg font-serif font-bold text-white tracking-widest uppercase group-hover:text-[#D4AF37] transition-colors leading-tight"
                        label={`Titre Carte ${item.id}`}
                      />

                      {/* Gold separator */}
                      <div className="w-8 lg:w-10 h-[1.5px] bg-[#D4AF37]/50 group-hover:w-14 transition-all duration-300 rounded-full" />

                      {/* Description */}
                      <EditableText
                        path={`pageTexts.universe.${item.id}.description`}
                        value={storeInfo?.pageTexts?.[item.id]?.description}
                        defaultValue={media.desc}
                        as="p"
                        className="text-[10px] sm:text-xs lg:text-sm text-gray-400 font-sans line-clamp-2 leading-relaxed max-w-[150px] sm:max-w-none"
                        label={`Description Carte ${item.id}`}
                      />

                      {/* CTA */}
                      <span className="text-[9px] sm:text-[10px] lg:text-xs font-mono text-[#F3E5AB] font-bold uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform pt-0.5">
                        Explorer ›
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* ── §4 CRITICAL REQUIREMENT: Trust Badges Row (bandeau de garanties) MUST be placed BELOW the 5 cards ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-6 sm:pt-8 border-t border-[#D4AF37]/25 mt-4 sm:mt-6"
            >
              <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-[#D4AF37]/25 shadow-sm hover:border-[#D4AF37] hover:shadow-[0_0_16px_rgba(212,175,55,0.15)] transition-all">
                <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
                  <ShieldCheck className="w-6 h-6 lg:w-7 lg:h-7" />
                </div>
                <div>
                  <EditableText
                    path="pageTexts.trustBadges.badge1Title"
                    value={storeInfo?.pageTexts?.trustBadges?.badge1Title}
                    defaultValue="Garantie 1 An Inaltérable"
                    as="h4"
                    className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900"
                    label="Garantie 1 - Titre"
                  />
                  <EditableText
                    path="pageTexts.trustBadges.badge1Desc"
                    value={storeInfo?.pageTexts?.trustBadges?.badge1Desc}
                    defaultValue="Acier Inoxydable 316L résistant eau & parfum"
                    as="p"
                    className="text-[11px] sm:text-xs lg:text-sm text-gray-600"
                    label="Garantie 1 - Description"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-[#D4AF37]/25 shadow-sm hover:border-[#D4AF37] hover:shadow-[0_0_16px_rgba(212,175,55,0.15)] transition-all">
                <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
                  <Award className="w-6 h-6 lg:w-7 lg:h-7" />
                </div>
                <div>
                  <EditableText
                    path="pageTexts.trustBadges.badge2Title"
                    value={storeInfo?.pageTexts?.trustBadges?.badge2Title}
                    defaultValue="Gravure Laser Millimétrée"
                    as="h4"
                    className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900"
                    label="Garantie 2 - Titre"
                  />
                  <EditableText
                    path="pageTexts.trustBadges.badge2Desc"
                    value={storeInfo?.pageTexts?.trustBadges?.badge2Desc}
                    defaultValue="Prénoms, dates, symboles & photos sur-mesure"
                    as="p"
                    className="text-[11px] sm:text-xs lg:text-sm text-gray-600"
                    label="Garantie 2 - Description"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#D4AF37]/25 shadow-sm hover:border-[#D4AF37] hover:shadow-[0_0_16px_rgba(212,175,55,0.15)] transition-all">
                <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <EditableText
                    path="pageTexts.trustBadges.badge3Title"
                    value={storeInfo?.pageTexts?.trustBadges?.badge3Title}
                    defaultValue="Expédition Tout le Bénin"
                    as="h4"
                    className="text-xs sm:text-sm font-semibold text-gray-900"
                    label="Garantie 3 - Titre"
                  />
                  <EditableText
                    path="pageTexts.trustBadges.badge3Desc"
                    value={storeInfo?.pageTexts?.trustBadges?.badge3Desc}
                    defaultValue="Livraison Cotonou, Calavi, Parakou & sous-région"
                    as="p"
                    className="text-[11px] sm:text-xs text-gray-600"
                    label="Garantie 3 - Description"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* ── CONTENT VIEW : slim active-tab bar + back button ── */
          <motion.div
            key="content-bar"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3"
          >
            {/* Back button */}
            <button
              onClick={onBackToGrid}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#FDF9F2] hover:border-[#D4AF37] transition-all cursor-pointer text-xs font-semibold shrink-0 shadow-sm"
              aria-label="Retour aux catégories"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </button>

            {/* Active category chip */}
            {activeItem && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#1A160C] to-[#121212] border border-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,0.25)]">
                <span className="w-7 h-7 rounded-full bg-black/80 border border-[#D4AF37]/60 flex items-center justify-center shrink-0">
                  {activeItem.id === 'accueil'
                    ? <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
                    : (() => {
                        const cls = 'w-3.5 h-3.5 text-[#D4AF37]';
                        switch (activeItem.iconName) {
                          case 'Gem':      return <Gem className={cls} />;
                          case 'Sparkles': return <Sparkles className={cls} />;
                          case 'Package':  return <Package className={cls} />;
                          default:         return <ShoppingBag className={cls} />;
                        }
                      })()
                  }
                </span>
                <span className="text-xs font-serif font-bold text-[#F3E5AB] tracking-widest uppercase">
                  {activeItem.title}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
