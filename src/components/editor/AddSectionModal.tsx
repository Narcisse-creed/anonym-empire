import React, { useState } from 'react';
import { CustomSection } from '../../types';
import {
  Type,
  Image as ImageIcon,
  Layout,
  BookOpen,
  Columns,
  X,
  Plus,
  Check,
  Palette,
} from 'lucide-react';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: CustomSection['type'], data: Partial<CustomSection>) => void;
  pageId: CustomSection['pageId'];
}

const BG_PALETTE = [
  { name: 'Blanc Ivoire', color: '#FFFFFF' },
  { name: 'Crème Chaud', color: '#FAF6F0' },
  { name: 'Sable Doré', color: '#F5EED8' },
  { name: 'Lavande Douce', color: '#F0EDF6' },
  { name: 'Écru Naturel', color: '#F0EDE7' },
  { name: 'Noir Profond', color: '#141414' },
];

const FONT_OPTIONS: { id: CustomSection['fontFamily']; label: string; class: string }[] = [
  { id: 'serif', label: 'Serif Royal', class: 'font-serif' },
  { id: 'sans', label: 'Sans Moderne', class: 'font-sans' },
  { id: 'elegant', label: 'Playfair Élégant', class: 'font-serif italic' },
];

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  pageId,
}) => {
  const [selectedType, setSelectedType] = useState<CustomSection['type']>('narrative');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePosition, setImagePosition] = useState<'left' | 'right'>('right');
  const [selectedBg, setSelectedBg] = useState<string>('#FFFFFF');
  const [selectedFont, setSelectedFont] = useState<CustomSection['fontFamily']>('serif');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(selectedType, {
      title: title || undefined,
      subtitle: subtitle || undefined,
      content: content || undefined,
      imagePosition,
      bgColor: selectedBg,
      fontFamily: selectedFont,
      pageId,
    });
    onClose();
    // Reset fields
    setTitle('');
    setSubtitle('');
    setContent('');
    setSelectedBg('#FFFFFF');
    setSelectedFont('serif');
  };

  const templates: {
    type: CustomSection['type'];
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      type: 'narrative',
      label: 'Récit Narratif Long',
      description: 'Format histoire / philosophie (style Enora Antoine) avec titre majuscule, grand texte et photo.',
      icon: BookOpen,
    },
    {
      type: 'text-image',
      label: 'Texte + Image',
      description: 'Présentation équilibrée avec photo à gauche ou à droite d’un bloc descriptif.',
      icon: Layout,
    },
    {
      type: 'image-duo',
      label: 'Duo de Photos',
      description: 'Deux créations ou photos présentées côte à côte avec titre et légende.',
      icon: Columns,
    },
    {
      type: 'text',
      label: 'Bloc Texte Centré',
      description: 'Grand titre centré, sous-titre doré et paragraphes épurés sans image.',
      icon: Type,
    },
    {
      type: 'image',
      label: 'Bannière Pleine Largeur',
      description: 'Grand visuel immersif pour marquer une transition forte sur la page.',
      icon: ImageIcon,
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full my-8 bg-[#141414] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-7 shadow-2xl text-white space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3.5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base tracking-wide text-[#D4AF37] uppercase">
                Ajouter une section sur la page
              </h3>
              <p className="text-[11px] text-gray-400">
                Créez une section riche et personnalisée en quelques clics
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Choose Template */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2.5">
            1. Choisissez le style de la section :
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              const isSelected = selectedType === tpl.type;
              return (
                <button
                  key={tpl.type}
                  type="button"
                  onClick={() => setSelectedType(tpl.type)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] text-white ring-1 ring-[#D4AF37]'
                      : 'bg-black/50 border-gray-800 hover:border-gray-700 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </div>
                    <h4 className="font-bold text-xs text-white mb-0.5">{tpl.label}</h4>
                    <p className="text-[10px] text-gray-400 leading-snug">{tpl.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Background Color & Font Customization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-gray-800">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Couleur de fond :</span>
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {BG_PALETTE.map((pal) => (
                <button
                  key={pal.color}
                  type="button"
                  onClick={() => setSelectedBg(pal.color)}
                  className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    selectedBg === pal.color
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/60 scale-105'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                  title={pal.name}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/20 shadow-inner"
                    style={{ backgroundColor: pal.color }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Police de titre :</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFont(f.id)}
                  className={`py-1.5 px-2 rounded-xl text-center text-[10px] border transition-colors cursor-pointer ${
                    selectedFont === f.id
                      ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                      : 'bg-black text-gray-300 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <span className={f.class}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Quick Content Pre-fill Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-gray-800">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Titre de la section (optionnel, modifiable en direct ensuite) :
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                selectedType === 'narrative'
                  ? 'Ex: LA CRÉATRICE ou NOTRE PHILOSOPHIE'
                  : selectedType === 'image-duo'
                  ? 'Ex: DUO DE PIÈCES RARES'
                  : "Ex: Notre Savoir-Faire d'Exception"
              }
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
              placeholder="Ex: Une démarche artisanale, poétique et durable"
              className="w-full p-2.5 bg-black text-white rounded-xl border border-gray-700 focus:border-[#D4AF37] focus:outline-none text-xs"
            />
          </div>

          {selectedType === 'text-image' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Position de l'image :
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setImagePosition('left')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    imagePosition === 'left'
                      ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                      : 'bg-black text-gray-300 border-gray-700'
                  }`}
                >
                  Image à Gauche
                </button>
                <button
                  type="button"
                  onClick={() => setImagePosition('right')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    imagePosition === 'right'
                      ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                      : 'bg-black text-gray-300 border-gray-700'
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
              <Plus className="w-4 h-4" /> Insérer la Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
