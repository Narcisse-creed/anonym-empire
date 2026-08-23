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
  const logoPath = '/images/logo-anonym-empire-transparent.png';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official 3D Wood Sculpted "A" Monogram Emblem (§40b) */}
      <div className={`relative flex items-center justify-center shrink-0 ${currentSize.icon}`}>
        {/* Ambient Gold Aura Glow */}
        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/35 blur-md pointer-events-none transform scale-115" />

        {/* Outer Golden Circle Container — fond blanc pour faire ressortir le "A" bois */}
        <div className="relative w-full h-full rounded-full bg-white p-[2px] border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-105 transition-transform duration-300 flex items-center justify-center overflow-hidden">
          <img
            src={logoPath}
            alt="Logo ANONYM EMPIRE — L'art de se démarquer"
            className="w-[115%] h-[115%] object-cover object-top drop-shadow-[0_2px_6px_rgba(212,175,55,0.4)]"
            style={{ marginTop: '-5%' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/logo-anonym-empire-transparent.png';
            }}
          />
        </div>
      </div>

      {/* Brand Name & Official Tagline */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif tracking-[0.2em] font-bold text-[#2C1A0E] ${currentSize.text}`}>
              ANONYM
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
