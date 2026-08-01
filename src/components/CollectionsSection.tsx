import React, { useState } from 'react';
import { Collection, Product } from '../types';
import { formatPriceFCFA } from '../utils/helpers';
import { Sparkles, ChevronLeft, ChevronRight, Grid3X3, Tag } from 'lucide-react';

interface CollectionsSectionProps {
  collections: Collection[];
  products: Product[];
  selectedCategory: string;
  onSelectCollection: (collectionIds: string[]) => void;
  onNavigateCatalog: () => void;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  collections,
  products,
  selectedCategory,
  onSelectCollection,
  onNavigateCatalog,
}) => {
  const [scrollX, setScrollX] = useState(0);

  const filteredCollections = selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'accueil'
    ? collections.filter((c) => {
        const hasProductsInCategory = c.productIds.some((pid) =>
          products.some((p) => p.id === pid && p.category === selectedCategory)
        );
        return hasProductsInCategory || c.productIds.length === 0;
      })
    : collections;

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('collections-scroll');
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const newScroll = direction === 'left'
        ? Math.max(0, container.scrollLeft - scrollAmount)
        : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: newScroll, behavior: 'smooth' });
      setScrollX(newScroll);
    }
  };

  if (filteredCollections.length === 0) return null;

  return (
    <section id="collections" className="py-16 bg-[#0B0B0B] text-white relative border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
              <Grid3X3 className="w-6 h-6 text-[#D4AF37]" />
              Collections
            </h2>
            <p className="text-xs text-gray-400 mt-1">Parcourez nos collections thématiques</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-[#141414] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
              title="Collection précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-[#141414] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
              title="Collection suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div id="collections-scroll" className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {filteredCollections.map((collection) => {
            const productCount = collection.productIds.length;
            const coverImg = collection.coverImage || products.find((p) => collection.productIds.includes(p.id))?.imageUrl || '';

            return (
              <div
                key={collection.id}
                className="flex-shrink-0 w-72 sm:w-80 snap-start group cursor-pointer"
                onClick={() => onSelectCollection(collection.productIds)}
              >
                <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#121212] transition-all hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                  {coverImg && (
                    <img
                      src={coverImg}
                      alt={collection.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-[#D4AF37]" />
                      <h3 className="font-serif font-bold text-white text-lg">{collection.name}</h3>
                    </div>
                    {collection.description && (
                      <p className="text-xs text-gray-300 line-clamp-2 mb-2">{collection.description}</p>
                    )}
                    <span className="text-xs font-mono text-[#D4AF37] bg-[#1A160C] px-2 py-0.5 rounded-full">
                      {productCount} produit{productCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onNavigateCatalog}
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all cursor-pointer"
          >
            Voir tout le catalogue
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};