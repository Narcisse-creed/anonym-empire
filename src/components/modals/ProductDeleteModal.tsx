import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { Product } from '../../types';

export interface ProductDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirmDelete: () => void;
}

export const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirmDelete,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white border-2 border-rose-500 rounded-3xl shadow-[0_0_50px_rgba(225,29,72,0.35)] overflow-hidden text-[#1A0F0A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-rose-950">
                Supprimer le Produit
              </h3>
              <p className="text-xs text-rose-600 font-mono">
                {product.refCode} • {product.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-rose-100 text-rose-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#D4AF37]/40 shadow-sm"
              />
            )}
            <div>
              <p className="font-bold text-sm text-gray-900">{product.name}</p>
              <p className="text-gray-500 font-mono">{product.refCode}</p>
              <p className="text-[#D4AF37] font-semibold">{product.price.toLocaleString('fr-FR')} FCFA</p>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Êtes-vous sûre de vouloir supprimer définitivement cette création du catalogue ? Cette action est irréversible.
          </p>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmDelete();
                onClose();
              }}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer Définitivement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
