import React from 'react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { Edit3, Check, Settings, Eye, Sparkles, X } from 'lucide-react';

interface VisualEditorToolbarProps {
  onOpenAdmin: () => void;
}

export const VisualEditorToolbar: React.FC<VisualEditorToolbarProps> = ({ onOpenAdmin }) => {
  const { isEditMode, toggleEditMode } = useVisualEditor();

  if (!isEditMode) return null;

  return (
    <>
      {/* Visual indicator border around the screen */}
      <div className="fixed inset-0 pointer-events-none border-3 sm:border-4 border-[#D4AF37]/70 z-[9980] shadow-[inset_0_0_30px_rgba(212,175,55,0.25)] animate-pulse" />

      {/* Floating Toolbar (bottom centered) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] max-w-[95vw] sm:max-w-2xl w-full px-4">
        <div className="bg-[#141414]/95 backdrop-blur-xl border-2 border-[#D4AF37] rounded-2xl sm:rounded-full px-4 py-3 sm:px-6 sm:py-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(212,175,55,0.3)] flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
          
          {/* Left: Status Badge & Hint */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]"></span>
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left">
              <span className="font-serif font-bold text-xs sm:text-sm tracking-wider text-[#D4AF37] uppercase flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" /> Mode Édition Visuel
              </span>
              <span className="hidden md:inline text-[11px] text-gray-400">
                • Cliquez sur un texte ou une image pour modifier
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenAdmin}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/90 border border-gray-700 hover:border-[#D4AF37]/50 text-gray-200 text-xs font-semibold transition-all cursor-pointer"
              title="Ouvrir le panneau d'administration complet"
            >
              <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Panel Admin</span>
            </button>

            <button
              onClick={toggleEditMode}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black text-xs font-bold transition-all shadow-md cursor-pointer group"
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
