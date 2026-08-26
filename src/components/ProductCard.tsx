import React from 'react';
import { Product, AvailabilityStatus } from '../types';
import { formatPriceFCFA, generateSingleProductWhatsAppMsg, buildWhatsAppLink } from '../utils/helpers';
import { Eye, MessageCircle, ShoppingCart, ShieldCheck, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { AvailabilityBadge } from './AvailabilityBadge';

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isEditMode?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onToggleAvailability?: (product: Product, newStatus: AvailabilityStatus) => void;
}

const AVAILABILITY_CYCLE: AvailabilityStatus[] = ['disponible', 'sur-commande', 'epuise'];

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  whatsappNumber,
  onQuickView,
  onAddToCart,
  isEditMode = false,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const isEpuise = product.availability === 'epuise';
  const whatsappMsg = generateSingleProductWhatsAppMsg(product);
  const whatsappUrl = buildWhatsAppLink(whatsappNumber, whatsappMsg);

  // Collect all images for mini gallery indicator
  const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean);

  const handleCycleAvailability = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggleAvailability) return;
    const current = product.availability || 'disponible';
    const idx = AVAILABILITY_CYCLE.indexOf(current as AvailabilityStatus);
    const next = AVAILABILITY_CYCLE[(idx + 1) % AVAILABILITY_CYCLE.length];
    onToggleAvailability(product, next);
  };

  const availabilityLabel: Record<AvailabilityStatus, string> = {
    disponible: '🟢 Dispo',
    'sur-commande': '🟡 Cmd',
    'en-arrivage': '🟡 Arriv.',
    epuise: '🔴 Épuisé',
    nouveau: '✨ Nouveau',
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-sm ${
        isEditMode ? 'ring-2 ring-[#D4AF37]/50 shadow-md' : ''
      } ${
        isEpuise
          ? 'border-gray-200 opacity-70'
          : 'border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-[0_4px_30px_rgba(212,175,55,0.18)]'
      }`}
    >
      {/* Admin Live Edit Controls (Only in Edit Mode) */}
      {isEditMode && (
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5 bg-black/85 p-1 rounded-xl shadow-lg border border-[#D4AF37]/60 backdrop-blur-md">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              className="p-1.5 rounded-lg bg-[#D4AF37] text-black hover:bg-[#F3E5AB] transition-colors cursor-pointer"
              title="Modifier ce produit (Édition Directe)"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product);
              }}
              className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
              title="Supprimer ce produit"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Quick Availability Toggle (Only in Edit Mode, bottom-left of image) */}
      {isEditMode && onToggleAvailability && (
        <div className="absolute bottom-[60%] left-2 z-30">
          <button
            type="button"
            onClick={handleCycleAvailability}
            title="Changer la disponibilité rapidement (clic pour alterner)"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border shadow-lg backdrop-blur-md transition-all cursor-pointer ${
              product.availability === 'disponible'
                ? 'bg-emerald-900/90 border-emerald-600 text-emerald-300 hover:bg-emerald-800'
                : product.availability === 'epuise'
                ? 'bg-rose-900/90 border-rose-700 text-rose-300 hover:bg-rose-800'
                : 'bg-amber-900/90 border-amber-600 text-amber-300 hover:bg-amber-800'
            }`}
          >
            {product.availability === 'disponible' ? (
              <ToggleRight className="w-3 h-3" />
            ) : (
              <ToggleLeft className="w-3 h-3" />
            )}
            <span>{availabilityLabel[product.availability as AvailabilityStatus] || '🟢 Dispo'}</span>
          </button>
        </div>
      )}

      {/* Top Image Section */}
      <div
        className={`relative aspect-square w-full overflow-hidden bg-gray-100 ${!isEpuise ? 'cursor-pointer' : 'cursor-default'}`}
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
        <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
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
        {!isEpuise && !isEditMode && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
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
          <div className="flex items-center justify-between text-[10px] text-[#8A6A20] mb-1 font-sans">
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
            className={`text-sm font-serif font-bold text-gray-900 line-clamp-2 leading-snug ${
              !isEpuise ? 'group-hover:text-[#D4AF37] transition-colors cursor-pointer' : ''
            }`}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-[11px] text-gray-500 font-sans mt-1 line-clamp-2 leading-relaxed">
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
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-baseline justify-between mb-2.5">
            <span className="text-[10px] text-gray-500">Prix :</span>
            <div className="text-right">
              <span className="text-base font-serif font-bold text-[#D4AF37]">
                {formatPriceFCFA(product.price)}
              </span>
              {product.priceVariable && (
                <span className="text-[9px] text-amber-600 block">*Variable</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => !isEpuise && onAddToCart(product)}
              disabled={isEpuise}
              title="Ajouter au panier"
              className={`inline-flex items-center justify-center gap-1.5 font-semibold text-[11px] py-2 px-2 rounded-xl transition-all ${
                isEpuise
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-[#1A1A1A] hover:bg-[#282215] text-[#D4AF37] border border-[#D4AF37]/40 cursor-pointer'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
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
