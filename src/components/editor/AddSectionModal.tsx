import React, { useState } from 'react';
import { CustomSection } from '../../types';
import { Type, Image as ImageIcon, Layout, X, Plus, Check } from 'lucide-react';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: CustomSection['type'], data: Partial<CustomSection>) => void;
  pageId: CustomSection['pageId'];
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  pageId,
}) => {
  const [selectedType, setSelectedType] = useState<CustomSection['type']>('text-image');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePosition, setImagePosition] = useState<'left' | 'right'>('right');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(selectedType, {
      title: title || undefined,
      subtitle: subtitle || undefined,
      content: content || undefined,
      imagePosition,
      pageId,
    });
    onClose();
    // Reset fields
    setTitle('');
    setSubtitle('');
    setContent('');
  };

  const templates: {
    type: CustomSection['type'];
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      type: 'text-image',
      label: 'Texte + Image',
      description: 'Idéal pour présenter une histoire, un savoir-faire ou un service avec une belle photo.',
      icon: Layout,
    },
    {
      type: 'text',
      label: 'Bloc Texte & Titre',
      description: 'Section centrée avec grand titre, sous-titre et paragraphe descriptif.',
      icon: Type,
    },
    {
      type: 'image',
      label: 'Image / Bannière Pleine Largeur',
      description: 'Grand visuel immersif avec titre et légende optionnelle.',
      icon: ImageIcon,
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-xl w-full bg-[#141414] border-2 border-[#D4AF37] rounded-3xl p-6 shadow-2xl text-white space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-sm sm:text-base tracking-wide text-[#D4AF37] uppercase">
              Ajouter une nouvelle section sur la page
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Choose Template */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2.5">
            1. Choisissez le modèle de section :
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              const isSelected = selectedType === tpl.type;
              return (
                <button
                  key={tpl.type}
                  type="button"
                  onClick={() => setSelectedType(tpl.type)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] text-white'
                      : 'bg-black/50 border-gray-800 hover:border-gray-700 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div>
                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                    <h4 className="font-bold text-xs text-white mb-1">{tpl.label}</h4>
                    <p className="text-[10px] text-gray-400 leading-snug">{tpl.description}</p>
                  </div>
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1 text-[10px] text-[#D4AF37] font-bold">
                      <Check className="w-3 h-3" /> Sélectionné
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Quick Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 border-t border-gray-800">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Titre de la section (optionnel, modifiable après) :
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Notre Savoir-Faire d'Exception"
              className="w-full p-2.5 bg-black text-white rounded-xl border border-gray-700 focus:border-[#D4AF37] focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Sous-titre / Slogan :
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Créations artisanales réalisées à la main"
              className="w-full p-2.5 bg-black text-white rounded-xl border border-gray-700 focus:border-[#D4AF37] focus:outline-none text-xs"
            />
          </div>

          {selectedType === 'text-image' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Position de l'image :
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setImagePosition('left')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    imagePosition === 'left' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]' : 'bg-black text-gray-300 border-gray-700'
                  }`}
                >
                  Image à Gauche
                </button>
                <button
                  type="button"
                  onClick={() => setImagePosition('right')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    imagePosition === 'right' ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]' : 'bg-black text-gray-300 border-gray-700'
                  }`}
                >
                  Image à Droite
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Créer & Insérer la Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
