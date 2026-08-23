import React, { useState } from 'react';
import { CustomSection } from '../../types';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { Trash2, ArrowLeftRight, AlertTriangle, X } from 'lucide-react';

interface CustomDynamicSectionProps {
  section: CustomSection;
  index: number;
}

export const CustomDynamicSection: React.FC<CustomDynamicSectionProps> = ({ section, index }) => {
  const { isEditMode, deleteCustomSection, updateCustomSection } = useVisualEditor();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    deleteCustomSection(section.id);
    setShowDeleteConfirm(false);
  };

  const toggleImagePosition = () => {
    updateCustomSection(section.id, {
      imagePosition: section.imagePosition === 'left' ? 'right' : 'left',
    });
  };

  return (
    <section className="py-16 sm:py-20 relative bg-white border-b border-[#D4AF37]/20 overflow-hidden">
      {/* Background ambient warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,_var(--tw-gradient-stops))] from-amber-50/50 via-transparent to-transparent pointer-events-none" />

      {/* Admin Controls Overlay (in Edit Mode) */}
      {isEditMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex items-center justify-between p-2.5 bg-[#141414] border border-[#D4AF37] rounded-xl text-xs text-white shadow-lg">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#D4AF37] text-black font-bold rounded text-[10px] uppercase">
                Section #{index + 1}
              </span>
              <span className="text-gray-300 font-mono text-[11px]">
                Modèle : {section.type === 'text-image' ? 'Texte + Image' : section.type === 'text' ? 'Texte Seul' : 'Image Pleine Largeur'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {section.type === 'text-image' && (
                <button
                  type="button"
                  onClick={toggleImagePosition}
                  className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Inverser position texte / image"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Inverser Côté ({section.imagePosition === 'left' ? 'Image à Gauche' : 'Image à Droite'})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-600 text-rose-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Supprimer cette section"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
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
              Êtes-vous sûre de vouloir supprimer définitivement cette section ({section.title || 'Sans titre'}) ? Cette action est irréversible.
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
      <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TYPE 1: TEXT + IMAGE */}
        {section.type === 'text-image' && (
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${section.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
            
            {/* Text Side */}
            <div className={`lg:col-span-7 space-y-4 ${section.imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'}`}>
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

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1A0F0A] leading-tight">
                <EditableText
                  path={`customSections.${index}.title`}
                  value={section.title}
                  defaultValue="Titre de la section"
                  label="Titre principal"
                />
              </h2>

              <p className="text-xs sm:text-sm font-sans font-semibold tracking-wider text-[#8C6D23] uppercase">
                <EditableText
                  path={`customSections.${index}.subtitle`}
                  value={section.subtitle}
                  defaultValue="Sous-titre de la section"
                  label="Sous-titre"
                />
              </p>

              <div className="text-sm sm:text-base text-gray-700 font-sans leading-relaxed pt-2">
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
            <div className={`lg:col-span-5 ${section.imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'}`}>
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
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A0F0A] leading-tight">
              <EditableText
                path={`customSections.${index}.title`}
                value={section.title}
                defaultValue="Titre de la section"
                label="Grand Titre"
              />
            </h2>

            <p className="text-xs sm:text-sm font-sans font-semibold tracking-widest text-[#8C6D23] uppercase">
              <EditableText
                path={`customSections.${index}.subtitle`}
                value={section.subtitle}
                defaultValue="Sous-titre"
                label="Sous-titre"
              />
            </p>

            <div className="text-sm sm:text-base text-gray-700 font-sans leading-relaxed pt-2">
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
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A0F0A]">
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
              <p className="text-xs sm:text-sm text-gray-600 font-sans italic">
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

      </div>
    </section>
  );
};
