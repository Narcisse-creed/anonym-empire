import React, { useState, useEffect } from 'react';
import { CrownLogo } from './CrownLogo';
import { StoreInfo, CategoryId } from '../types';
import { ShoppingBag, MessageCircle, Menu, X, ShieldCheck, Key } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

interface NavbarProps {
  storeInfo: StoreInfo;
  cartCount: number;
  notifications?: any[];
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  activeCategory: CategoryId | 'accueil' | 'contact';
  showGrid: boolean;
  onSelectCategory: (cat: CategoryId | 'accueil' | 'contact') => void;
  onBackToGrid: () => void;
  onGoToHomeHero: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  storeInfo,
  cartCount,
  notifications = [],
  onOpenCart,
  onOpenAdmin,
  isAdminLoggedIn,
  activeCategory,
  showGrid,
  onSelectCategory,
  onBackToGrid,
  onGoToHomeHero,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Track scroll position to update active navbar section dynamically
  useEffect(() => {
    if (activeCategory === 'contact') {
      setActiveSection('contact');
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      const universeEl = document.getElementById('universe-nav');
      const catalogueEl = document.getElementById('catalogue');

      if (universeEl && scrollPosition >= universeEl.offsetTop - 150) {
        setActiveSection('catalogue');
      } else if (catalogueEl && scrollPosition >= catalogueEl.offsetTop - 150) {
        setActiveSection('catalogue');
      } else {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory]);

  const handleLogoClick = () => {
    onGoToHomeHero();
  };

  const handleLongPressStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      onOpenAdmin();
    }, 2500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        onOpenAdmin();
      }
    };

    const checkUrlAdmin = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setTimeout(() => onOpenAdmin(), 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkUrlAdmin);
    checkUrlAdmin();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkUrlAdmin);
    };
  }, [onOpenAdmin]);

  /**
   * Nav click handler:
   * - 'hero': Reset to main home hero view at top of page (onGoToHomeHero)
   * - 'catalogue': Return to 5 cards view (onBackToGrid)
   * - 'contact': Open independent Contact page view (activeCategory = 'contact')
   */
  const handleNavClick = (sectionId: string) => {
    if (sectionId === 'hero') {
      onGoToHomeHero();
      setActiveSection('hero');
    } else if (sectionId === 'catalogue') {
      onBackToGrid();
      setActiveSection('catalogue');
    } else if (sectionId === 'contact') {
      onSelectCategory('contact');
      setActiveSection('contact');
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
    setMobileMenuOpen(false);
  };

  const btnBase =
    'px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold tracking-widest uppercase transition-all cursor-pointer';
  const btnActive =
    'text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.25)] font-bold';
  const btnIdle = 'text-gray-700 hover:text-[#D4AF37] hover:bg-black/5';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D4AF37]/25 shadow-[0_2px_20px_rgba(0,0,0,0.08)] transition-all">
      {/* ── Marquee ticker ── */}
      <div className="overflow-hidden bg-[#0D0D0D] border-b border-[#D4AF37]/10 py-1.5">
        <div className="whitespace-nowrap animate-[marqueeScroll_35s_linear_infinite] inline-block text-[10px] font-mono text-[#D4AF37]/70 tracking-widest uppercase">
          {[...Array(4)].map((_, i) => (
            <span key={i}>
              {storeInfo.address || 'Abomey-Calavi, Bénin'}&nbsp;&nbsp;·&nbsp;&nbsp;
              {storeInfo.whatsappNumber || '+229 XX XX XX XX'}&nbsp;&nbsp;·&nbsp;&nbsp;
              Qualité · Confiance · Élégance
              <span className="mx-16">&nbsp;</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Balanced 3-Column Header Layout (§1 Problem 1) ── */}
      <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Column: Brand Logo */}
        <div className="flex-1 flex justify-start items-center">
          <button
            onClick={() => {
              // Simple click → home. Long-press timer is already cancelled by onMouseUp/onTouchEnd.
              handleLogoClick();
            }}
            onTouchStart={handleLongPressStart}
            onTouchEnd={handleLongPressEnd}
            onMouseDown={handleLongPressStart}
            onMouseUp={handleLongPressEnd}
            className="text-left focus:outline-none group cursor-pointer relative shrink-0"
            title="ANONYM — Retour à l'accueil"
            aria-label="Retour à la page d'accueil"
          >
            <CrownLogo size="md" />
          </button>
        </div>

        {/* Center Column: Perfectly Symmetrical Navigation Links (Accueil, Catalogue, Contact) */}
        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-10">
          <button
            onClick={() => handleNavClick('hero')}
            className={`${btnBase} ${activeSection === 'hero' ? btnActive : btnIdle}`}
          >
            Accueil
          </button>

          <button
            onClick={() => handleNavClick('catalogue')}
            className={`${btnBase} ${activeSection === 'catalogue' ? btnActive : btnIdle}`}
          >
            Catalogue
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`${btnBase} ${activeSection === 'contact' ? btnActive : btnIdle}`}
          >
            Contact
          </button>
        </nav>

        {/* Right Column: Actions (WhatsApp, Notifications, Panier, Admin) */}
        <div className="flex-1 flex justify-end items-center space-x-2.5 sm:space-x-3.5 shrink-0">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(
              `Bonjour ${storeInfo.fullName}, je souhaite des informations sur vos bijoux et votre catalogue.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#0F291E] hover:bg-[#143D2C] text-emerald-400 border border-emerald-500/40 text-xs font-semibold px-3.5 py-2 rounded-full transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          {/* Notification Bell */}
          <NotificationBell notifications={notifications} />

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-white hover:bg-gray-50 border border-[#D4AF37]/40 text-[#D4AF37] transition-all cursor-pointer shadow-sm group"
            title="Mon Panier / Sélection"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-black animate-pulse shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin indicator */}
          {isAdminLoggedIn && (
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/60 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse cursor-pointer"
              title="Espace Administrateur Connecté"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-tight">Admin</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:text-[#D4AF37] border border-gray-200 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#D4AF37]/25 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <button
            onClick={() => handleNavClick('hero')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium tracking-wider uppercase transition-all ${
              activeSection === 'hero' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'text-gray-700 hover:text-[#D4AF37] hover:bg-gray-50'
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => handleNavClick('catalogue')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium tracking-wider uppercase transition-all ${
              activeSection === 'catalogue' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'text-gray-700 hover:text-[#D4AF37] hover:bg-gray-50'
            }`}
          >
            Catalogue (5 Cartes)
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium tracking-wider uppercase transition-all ${
              activeSection === 'contact' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'text-gray-700 hover:text-[#D4AF37] hover:bg-gray-50'
            }`}
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
};
