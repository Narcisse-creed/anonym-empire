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

        {/* Outer Golden Circle Container */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#2A2213] via-[#16120B] to-[#050403] p-[2px] border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-105 transition-transform duration-300 flex items-center justify-center overflow-hidden">
          <img
            src={logoPath}
            alt="Logo ANONYM EMPIRE — L'art de se démarquer"
            className="w-full h-full object-contain object-center filter brightness-[1.4] contrast-[1.1] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
            style={{ mixBlendMode: 'screen' }}
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
            <span className={`font-serif tracking-[0.2em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA771C] ${currentSize.text}`}>
              ANONYM
            </span>
          </div>
          <span className={`font-sans uppercase tracking-[0.18em] text-[#C5A059] font-semibold ${currentSize.sub}`}>
            QUALITÉ • CONFIANCE • ÉLÉGANCE
          </span>
        </div>
      )}
    </div>
  );
};
