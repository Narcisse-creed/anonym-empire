import React, { useState, useRef, useEffect } from 'react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import {
  Edit2,
  Check,
  X,
  Bold,
  Italic,
  Underline,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Image as ImageIcon,
} from 'lucide-react';

interface EditableTextProps {
  value?: string;
  defaultValue?: string;
  path: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  label?: string;
  renderDisplay?: (currentValue: string) => React.ReactNode;
}

const COLOR_PRESETS = [
  { name: 'Noir Ébène', color: '#1A0F0A' },
  { name: 'Brun Chocolat', color: '#2C1A0E' },
  { name: 'Doré Royal', color: '#D4AF37' },
  { name: 'Doré Sombre', color: '#8C6D23' },
  { name: 'Gris Chaud', color: '#4B5563' },
  { name: 'Émeraude', color: '#0F291E' },
  { name: 'Blanc Pur', color: '#FFFFFF' },
];

const HIGHLIGHT_PRESETS = [
  { name: 'Doré Royal', color: '#D4AF37', text: '#000000' },
  { name: 'Jaune Lumineux', color: '#FEF08A', text: '#000000' },
  { name: 'Ambre Chaud', color: '#FDE68A', text: '#000000' },
  { name: 'Émeraude Doux', color: '#A7F3D0', text: '#064E3B' },
  { name: 'Rose Poudré', color: '#FBCFE8', text: '#831843' },
  { name: 'Blanc Pur', color: '#FFFFFF', text: '#000000' },
];

const FONT_PRESETS = [
  { name: 'Cinzel (Royal)', value: "'Cinzel', serif" },
  { name: 'Playfair (Élégant)', value: "'Playfair Display', serif" },
  { name: 'Alex Brush (Calligraphie)', value: "'Alex Brush', cursive" },
  { name: 'Montserrat (Moderne)', value: "'Montserrat', sans-serif" },
  { name: 'Inter (Standard)', value: "'Inter', sans-serif" },
];

