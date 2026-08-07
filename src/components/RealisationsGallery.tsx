import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RealisationCollection, RealisationPhoto } from '../types';
import { X, ChevronLeft, ChevronRight, ImageIcon, Sparkles, Eye } from 'lucide-react';

interface RealisationsGalleryProps {
  realisations: RealisationCollection[];
}

// ─── Lightbox ──────────────────────────────────────────────────────────────

const Lightbox: React.FC<{
  photo: RealisationPhoto;
  allPhotos: RealisationPhoto[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
}> = ({ photo, onClose, onPrev, onNext, currentIndex, total }) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'Escape') onClose();
    },
    [onPrev, onNext, onClose]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev */}
      {total > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-3 sm:left-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={photo.id}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.imageUrl}
          alt={photo.caption || 'Réalisation ANONYM'}
          className="max-h-[75vh] max-w-full w-auto object-contain rounded-2xl shadow-2xl border border-[#D4AF37]/20"
        />
        <div className="mt-3 text-center space-y-1">
          {photo.caption && (
            <p className="text-sm font-serif text-[#F3E5AB] italic">{photo.caption}</p>
          )}
          <p className="text-[11px] text-gray-500 font-mono">
            {currentIndex + 1} / {total}
          </p>
        </div>
      </motion.div>

      {/* Next */}
      {total > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-3 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

export const RealisationsGallery: React.FC<RealisationsGalleryProps> = ({ realisations }) => {
  const visibleCollections = realisations
    .filter((c) => c.visible)
    .sort((a, b) => a.order - b.order);

  const [activeCollectionId, setActiveCollectionId] = useState<string>(
    visibleCollections[0]?.id || ''
  );
  const [lightbox, setLightbox] = useState<{ collectionId: string; photoIndex: number } | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const handleCollectionChange = (id: string) => {
    setActiveCollectionId(id);
    setVisibleCount(8);
  };

  // Don't render if no visible collections have photos OR there are no collections
  const hasAnyContent = visibleCollections.some((c) => c.photos.length > 0);
  const hasCollections = visibleCollections.length > 0;

  if (!hasCollections) return null;

  const activeCollection = visibleCollections.find((c) => c.id === activeCollectionId) || visibleCollections[0];
  const sortedPhotos = activeCollection
    ? [...activeCollection.photos].sort((a, b) => a.order - b.order)
    : [];

  const displayedPhotos = sortedPhotos.slice(0, visibleCount);

  const openLightbox = (collectionId: string, photoIndex: number) => {
    setLightbox({ collectionId, photoIndex });
  };

  const closeLightbox = () => setLightbox(null);

  const lightboxPhotos =
    lightbox
      ? [...(visibleCollections.find((c) => c.id === lightbox.collectionId)?.photos || [])].sort(
          (a, b) => a.order - b.order
        )
      : [];

  const goLightboxPrev = () => {
    if (!lightbox) return;
    setLightbox((prev) =>
      prev ? { ...prev, photoIndex: (prev.photoIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length } : null
    );
  };

  const goLightboxNext = () => {
    if (!lightbox) return;
    setLightbox((prev) =>
      prev ? { ...prev, photoIndex: (prev.photoIndex + 1) % lightboxPhotos.length } : null
    );
  };

  return (
    <>
      <section id="realisations" className="py-16 bg-[#F8F6F2] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl lg:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Nos Réalisations
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-3">
              Créations Passées
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              Découvrez quelques-unes de nos réalisations — des créations uniques livrées à nos clientes, 
              témoignant du soin et du savoir-faire qui anime chaque pièce ANONYM.
            </p>
          </motion.div>

          {/* Collection tabs */}
          {visibleCollections.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {visibleCollections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => handleCollectionChange(col.id)}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                    activeCollectionId === col.id
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_2px_15px_rgba(212,175,55,0.25)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 shadow-sm'
                  }`}
                >
                  {col.name}
                  {col.photos.length > 0 && (
                    <span className={`ml-1.5 text-[10px] font-mono ${activeCollectionId === col.id ? 'text-black/70' : 'text-gray-600'}`}>
                      ({col.photos.length})
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}

          {/* Collection description */}
          {activeCollection?.description && (
            <p className="text-center text-xs text-gray-500 italic mb-6">
              {activeCollection.description}
            </p>
          )}

          {/* Photo grid */}
          <AnimatePresence mode="wait">
            {displayedPhotos.length > 0 ? (
              <motion.div
                key={activeCollectionId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {displayedPhotos.map((photo, idx) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      onClick={() => openLightbox(activeCollection.id, idx)}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-[#D4AF37]/60 cursor-pointer shadow-sm transition-all hover:shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || `Réalisation ANONYM #${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/90 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-black" />
                          </div>
                        </div>
                      </div>
                      {/* Caption */}
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-[11px] text-[#F3E5AB] font-serif italic line-clamp-2 leading-tight">
                            {photo.caption}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Voir plus button */}
                {sortedPhotos.length > visibleCount && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 8)}
                      className="px-6 py-2.5 rounded-full border border-[#D4AF37]/40 bg-white text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm"
                    >
                      Voir plus de réalisations (+{sortedPhotos.length - visibleCount})
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={activeCollectionId + '-empty'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm"
              >
                <ImageIcon className="w-10 h-10 text-[#D4AF37]/30 mx-auto mb-3" />
                <p className="text-sm text-gray-500 font-serif italic">
                  Les photos de cette collection seront bientôt disponibles.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA bottom if no photos at all across all collections */}
          {!hasAnyContent && (
            <p className="text-center text-xs text-gray-600 mt-6 italic">
              La galerie sera enrichie progressivement avec les réalisations de la boutique.
            </p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && lightboxPhotos[lightbox.photoIndex] && (
          <Lightbox
            photo={lightboxPhotos[lightbox.photoIndex]}
            allPhotos={lightboxPhotos}
            onClose={closeLightbox}
            onPrev={goLightboxPrev}
            onNext={goLightboxNext}
            currentIndex={lightbox.photoIndex}
            total={lightboxPhotos.length}
          />
        )}
      </AnimatePresence>
    </>
  );
};
