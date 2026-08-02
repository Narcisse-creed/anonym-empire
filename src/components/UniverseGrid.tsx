import React from 'react';
import { UNIVERSE_CATEGORIES } from '../data/categories';
import { CategoryId } from '../types';
import { Home, Gem, Sparkles, Package, ShoppingBag } from 'lucide-react';

interface UniverseGridProps {
  activeCategory: CategoryId | 'accueil';
  onSelectCategory: (cat: CategoryId | 'accueil') => void;
  onNavigateCatalog: () => void;
}

export const UniverseGrid: React.FC<UniverseGridProps> = ({
  activeCategory,
  onSelectCategory,
  onNavigateCatalog,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gem':
        return <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />;
      case 'Package':
        return <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />;
      case 'KeyRound':
        return <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />;
      default:
        return <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />;
    }
  };

  const handleCategoryClick = (id: CategoryId | 'accueil') => {
    onSelectCategory(id);
    if (id === 'accueil') {
      const el = document.getElementById('hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigateCatalog();
      const el = document.getElementById('catalogue');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Build 5 Items: ACCUEIL + 4 CATEGORIES
  const items = [
    {
      id: 'accueil' as const,
      title: 'ACCUEIL',
      icon: <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />,
    },
    ...UNIVERSE_CATEGORIES.map((cat) => ({
      id: cat.id,
      title: cat.title.toUpperCase(),
      icon: getIcon(cat.iconName),
    })),
  ];

  // Images for rich visual cards (Section 27)
  const categoryMedia: Record<string, { image: string; desc: string }> = {
    accueil: {
      image: '/images/lizie-white-suit.jpg',
      desc: 'Maison de Création & Direction',
    },
    bijoux: {
      image: '/images/products/model-001.jpg',
      desc: 'Colliers, bracelets, bagues & manchettes personnalisés',
    },
    emballages: {
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
      desc: 'Coffrets, boîtes & packaging professionnel de prestige',
    },
    parfums: {
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop',
      desc: 'L\'univers olfactif ANONYM INVITATION',
    },
    accessoires: {
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
      desc: 'Verres, tasses, stylos & objets de marque sur-mesure',
    },
  };

  return (
    <>
      {/* Sticky Compact 1-Row Navigation Bar (Section 6a / Requirement 1) */}
      <section className="py-4 bg-[#0A0A0A] border-y border-[#D4AF37]/30 sticky top-20 z-30 shadow-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-1.5 sm:px-4">
          <div className="grid grid-cols-5 gap-1 sm:gap-2.5">
            {items.map((item) => {
              const isSelected = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleCategoryClick(item.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-1 sm:px-3 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#221B0B] to-[#121212] border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.35)] ring-1 ring-[#D4AF37]'
                      : 'bg-[#121212] border-gray-800 text-gray-300 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-[#181818]'
                  }`}
                >
                  <span className="shrink-0 p-1 rounded-full bg-black/60 border border-[#D4AF37]/30">
                    {item.icon}
                  </span>
                  <span className="text-[10px] sm:text-xs font-serif font-bold tracking-wider uppercase text-center sm:text-left truncate">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rich Visual Vertical Category Showcase Cards (Section 27 - Aesthetic Upgrade) */}
      {activeCategory === 'accueil' && (
        <section className="py-12 bg-[#060606] text-white border-b border-[#D4AF37]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-[11px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest block mb-2">
                NOS UNIVERS DE PERSONNALISATION
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Découvrez nos catégories d'articles
              </h2>
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {UNIVERSE_CATEGORIES.map((cat) => {
                const media = categoryMedia[cat.id] || { image: cat.image, desc: cat.description };
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="group relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#0F0F0F] transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer shadow-xl flex flex-col justify-end min-h-[320px] sm:min-h-[360px]"
                  >
                    {/* Background Image */}
                    <img
                      src={media.image}
                      alt={cat.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-85"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Item count badge */}
                    <span className="absolute top-4 right-4 bg-black/80 text-[#D4AF37] text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-[#D4AF37]/40 backdrop-blur-sm shadow">
                      {cat.itemCount} Modèles
                    </span>

                    {/* Content Card Body */}
                    <div className="relative z-10 p-6 space-y-2 text-center flex flex-col items-center">
                      {/* Icon in gold circle */}
                      <div className="w-12 h-12 rounded-full bg-black/80 border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] mb-1 group-hover:scale-110 transition-transform">
                        {getIcon(cat.iconName)}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-serif font-bold text-white tracking-wider uppercase group-hover:text-[#D4AF37] transition-colors">
                        {cat.title}
                      </h3>

                      {/* Gold Separator Line */}
                      <div className="w-10 h-0.5 bg-[#D4AF37]/60 group-hover:w-16 transition-all duration-300" />

                      {/* Short Description */}
                      <p className="text-xs text-gray-300 font-sans line-clamp-2 leading-relaxed max-w-xs">
                        {media.desc}
                      </p>

                      <span className="text-[10px] font-mono text-[#F3E5AB] font-bold uppercase pt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Explorer la catégorie</span> ›
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
