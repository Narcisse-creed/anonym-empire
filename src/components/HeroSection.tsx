import React from 'react';
import { motion } from 'motion/react';
import { StoreInfo } from '../types';
import { ShieldCheck, Gem, Star } from 'lucide-react';

interface HeroSectionProps {
  storeInfo: StoreInfo;
  onExploreCatalog: () => void;
  onOpenCustomizer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ storeInfo }) => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden py-10 sm:py-14 md:py-18 flex flex-col justify-center min-h-[45vh] lg:min-h-[52vh] w-full bg-white"
    >
      {/* ── Subtle background ambient warm glow ── */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white" />

      {/* ── Content Container ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">

        {/* 1. Grand Logo 3D Wood "A" Emblem — Autonome, grand, sans cercle ni badge */}
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 sm:mb-6"
        >
          <img
            src="/images/logo-3d-wood-a.png"
            alt="ANONYM 3D Wood Emblem"
            className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto object-contain mx-auto drop-shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/logo-anonym-empire-transparent.png';
            }}
          />
        </motion.div>

        {/* 2. "ANONYM" — Police serif élégante, couleur sombre (brun foncé/noir), pas de dégradé doré */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold tracking-[0.16em] sm:tracking-[0.18em] text-[#1A0F0A] uppercase leading-none mb-3"
        >
          {storeInfo.pageTexts?.accueil?.heroTitle || 'ANONYM'}
        </motion.h1>

        {/* 3. Ligne de séparation fine avec losange ornemental */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="flex items-center justify-center gap-3 w-56 sm:w-80 md:w-96 mx-auto my-2"
        >
          <div className="h-[1px] flex-1 bg-[#2C2018]/30" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#2C2018]/80" />
          <div className="h-[1px] flex-1 bg-[#2C2018]/30" />
        </motion.div>

        {/* 4. Slogan "QUALITÉ · CONFIANCE · ÉLÉGANCE" — Texte sombre simple, sans badge */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-xs sm:text-sm md:text-base font-sans font-semibold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#2C2018] mt-1 mb-5"
        >
          QUALITÉ &bull; CONFIANCE &bull; ÉLÉGANCE
        </motion.p>

        {/* 5. "L'art de se démarquer" — En italique, dans un encadré à bordure fine arrondie */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mb-8"
        >
          <div className="inline-block border border-[#8C7A6B]/50 rounded-full px-6 py-1.5 sm:px-8 sm:py-2 bg-white/70 shadow-xs">
            <span className="font-serif italic text-base sm:text-lg md:text-xl text-[#2C2018] tracking-wide">
              {storeInfo.pageTexts?.accueil?.heroSubtitle || "L'art de se démarquer"}
            </span>
          </div>
        </motion.div>

        {/* 6. Description de la marque */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-sm sm:text-base text-gray-700 font-sans leading-relaxed max-w-2xl sm:max-w-3xl mx-auto text-center mb-8"
        >
          {storeInfo.pageTexts?.accueil?.heroDescription ||
            "ANONYM est une marque de personnalisation sur mesure pour particuliers et professionnels. Notre mission : permettre à chaque client de se sentir unique et particulier à travers des produits et services de personnalisation d'exception — bijoux, emballages, parfums et accessoires."}
        </motion.p>

        {/* 7. Key figures (3 cartes d'engagements) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl sm:max-w-3xl w-full mx-auto"
        >
          {[
            { value: storeInfo.pageTexts?.accueil?.stat1Value || '211+', label: storeInfo.pageTexts?.accueil?.stat1Label || 'Modèles de Bijoux', icon: Gem },
            { value: storeInfo.pageTexts?.accueil?.stat2Value || '1 An', label: storeInfo.pageTexts?.accueil?.stat2Label || 'Garantie Inox 316L', icon: ShieldCheck },
            { value: storeInfo.pageTexts?.accueil?.stat3Value || '100%', label: storeInfo.pageTexts?.accueil?.stat3Label || 'Sur-Mesure', icon: Star },
          ].map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="text-center p-3.5 sm:p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-xs cursor-default"
            >
              <Icon className="w-5 h-5 text-[#8C6D23] mx-auto mb-1.5" />
              <div className="text-lg sm:text-2xl font-serif font-bold text-[#1A0F0A]">
                {value}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 mt-0.5 font-sans leading-tight">{label}</div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};