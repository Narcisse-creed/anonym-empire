import React, { useState } from 'react';
import { Product, MetalFinish, Order } from '../types';
import {
  formatPriceFCFA,
  generateSingleProductWhatsAppMsg,
  buildWhatsAppLink,
} from '../utils/helpers';
import {
  X,
  MessageCircle,
  ShoppingBag,
  ShieldCheck,
  Check,
  Upload,
  Palette,
  Type,
  User,
  Calendar,
} from 'lucide-react';
import { AvailabilityBadge } from './AvailabilityBadge';
import { ImageGallery } from './ImageGallery';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  whatsappNumber: string;
  onAddToCart: (
    product: Product,
    engravingText: string,
    metalFinish: MetalFinish,
    selectedColor?: string,
    customText?: string
  ) => void;
  onCreateOrder?: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  whatsappNumber,
  onAddToCart,
  onCreateOrder,
}) => {
  if (!product) return null;

  const [engravingText, setEngravingText] = useState('');
  const [selectedFinish, setSelectedFinish] = useState<MetalFinish>('or-jaune');
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [customText, setCustomText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Alex Brush');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const finishes: { id: MetalFinish; name: string; color: string }[] = [
    { id: 'or-jaune', name: 'Or Jaune', color: '#D4AF37' },
    { id: 'argent-massif', name: 'Argent Massif', color: '#E2E8F0' },
    { id: 'or-rose', name: 'Or Rose', color: '#E898AC' },
    { id: 'noir-mat', name: 'Noir Mat', color: '#4B5563' },
  ];

  const fontOptions = ['Alex Brush', 'Cinzel', 'Great Vibes', 'Montserrat'];
  const activeFinishObj = finishes.find((f) => f.id === selectedFinish) || finishes[0];

  const isEpuise = product.availability === 'epuise';

  const whatsappMsg = generateSingleProductWhatsAppMsg(
    product,
    engravingText || undefined,
    activeFinishObj.name,
    selectedColor || undefined,
    customText || undefined,
    quantity
  );
  const whatsappUrl = buildWhatsAppLink(whatsappNumber, whatsappMsg);

  const handleAddCartSubmit = () => {
    if (isEpuise) return;
    onAddToCart(product, engravingText, selectedFinish, selectedColor, customText);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setUploadedFileUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const hasCustomization = product.customizationOptions;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#101010] border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] max-h-[95vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-gray-300 hover:text-[#D4AF37] hover:bg-black transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT: Image Gallery */}
        <div className="md:w-5/12 relative bg-black flex flex-col items-center justify-start p-5 border-b md:border-b-0 md:border-r border-gray-800 overflow-y-auto">
          <ImageGallery
            mainImage={product.imageUrl}
            images={product.images}
            altText={product.name}
            category={product.category}
          />

          {/* Ref Code */}
          <div className="mt-3 w-full flex items-center justify-between text-xs text-gray-500">
            <span className="font-mono font-bold text-[#D4AF37] bg-[#1A160C] px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
              Réf #{product.refCode}
            </span>
            {product.guarantee && (
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Garantie 1 An</span>
              </span>
            )}
          </div>

          {/* Availability Badge */}
          <div className="mt-3 w-full">
            <AvailabilityBadge
              status={product.availability}
              deliveryDelay={product.deliveryDelay}
              size="md"
              showDelay={true}
            />
          </div>
        </div>

        {/* RIGHT: Product Info & Form */}
        <div className="md:w-7/12 p-5 sm:p-7 overflow-y-auto space-y-5 flex flex-col">
          <div className="flex-1 space-y-5">
            {/* Category + Name */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-sans">
                {product.category} • Réf #{product.refCode}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1 leading-tight">
                {product.name}
              </h2>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-serif font-bold text-[#F3E5AB]">
                {formatPriceFCFA(product.price)}
              </span>
              {product.priceVariable && (
                <span className="text-xs text-amber-300 font-sans">(*Prix variable)</span>
              )}
            </div>

            {/* Specs Row */}
            {(product.material || product.colors?.length) && (
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-800/80">
                {product.material && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 block">Matériau</span>
                    <span className="text-xs text-gray-200">{product.material}</span>
                  </div>
                )}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 block">Couleurs</span>
                    <span className="text-xs text-gray-200">{product.colors.join(' / ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
              {product.description}
            </p>

            {/* Customization Section */}
            {hasCustomization && (
              <div className="space-y-4 pt-4 border-t border-gray-800">
                <h3 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" />
                  Personnalisation
                </h3>

                {/* Name / Engraving */}
                {(hasCustomization.allowName || hasCustomization.allowText) && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-[#D4AF37]" />
                      {hasCustomization.allowName ? 'Prénom(s) / Texte à graver' : 'Texte'}
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                      placeholder="Ex: Kimberly & Shawn"
                      className="w-full bg-black border border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                )}

                {/* Date */}
                {hasCustomization.allowDate && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" />
                      Date (optionnel)
                    </label>
                    <input
                      type="text"
                      maxLength={20}
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Ex: 06.12.2026"
                      className="w-full bg-black border border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                )}

                {/* Color choice */}
                {hasCustomization.allowColorChoice && product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Couleur
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                            selectedColor === color
                              ? 'border-[#D4AF37] bg-[#1E190D] text-white'
                              : 'border-gray-700 bg-black/40 text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Font choice */}
                {hasCustomization.allowFontChoice && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Type className="w-3 h-3 text-[#D4AF37]" />
                      Police d'écriture
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {fontOptions.map((font) => (
                        <button
                          key={font}
                          onClick={() => setSelectedFont(font)}
                          className={`p-2 rounded-xl border text-xs transition-all cursor-pointer text-left ${
                            selectedFont === font
                              ? 'border-[#D4AF37] bg-[#1E190D] text-white'
                              : 'border-gray-800 bg-black/40 text-gray-400 hover:border-gray-600'
                          }`}
                          style={{ fontFamily: font }}
                        >
                          {font} — Exemple
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finition métal (for bijoux) */}
                {product.category === 'bijoux' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Finition Métal
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {finishes.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFinish(f.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all text-left cursor-pointer ${
                            selectedFinish === f.id
                              ? 'border-[#D4AF37] bg-[#1E190D] text-white'
                              : 'border-gray-800 bg-black/40 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                            style={{ backgroundColor: f.color }}
                          />
                          <span className="truncate">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Upload (logo, emballages) */}
                {hasCustomization.allowFileUpload && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Upload className="w-3 h-3 text-[#D4AF37]" />
                      Téléverser votre logo / fichier
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#D4AF37]/40 bg-black/30 cursor-pointer hover:border-[#D4AF37] transition-all">
                      <Upload className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <div className="flex-1 min-w-0">
                        {uploadedFileName ? (
                          <span className="text-xs text-emerald-400 truncate block">
                            ✓ {uploadedFileName}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Cliquez pour téléverser (PNG, JPG, PDF, SVG)
                          </span>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf,.svg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {uploadedFileUrl && uploadedFileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                      <img
                        src={uploadedFileUrl}
                        alt="Aperçu logo"
                        className="mt-2 h-16 w-auto rounded-lg border border-gray-700 object-contain bg-white/5"
                      />
                    )}
                  </div>
                )}

                {/* Live Engraving Preview */}
                {engravingText.trim() && (
                  <div className="p-3 rounded-xl bg-black/90 border border-[#D4AF37]/30 text-center">
                    <span className="text-[10px] uppercase text-gray-400 block mb-1">
                      Aperçu de votre gravure :
                    </span>
                    <span
                      className="italic text-lg text-[#F3E5AB]"
                      style={{ fontFamily: selectedFont }}
                    >
                      « {engravingText} »
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quantity + Actions */}
          <div className="pt-5 border-t border-gray-800 space-y-3">
            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Quantité :</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-gray-700 text-white hover:border-[#D4AF37] transition-all cursor-pointer text-sm"
                >
                  −
                </button>
                <span className="text-white font-bold w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-gray-700 text-white hover:border-[#D4AF37] transition-all cursor-pointer text-sm"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-[#F3E5AB] font-semibold ml-auto">
                Total : {formatPriceFCFA(product.price * quantity)}
              </span>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddCartSubmit}
                disabled={isEpuise}
                className={`inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                  isEpuise
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1A1A1A] hover:bg-[#282215] text-[#D4AF37] border border-[#D4AF37]/50'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ajouté !</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isEpuise ? 'Épuisé' : 'Ajouter au Panier'}</span>
                  </>
                )}
              </button>

              <a
                href={isEpuise ? undefined : whatsappUrl}
                target={isEpuise ? undefined : '_blank'}
                rel="noopener noreferrer"
                onClick={() => {
                  if (!isEpuise && onCreateOrder && product) {
                    onCreateOrder({
                      productId: product.id,
                      productName: product.name,
                      productRefCode: product.refCode,
                      customerName: 'Client WhatsApp',
                      customerPhone: '',
                      quantity,
                      customizationNotes: engravingText || undefined,
                      metalFinish: selectedFinish || undefined,
                      selectedColor: selectedColor || undefined,
                      customText: customText || undefined,
                      totalPrice: product.price * quantity,
                    });
                  }
                }}
                className={`inline-flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg transition-all text-center ${
                  isEpuise
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed pointer-events-none'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isEpuise ? 'Indisponible' : 'Commander'}</span>
              </a>
            </div>

            <p className="text-[10px] text-gray-500 text-center">
              *La commande se finalise via WhatsApp avec notre équipe ANONYM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
