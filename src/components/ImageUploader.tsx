import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, AlertCircle, RefreshCw } from 'lucide-react';

export interface ImageUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  maxSizeMB?: number;
  compact?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'wide';
  placeholder?: string;
  allowUrlInput?: boolean;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  label,
  helperText,
  maxSizeMB = 5,
  compact = false,
  aspectRatio = 'square',
  placeholder = 'Sélectionner une photo...',
  allowUrlInput = false,
  className = '',
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [urlInputValue, setUrlInputValue] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setError(null);

    // 1. Validate MIME type (images only)
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP, GIF).');
      return;
    }

    // 2. Validate File Size (maxSizeMB)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`L'image est trop lourde (${(file.size / (1024 * 1024)).toFixed(1)} Mo). Limite : ${maxSizeMB} Mo.`);
      return;
    }

    // 3. Convert to Data URL
    const reader = new FileReader();
    reader.onerror = () => {
      setError('Erreur lors de la lecture du fichier.');
    };
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setShowUrlInput(false);
      setUrlInputValue('');
    }
  };

  const aspectClass =
    aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : aspectRatio === 'wide'
      ? 'aspect-[16/9]'
      : 'aspect-square';

  if (compact) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <label className="block text-xs font-semibold text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`relative ${aspectClass} w-full rounded-xl overflow-hidden bg-black border-2 border-dashed ${
            error
              ? 'border-rose-500/80 bg-rose-950/20'
              : value
              ? 'border-[#D4AF37]/60 border-solid'
              : 'border-gray-800 hover:border-[#D4AF37]/50'
          } flex flex-col items-center justify-center cursor-pointer group transition-all`}
        >
          {value ? (
            <>
              <img
                src={value}
                alt="Aperçu"
                className="w-full h-full object-cover"
                onError={() => {
                  setError('Lien image invalide ou inaccessible.');
                }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="p-1.5 rounded-lg bg-[#D4AF37] text-black font-bold hover:bg-[#F3E5AB] transition-all"
                  title="Changer d'image"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-500 transition-all"
                  title="Supprimer l'image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="p-3 text-center space-y-1">
              <Upload className="w-5 h-5 text-[#D4AF37] mx-auto group-hover:scale-110 transition-transform" />
              <span className="text-[10px] text-gray-400 font-semibold block line-clamp-1">
                {placeholder}
              </span>
              <span className="text-[9px] text-gray-600 block">
                Galerie / Fichier
              </span>
            </div>
          )}
        </div>

        {error && (
          <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-[#D4AF37] uppercase">
            {label}
          </label>
          {allowUrlInput && (
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[10px] text-gray-400 hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? 'Upload fichier' : 'Coller lien URL'}</span>
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {showUrlInput ? (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Coller l'adresse (URL) de l'image..."
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            className="flex-1 bg-black/80 border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl hover:bg-[#F3E5AB] transition-all cursor-pointer shrink-0"
          >
            Valider
          </button>
        </form>
      ) : value ? (
        /* Image Preview Box */
        <div className="relative bg-[#141414] border border-[#D4AF37]/40 rounded-2xl p-3 flex items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div className={`relative ${aspectClass} w-16 sm:w-20 rounded-xl overflow-hidden bg-black shrink-0 border border-gray-800`}>
              <img
                src={value}
                alt="Aperçu"
                className="w-full h-full object-cover"
                onError={() => {
                  setError('Lien image invalide ou inaccessible.');
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Image sélectionnée</span>
              </span>
              <p className="text-[10px] text-gray-400 truncate mt-0.5 font-mono">
                {value.startsWith('data:') ? 'Image importée depuis l\'appareil (Base64)' : value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-[#D4AF37] hover:text-black text-gray-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Changer</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-xl bg-rose-950 text-rose-400 hover:bg-rose-800 hover:text-white transition-all cursor-pointer"
              title="Supprimer la photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone / Upload button */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`p-5 rounded-2xl bg-black/60 border-2 border-dashed ${
            error
              ? 'border-rose-500/80 bg-rose-950/10'
              : 'border-gray-800 hover:border-[#D4AF37]/60 hover:bg-[#141414]'
          } flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-2 group`}
        >
          <div className="p-3 rounded-full bg-[#1A160C] border border-[#D4AF37]/40 text-[#D4AF37] group-hover:scale-110 transition-transform">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              {placeholder}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              Cliquez pour ouvrir la galerie photo ou glissez un fichier ici
            </span>
          </div>
          {helperText && (
            <span className="text-[10px] text-gray-500 font-mono block">
              {helperText}
            </span>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
