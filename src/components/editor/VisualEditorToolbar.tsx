import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { Edit3, Check, Settings, GripVertical, RotateCcw } from 'lucide-react';

interface VisualEditorToolbarProps {
  onOpenAdmin: () => void;
}

const STORAGE_KEY = 'anonym_editor_toolbar_pos_v2';

export const VisualEditorToolbar: React.FC<VisualEditorToolbarProps> = ({ onOpenAdmin }) => {
  const { isEditMode, toggleEditMode } = useVisualEditor();
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<{ x: number; y: number } | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch (e) {}
    return null;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Keep toolbar within viewport bounds when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (!position || !toolbarRef.current) return;
      const rect = toolbarRef.current.getBoundingClientRect();
      const maxX = Math.max(10, window.innerWidth - rect.width - 10);
      const maxY = Math.max(10, window.innerHeight - rect.height - 10);

      const clampedX = Math.max(10, Math.min(position.x, maxX));
      const clampedY = Math.max(10, Math.min(position.y, maxY));

      if (clampedX !== position.x || clampedY !== position.y) {
        const newPos = { x: clampedX, y: clampedY };
        setPosition(newPos);
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newPos));
        } catch (e) {}
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  // Drag handlers
  const startDrag = (clientX: number, clientY: number) => {
    if (!toolbarRef.current) return;
    const rect = toolbarRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag from toolbar background or grip handle, not from buttons/links
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    const touch = e.touches[0];
    if (touch) {
      startDrag(touch.clientX, touch.clientY);
    }
  };

  const onDragMove = useCallback((clientX: number, clientY: number) => {
    if (!toolbarRef.current) return;
    const rect = toolbarRef.current.getBoundingClientRect();

    let newX = clientX - dragOffsetRef.current.x;
    let newY = clientY - dragOffsetRef.current.y;

    const maxX = Math.max(10, window.innerWidth - rect.width - 10);
    const maxY = Math.max(10, window.innerHeight - rect.height - 10);

    newX = Math.max(10, Math.min(newX, maxX));
    newY = Math.max(10, Math.min(newY, maxY));

    const newPos = { x: newX, y: newY };
    setPosition(newPos);
  }, []);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    if (position) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(position));
      } catch (e) {}
    }
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      onDragMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        onDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseUp = () => {
      endDrag();
    };

    const handleTouchEnd = () => {
      endDrag();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, onDragMove, endDrag]);

  const handleResetPosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPosition(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (err) {}
  };

  if (!isEditMode) return null;

  const style: React.CSSProperties = position
    ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'none',
        bottom: 'auto',
      }
    : {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
      };

  return (
    <>
      {/* Visual indicator border around the screen */}
      <div className="fixed inset-0 pointer-events-none border-3 sm:border-4 border-[#D4AF37]/70 z-[9980] shadow-[inset_0_0_30px_rgba(212,175,55,0.25)] animate-pulse" />

      {/* Floating Toolbar (Draggable) */}
      <div
        ref={toolbarRef}
        style={style}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`z-[9990] max-w-[95vw] sm:max-w-2xl w-full px-2 sm:px-4 select-none ${
          isDragging ? 'cursor-grabbing opacity-95 scale-[1.01]' : 'cursor-grab'
        } transition-transform duration-75`}
      >
        <div className="bg-[#141414]/95 backdrop-blur-xl border-2 border-[#D4AF37] rounded-2xl sm:rounded-full px-3 py-2.5 sm:px-5 sm:py-3 shadow-[0_10px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(212,175,55,0.35)] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-white">
          
          {/* Left: Grip handle & Status Badge & Hint */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {/* Grip handle indicator */}
            <div
              className="p-1 rounded-lg text-[#D4AF37]/80 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-grab active:cursor-grabbing shrink-0"
              title="Glisser pour déplacer la barre"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left min-w-0">
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wider text-[#D4AF37] uppercase flex items-center gap-1.5 shrink-0">
                <Edit3 className="w-3.5 h-3.5" /> Mode Édition
              </span>
              <span className="hidden md:inline text-[11px] text-gray-400 truncate">
                • Cliquez pour modifier
              </span>
            </div>
          </div>

          {/* Right: Actions (Panel Admin, Terminer/Quitter, Reset Position) */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end shrink-0">
            {position && (
              <button
                onClick={handleResetPosition}
                className="p-1.5 rounded-lg bg-black/50 hover:bg-black/90 border border-gray-800 text-gray-400 hover:text-[#D4AF37] transition-all cursor-pointer"
                title="Recentrer la barre en bas"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/90 border border-gray-700 hover:border-[#D4AF37]/50 text-gray-200 text-xs font-semibold transition-all cursor-pointer"
              title="Ouvrir le panneau d'administration complet"
            >
              <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Panel Admin</span>
            </button>

            <button
              onClick={toggleEditMode}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black text-xs font-bold transition-all shadow-md cursor-pointer group"
              title="Quitter le mode édition et afficher la vue visiteur"
            >
              <Check className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Terminer / Quitter</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
