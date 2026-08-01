import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreInfo } from '../types';
import { CrownLogo } from './CrownLogo';
import { FOUNDER_SLIDES } from '../data/founderMedia';
import { Sparkles, CheckCircle2, Clock, Award, Shield, PhoneCall, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface AboutFounderProps {
  storeInfo: StoreInfo;
}

export const AboutFounder: React.FC<AboutFounderProps> = ({ storeInfo }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Auto-play interval for the founder photos slideshow (8 seconds)
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % FOUNDER_SLIDES.length);
    }, 8000);
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
    <section id="about" className="py-20 bg-[#080808] text-white relative border-b border-[#D4AF37]/20 overflow-hidden">
      {/* Background Subtle Floating Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#B8935F]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A160C] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>À Propos d'ANONYM</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight"
          >
            L'Histoire & La Direction
            <span className="block text-2xl sm:text-3xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA771C] mt-2">
              « L'art de se démarquer »
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive 3D Animated Founder Photo Carousel */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 p-2 bg-[#121212] shadow-[0_0_50px_rgba(212,175,55,0.25)] group"
            >
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden bg-black">
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
                    className="w-full h-full object-cover object-top filter saturate-[1.05]"
                  />
                </AnimatePresence>

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold">
                  {currentSlide.badge}
                </div>

                {/* Autoplay Pause / Play Toggle */}
                <button
                  onClick={() => setIsAutoplay(!isAutoplay)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 border border-gray-700 text-white hover:text-[#D4AF37] transition-all"
                  title={isAutoplay ? 'Mettre en pause' : 'Lecture automatique'}
                >
                  {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                {/* Slide Overlay Info Centered */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/85 backdrop-blur-md border border-[#D4AF37]/40 text-center space-y-1 shadow-xl">
                  <span className="font-serif font-bold text-base sm:text-lg text-[#F3E5AB] block text-center">
                    {currentSlide.title}
                  </span>
                  <span className="text-xs font-sans text-amber-200/90 block text-center">
                    {currentSlide.subtitle}
                  </span>
                  <p className="text-[11px] text-gray-300 font-sans italic line-clamp-2 pt-1 border-t border-gray-800/80 mt-1 text-center">
                    "{currentSlide.description}"
                  </p>
                </div>

                {/* Slider Nav Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 border border-[#D4AF37]/40 text-[#D4AF37] opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
                  title="Photo précédente"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 border border-[#D4AF37]/40 text-[#D4AF37] opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
                  title="Photo suivante"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-2 pt-3 pb-1">
                {FOUNDER_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIndex
                        ? 'w-8 bg-[#D4AF37]'
                        : 'w-2 bg-gray-700 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Detailed Brand Presentation & PDF Conditions */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  La Fondatrice : <span className="text-[#D4AF37]">Lizie Fifamè ALLATIN</span>
                </h3>
                <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed">
                  Basée à <strong className="text-white">Abomey-Calavi (Zogbadjè, Bénin)</strong>, <strong className="text-[#F3E5AB]">ANONYM</strong> est une maison béninoise d'excellence dédiée aux bijoux personnalisés, la parfumerie et la conception de coffrets de prestige. Nous traduisons vos émotions, prénoms et dates mémorables en œuvres durables.
                </p>
              </div>

              {/* Brand Values Banner */}
              <div className="p-4 rounded-2xl bg-[#12100A] border border-[#D4AF37]/40 flex flex-wrap items-center justify-around gap-4 text-center shadow-lg">
                {storeInfo.values.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                    <span className="font-serif font-bold tracking-widest text-[#F3E5AB] uppercase text-xs sm:text-sm">
                      {val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Catalog Official Commitments (PDF Data) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-base font-serif font-semibold text-[#D4AF37] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  <span>Engagements & Informations du Catalogue Officiel</span>
                </h4>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-300">
                  <li className="flex items-start gap-2.5 bg-[#121212] p-3 rounded-xl border border-gray-800/80 hover:border-[#D4AF37]/30 transition-all">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>Pour tous :</strong> Hommes, femmes, couples, enfants, bébés et animaux.</span>
                  </li>

                  <li className="flex items-start gap-2.5 bg-[#121212] p-3 rounded-xl border border-gray-800/80 hover:border-[#D4AF37]/30 transition-all">
                    <Award className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>Garantie 1 An :</strong> Acier inoxydable 316L, ne rouille ni ne noircit au parfum.</span>
                  </li>

                  <li className="flex items-start gap-2.5 bg-[#121212] p-3 rounded-xl border border-gray-800/80 hover:border-[#D4AF37]/30 transition-all">
                    <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>Délai de fabrication :</strong> 4 à 6 semaines au plus tard pour les bijoux d'importation.</span>
                  </li>

                  <li className="flex items-start gap-2.5 bg-[#121212] p-3 rounded-xl border border-gray-800/80 hover:border-[#D4AF37]/30 transition-all">
                    <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>Commission 10% :</strong> Programme d'apporteurs d'affaires et récompenses partenaires.</span>
                  </li>
                </ul>
              </div>

              {/* Legal Registrations & Official Payment Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17140B] via-[#121212] to-[#0A0A0A] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Paiements & Transferts de Validation :</span>
                    <span className="font-mono font-bold text-amber-200 text-sm">
                      {storeInfo.phone1} / {storeInfo.phone2}
                    </span>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                      RCCM: {storeInfo.rccm} | IFU: {storeInfo.ifu}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <CrownLogo size="sm" showText={false} />
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
