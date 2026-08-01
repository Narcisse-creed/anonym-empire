import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  mainImage: string;
  images?: string[];
  altText?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  images = [],
  altText = 'Produit',
}) => {
  const allImages = [mainImage, ...images.filter((img) => img && img !== mainImage)];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <>
      {/* Main Image Viewer */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black shadow-2xl group">
        <img
          src={allImages[activeIndex]}
          alt={`${altText} — photo ${activeIndex + 1}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop';
          }}
        />

        {/* Counter */}
        {allImages.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-mono px-2 py-1 rounded-full backdrop-blur-sm">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-3 left-3 p-1.5 rounded-full bg-black/70 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black cursor-pointer"
          title="Agrandir la photo"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Prev / Next Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white hover:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white hover:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                idx === activeIndex
                  ? 'border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                  : 'border-gray-700 opacity-60 hover:opacity-100 hover:border-gray-500'
              }`}
            >
              <img
                src={img}
                alt={`Vue ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&auto=format&fit=crop';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer z-10"
            onClick={() => setIsZoomed(false)}
          >
            <X className="w-6 h-6" />
          </button>
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer z-10"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer z-10"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}
          <img
            src={allImages[activeIndex]}
            alt={altText}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-white/60 text-xs">
            {activeIndex + 1} / {allImages.length} — Cliquez à l'extérieur pour fermer
          </div>
        </div>
      )}
    </>
  );
};
