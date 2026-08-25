import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Upload, Sparkles, Tag, Layers, CheckCircle } from 'lucide-react';
import {
  Product,
  CategoryId,
  GenderCategory,
  AvailabilityStatus,
  Collection,
  SubCategoryLevel1,
  SubCategoryLevel2,
} from '../../types';
import { ImageUploader } from '../ImageUploader';

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: Product | null;
  initialCategory?: CategoryId;
  initialGender?: GenderCategory;
  initialSubCategory?: string;
  collections?: Collection[];
  subCategoriesLvl1?: SubCategoryLevel1[];
  subCategoriesLvl2?: SubCategoryLevel2[];
  productsCount?: number;
  onSave: (productData: Product | Omit<Product, 'id'>) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  editingProduct,
  initialCategory = 'bijoux',
  initialGender = 'femme',
  initialSubCategory,
  collections = [],
  subCategoriesLvl1 = [],
  subCategoriesLvl2 = [],
  productsCount = 0,
  onSave,
}) => {
  const isEditMode = Boolean(editingProduct);

  const [refCode, setRefCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryId>(initialCategory);
  const [gender, setGender] = useState<GenderCategory>(initialGender);
  const [subCategory, setSubCategory] = useState<string>('colliers');
  const [price, setPrice] = useState<number>(9500);
  const [priceVariable, setPriceVariable] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [availability, setAvailability] = useState<AvailabilityStatus>('disponible');
  const [badge, setBadge] = useState<string>('Disponible');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [material, setMaterial] = useState<string>('Acier Inoxydable 316L');
  const [guarantee, setGuarantee] = useState<string>('1 An de Garantie');
  const [deliveryDelay, setDeliveryDelay] = useState<string>('24h à 48h');
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>(['', '', '']);

  // Initialize or reset form on open/change
  useEffect(() => {
    if (!isOpen) return;

    if (editingProduct) {
      setRefCode(editingProduct.refCode || '');
      setName(editingProduct.name || '');
      setCategory(editingProduct.category || 'bijoux');
      setGender(editingProduct.gender || 'femme');
      setSubCategory(editingProduct.subCategory || '');
      setPrice(editingProduct.price || 0);
      setPriceVariable(Boolean(editingProduct.priceVariable));
      setDescription(editingProduct.description || '');
      setAvailability(editingProduct.availability || 'disponible');
      setBadge(editingProduct.badge || 'Disponible');
      setIsFeatured(Boolean(editingProduct.isFeatured));
      setMaterial(editingProduct.material || 'Acier Inoxydable 316L');
      setGuarantee(editingProduct.guarantee || '1 An de Garantie');
      setDeliveryDelay(editingProduct.deliveryDelay || '24h à 48h');
      setCollectionIds(editingProduct.collectionIds || []);

      const list = [
        editingProduct.imageUrl,
        ...(editingProduct.images || []).filter((i) => i && i !== editingProduct.imageUrl),
      ].filter(Boolean);
      const unique = Array.from(new Set(list));
      while (unique.length < 3) unique.push('');
      setImages(unique.slice(0, 3));
    } else {
      const generatedRef = `${productsCount + 1}`.padStart(3, '0');
      setRefCode(generatedRef);
      setName('');
      setCategory(initialCategory || 'bijoux');
      setGender(initialGender || 'femme');
      setSubCategory(initialSubCategory || 'colliers');
      setPrice(9500);
      setPriceVariable(false);
      setDescription('');
      setAvailability('disponible');
      setBadge('Disponible');
      setIsFeatured(false);
      setMaterial('Acier Inoxydable 316L');
      setGuarantee('1 An de Garantie');
      setDeliveryDelay('24h à 48h');
      setCollectionIds([]);
      setImages(['', '', '']);
    }
  }, [isOpen, editingProduct, initialCategory, initialGender, initialSubCategory, productsCount]);

  // Compute available SubCategories Level 2 dynamically based on selected Category and Level 1
  const dynamicSubCategoryOptions = useMemo(() => {
    // 1. First look in subCategoriesLvl2 filtered by parentCategory
    const lvl2Filtered = subCategoriesLvl2.filter(
      (c) => c.parentCategory === category && c.visible !== false
    );

    if (lvl2Filtered.length > 0) {
      return lvl2Filtered.map((c) => ({
        value: c.id,
        label: c.name,
      }));
    }

    // 2. Fallback to subCategoriesLvl1 if no Lvl2 exist for this category
    const lvl1Filtered = subCategoriesLvl1.filter(
      (c) => c.parentCategory === category && c.visible !== false
    );

    if (lvl1Filtered.length > 0) {
      return lvl1Filtered.map((c) => ({
        value: c.id,
        label: `${c.icon ? c.icon + ' ' : ''}${c.name}`,
      }));
    }

    // 3. Fallback defaults per category if none configured in DB
    switch (category) {
      case 'bijoux':
        return [
          { value: 'colliers', label: '📿 Colliers' },
          { value: 'bracelets', label: '🔗 Bracelets' },
          { value: 'bagues', label: '💍 Bagues' },
          { value: 'boucles-oreilles', label: "✨ Boucles d'oreilles" },
          { value: 'chaines-pieds', label: '🦶 Chaînes de pieds' },
          { value: 'perles-hanche', label: '💃 Perles de hanche' },
          { value: 'montres', label: '⌚ Montres' },
          { value: 'medailles', label: '🏅 Médailles' },
          { value: 'manchettes', label: '💪 Manchettes' },
          { value: 'autres', label: '✨ Autres Bijoux' },
        ];
      case 'emballages':
        return [
          { value: 'boites', label: '📦 Boîtes' },
          { value: 'sachets', label: '🛍️ Sachets' },
          { value: 'sacs', label: '👜 Sacs' },
          { value: 'pots', label: '🫙 Pots' },
          { value: 'flacons', label: '🧪 Flacons' },
          { value: 'papier', label: '📄 Papier' },
          { value: 'verre', label: '🥛 Verre' },
          { value: 'autres', label: '📦 Autres Emballages' },
        ];
      case 'parfums':
        return [
          { value: 'anonym-invitation', label: '👑 ANONYM INVITATION' },
          { value: 'extrait-50ml', label: '👑 Extrait de Parfum 50ml' },
          { value: 'huile-olfactive', label: '✨ Huile Olfactive Sur-Mesure' },
          { value: 'brume', label: '🌸 Brume Parfumée' },
          { value: 'collections-privees', label: '✨ Collections Privées' },
        ];
      case 'accessoires':
        return [
          { value: 'verres', label: '🥂 Verres Personnalisés' },
          { value: 'tasses', label: '☕ Tasses & Mugs' },
          { value: 'stylos', label: '🖊️ Stylos Personnalisés' },
          { value: 'portecles', label: '🔑 Porte-Clés Personnalisés' },
          { value: 'nounours', label: '🧸 Nounours Personnalisés' },
          { value: 'bijoux', label: '💍 Bijoux Personnalisés' },
          { value: 'autres', label: '✨ Autres Accessoires' },
        ];
      default:
        return [{ value: 'tous', label: 'Général' }];
    }
  }, [category, subCategoriesLvl1, subCategoriesLvl2]);

  if (!isOpen) return null;

  const handleUpdateImageAtIndex = (index: number, url: string) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !refCode.trim()) return;

    const validImages = images.filter((img) => img && img.trim().length > 0);
    const mainImage =
      validImages[0] ||
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop';

    const productPayload = {
      ...(editingProduct || {}),
      refCode: refCode.trim(),
      name: name.trim(),
      category,
      gender,
      subCategory: subCategory || dynamicSubCategoryOptions[0]?.value || 'colliers',
      price: Number(price) || 0,
      priceVariable,
      description: description.trim(),
      imageUrl: mainImage,
      images: validImages.length > 0 ? validImages : [mainImage],
      availability,
      badge:
        availability === 'nouveau'
          ? 'Nouveauté'
          : availability === 'epuise'
          ? 'Épuisé'
          : availability === 'sur-commande'
          ? 'Sur commande'
          : badge || 'Disponible',
      isFeatured: availability === 'nouveau' ? true : isFeatured,
      material: material.trim(),
      guarantee: guarantee.trim(),
      deliveryDelay: deliveryDelay.trim(),
      collectionIds,
    };

    onSave(productPayload as any);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white border-2 border-[#D4AF37] rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.3)] flex flex-col overflow-hidden text-[#1A0F0A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1A0F0A]">
                {isEditMode ? `Modifier la Création : ${name || refCode}` : 'Ajouter une Nouvelle Création'}
              </h3>
              <p className="text-xs text-gray-600">
                Catalogue ANONYM • {isEditMode ? 'Mise à jour en direct' : 'Ajout immédiat au catalogue'}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Code Référence <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
                placeholder="Ex: #001, #212..."
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-[#1A0F0A] font-mono focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Nom Commercial du Produit <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Collier Prénom Calligraphié Or 18k"
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-[#1A0F0A] font-semibold focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Catégorie Principale <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value as CategoryId;
                  setCategory(newCat);
                }}
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-[#1A0F0A] font-medium focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="bijoux">💎 Bijoux</option>
                <option value="emballages">📦 Emballages</option>
                <option value="parfums">👑 Parfums (ANONYM)</option>
                <option value="accessoires">✨ Accessoires</option>
              </select>
            </div>

            {/* 1st Level (Target / Gender for Bijoux) */}
            {category === 'bijoux' ? (
              <div>
                <label className="block text-[#D4AF37] font-semibold mb-1">
                  Cible / Genre (Niveau 1) *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as GenderCategory)}
                  className="w-full bg-white border border-[#D4AF37]/60 rounded-xl p-2.5 text-[#1A0F0A] font-medium focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="femme">👩 Bijoux Femme</option>
                  <option value="homme">👨 Bijoux Homme</option>
                  <option value="couple">👩‍❤️‍👨 Bijoux Couple</option>
                  <option value="enfant">👶 Bijoux Enfant</option>
                  <option value="mixte">✨ Bijoux Mixte</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-gray-500 font-semibold mb-1">
                  Sous-Catégorie Niveau 1
                </label>
                <input
                  type="text"
                  disabled
                  value={category.toUpperCase()}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2.5 text-gray-500 cursor-not-allowed"
                />
              </div>
            )}

            {/* 2nd Level SubCategory (DYNAMIC SYNCHRONIZATION) */}
            <div>
              <label className="block text-[#D4AF37] font-semibold mb-1">
                Sous-Catégorie Niveau 2 (Type Spécifique) <span className="text-rose-500">*</span>
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full bg-white border border-[#D4AF37]/60 rounded-xl p-2.5 text-[#1A0F0A] font-semibold focus:border-[#D4AF37] focus:outline-none"
              >
                {dynamicSubCategoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Collection Select */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Collection Rattachée (Optionnel)
              </label>
              <select
                value={collectionIds[0] || ''}
                onChange={(e) => setCollectionIds(e.target.value ? [e.target.value] : [])}
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-[#1A0F0A] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="">-- Aucune collection spécifique --</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.icon || '📿'} {col.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Prix Indicatif (FCFA) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={price || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setPrice(val ? parseInt(val) : 0);
                }}
                placeholder="Ex: 9500"
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-[#1A0F0A] font-semibold focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-[#D4AF37] font-semibold mb-1">
                Disponibilité & Statut <span className="text-rose-500">*</span>
              </label>
              <select
                value={availability}
                onChange={(e) => {
                  const val = e.target.value as AvailabilityStatus;
                  setAvailability(val);
                  if (val === 'nouveau') setBadge('Nouveauté');
                  else if (val === 'epuise') setBadge('Épuisé');
                  else if (val === 'sur-commande') setBadge('Sur commande');
                  else setBadge('Disponible');
                }}
                className="w-full bg-white border border-[#D4AF37]/60 rounded-xl p-2.5 text-[#1A0F0A] font-medium focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="disponible">🟢 Disponible (En stock)</option>
                <option value="sur-commande">🟡 Sur commande (Confection sur-mesure)</option>
                <option value="epuise">🔴 Épuisé (Rupture de stock)</option>
                <option value="nouveau">✨ Nouveau (Nouveauté / En Vedette)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs">
            <label className="block text-gray-700 font-semibold mb-1">
              Description & Histoire du Bijou / Produit
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez les finitions, symbolismes ou conseils d'entretien..."
              className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-[#1A0F0A] focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* 3 Photos Carousel Upload Section */}
          <div className="bg-gray-50 border border-[#D4AF37]/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#D4AF37]" />
              <h4 className="text-sm font-serif font-bold text-[#1A0F0A]">
                Photos du Carrousel Produit (Jusqu'à 3 images)
              </h4>
            </div>
            <p className="text-[11px] text-gray-600">
              La première photo est la photo principale affichée sur la carte. Les suivantes apparaissent au survol ou dans la fiche détaillée.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[0, 1, 2].map((slotIdx) => {
                const imgVal = images[slotIdx] || '';
                const isMain = slotIdx === 0;

                return (
                  <div
                    key={slotIdx}
                    className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 bg-white ${
                      isMain ? 'border-[#D4AF37] shadow-sm' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isMain ? 'text-[#D4AF37]' : 'text-gray-600'}`}>
                        Photo #{slotIdx + 1} {isMain && '(Principale)'}
                      </span>
                    </div>
                    <ImageUploader
                      value={imgVal}
                      onChange={(val) => handleUpdateImageAtIndex(slotIdx, val)}
                      compact={true}
                      allowUrlInput={false}
                      aspectRatio="square"
                      maxSizeMB={5}
                      placeholder={`Sélectionner Photo #${slotIdx + 1}...`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditMode ? 'Enregistrer les Modifications' : 'Créer le Produit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
