import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreInfo } from '../types';
import { CrownLogo } from './CrownLogo';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Award, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % FOUNDER_SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + FOUNDER_SLIDES.length) % FOUNDER_SLIDES.length);
  }, []);

  // Auto-play every 5 seconds
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const slide = FOUNDER_SLIDES[currentIndex];

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40, scale: 1.04 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40, scale: 0.97 }),
  };

  return (
    <section id="hero" className="relative bg-[#050509] text-white overflow-hidden pt-8 pb-20 border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* ── Left Column: staggered fade-in centered text per §44 ── */}
          <div className="lg:col-span-6 text-center flex flex-col items-center space-y-6">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18150D] border border-[#D4AF37]/40 shadow-[0_0_25px_rgba(212,175,55,0.2)]"
            >
              <CrownLogo size="sm" showText={false} />
              <span className="font-serif italic text-xs sm:text-sm text-[#F3E5AB] tracking-wide">
                Maison de Création &amp; Personnalisation
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight leading-[1.12] text-center"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA771C] animate-[shimmer_3s_ease-in-out_infinite]">
                {storeInfo.pageTexts?.accueil?.heroTitle || 'ANONYM'}
              </span>
              <span className="block mt-2 font-serif font-light italic text-white">
                « L'art de se démarquer »
              </span>
            </motion.h1>

            {/* Quality badge */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#121212] border border-[#D4AF37]/30 text-xs font-mono text-[#F3E5AB]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              <span>Qualité • Confiance • Élégance</span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed max-w-xl mx-auto text-center"
            >
              {storeInfo.pageTexts?.accueil?.heroDescription || 'Créations d\'exception gravées sur-mesure : bijoux personnalisés en acier inoxydable garanti 1 an, parfums de luxe et coffrets d\'emballages royaux pour femmes, hommes et événements précieux.'}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full"
            >
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#996515] hover:from-[#F3E5AB] hover:to-[#B8935F] text-black font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] active:translate-y-0 cursor-pointer"
              >
                <span>Explorer le Catalogue</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                onClick={onOpenCustomizer}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#141414] hover:bg-[#1F1C12] text-[#D4AF37] border border-[#D4AF37]/50 font-semibold text-xs sm:text-sm tracking-wider uppercase px-6 py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] cursor-pointer"
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

          {/* ── Right Column: 3-image carousel (§26 / §39) ── */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.25)] bg-[#0E0E0E] group"
            >
              {/* Slide area */}
              <div className="aspect-[4/3] sm:aspect-[3/4] relative overflow-hidden bg-black">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.img
                    key={slide.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                    src={slide.imageUrl}
                    alt={slide.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format&fit=crop';
                    }}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    style={{ willChange: 'transform, opacity' }}
                  />
                </AnimatePresence>

                {/* Subtle Ken Burns on current image via CSS keyframe (applied to container) */}
                <div className="absolute inset-0 pointer-events-none animate-[kenburns_8s_ease-in-out_infinite_alternate]" />

                {/* Dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                {/* Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono font-bold tracking-widest shadow">
                  {slide.badge}
                </div>

                {/* Slide dots */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  {FOUNDER_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); }}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Image ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Slide info overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-[#D4AF37]/30 shadow-xl">
                  <span className="font-serif font-bold text-sm sm:text-base text-[#F3E5AB] block">
                    {slide.title}
                  </span>
                  <span className="text-[11px] text-amber-200/80 block mt-0.5">
                    {slide.subtitle}
                  </span>
                  <p className="text-[10px] text-gray-400 italic mt-1 line-clamp-2 border-t border-gray-800/60 pt-1">
                    «&nbsp;{slide.description}&nbsp;»
                  </p>
                </div>

                {/* ‹ Prev arrow */}
                <button
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 border border-[#D4AF37]/40 text-[#D4AF37] opacity-70 hover:opacity-100 hover:scale-110 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all cursor-pointer z-10"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* › Next arrow */}
                <button
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 border border-[#D4AF37]/40 text-[#D4AF37] opacity-70 hover:opacity-100 hover:scale-110 hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all cursor-pointer z-10"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ── Trust Badges Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-12 mt-12 border-t border-[#D4AF37]/20 text-left"
        >
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#121212]/90 border border-[#D4AF37]/25 shadow-lg hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all">
            <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Garantie 1 An Inaltérable</h4>
              <p className="text-[11px] sm:text-xs text-gray-400">Acier Inoxydable 316L résistant eau &amp; parfum</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#121212]/90 border border-[#D4AF37]/25 shadow-lg hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all">
            <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Gravure Laser Millimétrée</h4>
              <p className="text-[11px] sm:text-xs text-gray-400">Prénoms, dates, symboles &amp; photos sur-mesure</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#121212]/90 border border-[#D4AF37]/25 shadow-lg hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all">
            <div className="p-3 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Expédition Tout le Bénin</h4>
              <p className="text-[11px] sm:text-xs text-gray-400">Livraison Cotonou, Calavi, Parakou &amp; sous-région</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};