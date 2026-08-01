import React from 'react';
import { UNIVERSE_CATEGORIES } from '../data/categories';
import { CategoryId } from '../types';
import { Gem, Sparkles, Package, KeyRound, ArrowRight } from 'lucide-react';

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
        return <Gem className="w-7 h-7 text-[#D4AF37]" />;
      case 'Sparkles':
        return <Sparkles className="w-7 h-7 text-[#D4AF37]" />;
      case 'Package':
        return <Package className="w-7 h-7 text-[#D4AF37]" />;
      case 'KeyRound':
        return <KeyRound className="w-7 h-7 text-[#D4AF37]" />;
      default:
        return <Gem className="w-7 h-7 text-[#D4AF37]" />;
    }
  };

  const handleCategoryClick = (id: CategoryId | 'accueil') => {
    onSelectCategory(id);
    onNavigateCatalog();
  };

  return (
    <section className="py-16 bg-[#0A0A0A] relative border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-sans tracking-[0.3em] text-[#D4AF37] font-semibold mb-2">
            Nos Univers de Personnalisation
          </h2>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Explorez nos 4 Collections Exclusives
          </h3>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
        </div>

        {/* 4 Universe Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {UNIVERSE_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border ${
                  isSelected
                    ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)] ring-2 ring-[#D4AF37]/50'
                    : 'border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                }`}
              >
                {/* Background Image with Dark Vignette Gradient */}
                <div className="h-72 w-full relative overflow-hidden bg-black">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                  {/* Top Badge: Item Count */}
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-sans font-semibold tracking-wider text-black bg-[#D4AF37] px-2.5 py-1 rounded-full shadow-md">
                      {cat.itemCount} Modèles
                    </span>

                    <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Center Floating Icon Circle */}
                  <div className="my-auto text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#121212]/90 border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300">
                      {getIcon(cat.iconName)}
                    </div>
                  </div>

                  {/* Bottom Text Label */}
                  <div className="text-center pt-2">
                    <h4 className="text-xl font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-amber-200/80 font-sans mt-0.5 line-clamp-1">
                      {cat.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
