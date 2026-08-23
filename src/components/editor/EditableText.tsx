import React, { useState, useRef, useEffect } from 'react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { Edit2, Check, X, Bold, Italic, Palette } from 'lucide-react';

interface EditableTextProps {
  value?: string;
  defaultValue?: string;
  path: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  label?: string;
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

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  defaultValue = '',
  path,
  as: Component = 'span',
  className = '',
  style = {},
  multiline = false,
  label,
}) => {
  const { isEditMode, activeEditPath, setActiveEditPath, updateTextByPath } = useVisualEditor();
  const currentValue = value !== undefined && value !== null && value !== '' ? value : defaultValue;

  const isEditing = isEditMode && activeEditPath === path;
  const [draftValue, setDraftValue] = useState<string>(currentValue);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDraftValue(currentValue);
  }, [currentValue]);

  // Click outside to close or auto-save
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        // If clicking outside, close editor
        setActiveEditPath(null);
        setShowColorPicker(false);
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
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDraftValue(currentValue);
    setActiveEditPath(null);
    setShowColorPicker(false);
  };

  // Helper for applying HTML formatting tags
  const applyFormat = (tag: 'b' | 'i') => {
    const textarea = document.getElementById(`editor-input-${path.replace(/[^a-zA-Z0-9]/g, '_')}`) as HTMLTextAreaElement | HTMLInputElement;
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
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
    const textarea = document.getElementById(`editor-input-${path.replace(/[^a-zA-Z0-9]/g, '_')}`) as HTMLTextAreaElement | HTMLInputElement;
    if (!textarea) return;

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
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

  // Normal Visitor Mode or Non-editing Mode
  if (!isEditMode) {
    // Render with support for simple HTML tags (b, i, span)
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
        className="relative z-50 inline-block w-full my-1 p-2 bg-[#1A1A1A] border-2 border-[#D4AF37] rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Floating Formatting Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 mb-2 border-b border-gray-700 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold px-1.5 py-0.5 bg-black/50 rounded">
              {label || path.split('.').pop()}
            </span>
            <button
              type="button"
              onClick={() => applyFormat('b')}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white transition-colors cursor-pointer"
              title="Mettre en gras (balise <b>)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat('i')}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white transition-colors cursor-pointer"
              title="Mettre en italique (balise <i>)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            {/* Color selector dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
                title="Couleur du texte"
              >
                <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>

              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-black/95 border border-[#D4AF37]/60 rounded-xl shadow-2xl flex flex-col gap-1.5 z-[100] min-w-[140px]">
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
            rows={4}
            className="w-full p-2.5 bg-black text-white rounded-lg border border-gray-700 focus:border-[#D4AF37] focus:outline-none text-xs sm:text-sm font-sans leading-relaxed resize-y"
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
            className="w-full p-2 bg-black text-white rounded-lg border border-gray-700 focus:border-[#D4AF37] focus:outline-none text-xs sm:text-sm font-sans"
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
      <Component dangerouslySetInnerHTML={{ __html: currentValue }} />

      {/* Floating mini pencil icon on hover */}
      <span className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 z-30 bg-[#D4AF37] text-black p-1 rounded-full shadow-lg transition-opacity duration-150 pointer-events-none scale-90">
        <Edit2 className="w-2.5 h-2.5" />
      </span>
    </span>
  );
};