const SIZE_PRESETS = [
  { name: 'Petite (12px)', value: '12px' },
  { name: 'Normale (15px)', value: '15px' },
  { name: 'Moyenne (18px)', value: '18px' },
  { name: 'Grande (24px)', value: '24px' },
  { name: 'Très Grande (32px)', value: '32px' },
];

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  defaultValue = '',
  path,
  as: Component = 'span',
  className = '',
  style = {},
  multiline = false,
  label,
  renderDisplay,
}) => {
  const { isEditMode, activeEditPath, setActiveEditPath, updateTextByPath } = useVisualEditor();
  const currentValue = value !== undefined && value !== null && value !== '' ? value : defaultValue;

  const isEditing = isEditMode && activeEditPath === path;
  const [draftValue, setDraftValue] = useState<string>(currentValue);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showFontPicker, setShowFontPicker] = useState<boolean>(false);
  const [showSizePicker, setShowSizePicker] = useState<boolean>(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraftValue(currentValue);
  }, [currentValue]);

  // Click outside to close or auto-save
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        setActiveEditPath(null);
        setShowColorPicker(false);
        setShowFontPicker(false);
        setShowSizePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, setActiveEditPath]);

  const handleStartEdit = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.stopPropagation();
    e.preventDefault();
    setDraftValue(currentValue);
    setActiveEditPath(path);
  };

  const handleSave = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    updateTextByPath(path, draftValue);
    setActiveEditPath(null);
    setShowColorPicker(false);
    setShowFontPicker(false);
    setShowSizePicker(false);
    setShowHighlightPicker(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDraftValue(currentValue);
    setActiveEditPath(null);
    setShowColorPicker(false);
    setShowFontPicker(false);
    setShowSizePicker(false);
    setShowHighlightPicker(false);
  };

  const applyHighlight = (bgColor: string, textColor: string) => {
    const input = getInputEl();
    if (!input) return;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const selected = draftValue.substring(start, end);
    if (selected) {
      const formatted = `<mark style="background-color:${bgColor};color:${textColor};padding:0 2px;border-radius:3px">${selected}</mark>`;
      setDraftValue(draftValue.substring(0, start) + formatted + draftValue.substring(end));
    } else {
      setDraftValue(`<mark style="background-color:${bgColor};color:${textColor};padding:0 2px;border-radius:3px">${draftValue}</mark>`);
    }
    setShowHighlightPicker(false);
  };

  const getInputEl = () => {
    const inputId = `editor-input-${path.replace(/[^a-zA-Z0-9]/g, '_')}`;
    return document.getElementById(inputId) as HTMLTextAreaElement | HTMLInputElement | null;
  };

  // Helper for applying HTML formatting tags
  const applyFormat = (tag: 'b' | 'i' | 'u') => {
    const input = getInputEl();
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const selected = draftValue.substring(start, end);

    if (selected) {
      const formatted = `<${tag}>${selected}</${tag}>`;
      const nextValue = draftValue.substring(0, start) + formatted + draftValue.substring(end);
      setDraftValue(nextValue);
    } else {
      const nextValue = draftValue + `<${tag}>Texte</${tag}>`;
      setDraftValue(nextValue);
    }
  };

  const applyColor = (colorHex: string) => {
    const input = getInputEl();
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const selected = draftValue.substring(start, end);

    if (selected) {
      const formatted = `<span style="color:${colorHex}">${selected}</span>`;
      const nextValue = draftValue.substring(0, start) + formatted + draftValue.substring(end);
      setDraftValue(nextValue);
    } else {
      const nextValue = `<span style="color:${colorHex}">${draftValue}</span>`;
      setDraftValue(nextValue);
    }
    setShowColorPicker(false);
  };

  const applyFont = (fontFamily: string) => {
    const input = getInputEl();
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const selected = draftValue.substring(start, end);

    if (selected) {
      const formatted = `<span style="font-family:${fontFamily}">${selected}</span>`;
      const nextValue = draftValue.substring(0, start) + formatted + draftValue.substring(end);
      setDraftValue(nextValue);
    } else {
      const nextValue = `<span style="font-family:${fontFamily}">${draftValue}</span>`;
      setDraftValue(nextValue);
    }
    setShowFontPicker(false);
  };

  const applySize = (fontSize: string) => {
    const input = getInputEl();
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const selected = draftValue.substring(start, end);

    if (selected) {
      const formatted = `<span style="font-size:${fontSize}">${selected}</span>`;
      const nextValue = draftValue.substring(0, start) + formatted + draftValue.substring(end);
      setDraftValue(nextValue);
    } else {
      const nextValue = `<span style="font-size:${fontSize}">${draftValue}</span>`;
      setDraftValue(nextValue);
    }
    setShowSizePicker(false);
  };

  const applyAlignment = (align: 'left' | 'center' | 'right') => {
    const input = getInputEl();
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const selected = draftValue.substring(start, end);

    if (selected) {
      const formatted = `<div style="text-align:${align}">${selected}</div>`;
      const nextValue = draftValue.substring(0, start) + formatted + draftValue.substring(end);
      setDraftValue(nextValue);
    } else {
      const nextValue = `<div style="text-align:${align}">${draftValue}</div>`;
      setDraftValue(nextValue);
    }
  };

  // Image insertion inside text handler
  const handleInsertImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          const input = getInputEl();
          const start = input ? input.selectionStart || draftValue.length : draftValue.length;
          const imageTag = `<img src="${compressedDataUrl}" alt="Illustration" style="max-width:100%; border-radius:12px; margin:12px 0; display:block;" />`;
          const nextValue = draftValue.substring(0, start) + imageTag + draftValue.substring(start);
          setDraftValue(nextValue);
        }
        setIsUploadingImage(false);
      };
      img.src = uploadEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Normal Visitor Mode or Non-editing Mode
  if (!isEditMode) {
    if (renderDisplay) {
      return (
        <Component className={className} style={style}>
          {renderDisplay(currentValue)}
        </Component>
      );
    }
    return (
      <Component
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: currentValue }}
      />
    );
  }

  // Edit Mode — Active Form
  if (isEditing) {
    const inputId = `editor-input-${path.replace(/[^a-zA-Z0-9]/g, '_')}`;

    return (
      <div
        ref={editorRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 inline-block w-full my-1 p-2.5 bg-[#141414] border-2 border-[#D4AF37] rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Floating Formatting Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-gray-800 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold px-2 py-0.5 bg-black/70 rounded border border-[#D4AF37]/30">
              {label || path.split('.').pop()}
            </span>

            {/* B / I / U */}
            <button
              type="button"
              onClick={() => applyFormat('b')}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white transition-colors cursor-pointer"
              title="Gras <b>"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('i')}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white transition-colors cursor-pointer"
              title="Italique <i>"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('u')}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white transition-colors cursor-pointer"
              title="Souligné <u>"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>

            {/* Police selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowFontPicker(!showFontPicker);
                  setShowColorPicker(false);
                  setShowSizePicker(false);
                }}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
                title="Choisir la police"
              >
                <Type className="w-3.5 h-3.5 text-amber-300" />
              </button>

              {showFontPicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-black/95 border border-[#D4AF37]/60 rounded-xl shadow-2xl flex flex-col gap-1 z-[110] min-w-[170px]">
                  <span className="text-[10px] text-gray-400 font-mono">Typographie :</span>
                  {FONT_PRESETS.map((f) => (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => applyFont(f.value)}
                      className="px-2 py-1 rounded hover:bg-gray-800 text-left text-xs text-gray-200 hover:text-[#D4AF37] transition-colors cursor-pointer"
                      style={{ fontFamily: f.value }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Taille de texte */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSizePicker(!showSizePicker);
                  setShowColorPicker(false);
                  setShowFontPicker(false);
                }}
                className="px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-[#D4AF37] transition-colors text-[11px] font-mono font-bold cursor-pointer"
                title="Taille du texte"
              >
                Aa
              </button>

              {showSizePicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-black/95 border border-[#D4AF37]/60 rounded-xl shadow-2xl flex flex-col gap-1 z-[110] min-w-[150px]">
                  <span className="text-[10px] text-gray-400 font-mono">Taille de texte :</span>
                  {SIZE_PRESETS.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => applySize(s.value)}
                      className="px-2 py-1 rounded hover:bg-gray-800 text-left text-xs text-gray-200 hover:text-[#D4AF37] transition-colors cursor-pointer"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Alignments */}
            <button
              type="button"
              onClick={() => applyAlignment('left')}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Aligner à gauche"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyAlignment('center')}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Centrer"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyAlignment('right')}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Aligner à droite"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>

            {/* Highlight selector dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowHighlightPicker(!showHighlightPicker);
                  setShowColorPicker(false);
                  setShowFontPicker(false);
                  setShowSizePicker(false);
                }}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-yellow-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Surlignage (Highlight)"
              >
                <Highlighter className="w-3.5 h-3.5 text-yellow-300" />
              </button>

              {showHighlightPicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-black/95 border border-[#D4AF37]/60 rounded-xl shadow-2xl flex flex-col gap-1.5 z-[110] min-w-[160px]">
                  <span className="text-[10px] text-gray-400 font-mono">Surlignage :</span>
                  {HIGHLIGHT_PRESETS.map((h) => (
                    <button
                      key={h.color}
                      type="button"
                      onClick={() => applyHighlight(h.color, h.text)}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800 text-left text-xs cursor-pointer"
                    >
                      <span className="w-3.5 h-3.5 rounded border border-gray-600 shrink-0" style={{ backgroundColor: h.color }} />
                      <span className="text-gray-200 text-[11px]">{h.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color selector dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowFontPicker(false);
                  setShowSizePicker(false);
                  setShowHighlightPicker(false);
                }}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
                title="Couleur du texte"
              >
                <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>

              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-black/95 border border-[#D4AF37]/60 rounded-xl shadow-2xl flex flex-col gap-1.5 z-[110] min-w-[150px]">
                  <span className="text-[10px] text-gray-400 font-mono">Palette :</span>
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => applyColor(p.color)}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800 text-left text-xs cursor-pointer"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-600 shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-gray-200 text-[11px]">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Image insertion inside text */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-amber-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Insérer une image dans le texte"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">{isUploadingImage ? '...' : '+ Img'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInsertImage}
            />
          </div>

          {/* Actions: Save / Cancel */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCancel}
              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1 rounded-lg bg-[#D4AF37] hover:bg-[#F3E5AB] text-black text-xs font-bold transition-all shadow flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Enregistrer
            </button>
          </div>
        </div>

        {/* Text Input */}
        {multiline ? (
          <textarea
            id={inputId}
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            rows={5}
            className="w-full p-3 bg-black text-white rounded-lg border border-gray-700 focus:border-[#D4AF37] focus:outline-none text-xs sm:text-sm font-sans leading-relaxed resize-y"
            autoFocus
          />
        ) : (
          <input
            id={inputId}
            type="text"
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            className="w-full p-2.5 bg-black text-white rounded-lg border border-gray-700 focus:border-[#D4AF37] focus:outline-none text-xs sm:text-sm font-sans"
            autoFocus
          />
        )}
      </div>
    );
  }

  // Edit Mode — Hoverable element
  return (
    <span
      onClick={handleStartEdit}
      className={`group relative inline-block cursor-pointer transition-all duration-150 rounded px-1 -mx-1 border border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:shadow-[0_0_12px_rgba(212,175,55,0.25)] ${className}`}
      style={style}
      title="Cliquer pour modifier ce texte"
    >
      {renderDisplay ? (
        <Component className="inline-block">{renderDisplay(currentValue)}</Component>
      ) : (
        <Component dangerouslySetInnerHTML={{ __html: currentValue }} />
      )}

      {/* Floating mini pencil icon on hover */}
      <span className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 z-30 bg-[#D4AF37] text-black p-1 rounded-full shadow-lg transition-opacity duration-150 pointer-events-none scale-90">
        <Edit2 className="w-2.5 h-2.5" />
      </span>
    </span>
  );
};
