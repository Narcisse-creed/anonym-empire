import React, { useState, useMemo } from 'react';
import { Product, CategoryId, SubCategory, GenderCategory, AvailabilityStatus } from '../types';
import { UNIVERSE_CATEGORIES } from '../data/categories';
import { ProductCard } from './ProductCard';
import { Search, RotateCcw, Gem, Sparkles } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: CategoryId | 'accueil';
  onSelectCategory: (cat: CategoryId | 'accueil') => void;
  whatsappNumber: string;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  allProducts?: Product[];
  selectedCollectionIds?: string[];
  collections?: any[];
  onClearCollectionFilter?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  whatsappNumber,
  onQuickView,
  onAddToCart,
  allProducts,
  selectedCollectionIds,
  collections,
  onClearCollectionFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>('all');
  const [selectedGender, setSelectedGender] = useState<GenderCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [selectedPriceTier, setSelectedPriceTier] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityStatus | 'all'>('all');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCollectionIds && selectedCollectionIds.length > 0) {
          if (!p.collectionIds?.some((cid) => selectedCollectionIds.includes(cid))) return false;
        }
        if (selectedCategory !== 'all' && selectedCategory !== 'accueil') {
          if (p.category !== selectedCategory) return false;
        }
        if (activeSubCategory !== 'all') {
          if (p.subCategory !== activeSubCategory) return false;
        }
        if (selectedGender !== 'all') {
          if (p.gender !== selectedGender && p.gender !== 'mixte') return false;
        }
        if (selectedAvailability !== 'all' && p.availability) {
          if (p.availability !== selectedAvailability) return false;
        }
        if (selectedPriceTier === 'low') {
          if (p.price >= 10000) return false;
        } else if (selectedPriceTier === 'mid') {
          if (p.price < 10000 || p.price > 25000) return false;
        } else if (selectedPriceTier === 'high') {
          if (p.price <= 25000) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchRef = p.refCode.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchMaterial = p.material ? p.material.toLowerCase().includes(q) : false;
          return matchName || matchRef || matchDesc || matchMaterial;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, activeSubCategory, selectedGender, selectedAvailability, searchQuery, sortBy, selectedPriceTier, selectedCollectionIds]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveSubCategory('all');
    setSelectedGender('all');
    setSelectedAvailability('all');
    setSortBy('featured');
    setSelectedPriceTier('all');
    if (selectedCategory === 'accueil') onSelectCategory('all');
    if (onClearCollectionFilter) onClearCollectionFilter();
  };

  const currentCatObj = UNIVERSE_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <section id="catalogue" className="py-16 bg-[#0B0B0B] text-white min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A160C] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <Gem className="w-3.5 h-3.5" />
            <span>Catalogue Privé & Cartes Cadeaux</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            {currentCatObj && currentCatObj.id !== 'all' && currentCatObj.id !== 'accueil'
              ? `Univers ${currentCatObj.title}`
              : 'Collection Complète ANONYM'}
          </h2>
          <p className="text-sm text-gray-400 mt-2 font-sans">
            Sélectionnez une pièce pour personnaliser les prénoms, initiales, dates ou finitions.
          </p>
        </div>

        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => { onSelectCategory('all'); setActiveSubCategory('all'); }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${selectedCategory === 'all' || selectedCategory === 'accueil' ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-[#181818] text-gray-300 hover:bg-[#222222] hover:text-[#D4AF37] border border-gray-800'}`}
          >
            Tous nos Modèles ({products.length})
          </button>
          {UNIVERSE_CATEGORIES.filter((c) => c.id !== 'accueil').map((cat) => (
            <button key={cat.id} onClick={() => { onSelectCategory(cat.id); setActiveSubCategory('all'); }} className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat.id ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-[#181818] text-gray-300 hover:bg-[#222222] hover:text-[#D4AF37] border border-gray-800'}`}>
              {cat.title}
            </button>
          ))}
        </div>

        {(selectedCategory === 'bijoux' || selectedCategory === 'all') && (
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 mb-8 pb-2 text-xs">
            <button onClick={() => setActiveSubCategory('all')} className={`px-3.5 py-1.5 rounded-lg border transition-all ${activeSubCategory === 'all' ? 'bg-[#1E190D] border-[#D4AF37] text-[#D4AF37]' : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'}`}>Toutes sous-catégories</button>
            <button onClick={() => setActiveSubCategory('colliers-femme')} className={`px-3.5 py-1.5 rounded-lg border transition-all ${activeSubCategory === 'colliers-femme' ? 'bg-[#1E190D] border-[#D4AF37] text-[#D4AF37]' : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'}`}>Colliers Femme</button>
            <button onClick={() => setActiveSubCategory('colliers-homme-couple')} className={`px-3.5 py-1.5 rounded-lg border transition-all ${activeSubCategory === 'colliers-homme-couple' ? 'bg-[#1E190D] border-[#D4AF37] text-[#D4AF37]' : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'}`}>Homme & Couple</button>
            <button onClick={() => setActiveSubCategory('boucles-oreilles')} className={`px-3.5 py-1.5 rounded-lg border transition-all ${activeSubCategory === 'boucles-oreilles' ? 'bg-[#1E190D] border-[#D4AF37] text-[#D4AF37]' : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'}`}>Boucles d'Oreilles</button>
            <button onClick={() => setActiveSubCategory('bracelets')} className={`px-3.5 py-1.5 rounded-lg border transition-all ${activeSubCategory === 'bracelets' ? 'bg-[#1E190D] border-[#D4AF37] text-[#D4AF37]' : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'}`}>Bracelets</button>
            <button onClick={() => setActiveSubCategory('bagues')} className={`px-3.5 py-1.5 rounded-lg border transition-all ${activeSubCategory === 'bagues' ? 'bg-[#1E190D] border-[#D4AF37] text-[#D4AF37]' : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'}`}>Bagues</button>
            <button onClick={() => setActiveSubCategory('manchettes')} className={`px-3.5 py-1.5 rounded-lg border transition-all ${activeSubCategory === 'manchettes' ? 'bg-[#1E190D] border-[#D4AF37] text-[#D4AF37]' : 'bg-black/40 border-gray-800 text-gray-400 hover:text-white'}`}>Manchettes</button>
          </div>
        )}

        <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-4 sm:p-6 mb-10 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher par nom, réf (#001, #181...), mot-clé..." className="w-full bg-black/80 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]" />
            </div>

            <div className="md:col-span-5 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#D4AF37] font-semibold mr-1 hidden sm:inline">Public :</span>
              <button onClick={() => setSelectedGender('all')} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedGender === 'all' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-[#D4AF37] hover:border-[#D4AF37]/50'}`}>Tous ({products.length})</button>
              <button onClick={() => { setSelectedGender('femme'); setActiveSubCategory('all'); }} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedGender === 'femme' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-[#D4AF37] hover:border-[#D4AF37]/50'}`}>Pour Femme ({products.filter((p) => p.gender === 'femme' || p.gender === 'mixte').length})</button>
              <button onClick={() => { setSelectedGender('homme'); setActiveSubCategory('all'); }} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedGender === 'homme' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-[#D4AF37] hover:border-[#D4AF37]/50'}`}>Pour Homme ({products.filter((p) => p.gender === 'homme' || p.gender === 'mixte').length})</button>
              <button onClick={() => { setSelectedGender('couple'); setActiveSubCategory('all'); }} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedGender === 'couple' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-[#D4AF37] hover:border-[#D4AF37]/50'}`}>Duo Couple ({products.filter((p) => p.gender === 'couple').length})</button>
            </div>

            <div className="md:col-span-5 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#D4AF37] font-semibold mr-1 hidden sm:inline">Disponibilité :</span>
              <button onClick={() => setSelectedAvailability('all')} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedAvailability === 'all' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-[#D4AF37]'}`}>Tous</button>
              <button onClick={() => setSelectedAvailability('disponible')} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedAvailability === 'disponible' ? 'bg-emerald-950 text-emerald-400 border-emerald-700 font-bold' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-emerald-400'}`}>🟢 Disponible</button>
              <button onClick={() => setSelectedAvailability('en-arrivage')} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedAvailability === 'en-arrivage' ? 'bg-amber-950 text-amber-400 border-amber-700 font-bold' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-amber-400'}`}>🟡 En arrivage</button>
              <button onClick={() => setSelectedAvailability('epuise')} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedAvailability === 'epuise' ? 'bg-rose-950 text-rose-400 border-rose-800 font-bold' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-rose-400'}`}>🔴 Épuisé</button>
            </div>

            <div className="md:col-span-5 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#D4AF37] font-semibold mr-1 hidden sm:inline">Prix :</span>
              <button onClick={() => setSelectedPriceTier('all')} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedPriceTier === 'all' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-[#D4AF37] hover:border-[#D4AF37]/50'}`}>Tous</button>
              <button onClick={() => setSelectedPriceTier('low')} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedPriceTier === 'low' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-[#D4AF37] hover:border-[#D4AF37]/50'}`}>&lt; 10k</button>
              <button onClick={() => setSelectedPriceTier('mid')} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedPriceTier === 'mid' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-[#D4AF37] hover:border-[#D4AF37]/50'}`}>10k – 25k</button>
              <button onClick={() => setSelectedPriceTier('high')} className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${selectedPriceTier === 'high' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'bg-black/60 text-gray-300 border-gray-800 hover:text-[#D4AF37] hover:border-[#D4AF37]/50'}`}>&gt; 25k</button>
            </div>

            <div className="md:col-span-3 flex items-center gap-2 justify-end">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-black/80 border border-gray-800 text-xs text-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#D4AF37] w-full">
                <option value="featured">Suggérés / Best-Sellers</option>
                <option value="price-asc">Prix : Croissant</option>
                <option value="price-desc">Prix : Décroissant</option>
                <option value="name">Nom : A-Z</option>
              </select>

              {(searchQuery || selectedGender !== 'all' || activeSubCategory !== 'all' || selectedAvailability !== 'all' || selectedPriceTier !== 'all' || (selectedCollectionIds && selectedCollectionIds.length > 0)) && (
                <button onClick={handleResetFilters} className="p-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700" title="Réinitialiser les filtres">
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedCollectionIds && selectedCollectionIds.length > 0 && allProducts && (
              <div className="md:col-span-7 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#D4AF37] font-semibold">Collection :</span>
                {selectedCollectionIds.map((cid) => {
                  const col = collections?.find((c: any) => c.id === cid);
                  return col ? (
                    <span key={cid} className="px-3 py-1 rounded-full bg-[#1E190D] border border-[#D4AF37] text-[#D4AF37] flex items-center gap-1">
                      {col.name}
                      <button onClick={onClearCollectionFilter} className="hover:text-white ml-1">×</button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 text-xs text-gray-400">
          <span>Affichage de <strong className="text-[#D4AF37]">{filteredProducts.length}</strong> création(s) disponible(s)</span>
          <span className="font-serif italic text-amber-200/70">« Qualité • Élégance • Personnalisation »</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} onQuickView={onQuickView} onAddToCart={onAddToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121212] rounded-3xl border border-gray-800 p-8 max-w-md mx-auto">
            <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-serif font-bold text-white mb-2">Aucun modèle trouvé</h3>
            <p className="text-xs text-gray-400 mb-6">Aucun bijou ou article ne correspond à votre recherche "{searchQuery}". Testez une autre référence ou réinitialisez les filtres.</p>
            <button onClick={handleResetFilters} className="bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-[#F3E5AB] transition-all cursor-pointer">Afficher Tous nos Modèles</button>
          </div>
        )}
      </div>
    </section>
  );
};
