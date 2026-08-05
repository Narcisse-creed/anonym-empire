import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { StoreInfo } from '../types';
import { CrownLogo } from './CrownLogo';
import { Sparkles, ShieldCheck, Award, Truck, Gem, Star } from 'lucide-react';

interface HeroSectionProps {
  storeInfo: StoreInfo;
  onExploreCatalog: () => void;
  onOpenCustomizer: () => void;
}

/* ─────────────────────────────────────────────────────────
   Animated golden particles canvas (§3 + §12 spec)
   Lightweight, CPU-gentle, 60 fps
───────────────────────────────────────────────────────── */
const GoldenParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);

    const COUNT = 60;
    type P = { x: number; y: number; r: number; vx: number; vy: number; alpha: number; dAlpha: number; color: string };
    const GOLDS = ['rgba(212,175,55,', 'rgba(243,229,171,', 'rgba(180,140,30,', 'rgba(255,215,80,'];

    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.05,
      alpha: Math.random(),
      dAlpha: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      color: GOLDS[Math.floor(Math.random() * GOLDS.length)],
    }));

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.dAlpha;
        if (p.alpha <= 0 || p.alpha >= 1) p.dAlpha *= -1;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < -5 || p.x > W + 5) p.x = Math.random() * W;

        // Glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
        grd.addColorStop(0, `${p.color}${p.alpha.toFixed(2)})`);
        grd.addColorStop(1, `${p.color}0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.min(p.alpha + 0.3, 1).toFixed(2)})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.65 }}
    />
  );
};

/* ─────────────────────────────────────────────────────────
   Main HeroSection component
───────────────────────────────────────────────────────── */
export const HeroSection: React.FC<HeroSectionProps> = ({ storeInfo }) => {
  return (
    <section
      id="hero"
      className="relative text-white overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 border-b border-[#D4AF37]/20 flex flex-col justify-center min-h-[45vh] lg:min-h-[52vh] xl:min-h-[56vh] w-full"
      style={{
        background: `
          radial-gradient(ellipse 120% 60% at 50% 0%, rgba(26,18,5,0.95) 0%, transparent 70%),
          radial-gradient(ellipse 80% 50% at 80% 100%, rgba(60,35,5,0.6) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 20% 80%, rgba(20,10,2,0.7) 0%, transparent 55%),
          linear-gradient(170deg, #0A0800 0%, #0D0B05 30%, #070606 55%, #0B0908 80%, #050405 100%)
        `,
      }}
    >
      {/* ── Animated golden particles ── */}
      <GoldenParticles />

      {/* ── Animated ambient glow orbs ── */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#D4AF37] rounded-full blur-[130px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 30, 0], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-10 right-0 w-96 h-96 bg-[#B8935F] rounded-full blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -20, 0], opacity: [0.06, 0.13, 0.06] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute -bottom-10 left-0 w-80 h-80 bg-[#D4AF37] rounded-full blur-[120px] pointer-events-none"
      />

      {/* ── Subtle diagonal texture lines ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            rgba(212,175,55,0.8) 0px,
            rgba(212,175,55,0.8) 1px,
            transparent 1px,
            transparent 60px
          )`,
        }}
      />

      {/* ── Content ── */}
      <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Brand pill — cascade step 1 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-3"
        >
          <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-[#18150D]/80 border border-[#D4AF37]/40 shadow-[0_0_30px_rgba(212,175,55,0.25)] backdrop-blur-sm">
            <span className="font-serif italic text-xs sm:text-sm text-[#F3E5AB] tracking-wide text-center">
              {storeInfo.pageTexts?.accueil?.badgeTop || 'Maison de Création & Personnalisation'}
            </span>
          </div>
        </motion.div>

        {/* Brand Logo Emblem — Centré et équilibré sous le badge et au-dessus du titre ANONYM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col items-center justify-center mb-2"
        >
          <div className="relative group">
            {/* Ambient Gold Aura Glow */}
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/35 blur-lg pointer-events-none transform scale-125 group-hover:scale-135 transition-transform duration-500" />
            
            {/* Balanced Official Logo Image / Emblem */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-[#2A2213] via-[#16120B] to-[#050403] p-1 border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)] group-hover:border-[#F3E5AB] group-hover:shadow-[0_0_35px_rgba(212,175,55,0.55)] transition-all duration-300 flex items-center justify-center overflow-hidden">
              <img
                src="/images/logo-anonym-empire-transparent.png"
                alt="ANONYM EMPIRE Logo"
                className="w-full h-full object-contain object-center filter brightness-[1.35] contrast-[1.1] drop-shadow-[0_0_8px_rgba(212,175,55,0.7)] group-hover:scale-105 transition-transform duration-300"
                style={{ mixBlendMode: 'screen' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/logo-anonym-empire-transparent.png';
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main title — cascade step 2 */}
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-8xl lg:text-9xl font-serif font-extrabold tracking-tight text-center leading-[1.0] mb-2"
        >
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="text-transparent bg-clip-text inline-block"
            style={{
              backgroundImage: 'linear-gradient(90deg, #AA771C, #D4AF37, #F3E5AB, #D4AF37, #AA771C)',
              backgroundSize: '300% 100%',
            }}
          >
            {storeInfo.pageTexts?.accueil?.heroTitle || 'ANONYM'}
          </motion.span>

          {/* Animated golden underline */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="block h-[3px] w-48 sm:w-72 lg:w-96 mx-auto mt-2 rounded-full origin-center"
            style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, #F3E5AB, #D4AF37, transparent)' }}
          />
        </motion.h1>

        {/* Tagline — cascade step 3 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light italic text-center text-[#E8D5A3]/90 mb-8"
        >
          {storeInfo.pageTexts?.accueil?.heroSubtitle || '« L\'art de se démarquer »'}
        </motion.p>

        {/* Quality badge — cascade step 4 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#0F0E08]/80 border border-[#D4AF37]/30 text-xs font-mono text-[#F3E5AB] backdrop-blur-sm shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37] animate-pulse" />
            <span className="tracking-[0.2em] uppercase">
              {storeInfo.pageTexts?.accueil?.badgeQuality || 'Qualité · Confiance · Élégance'}
            </span>
          </div>
        </motion.div>

        {/* Brand description — cascade step 5 */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300/90 font-sans leading-relaxed max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto text-center mb-8 sm:mb-10"
        >
          {storeInfo.pageTexts?.accueil?.heroDescription ||
            'Créations d\'exception gravées sur-mesure : bijoux personnalisés en acier inoxydable garanti 1 an, parfums de luxe et coffrets d\'emballages royaux pour femmes, hommes et événements précieux.'}
        </motion.p>

        {/* ── Premium separator ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.65 }}
          className="flex items-center gap-4 mb-6 sm:mb-8 max-w-sm lg:max-w-md mx-auto"
        >
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.5))' }} />
          <Gem className="w-4 h-4 text-[#D4AF37]/70" />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.5))' }} />
        </motion.div>

        {/* ── Key figures ── cascade step 6 */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72 }}
          className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto mb-4 sm:mb-6"
        >
          {[
            { value: storeInfo.pageTexts?.accueil?.stat1Value || '211+', label: storeInfo.pageTexts?.accueil?.stat1Label || 'Modèles de Bijoux', icon: Gem },
            { value: storeInfo.pageTexts?.accueil?.stat2Value || '1 An', label: storeInfo.pageTexts?.accueil?.stat2Label || 'Garantie Inox 316L', icon: ShieldCheck },
            { value: storeInfo.pageTexts?.accueil?.stat3Value || '100%', label: storeInfo.pageTexts?.accueil?.stat3Label || 'Sur-Mesure', icon: Star },
          ].map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.72 + i * 0.08 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(212,175,55,0.3)' }}
              className="text-center p-4 sm:p-5 rounded-2xl bg-[#0D0C07]/80 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all group backdrop-blur-sm cursor-default"
            >
              <Icon className="w-5 h-5 text-[#D4AF37] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37]">
                {value}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 font-sans leading-tight">{label}</div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};