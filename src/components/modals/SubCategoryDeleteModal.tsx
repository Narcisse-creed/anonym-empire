import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, ArrowRight } from 'lucide-react';
import { SubCategoryLevel1, SubCategoryLevel2, Product } from '../../types';

export interface SubCategoryDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  subCategory: SubCategoryLevel1 | SubCategoryLevel2 | null;
  level: 1 | 2;
  affectedProductsCount?: number;
  availableReplacementSubCats?: (SubCategoryLevel1 | SubCategoryLevel2)[];
  onConfirmDelete: (reassignToSubCatId?: string) => void;
}

export const SubCategoryDeleteModal: React.FC<SubCategoryDeleteModalProps> = ({
  isOpen,
  onClose,
  subCategory,
  level,
  affectedProductsCount = 0,
  availableReplacementSubCats = [],
  onConfirmDelete,
}) => {
  const [reassignOption, setReassignOption] = useState<'reassign' | 'orphan'>(
    availableReplacementSubCats.length > 0 ? 'reassign' : 'orphan'
  );
  const [selectedReplacementId, setSelectedReplacementId] = useState<string>(
    availableReplacementSubCats[0]?.id || ''
  );

  if (!isOpen || !subCategory) return null;

  const handleConfirm = () => {
    if (reassignOption === 'reassign' && selectedReplacementId) {
      onConfirmDelete(selectedReplacementId);
    } else {
      onConfirmDelete(undefined);
    }
    onClose();
  };

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
                Supprimer la Sous-Catégorie
              </h3>
              <p className="text-xs text-rose-600 font-mono">
                {subCategory.name} (Niveau {level})
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
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 leading-relaxed">
            <p className="font-semibold mb-1 flex items-center gap-1.5 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Impact sur les créations du catalogue :</span>
            </p>
            <p>
              Cette sous-catégorie contient actuellement{' '}
              <strong>{affectedProductsCount} produit(s)</strong>.
            </p>
          </div>

          {affectedProductsCount > 0 && availableReplacementSubCats.length > 0 && (
            <div className="space-y-3 pt-1">
              <p className="font-semibold text-gray-800">
                Que souhaitez-vous faire des {affectedProductsCount} produit(s) rattaché(s) ?
              </p>

              {/* Option 1: Reassign */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 cursor-pointer">
                <input
                  type="radio"
                  name="reassignChoice"
                  checked={reassignOption === 'reassign'}
                  onChange={() => setReassignOption('reassign')}
                  className="mt-0.5 accent-emerald-600"
                />
                <div className="flex-1 space-y-1.5">
                  <span className="font-bold text-emerald-950 block">
                    Réassigner automatiquement à une autre sous-catégorie (Recommandé)
                  </span>
                  {reassignOption === 'reassign' && (
                    <select
                      value={selectedReplacementId}
                      onChange={(e) => setSelectedReplacementId(e.target.value)}
                      className="w-full bg-white border border-emerald-400 rounded-lg p-2 text-xs text-gray-900 font-medium"
                    >
                      {availableReplacementSubCats
                        .filter((c) => c.id !== subCategory.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {'icon' in c && c.icon ? `${c.icon} ` : ''}
                            {c.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </label>

              {/* Option 2: Leave unlinked */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="reassignChoice"
                  checked={reassignOption === 'orphan'}
                  onChange={() => setReassignOption('orphan')}
                  className="mt-0.5 accent-rose-600"
                />
                <div className="space-y-0.5">
                  <span className="font-semibold text-gray-800 block">
                    Ne pas réassigner
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    Les produits resteront dans le catalogue global et la recherche, mais n'apparaîtront plus dans ce filtre de sous-catégorie.
                  </span>
                </div>
              </label>
            </div>
          )}

          {affectedProductsCount === 0 && (
            <p className="text-gray-600">
              Aucun produit n'est actuellement rattaché à cette sous-catégorie. Elle sera supprimée en toute sécurité.
            </p>
          )}

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
              onClick={handleConfirm}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Confirmer la Suppression</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
