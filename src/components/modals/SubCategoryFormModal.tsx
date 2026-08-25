import React, { useState, useEffect } from 'react';
import { X, Save, FolderPlus, Layers } from 'lucide-react';
import { CategoryId, SubCategoryLevel1, SubCategoryLevel2 } from '../../types';

export interface SubCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: 1 | 2;
  editingSubCategory?: SubCategoryLevel1 | SubCategoryLevel2 | null;
  defaultParentCategory?: CategoryId;
  defaultLevel1Id?: string;
  subCategoriesLvl1?: SubCategoryLevel1[];
  onSaveLvl1?: (cat: Omit<SubCategoryLevel1, 'id' | 'order'> | SubCategoryLevel1) => void;
  onSaveLvl2?: (cat: Omit<SubCategoryLevel2, 'id' | 'order'> | SubCategoryLevel2) => void;
}

export const SubCategoryFormModal: React.FC<SubCategoryFormModalProps> = ({
  isOpen,
  onClose,
  level,
  editingSubCategory,
  defaultParentCategory = 'bijoux',
  defaultLevel1Id = '',
  subCategoriesLvl1 = [],
  onSaveLvl1,
  onSaveLvl2,
}) => {
  const isEdit = Boolean(editingSubCategory);

  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState<CategoryId>(defaultParentCategory);
  const [level1Id, setLevel1Id] = useState(defaultLevel1Id);
  const [icon, setIcon] = useState('💎');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    if (editingSubCategory) {
      setName(editingSubCategory.name || '');
      setParentCategory(editingSubCategory.parentCategory || defaultParentCategory);
      setVisible(editingSubCategory.visible !== false);

      if (level === 1) {
        setIcon((editingSubCategory as SubCategoryLevel1).icon || '💎');
      } else {
        setLevel1Id((editingSubCategory as SubCategoryLevel2).level1Id || defaultLevel1Id);
      }
    } else {
      setName('');
      setParentCategory(defaultParentCategory || 'bijoux');
      setVisible(true);
      setIcon('💎');
      setLevel1Id(defaultLevel1Id || subCategoriesLvl1.find((c) => c.parentCategory === defaultParentCategory)?.id || '');
    }
  }, [isOpen, editingSubCategory, level, defaultParentCategory, defaultLevel1Id, subCategoriesLvl1]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const trimmedName = name.trim().toUpperCase();

    if (level === 1) {
      if (isEdit && editingSubCategory) {
        onSaveLvl1?.({
          ...(editingSubCategory as SubCategoryLevel1),
          name: trimmedName,
          parentCategory,
          icon,
          visible,
        });
      } else {
        onSaveLvl1?.({
          name: trimmedName,
          parentCategory,
          icon,
          visible,
        });
      }
    } else {
      const parentL1 = subCategoriesLvl1.find((c) => c.id === level1Id);
      const resolvedParentCat = parentL1?.parentCategory || parentCategory;

      if (isEdit && editingSubCategory) {
        onSaveLvl2?.({
          ...(editingSubCategory as SubCategoryLevel2),
          name: trimmedName,
          level1Id: level1Id || defaultLevel1Id,
          parentCategory: resolvedParentCat,
          visible,
        });
      } else {
        onSaveLvl2?.({
          name: trimmedName,
          level1Id: level1Id || defaultLevel1Id,
          parentCategory: resolvedParentCat,
          visible,
        });
      }
    }

    onClose();
  };

  const relevantLvl1List = subCategoriesLvl1.filter(
    (c) => c.parentCategory === parentCategory
  );

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white border-2 border-[#D4AF37] rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.3)] overflow-hidden text-[#1A0F0A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37]">
              {level === 1 ? <FolderPlus className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1A0F0A]">
                {isEdit
                  ? `Modifier la Sous-Catégorie (Niv. ${level})`
                  : `Nouvelle Sous-Catégorie (Niveau ${level})`}
              </h3>
              <p className="text-xs text-gray-500">
                Univers {parentCategory.toUpperCase()} • Structure du catalogue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Nom de la Sous-Catégorie <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={level === 1 ? "ex: BAGUES, COLLIERS..." : "ex: COLLIERS SUR-MESURE, BAGUES OR..."}
              className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-[#1A0F0A] uppercase font-bold focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Catégorie Parente
              </label>
              <select
                value={parentCategory}
                onChange={(e) => {
                  const newCat = e.target.value as CategoryId;
                  setParentCategory(newCat);
                  const firstL1 = subCategoriesLvl1.find((c) => c.parentCategory === newCat);
                  if (firstL1) setLevel1Id(firstL1.id);
                }}
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-[#1A0F0A] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="bijoux">💎 Bijoux</option>
                <option value="emballages">📦 Emballages</option>
                <option value="parfums">👑 Parfums</option>
                <option value="accessoires">✨ Accessoires</option>
              </select>
            </div>

            {level === 1 ? (
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Icône / Émoji
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="💎"
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-center text-lg text-[#1A0F0A] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Sous-Catégorie Niveau 1 Parente <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={level1Id}
                  onChange={(e) => setLevel1Id(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-[#1A0F0A] focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="">-- Sélectionner le parent Niv. 1 --</option>
                  {relevantLvl1List.map((l1) => (
                    <option key={l1.id} value={l1.id}>
                      {l1.icon ? `${l1.icon} ` : ''}{l1.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded"
              />
              <span className="text-gray-700 font-medium">Visible sur le catalogue public</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
