import React from 'react';

interface CrownLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  useImage?: boolean;
  className?: string;
}

export const CrownLogo: React.FC<CrownLogoProps> = ({
  size = 'md',
  showText = true,
  useImage = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-10 h-10', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-12 h-12', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-24 h-24', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];
  const logoPath = '/images/logo-anonym-empire-transparent.png';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official 3D Wood Sculpted "A" Monogram & Logo Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${currentSize.icon}`}>
        {/* Ambient Gold Aura Glow */}
        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/25 blur-md pointer-events-none transform scale-110" />

        {/* Outer Golden Circle Container */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#241C0E] via-[#120F09] to-[#050403] p-[1.5px] border border-[#D4AF37]/70 shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform duration-300 flex items-center justify-center overflow-hidden">
          <img
            src={logoPath}
               alt="Logo ANONYM"
            className="w-full h-full object-contain object-center p-0.5 filter brightness-110 saturate-[1.15] contrast-[1.1]"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = '/images/logo-anonym-empire.jpg';
            }}
          />
        </div>
      </div>

      {/* Brand Name & Official Tagline */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
             <span className={`font-serif tracking-[0.2em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA771C] ${currentSize.text}`}>
               ANONYM
             </span>
          </div>
          <span className={`font-sans uppercase tracking-[0.18em] text-[#C5A059] font-medium ${currentSize.sub}`}>
            QUALITÉ • CONFIANCE • ÉLÉGANCE
          </span>
        </div>
      )}
    </div>
  );
};
