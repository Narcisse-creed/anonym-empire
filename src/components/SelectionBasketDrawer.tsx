import React from 'react';
import { CartItem, Order, StoreInfo } from '../types';
import { formatPriceFCFA, generateCartWhatsAppMsg, buildWhatsAppLink } from '../utils/helpers';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingCart } from 'lucide-react';

interface SelectionBasketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  storeInfo: StoreInfo;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCreateOrder?: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
}

export const SelectionBasketDrawer: React.FC<SelectionBasketDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  storeInfo,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCreateOrder,
}) => {
  if (!isOpen) return null;

  const totalEstimate = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalArticles = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const whatsappMsg = generateCartWhatsAppMsg(cartItems, storeInfo);
  const whatsappUrl = buildWhatsAppLink(storeInfo.whatsappNumber, whatsappMsg);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101010] border-l border-[#D4AF37]/30 text-white shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-[#1A160C] border border-[#D4AF37]/40 text-[#D4AF37]">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-white">
                  Votre Panier
                </h2>
                <span className="text-xs text-gray-400 font-sans">
                  {totalArticles} article{totalArticles > 1 ? 's' : ''} dans le panier
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
              title="Fermer le panier"
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
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop';
                    }}
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
                          className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                          title="Supprimer cet article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-[#D4AF37] block">
                        Réf #{item.product.refCode}
                      </span>

                      {/* Options / Customizations */}
                      {item.metalFinish && (
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Finition : <strong className="text-gray-200 capitalize">{item.metalFinish.replace('-', ' ')}</strong>
                        </span>
                      )}

                      {item.selectedColor && (
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Couleur : <strong className="text-gray-200">{item.selectedColor}</strong>
                        </span>
                      )}

                      {item.engravingText && (
                        <span className="text-[11px] text-amber-200/90 font-serif italic block mt-1">
                          Gravure : « {item.engravingText} »
                        </span>
                      )}

                      {item.customText && (
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Texte/Date : <strong className="text-gray-200">{item.customText}</strong>
                        </span>
                      )}
                    </div>

                    {/* Quantity & Unit Price Row */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800">
                      <div className="flex items-center gap-2 bg-black px-2 py-1 rounded-lg border border-gray-800">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="text-gray-400 hover:text-white cursor-pointer"
                          title="Diminuer la quantité"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold font-mono px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-white cursor-pointer"
                          title="Augmenter la quantité"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-serif font-bold text-[#F3E5AB] block">
                          {formatPriceFCFA(item.product.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[9px] text-gray-500 font-sans block">
                            {formatPriceFCFA(item.product.price)} / unité
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-gray-500">
                <ShoppingCart className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-sm font-serif text-gray-300">Votre panier est vide</p>
                <p className="text-xs mt-1 text-gray-500 max-w-xs mx-auto">
                  Naviguez dans le catalogue et cliquez sur "Ajouter au panier".
                </p>
              </div>
            )}
          </div>

          {/* Footer Summary & WhatsApp Order Action */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-800 bg-[#0C0C0C] space-y-4">
              
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-gray-400">Total :</span>
                <span className="text-xl font-serif font-bold text-[#F3E5AB]">
                  {formatPriceFCFA(totalEstimate)}
                </span>
              </div>

              <div className="space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (onCreateOrder && cartItems.length > 0) {
                      cartItems.forEach((item) => {
                        onCreateOrder({
                          productId: item.product.id,
                          productName: item.product.name,
                          productRefCode: item.product.refCode,
                          customerName: 'Client Panier WhatsApp',
                          customerPhone: '',
                          quantity: item.quantity,
                          customizationNotes: item.engravingText || item.customText || undefined,
                          metalFinish: item.metalFinish || undefined,
                          totalPrice: item.product.price * item.quantity,
                        });
                      });
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-lg transition-all text-center cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Commander via WhatsApp</span>
                </a>

                <button
                  onClick={onClearCart}
                  className="w-full text-center text-xs text-gray-500 hover:text-rose-400 py-1 transition-colors cursor-pointer"
                >
                  Vider le panier
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
