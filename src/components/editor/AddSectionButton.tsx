import React, { useState } from 'react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { AddSectionModal } from './AddSectionModal';
import { CustomSection } from '../../types';
import { Plus } from 'lucide-react';

interface AddSectionButtonProps {
  pageId: CustomSection['pageId'];
}

export const AddSectionButton: React.FC<AddSectionButtonProps> = ({ pageId }) => {
  const { isEditMode, addCustomSection } = useVisualEditor();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isEditMode) return null;

  return (
    <div className="py-6 px-4 flex items-center justify-center relative z-30">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#141414] hover:bg-[#D4AF37] border-2 border-dashed border-[#D4AF37] text-[#D4AF37] hover:text-black font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 cursor-pointer"
      >
        <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center group-hover:bg-black group-hover:text-[#D4AF37] transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </span>
        <span>Ajouter une section personnalisée ici</span>
      </button>

      <AddSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(type, data) => addCustomSection(pageId, type, data)}
        pageId={pageId}
      />
    </div>
  );
};
