import React, { useState, useEffect } from 'react';
import { CrownLogo } from './CrownLogo';
import { StoreInfo, CategoryId } from '../types';
import { ShoppingBag, MessageCircle, Menu, X, Sparkles, ShieldCheck, Key } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

interface NavbarProps {
  storeInfo: StoreInfo;
  cartCount: number;
  notifications?: any[];
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  activeCategory: CategoryId | 'accueil';
  onSelectCategory: (cat: CategoryId | 'accueil') => void;
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
  onSelectCategory,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Track scroll position to update active navbar section dynamically
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'catalogue', 'customizer', 'about', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    setLogoClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        onOpenAdmin();
        return 0;
      }
      return newCount;
    });
    setTimeout(() => setLogoClickCount(0), 2000);
    handleNavClick('hero', 'accueil');
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
        onOpenAdmin();
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
   * §37b — Fixed nav click handler.
   * When clicking "Contact" (or any section that lives inside the accueil view),
   * we must first ensure activeCategory === 'accueil' so those sections are mounted,
   * then scroll after a short delay.
   */
  const handleNavClick = (sectionId: string, categoryId?: CategoryId | 'accueil') => {
    // §42: When clicking Catalogue from accueil view, change category then scroll after React mounts the catalog component
    if (sectionId === 'catalogue' && activeCategory === 'accueil') {
      const targetCat = categoryId || 'bijoux';
      onSelectCategory(targetCat);
      setTimeout(() => {
        onNavigateSection('catalogue');
      }, 80);
    }
    // §37b: Sections that only render when activeCategory === 'accueil'
    else if (['about', 'contact', 'customizer'].includes(sectionId) && activeCategory !== 'accueil') {
      onSelectCategory('accueil');
      setTimeout(() => {
        onNavigateSection(sectionId);
      }, 80);
    } else {
      if (categoryId) onSelectCategory(categoryId);
      onNavigateSection(sectionId);
    }
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  const btnBase =
    'px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold tracking-wider uppercase transition-all cursor-pointer';
  const btnActive =
    'text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.3)]';
  const btnIdle = 'text-gray-300 hover:text-[#D4AF37] hover:bg-white/5';

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-all">
      {/* ── Marquee ticker ── §3a: wider gap + slower speed */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo — §3a: bigger glow for better visibility */}
        <button
          onClick={handleLogoClick}
          className="text-left focus:outline-none group cursor-pointer relative shrink-0"
          title="ANONYM"
        >
          <CrownLogo size="md" />
          {logoClickCount > 0 && logoClickCount < 3 && (
            <span className="absolute -bottom-2 left-0 text-[9px] text-[#D4AF37] font-mono animate-pulse">
              Clé d'accès : {3 - logoClickCount}...
            </span>
          )}
        </button>

        {/* Desktop Nav — §37a: "L'Entreprise & CEO" removed */}
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-6 mx-4">
          <button
            onClick={() => handleNavClick('hero', 'accueil')}
            className={`${btnBase} ${activeSection === 'hero' ? btnActive : btnIdle}`}
          >
            Accueil
          </button>

          <button
            onClick={() => handleNavClick('catalogue', 'bijoux')}
            className={`${btnBase} ${activeSection === 'catalogue' ? btnActive : btnIdle}`}
          >
            Catalogue
          </button>

          <button
            onClick={() => handleNavClick('customizer')}
            className={`text-xs lg:text-sm font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-full border ${
              activeSection === 'customizer'
                ? 'text-[#D4AF37] bg-[#D4AF37]/25 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                : 'text-amber-200/90 hover:text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30 hover:bg-[#D4AF37]/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>Aperçu Gravure</span>
          </button>

          {/* §37b: "Contact" now correctly navigates to the contact section */}
          <button
            onClick={() => handleNavClick('contact')}
            className={`${btnBase} ${activeSection === 'contact' ? btnActive : btnIdle}`}
          >
            Contact
          </button>
        </nav>

        {/* Action Buttons Right */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
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
            className="relative p-2.5 rounded-full bg-[#161616] hover:bg-[#222222] border border-[#D4AF37]/40 text-[#D4AF37] transition-all cursor-pointer shadow-md group"
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
              <span className="text-xs font-semibold tracking-tight">Admin Connecté</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#161616] text-gray-300 hover:text-[#D4AF37] border border-gray-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer — §37a: "L'Entreprise & CEO" removed */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick('hero', 'accueil')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium tracking-wider uppercase transition-all ${
              activeSection === 'hero' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'text-gray-300'
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => handleNavClick('catalogue', 'bijoux')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium tracking-wider uppercase transition-all ${
              activeSection === 'catalogue' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'text-gray-300'
            }`}
          >
            Catalogue
          </button>
          <button
            onClick={() => handleNavClick('customizer')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium tracking-wider uppercase transition-all flex items-center justify-between ${
              activeSection === 'customizer' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]' : 'text-amber-200'
            }`}
          >
            <span>Aperçu Gravure</span>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </button>
          {/* §37b: Contact fixed */}
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium tracking-wider uppercase transition-all ${
              activeSection === 'contact' ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'text-gray-300'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold tracking-wider uppercase transition-all bg-[#1E180D] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center gap-2"
          >
            <Key className="w-4 h-4 text-[#D4AF37]" />
            <span>Accès Gérant / Administrateur</span>
          </button>
        </div>
      )}
    </header>
  );
};
