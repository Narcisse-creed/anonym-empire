import React from 'react';

interface CrownLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  useImage?: boolean;
  className?: string;
}

export const CrownLogo: React.FC<CrownLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = false,
  useImage = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-11 h-11', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-14 h-14', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-20 h-20', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-28 h-28', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];
  // logo-3d-wood-a.png = uniquement le symbole "A" en bois, fond blanc, sans aucun texte
  const logoPath = '/images/logo-3d-wood-a.png';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official 3D Wood Sculpted "A" Monogram Emblem (§40b) */}
      <div className={`relative flex items-center justify-center shrink-0 ${currentSize.icon}`}>
        {/* Ambient Gold Aura Glow */}
        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/35 blur-md pointer-events-none transform scale-115" />

        {/* Outer Golden Circle Container — fond blanc, image "A" seul sans texte */}
        <div className="relative w-full h-full rounded-full bg-white p-[3px] border-2 border-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.45)] hover:scale-105 transition-transform duration-300 flex items-center justify-center overflow-hidden">
          <img
            src={logoPath}
            alt="ANONYM — Symbole A bois sculpté"
            className="w-[90%] h-[90%] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/logo-3d-wood-a.png';
            }}
          />
        </div>
      </div>

      {/* Brand Name & Official Tagline */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif tracking-[0.2em] font-bold ${currentSize.text}`}>
              <span className="anonym-part-a">ANO</span>
              <span className="anonym-part-b">NYM</span>
            </span>
          </div>
          {showSubtitle && (
            <span className={`font-sans uppercase tracking-[0.18em] text-[#C5A059] font-semibold ${currentSize.sub}`}>
              QUALITÉ • CONFIANCE • ÉLÉGANCE
            </span>
          )}
        </div>
      )}
    </div>
  );
};
