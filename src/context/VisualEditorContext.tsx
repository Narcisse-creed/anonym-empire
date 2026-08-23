import React, { createContext, useContext, useState, useCallback } from 'react';
import { StoreInfo, CustomSection } from '../types';

interface VisualEditorContextType {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  toggleEditMode: () => void;
  activeEditPath: string | null;
  setActiveEditPath: (path: string | null) => void;
  updateTextByPath: (path: string, value: string) => void;
  updateImageByPath: (path: string, imageUrl: string) => void;
  addCustomSection: (pageId: CustomSection['pageId'], type: CustomSection['type'], data?: Partial<CustomSection>) => void;
  updateCustomSection: (sectionId: string, data: Partial<CustomSection>) => void;
  deleteCustomSection: (sectionId: string) => void;
  reorderCustomSections: (sections: CustomSection[]) => void;
  storeInfo: StoreInfo;
}

const VisualEditorContext = createContext<VisualEditorContextType | null>(null);

export const useVisualEditor = () => {
  const context = useContext(VisualEditorContext);
  if (!context) {
    throw new Error('useVisualEditor must be used within a VisualEditorProvider');
  }
  return context;
};

interface VisualEditorProviderProps {
  children: React.ReactNode;
  storeInfo: StoreInfo;
  onUpdateStoreInfo: (info: StoreInfo) => void;
}

// Utility to set nested properties safely
function setNestedValue(obj: any, path: string, value: any): any {
  const clone = JSON.parse(JSON.stringify(obj || {}));
  const parts = path.split('.');
  let current = clone;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined || current[part] === null) {
      // Check if next part is an array index
      current[part] = !isNaN(Number(parts[i + 1])) ? [] : {};
    }
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
  return clone;
}

export const VisualEditorProvider: React.FC<VisualEditorProviderProps> = ({
  children,
  storeInfo,
  onUpdateStoreInfo,
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeEditPath, setActiveEditPath] = useState<string | null>(null);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
    setActiveEditPath(null);
  }, []);

  const updateTextByPath = useCallback(
    (path: string, value: string) => {
      // If path doesn't start with pageTexts or founderSection or customSections, assume pageTexts by default
      let fullPath = path;
      if (!path.startsWith('pageTexts.') && !path.startsWith('founderSection.') && !path.startsWith('customSections.') && !path.startsWith('name') && !path.startsWith('tagline')) {
        fullPath = `pageTexts.${path}`;
      }

      const updated = setNestedValue(storeInfo, fullPath, value);
      onUpdateStoreInfo(updated);
    },
    [storeInfo, onUpdateStoreInfo]
  );

  const updateImageByPath = useCallback(
    (path: string, imageUrl: string) => {
      let fullPath = path;
      if (!path.startsWith('pageTexts.') && !path.startsWith('founderSection.') && !path.startsWith('customSections.')) {
        fullPath = `pageTexts.${path}`;
      }

      const updated = setNestedValue(storeInfo, fullPath, imageUrl);
      onUpdateStoreInfo(updated);
    },
    [storeInfo, onUpdateStoreInfo]
  );

  const addCustomSection = useCallback(
    (pageId: CustomSection['pageId'], type: CustomSection['type'], data: Partial<CustomSection> = {}) => {
      const currentSections = storeInfo.customSections || [];
      const newSection: CustomSection = {
        id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        pageId,
        type,
        title: data.title || (type === 'image' ? 'Galerie Photo' : 'Nouveau Titre de Section'),
        subtitle: data.subtitle || "Sous-titre personnalisable",
        content:
          data.content ||
          "Cliquez sur ce texte pour modifier le contenu de votre nouvelle section personnalisée. Vous pouvez mettre en forme les textes et ajouter des images en toute simplicité.",
        imageUrl: data.imageUrl || (type !== 'text' ? '/images/lizie-black-outfit.jpg' : undefined),
        imagePosition: data.imagePosition || 'right',
        badge: data.badge || 'Nouveau',
        order: currentSections.length + 1,
      };

      const updated = {
        ...storeInfo,
        customSections: [...currentSections, newSection],
      };
      onUpdateStoreInfo(updated);
    },
    [storeInfo, onUpdateStoreInfo]
  );

  const updateCustomSection = useCallback(
    (sectionId: string, data: Partial<CustomSection>) => {
      const currentSections = storeInfo.customSections || [];
      const updatedSections = currentSections.map((s) => (s.id === sectionId ? { ...s, ...data } : s));
      onUpdateStoreInfo({
        ...storeInfo,
        customSections: updatedSections,
      });
    },
    [storeInfo, onUpdateStoreInfo]
  );

  const deleteCustomSection = useCallback(
    (sectionId: string) => {
      const currentSections = storeInfo.customSections || [];
      const updatedSections = currentSections.filter((s) => s.id !== sectionId);
      onUpdateStoreInfo({
        ...storeInfo,
        customSections: updatedSections,
      });
    },
    [storeInfo, onUpdateStoreInfo]
  );

  const reorderCustomSections = useCallback(
    (sections: CustomSection[]) => {
      onUpdateStoreInfo({
        ...storeInfo,
        customSections: sections,
      });
    },
    [storeInfo, onUpdateStoreInfo]
  );

  return (
    <VisualEditorContext.Provider
      value={{
        isEditMode,
        setIsEditMode,
        toggleEditMode,
        activeEditPath,
        setActiveEditPath,
        updateTextByPath,
        updateImageByPath,
        addCustomSection,
        updateCustomSection,
        deleteCustomSection,
        reorderCustomSections,
        storeInfo,
      }}
    >
      {children}
    </VisualEditorContext.Provider>
  );
};
