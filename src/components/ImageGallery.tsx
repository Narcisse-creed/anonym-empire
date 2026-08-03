import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  mainImage: string;
  images?: string[];
  altText?: string;
  category?: string;
}

// Fallback high-res secondary views per category to ensure 3 photos per product
const CATEGORY_FALLBACK_IMAGES: Record<string, string[]> = {
  bijoux: [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611591475168-e4b9b940985c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
  ],
  parfums: [
    'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop',
  ],
  emballages: [
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513885535751-8b9238bd4541?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
  ],
  accessoires: [
    'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
  ],
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  images = [],
  altText = 'Produit',
  category = 'bijoux',
}) => {
  // Build a 3-image list: use mainImage + valid images prop, supplemented by category fallbacks if < 3
  const categoryFallbacks = CATEGORY_FALLBACK_IMAGES[category?.toLowerCase()] || CATEGORY_FALLBACK_IMAGES.bijoux;

  const rawList = [mainImage, ...images].filter((img): img is string => Boolean(img && img.trim().length > 0));
  // Deduplicate
  const uniqueList = Array.from(new Set(rawList));

  // Fill up to 3 images
  while (uniqueList.length < 3) {
    const nextFallback = categoryFallbacks.find((fb) => !uniqueList.includes(fb)) || categoryFallbacks[uniqueList.length % categoryFallbacks.length];
    uniqueList.push(nextFallback);
  }

  const allImages = uniqueList.slice(0, 3);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Touch Swipe coordinates
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  // Auto-play timer (every 4s) when not paused and not zoomed
  useEffect(() => {
    if (isPaused || isZoomed || allImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % allImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, isZoomed, allImages.length]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ── Main Image Container with Carousel Controls ── */}
      <div
        className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#D4AF37]/30 shadow-2xl group cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsZoomed(true)}
      >
        {/* Active Image */}
        <img
          key={allImages[activeIndex]}
          src={allImages[activeIndex]}
          alt={`${altText} — vue ${activeIndex + 1}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-500 transform scale-100 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop';
          }}
        />

        {/* Counter Badge */}
        <div className="absolute top-3 right-3 z-10 bg-black/80 text-[#D4AF37] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-[#D4AF37]/40 backdrop-blur-md shadow-md">
          {activeIndex + 1} / {allImages.length}
        </div>

        {/* Zoom Hint Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(true);
          }}
          className="absolute top-3 left-3 z-10 p-2 rounded-full bg-black/80 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black transition-all shadow-md cursor-pointer"
          title="Agrandir en plein écran"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Navigation Arrows ‹ › (Always visible for easy clicking) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-all shadow-lg cursor-pointer"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black flex items-center justify-center transition-all shadow-lg cursor-pointer"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dot Indicators Position Bar (● ○ ○) */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/30">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === activeIndex
                    ? 'w-5 h-2 bg-[#D4AF37]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Aller à la photo ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Bottom subtle dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* ── 3 Thumbnails Selector Row ── */}
      {allImages.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-3.5 w-full">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer aspect-square w-16 sm:w-20 ${
                idx === activeIndex
                  ? 'border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.5)] scale-105'
                  : 'border-gray-800 opacity-60 hover:opacity-100 hover:border-[#D4AF37]/50'
              }`}
            >
              <img
                src={img}
                alt={`Miniature ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&auto=format&fit=crop';
                }}
              />
              <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/80 text-[8px] font-mono text-[#D4AF37] rounded">
                #{idx + 1}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Fullscreen Lightbox Modal ── */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsZoomed(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/80 border border-[#D4AF37]/40 text-white hover:text-[#D4AF37] cursor-pointer shadow-xl"
            onClick={() => setIsZoomed(false)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Lightbox arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-black/80 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-xl"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-black/80 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-xl"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          {/* Fullscreen image */}
          <img
            src={allImages[activeIndex]}
            alt={altText}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[82vh] rounded-2xl shadow-[0_0_80px_rgba(212,175,55,0.2)] object-contain border border-[#D4AF37]/30"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Lightbox Footer text & dots */}
          <div className="mt-4 flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === activeIndex ? 'bg-[#D4AF37] scale-125' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-amber-200/80 font-mono">
              {altText} — Vue {activeIndex + 1} / {allImages.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
