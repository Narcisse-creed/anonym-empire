import React from 'react';
import { motion } from 'motion/react';
import { StoreInfo } from '../types';
import { ShieldCheck, Gem, Star } from 'lucide-react';
import { EditableText } from './editor/EditableText';

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
      {/* CSS Keyframes — GPU-friendly (transform + opacity only) */}
      <style>{`
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes shineSweep {
          0%   { transform: translateX(-130%) skewX(-15deg); opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateX(230%) skewX(-15deg); opacity: 0; }
        }
        @keyframes drawUnderline {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes floatPart {
          0%   { transform: translateY(0px); opacity: 0; }
          15%  { opacity: 0.8; }
          85%  { opacity: 0.35; }
          100% { transform: translateY(-110px); opacity: 0; }
        }
        @keyframes floatPart2 {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          20%  { opacity: 0.7; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-95px) translateX(-8px); opacity: 0; }
        }
        @keyframes haloBreath {
          0%, 100% { opacity: 0.18; transform: scale(1.25); }
          50%       { opacity: 0.30; transform: scale(1.36); }
        }
      `}</style>

      {/* Halo ambiant warm */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 5%, rgba(212,175,55,0.09) 0%, rgba(255,249,235,0.13) 45%, transparent 70%)',
          animation: 'haloBreath 9s ease-in-out infinite',
        }}
      />

      {/* Particules dorées flottantes */}
      {[
        { left: '14%', bottom: '32%', delay: '0s',   dur: '10s', size: 3.5, anim: 'floatPart'  },
        { left: '76%', bottom: '40%', delay: '3s',   dur: '12s', size: 2.5, anim: 'floatPart2' },
        { left: '34%', bottom: '25%', delay: '6s',   dur: '11s', size: 4,   anim: 'floatPart'  },
        { left: '62%', bottom: '30%', delay: '1.5s', dur: '14s', size: 2.5, anim: 'floatPart2' },
        { left: '88%', bottom: '50%', delay: '4.5s', dur: '10s', size: 3,   anim: 'floatPart'  },
        { left: '8%',  bottom: '48%', delay: '7s',   dur: '13s', size: 2.5, anim: 'floatPart2' },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: p.left, bottom: p.bottom,
            width: `${p.size}px`, height: `${p.size}px`,
            background: 'radial-gradient(circle, rgba(212,175,55,0.9) 0%, transparent 100%)',
            animation: `${p.anim} ${p.dur} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">

        {/* LOGO — Animation 1 (entrée) + Animation 3 (flottement) + Animation 2 (reflet) */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-4 sm:mb-6 relative"
        >
          {/* Halo doré derrière le A */}
          <div
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{ animation: 'haloBreath 7s ease-in-out infinite' }}
          />
          {/* Flottement doux — Animation 3 */}
          <div style={{ animation: 'floatLogo 5s ease-in-out infinite' }} className="relative inline-block">
            <img
              src="/images/logo-3d-wood-a.png"
              alt="ANONYM 3D Wood Emblem"
              className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto object-contain mx-auto drop-shadow-[0_14px_30px_rgba(0,0,0,0.13)] select-none"
              draggable={false}
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo-anonym-empire-transparent.png'; }}
            />
            {/* Reflet lumineux diagonal — Animation 2 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <div
                style={{
                  position: 'absolute', top: '-20%', left: '0',
                  width: '35%', height: '140%',
                  background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.52) 50%, rgba(255,255,255,0) 70%, transparent 100%)',
                  animation: 'shineSweep 6s 1.8s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* ANONYM — Grand Titre Statique Ébène / Chocolat Noir */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="anonym-logo text-5xl sm:text-7xl md:text-8xl font-serif font-bold tracking-[0.16em] sm:tracking-[0.18em] uppercase leading-none mb-2 select-none text-[#1F130B]"
        >
          <EditableText
            path="accueil.heroTitle"
            value={storeInfo.pageTexts?.accueil?.heroTitle}
            defaultValue="ANONYM"
            label="Grand Titre Hero"
            renderDisplay={(val) => (
              <span className="anonym-part-a inline-block text-[#1F130B]">
                {val || 'ANONYM'}
              </span>
            )}
          />
        </motion.h1>

        {/* SOULIGNEMENT DORÉ — Ligne épurée avec losange */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="flex items-center justify-center gap-3 w-56 sm:w-80 md:w-96 mx-auto my-3"
        >
          <div
            className="h-[1.5px] flex-1"
            style={{
              background: 'linear-gradient(to left, rgba(212,175,55,0.85), rgba(212,175,55,0.2), transparent)',
              animation: 'drawUnderline 0.85s 1.0s cubic-bezier(0.4,0,0.2,1) both',
              transformOrigin: 'right center',
            }}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.3, type: 'spring', stiffness: 320 }}
            className="w-1.5 h-1.5 rotate-45 shrink-0 bg-[#D4AF37]"
          />
          <div
            className="h-[1.5px] flex-1"
            style={{
              background: 'linear-gradient(to right, rgba(212,175,55,0.85), rgba(212,175,55,0.2), transparent)',
              animation: 'drawUnderline 0.85s 1.0s cubic-bezier(0.4,0,0.2,1) both',
              transformOrigin: 'left center',
            }}
          />
        </motion.div>

        {/* Encadré tagline "L'art de se démarquer" (légèrement agrandi et valorisé) */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: 1.15 }}
          className="mt-3 mb-8"
        >
          <div className="inline-block border border-[#8C7A6B]/50 rounded-full px-8 py-2.5 sm:px-12 sm:py-3 bg-white/95 shadow-sm">
            <span className="font-serif italic text-xl sm:text-2xl md:text-[26px] text-[#2C2018] tracking-wide font-normal">
              <EditableText
                path="accueil.heroSubtitle"
                value={storeInfo.pageTexts?.accueil?.heroSubtitle}
                defaultValue="L'art de se démarquer"
                label="Sous-titre / Slogan"
              />
            </span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: 1.45 }}
          className="text-sm sm:text-base text-gray-600 font-sans leading-relaxed max-w-2xl sm:max-w-3xl mx-auto text-center mb-8"
        >
          <EditableText
            path="accueil.heroDescription"
            value={storeInfo.pageTexts?.accueil?.heroDescription}
            defaultValue="ANONYM est une marque de personnalisation sur mesure pour particuliers et professionnels. Notre mission : permettre à chaque client de se sentir unique et particulier à travers des produits et services de personnalisation d'exception — bijoux, emballages, parfums et accessoires."
            multiline={true}
            label="Description Marque"
          />
        </motion.div>

        {/* 3 cartes d'engagements */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 1.6 }}
          className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl sm:max-w-3xl w-full mx-auto"
        >
          {[
            {
              pathVal: 'accueil.stat1Value', val: storeInfo.pageTexts?.accueil?.stat1Value, defVal: '211+',
              pathLbl: 'accueil.stat1Label', lbl: storeInfo.pageTexts?.accueil?.stat1Label, defLbl: 'Modèles de Bijoux',
              icon: Gem
            },
            {
              pathVal: 'accueil.stat2Value', val: storeInfo.pageTexts?.accueil?.stat2Value, defVal: '1 An',
              pathLbl: 'accueil.stat2Label', lbl: storeInfo.pageTexts?.accueil?.stat2Label, defLbl: 'Garantie Inox 316L',
              icon: ShieldCheck
            },
            {
              pathVal: 'accueil.stat3Value', val: storeInfo.pageTexts?.accueil?.stat3Value, defVal: '100%',
              pathLbl: 'accueil.stat3Label', lbl: storeInfo.pageTexts?.accueil?.stat3Label, defLbl: 'Sur-Mesure',
              icon: Star
            },
          ].map(({ pathVal, val, defVal, pathLbl, lbl, defLbl, icon: Icon }, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04, y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-center p-3.5 sm:p-5 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm cursor-default"
            >
              <Icon className="w-5 h-5 text-[#8C6D23] mx-auto mb-1.5" />
              <div className="text-lg sm:text-2xl font-serif font-bold text-[#1A0F0A]">
                <EditableText path={pathVal} value={val} defaultValue={defVal} label={`Stat #${i + 1} Valeur`} />
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-sans leading-tight">
                <EditableText path={pathLbl} value={lbl} defaultValue={defLbl} label={`Stat #${i + 1} Libellé`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};