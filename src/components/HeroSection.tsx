import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreInfo } from '../types';
import { CrownLogo } from './CrownLogo';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Award, Truck, ChevronLeft, ChevronRight, Play, Pause, User2 } from 'lucide-react';
import { FOUNDER_SLIDES } from '../data/founderMedia';

interface HeroSectionProps {
  storeInfo: StoreInfo;
  onExploreCatalog: () => void;
  onOpenCustomizer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  storeInfo,
  onExploreCatalog,
  onOpenCustomizer,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % FOUNDER_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % FOUNDER_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + FOUNDER_SLIDES.length) % FOUNDER_SLIDES.length);
  };

  const currentSlide = FOUNDER_SLIDES[currentSlideIndex];

  return (
    <section id="hero" className="relative bg-[#050509] text-white overflow-hidden pt-8 pb-20 border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          <div className="lg:col-span-6 text-center lg:text-left space-y-6">

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18150D] border border-[#D4AF37]/40 shadow-[0_0_25px_rgba(212,175,55,0.2)]"
            >
              <CrownLogo size="sm" showText={false} />
              <span className="font-serif italic text-xs sm:text-sm text-[#F3E5AB] tracking-wide">
                Maison de Création & Personnalisation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight leading-[1.12]"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA771C]">
                {storeInfo.pageTexts?.accueil?.heroTitle || 'ANONYM'}
              </span>
              <span className="block mt-2 font-serif font-light italic text-white">
                « L'art de se démarquer »
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#121212] border border-[#D4AF37]/30 text-xs font-mono text-[#F3E5AB]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              <span>{storeInfo.pageTexts?.accueil?.heroSubtitle || "L'art de se démarquer"}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              {storeInfo.pageTexts?.accueil?.heroDescription || 'Créations d\'exception gravées sur-mesure : bijoux personnalisés en acier inoxydable garanti 1 an, parfums de luxe et coffrets d\'emballages royaux pour femmes, hommes et événements précieux.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#996515] hover:from-[#F3E5AB] hover:to-[#B8935F] text-black font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
              >
                <span>Explorer le Catalogue</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                onClick={onOpenCustomizer}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#141414] hover:bg-[#1F1C12] text-[#D4AF37] border border-[#D4AF37]/50 font-semibold text-xs sm:text-sm tracking-wider uppercase px-6 py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span>Simulateur Gravure</span>
              </button>

              <a
                href={`https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(
                  `Bonjour ${storeInfo.fullName}, je souhaite commander un bijou ou coffret d'exception.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F291E] hover:bg-[#143D2C] text-emerald-400 border border-emerald-500/40 font-semibold text-xs sm:text-sm tracking-wider uppercase px-5 py-3.5 rounded-full shadow-md transition-all transform hover:-translate-y-1"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </motion.div>

          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.25)] bg-[#0E0E0E]">
              <div className="aspect-[4/3] sm:aspect-[3/4] relative rounded-2xl overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide.id}
                    src={currentSlide.imageUrl}
                    alt={currentSlide.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format&fit=crop';
                    }}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover object-top"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-[#D4AF37]/40 text-[10px] uppercase tracking-widest text-[#F3E5AB] font-mono font-bold">
                    <User2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {currentSlide.badge}
                  </span>
                  <h3 className="font-serif font-bold text-white text-base sm:text-lg mt-1">
                    {currentSlide.title}
                  </h3>
                  <p className="text-[11px] text-gray-300">
                    {currentSlide.subtitle}
                  </p>
                </div>

                <button
                  onClick={() => setIsAutoplay(!isAutoplay)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/70 border border-gray-700 text-white hover:text-[#D4AF37] transition-all"
                  title={isAutoplay ? 'Mettre en pause' : 'Lecture automatique'}
                >
                  {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-[#D4AF37]/40 text-[#D4AF37] opacity-80 hover:opacity-100 transition-all"
                  title="Photo précédente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-[#D4AF37]/40 text-[#D4AF37] opacity-80 hover:opacity-100 transition-all"
                  title="Photo suivante"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-3 pb-1">
                {FOUNDER_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlideIndex
                        ? 'w-8 bg-[#D4AF37]'
                        : 'w-2 bg-gray-700 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-12 mt-12 border-t border-[#D4AF37]/20 text-left"
        >
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#121212]/90 border border-[#D4AF37]/25 shadow-lg hover:border-[#D4AF37] transition-all">
            <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Garantie 1 An Inaltérable</h4>
              <p className="text-[11px] sm:text-xs text-gray-400">Acier Inoxydable 316L résistant eau & parfum</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#121212]/90 border border-[#D4AF37]/25 shadow-lg hover:border-[#D4AF37] transition-all">
            <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Gravure Laser Millimétrée</h4>
              <p className="text-[11px] sm:text-xs text-gray-400">Prénoms, dates, symboles & photos sur-mesure</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#121212]/90 border border-[#D4AF37]/25 shadow-lg hover:border-[#D4AF37] transition-all">
            <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Expédition Tout le Bénin</h4>
              <p className="text-[11px] sm:text-xs text-gray-400">Livraison Cotonou, Calavi, Parakou & sous-région</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};