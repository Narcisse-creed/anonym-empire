import React, { useState } from 'react';
import { CustomSection } from '../../types';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import {
  Trash2,
  ArrowLeftRight,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Palette,
  Type,
  Sparkles,
} from 'lucide-react';

interface CustomDynamicSectionProps {
  section: CustomSection;
  index: number;
  totalSections?: number;
}

const BG_PALETTE = [
  { name: 'Blanc Ivoire', color: '#FFFFFF', isDark: false },
  { name: 'Crème Chaud', color: '#FAF6F0', isDark: false },
  { name: 'Sable Doré', color: '#F5EED8', isDark: false },
  { name: 'Lavande Douce', color: '#F0EDF6', isDark: false },
  { name: 'Écru Naturel', color: '#F0EDE7', isDark: false },
  { name: 'Noir Profond', color: '#141414', isDark: true },
];

const FONT_OPTIONS: { id: CustomSection['fontFamily']; label: string; class: string }[] = [
  { id: 'serif', label: 'Serif Royal', class: 'font-serif' },
  { id: 'sans', label: 'Sans Moderne', class: 'font-sans' },
  { id: 'elegant', label: 'Playfair Élégant', class: 'font-serif italic' },
];

export const CustomDynamicSection: React.FC<CustomDynamicSectionProps> = ({
  section,
  index,
  totalSections = 1,
}) => {
  const {
    isEditMode,
    deleteCustomSection,
    updateCustomSection,
    moveCustomSection,
  } = useVisualEditor();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);

  const handleDelete = () => {
    deleteCustomSection(section.id);
    setShowDeleteConfirm(false);
  };

  const toggleImagePosition = () => {
    updateCustomSection(section.id, {
      imagePosition: section.imagePosition === 'left' ? 'right' : 'left',
    });
  };

  const currentColor = section.bgColor || '#FFFFFF';
  const isDarkBg = currentColor === '#141414' || currentColor.toLowerCase() === '#000000';
  const fontClass =
    section.fontFamily === 'sans'
      ? 'font-sans'
      : section.fontFamily === 'elegant'
      ? 'font-serif italic'
      : 'font-serif';

  return (
    <section
      className="py-16 sm:py-24 relative border-b border-[#D4AF37]/20 transition-colors duration-300"
      style={{ backgroundColor: currentColor }}
    >
      {/* Background ambient glow if light */}
      {!isDarkBg && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,_var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Admin Controls Overlay (in Edit Mode) */}
      {isEditMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-30">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#141414] border-2 border-[#D4AF37] rounded-2xl text-xs text-white shadow-2xl">
            {/* Left: Section identifier & type */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#D4AF37] text-black font-bold rounded-lg text-[10px] uppercase tracking-wider">
                Section #{index + 1}
              </span>
              <span className="text-gray-300 font-mono text-[11px]">
                {section.type === 'narrative'
                  ? 'Récit Narratif Long'
                  : section.type === 'image-duo'
                  ? 'Duo de Photos'
                  : section.type === 'text-image'
                  ? 'Texte + Image'
                  : section.type === 'text'
                  ? 'Texte Seul'
                  : 'Bannière Large'}
              </span>
            </div>

            {/* Middle & Right: Actions (Move, Background Color, Font, Delete) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Move Up */}
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveCustomSection(section.id, 'up')}
                className={`p-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  index === 0
                    ? 'opacity-40 cursor-not-allowed border-gray-800 text-gray-500'
                    : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white cursor-pointer'
                }`}
                title="Monter la section"
              >
                <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                <span className="hidden sm:inline">Monter</span>
              </button>

              {/* Move Down */}
              <button
                type="button"
                disabled={index >= totalSections - 1}
                onClick={() => moveCustomSection(section.id, 'down')}
                className={`p-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  index >= totalSections - 1
                    ? 'opacity-40 cursor-not-allowed border-gray-800 text-gray-500'
                    : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-white cursor-pointer'
                }`}
                title="Descendre la section"
              >
                <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
                <span className="hidden sm:inline">Descendre</span>
              </button>

              {/* Background Color Picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowFontPicker(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Changer la couleur de fond"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-gray-500 shadow-sm"
                    style={{ backgroundColor: currentColor }}
                  />
                  <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Fond</span>
                </button>

                {showColorPicker && (
                  <div className="absolute right-0 top-full mt-2 w-56 p-3 bg-[#1c1c1c] border-2 border-[#D4AF37] rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
                      Couleur de fond
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {BG_PALETTE.map((pal) => (
                        <button
                          key={pal.color}
                          type="button"
                          onClick={() => {
                            updateCustomSection(section.id, { bgColor: pal.color });
                            setShowColorPicker(false);
                          }}
                          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            currentColor === pal.color
                              ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 scale-105'
                              : 'border-gray-700 hover:border-gray-500'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-full border border-black/20 shadow-inner"
                            style={{ backgroundColor: pal.color }}
                          />
                          <span className="text-[9px] text-gray-300 font-medium text-center leading-tight truncate w-full">
                            {pal.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Font Family Picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowFontPicker(!showFontPicker);
                    setShowColorPicker(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Changer la police de la section"
                >
                  <Type className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Police</span>
                </button>

                {showFontPicker && (
                  <div className="absolute right-0 top-full mt-2 w-48 p-2.5 bg-[#1c1c1c] border-2 border-[#D4AF37] rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] px-1 mb-1">
                      Typographie
                    </p>
                    {FONT_OPTIONS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          updateCustomSection(section.id, { fontFamily: f.id });
                          setShowFontPicker(false);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          section.fontFamily === f.id || (!section.fontFamily && f.id === 'serif')
                            ? 'bg-[#D4AF37] text-black font-bold'
                            : 'hover:bg-gray-800 text-gray-300'
                        }`}
                      >
                        <span className={f.class}>{f.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Invert Side (for text-image) */}
              {section.type === 'text-image' && (
                <button
                  type="button"
                  onClick={toggleImagePosition}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Inverser position texte / image"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden sm:inline">
                    {section.imagePosition === 'left' ? 'Image à Gauche' : 'Image à Droite'}
                  </span>
                </button>
              )}

              {/* Delete */}
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-600 text-rose-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Supprimer cette section"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {showDeleteConfirm && (
        <div
          onClick={() => setShowDeleteConfirm(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#141414] border-2 border-rose-600 rounded-3xl p-6 shadow-2xl text-white space-y-4 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-950 border border-rose-600 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-rose-300">
              Confirmer la suppression de la section
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Êtes-vous sûre de vouloir supprimer définitivement cette section (
              {section.title || 'Sans titre'}) ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg cursor-pointer"
              >
                Oui, Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Section Content Render by Type ── */}
      <div className="max-w-7xl lg:max-w-[1300px] xl:max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TYPE 1: TEXT + IMAGE */}
        {section.type === 'text-image' && (
          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
              section.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Text Side */}
            <div
              className={`lg:col-span-7 space-y-4 ${
                section.imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'
              }`}
            >
              {section.badge && (
                <div className="inline-block px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#8C6D23] font-mono text-[11px] font-bold uppercase tracking-wider">
                  <EditableText
                    path={`customSections.${index}.badge`}
                    value={section.badge}
                    defaultValue="Nouveau"
                    label="Badge"
                  />
                </div>
              )}

              <h2
                className={`text-2xl sm:text-4xl font-bold leading-tight ${
                  isDarkBg ? 'text-white' : 'text-[#1A0F0A]'
                } ${fontClass}`}
              >
                <EditableText
                  path={`customSections.${index}.title`}
                  value={section.title}
                  defaultValue="Titre de la section"
                  label="Titre principal"
                />
              </h2>

              <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#8C6D23] uppercase">
                <EditableText
                  path={`customSections.${index}.subtitle`}
                  value={section.subtitle}
                  defaultValue="Sous-titre de la section"
                  label="Sous-titre"
                />
              </p>

              <div
                className={`text-sm sm:text-base leading-relaxed pt-2 ${
                  isDarkBg ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                <EditableText
                  path={`customSections.${index}.content`}
                  value={section.content}
                  defaultValue="Description de la section..."
                  multiline={true}
                  label="Paragraphe"
                />
              </div>
            </div>

            {/* Image Side */}
            <div
              className={`lg:col-span-5 ${
                section.imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'
              }`}
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/30 bg-white p-2">
                <EditableImage
                  path={`customSections.${index}.imageUrl`}
                  src={section.imageUrl}
                  defaultSrc="/images/lizie-black-outfit.jpg"
                  alt={section.title || 'Image section'}
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                  label="Photo de la section"
                />
              </div>
            </div>
          </div>
        )}

        {/* TYPE 2: TEXT ONLY (CENTERED) */}
        {section.type === 'text' && (
          <div className="max-w-3xl mx-auto text-center space-y-4">
            {section.badge && (
              <div className="inline-block px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#8C6D23] font-mono text-[11px] font-bold uppercase tracking-wider">
                <EditableText
                  path={`customSections.${index}.badge`}
                  value={section.badge}
                  defaultValue="La Maison"
                  label="Badge"
                />
              </div>
            )}

            <h2
              className={`text-2xl sm:text-4xl font-bold leading-tight ${
                isDarkBg ? 'text-white' : 'text-[#1A0F0A]'
              } ${fontClass}`}
            >
              <EditableText
                path={`customSections.${index}.title`}
                value={section.title}
                defaultValue="Titre de la section"
                label="Grand Titre"
              />
            </h2>

            <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#8C6D23] uppercase">
              <EditableText
                path={`customSections.${index}.subtitle`}
                value={section.subtitle}
                defaultValue="Sous-titre"
                label="Sous-titre"
              />
            </p>

            <div
              className={`text-sm sm:text-base leading-relaxed pt-2 ${
                isDarkBg ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              <EditableText
                path={`customSections.${index}.content`}
                value={section.content}
                defaultValue="Contenu de la section..."
                multiline={true}
                label="Texte"
              />
            </div>
          </div>
        )}

        {/* TYPE 3: FULL WIDTH BANNER IMAGE */}
        {section.type === 'image' && (
          <div className="max-w-5xl mx-auto space-y-4 text-center">
            {section.title && (
              <h2
                className={`text-2xl sm:text-4xl font-bold ${
                  isDarkBg ? 'text-white' : 'text-[#1A0F0A]'
                } ${fontClass}`}
              >
                <EditableText
                  path={`customSections.${index}.title`}
                  value={section.title}
                  defaultValue="Titre de la bannière"
                  label="Titre"
                />
              </h2>
            )}

            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/30 bg-white p-2">
              <EditableImage
                path={`customSections.${index}.imageUrl`}
                src={section.imageUrl}
                defaultSrc="/images/lizie-black-outfit.jpg"
                alt={section.title || 'Bannière'}
                className="w-full h-80 sm:h-[450px] object-cover rounded-2xl"
                label="Bannière Photo"
              />
            </div>

            {section.subtitle && (
              <p className={`text-xs sm:text-sm italic ${isDarkBg ? 'text-gray-400' : 'text-gray-600'}`}>
                <EditableText
                  path={`customSections.${index}.subtitle`}
                  value={section.subtitle}
                  defaultValue="Légende de la photo"
                  label="Légende"
                />
              </p>
            )}
          </div>
        )}

        {/* TYPE 4: NARRATIVE (STYLE ENORA ANTOINE - LONG STORY LAYOUT) */}
        {section.type === 'narrative' && (
          <div className="max-w-3xl lg:max-w-4xl mx-auto space-y-8 text-center">
            {/* Top Optional Decorative Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#8C6D23] text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <EditableText
                  path={`customSections.${index}.badge`}
                  value={section.badge}
                  defaultValue="NOTRE VISION"
                  label="Badge Récit"
                />
              </div>
            </div>

            {/* Main Narrative Heading */}
            <div className="space-y-3">
              <h2
                className={`text-3xl sm:text-5xl font-bold uppercase tracking-wider leading-tight ${
                  isDarkBg ? 'text-white' : 'text-[#1A0F0A]'
                } ${fontClass}`}
              >
                <EditableText
                  path={`customSections.${index}.title`}
                  value={section.title}
                  defaultValue="LA CRÉATRICE"
                  label="Grand Titre Récit"
                />
              </h2>

              <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#8C6D23] uppercase">
                <EditableText
                  path={`customSections.${index}.subtitle`}
                  value={section.subtitle}
                  defaultValue="Une joaillerie éthique, poétique et personnelle"
                  label="Sous-titre Récit"
                />
              </p>
            </div>

            {/* Optional Header Picture */}
            {section.imageUrl && (
              <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-xl border-2 border-[#D4AF37]/30 bg-white p-2">
                <EditableImage
                  path={`customSections.${index}.imageUrl`}
                  src={section.imageUrl}
                  defaultSrc="/images/lizie-black-outfit.jpg"
                  alt={section.title || 'Photo Récit'}
                  className="w-full h-72 sm:h-96 object-cover rounded-2xl"
                  label="Photo d'illustration récit"
                />
              </div>
            )}

            {/* Narrative Long Prose */}
            <div
              className={`text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose text-left font-sans max-w-3xl mx-auto space-y-4 ${
                isDarkBg ? 'text-gray-300' : 'text-[#2C2420]'
              }`}
            >
              <EditableText
                path={`customSections.${index}.content`}
                value={section.content}
                defaultValue={`Issue d'un héritage d'excellence et de raffinement, la Maison ANONYM conçoit des bijoux et parures uniques. Chaque création traduit vos émotions, prénoms et dates mémorables en œuvres durables.\n\nUne démarche éthique et personnalisée :\nNous sélectionnons avec la plus haute rigueur nos métaux précieux et nos pierres. L'or et l'acier inoxydable 316L résistent à l'épreuve du temps, conçus pour transcender les générations.\n\nUne esthétique qui allie poésie et modernité :\nDans ses créations, ANONYM sculpte la pureté et la lumière, traçant des courbes élégantes qui valorisent chaque personne.`}
                multiline={true}
                label="Texte narratif complet"
              />
            </div>
          </div>
        )}

        {/* TYPE 5: IMAGE DUO (TWO CURATED PHOTOS SIDE-BY-SIDE) */}
        {section.type === 'image-duo' && (
          <div className="max-w-5xl mx-auto space-y-6 text-center">
            {section.title && (
              <h2
                className={`text-2xl sm:text-4xl font-bold ${
                  isDarkBg ? 'text-white' : 'text-[#1A0F0A]'
                } ${fontClass}`}
              >
                <EditableText
                  path={`customSections.${index}.title`}
                  value={section.title}
                  defaultValue="NOS CRÉATIONS PHARE"
                  label="Titre Duo de Photos"
                />
              </h2>
            )}

            {section.subtitle && (
              <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#8C6D23] uppercase">
                <EditableText
                  path={`customSections.${index}.subtitle`}
                  value={section.subtitle}
                  defaultValue="Double perspective de nos réalisations"
                  label="Sous-titre"
                />
              </p>
            )}

            {/* Duo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-2">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/30 bg-white p-2">
                <EditableImage
                  path={`customSections.${index}.imageUrl`}
                  src={section.imageUrl}
                  defaultSrc="/images/lizie-black-outfit.jpg"
                  alt="Photo 1"
                  className="w-full h-72 sm:h-80 object-cover rounded-2xl"
                  label="Photo 1 (Gauche)"
                />
              </div>

              <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/30 bg-white p-2">
                <EditableImage
                  path={`customSections.${index}.imageUrl2`}
                  src={section.imageUrl2}
                  defaultSrc="/images/lizie-white-suit.jpg"
                  alt="Photo 2"
                  className="w-full h-72 sm:h-80 object-cover rounded-2xl"
                  label="Photo 2 (Droite)"
                />
              </div>
            </div>

            {section.content && (
              <div
                className={`text-xs sm:text-sm max-w-2xl mx-auto pt-2 italic ${
                  isDarkBg ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <EditableText
                  path={`customSections.${index}.content`}
                  value={section.content}
                  defaultValue="Détails de conception et finition artisanale"
                  multiline={true}
                  label="Légende du duo"
                />
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
