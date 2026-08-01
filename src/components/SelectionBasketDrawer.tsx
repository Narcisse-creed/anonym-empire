import React from 'react';
import { CartItem, StoreInfo } from '../types';
import { formatPriceFCFA, generateCartWhatsAppMsg, buildWhatsAppLink } from '../utils/helpers';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react';

interface SelectionBasketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  storeInfo: StoreInfo;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const SelectionBasketDrawer: React.FC<SelectionBasketDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  storeInfo,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const totalEstimate = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const whatsappMsg = generateCartWhatsAppMsg(cartItems, storeInfo);
  const whatsappUrl = buildWhatsAppLink(storeInfo.whatsappNumber, whatsappMsg);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101010] border-l border-[#D4AF37]/30 text-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-[#1A160C] border border-[#D4AF37]/40 text-[#D4AF37]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-white">
                  Votre Sélection Devis
                </h2>
                <span className="text-xs text-gray-400 font-sans">
                  {cartItems.length} article(s) sélectionné(s)
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-[#161616] border border-gray-800 rounded-2xl p-4 flex gap-4 relative group hover:border-[#D4AF37]/40 transition-colors"
                >
                  {/* Thumbnail Image */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-xl border border-gray-800 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-serif font-bold text-white truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-gray-500 hover:text-rose-400 p-1"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-[#D4AF37] block">
                        Réf #{item.product.refCode}
                      </span>

                      {/* Engraving Note */}
                      {item.engravingText && (
                        <span className="text-[11px] text-amber-200/90 font-serif italic block mt-1">
                          Gravure : « {item.engravingText} »
                        </span>
                      )}
                    </div>

                    {/* Quantity & Unit Price Row */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800">
                      <div className="flex items-center gap-2 bg-black px-2 py-1 rounded-lg border border-gray-800">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold font-mono px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-serif font-bold text-[#F3E5AB]">
                        {formatPriceFCFA(item.product.price * item.quantity)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-500">
                <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-sm font-serif">Votre sélection est vide</p>
                <p className="text-xs mt-1">
                  Naviguez dans le catalogue et cliquez sur "Ajouter au Devis".
                </p>
              </div>
            )}
          </div>

          {/* Footer Summary & WhatsApp Order Action */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-800 bg-[#0C0C0C] space-y-4">
              
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-gray-400">Total estimé :</span>
                <span className="text-xl font-serif font-bold text-[#F3E5AB]">
                  {formatPriceFCFA(totalEstimate)}
                </span>
              </div>

              <div className="space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-lg transition-all text-center"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Envoyer la Commande sur WhatsApp</span>
                </a>

                <button
                  onClick={onClearCart}
                  className="w-full text-center text-xs text-gray-500 hover:text-rose-400 py-1"
                >
                  Vider la sélection
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
