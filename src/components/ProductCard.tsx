import React from 'react';
import { Product } from '../types';
import { formatPriceFCFA, generateSingleProductWhatsAppMsg, buildWhatsAppLink } from '../utils/helpers';
import { Eye, MessageCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { AvailabilityBadge } from './AvailabilityBadge';

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  whatsappNumber,
  onQuickView,
  onAddToCart,
}) => {
  const isEpuise = product.availability === 'epuise';
  const whatsappMsg = generateSingleProductWhatsAppMsg(product);
  const whatsappUrl = buildWhatsAppLink(whatsappNumber, whatsappMsg);

  // Collect all images for mini gallery indicator
  const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean);

  return (
    <div className={`group bg-[#121212] rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-xl ${
      isEpuise
        ? 'border-gray-800 opacity-70'
        : 'border-[#D4AF37]/25 hover:border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)]'
    }`}>

      {/* Top Image Section */}
      <div
        className={`relative aspect-square w-full overflow-hidden bg-black/80 ${!isEpuise ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={() => !isEpuise && onQuickView(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transition-transform duration-500 opacity-90 ${
            !isEpuise ? 'group-hover:scale-110 group-hover:opacity-100' : 'grayscale'
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="font-mono text-[10px] font-bold text-black bg-[#D4AF37] px-2 py-0.5 rounded-md shadow-md">
            #{product.refCode}
          </span>
          {product.badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-black/80 border border-[#D4AF37]/50 px-2 py-0.5 rounded-md backdrop-blur-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Multi-photo indicator */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 pointer-events-none">
            <span className="text-[9px] bg-black/70 text-gray-300 px-1.5 py-0.5 rounded-full backdrop-blur-sm border border-gray-700">
              📷 {allImages.length} photos
            </span>
          </div>
        )}

        {/* Quick View Button (only if not épuisé) */}
        {!isEpuise && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Voir Détails</span>
            </button>
          </div>
        )}

        {/* Épuisé Overlay */}
        {isEpuise && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="bg-rose-950/80 border border-rose-700 text-rose-300 text-xs font-bold px-4 py-2 rounded-full">
              🔴 Épuisé
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Gender & Guarantee */}
          <div className="flex items-center justify-between text-[10px] text-amber-200/70 mb-1 font-sans">
            <span className="uppercase tracking-wider">
              {product.gender === 'femme' && '♀ Femme'}
              {product.gender === 'homme' && '♂ Homme'}
              {product.gender === 'couple' && '♥ Couple'}
              {product.gender === 'mixte' && '⚥ Mixte'}
            </span>
            {product.guarantee && (
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Garanti 1 An</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => !isEpuise && onQuickView(product)}
            className={`text-sm font-serif font-bold text-white line-clamp-2 leading-snug ${
              !isEpuise ? 'group-hover:text-[#D4AF37] transition-colors cursor-pointer' : ''
            }`}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-[11px] text-gray-400 font-sans mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Availability Badge */}
        <AvailabilityBadge
          status={product.availability}
          deliveryDelay={product.deliveryDelay}
          size="sm"
          showDelay={true}
        />

        {/* Price & Actions */}
        <div className="pt-2 border-t border-gray-800/80">
          <div className="flex items-baseline justify-between mb-2.5">
            <span className="text-[10px] text-gray-500">Prix :</span>
            <div className="text-right">
              <span className="text-base font-serif font-bold text-[#F3E5AB]">
                {formatPriceFCFA(product.price)}
              </span>
              {product.priceVariable && (
                <span className="text-[9px] text-amber-300 block">*Variable</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => !isEpuise && onAddToCart(product)}
              disabled={isEpuise}
              className={`inline-flex items-center justify-center gap-1.5 font-semibold text-[11px] py-2 px-2 rounded-xl transition-all ${
                isEpuise
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-[#1A1A1A] hover:bg-[#282215] text-[#D4AF37] border border-[#D4AF37]/40 cursor-pointer'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Panier</span>
            </button>

            {!isEpuise ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] py-2 px-2 rounded-xl shadow-md transition-all text-center"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Commander</span>
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center justify-center gap-1.5 bg-gray-800 text-gray-600 font-semibold text-[11px] py-2 px-2 rounded-xl cursor-not-allowed"
              >
                <span>Indisponible</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
