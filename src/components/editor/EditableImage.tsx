import React, { useState, useRef } from 'react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { Camera, Check, X, Upload, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { optimizeImageFile } from '../../utils/imageOptimizer';

interface EditableImageProps {
  src?: string;
  defaultSrc: string;
  alt: string;
  path: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  defaultSrc,
  alt,
  path,
  className = '',
  style = {},
  label,
}) => {
  const { isEditMode, updateImageByPath } = useVisualEditor();
  const currentSrc = src || defaultSrc;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string>(currentSrc);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    try {
      const optimized = await optimizeImageFile(file, {
        maxDimension: 1200,
        quality: 0.82,
        mimeType: 'image/jpeg',
      });
      setPreviewSrc(optimized);
    } catch (err) {
      console.warn('Error optimizing image in EditableImage:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    updateImageByPath(path, previewSrc);
    setIsModalOpen(false);
  };

  const handleResetToDefault = () => {
    setPreviewSrc(defaultSrc);
    updateImageByPath(path, defaultSrc);
    setIsModalOpen(false);
  };

  // Normal Visitor Mode
  if (!isEditMode) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        style={style}
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultSrc;
        }}
      />
    );
  }

  // Edit Mode
  return (
    <div className="relative group inline-block w-full">
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} transition-all duration-200 border-2 border-dashed border-transparent group-hover:border-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]`}
        style={style}
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultSrc;
        }}
      />

      {/* Floating Overlay Button on Hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-inherit pointer-events-none">
        <button
          type="button"
          onClick={() => {
            setPreviewSrc(currentSrc);
            setIsModalOpen(true);
          }}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold text-xs rounded-full shadow-2xl transition-transform hover:scale-105 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Remplacer l'image</span>
        </button>
      </div>

      {/* Replace Image Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full bg-[#141414] border-2 border-[#D4AF37] rounded-3xl p-6 shadow-2xl text-white space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif font-bold text-sm tracking-wide text-[#D4AF37] uppercase">
                  Remplacer l'image {label ? `• ${label}` : ''}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Area */}
            <div className="flex flex-col items-center justify-center p-4 bg-black/50 border border-gray-800 rounded-2xl">
              <div className="max-h-56 max-w-full overflow-hidden rounded-xl border border-gray-700 mb-3 flex items-center justify-center">
                <img
                  src={previewSrc}
                  alt="Aperçu"
                  className="max-h-56 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultSrc;
                  }}
                />
              </div>
              {fileName && <span className="text-[11px] text-gray-400 font-mono">{fileName}</span>}
            </div>

            {/* File Upload input button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 border-2 border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] text-gray-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#D4AF37]" />
                <span>Choisir une photo depuis mon appareil (Téléphone / PC)</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] text-gray-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="Rétablir l'image originale par défaut"
              >
                <RotateCcw className="w-3 h-3" /> Image par défaut
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Valider & Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
