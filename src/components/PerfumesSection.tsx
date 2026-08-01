import React from 'react';
import { StoreInfo, Product } from '../types';
import { formatPriceFCFA } from '../utils/helpers';
import { buildWhatsAppLink } from '../utils/helpers';
import { Sparkles, MessageCircle, ArrowRight, Droplets, Crown } from 'lucide-react';

interface PerfumesSectionProps {
  storeInfo: StoreInfo;
  onNavigateCatalog: () => void;
  onOpenCustomizer: () => void;
  products?: Product[];
}

export const PerfumesSection: React.FC<PerfumesSectionProps> = ({
  storeInfo,
  onNavigateCatalog,
  onOpenCustomizer,
  products,
}) => {
  const hardcodedProduct = {
    id: 'perfume-invitation',
    name: 'ANONYM INVITATION',
    description: storeInfo.pageTexts?.parfums?.invitationDescription || "La porte d'entrée vers l'univers olfactif de la marque. Une fragrance d'exception pour découvrir la qualité ANONYM.",
    price: 15000,
    imageUrl: '/images/products/perfume-invitation.jpg',
    category: 'parfums',
  };

  const invitationProduct = products
    ? products.find(
        (p) => p.id === 'perfume-invitation' || p.name.toLowerCase().includes('invitation')
      ) || hardcodedProduct
    : hardcodedProduct;

  return (
    <section id="parfums" className="py-20 bg-gradient-to-b from-[#0A0012] via-[#101010] to-[#0A0012] text-white relative border-b border-[#D4AF37]/20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#D4AF37]/10 via-transparent to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A0D1E] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <Droplets className="w-3.5 h-3.5" />
            <span>Parfums d'Exception</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            {storeInfo.pageTexts?.parfums?.title || 'Parfums ANONYM'}
          </h2>
          <p className="text-sm text-gray-300 mt-4 font-sans leading-relaxed max-w-2xl mx-auto">
            {storeInfo.pageTexts?.parfums?.description || "ANONYM crée un univers olfactif destiné aux personnes qui souhaitent posséder une identité olfactive qui leur est propre. Une senteur reconnaissable, une signature que votre entourage associera à votre présence."}
          </p>
        </div>

        {/* ANONYM INVITATION Hero Product Card */}
        <div className="bg-gradient-to-r from-[#1A0D1E] via-[#0F0A14] to-[#1A0D1E] border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5 pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono uppercase tracking-wider">
                <Crown className="w-4 h-4" />
                <span>Signature Parfum</span>
              </div>
              <h3 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#F3E5AB] tracking-tight">
                ANONYM INVITATION
              </h3>
              <p className="text-sm text-gray-300 font-sans leading-relaxed">
                {invitationProduct.description}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-serif font-bold text-[#D4AF37]">{formatPriceFCFA(invitationProduct.price)}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={buildWhatsAppLink(storeInfo.whatsappNumber, `Bonjour ANONYM, je souhaite commander ANONYM INVITATION — parfum d'exception.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#996515] hover:from-[#F3E5AB] hover:to-[#B8935F] text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1 cursor-pointer"
                >
                  Commander sur WhatsApp
                  <MessageCircle className="w-4 h-4" />
                </a>
                <button
                  onClick={onNavigateCatalog}
                  className="inline-flex items-center justify-center gap-2 bg-[#141414] hover:bg-[#1F1C12] text-[#D4AF37] border border-[#D4AF37]/50 font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all cursor-pointer"
                >
                  Explorer la Collection
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl bg-[#0A0510] border border-[#D4AF37]/20 flex items-center justify-center overflow-hidden">
                <Droplets className="w-24 h-24 text-[#D4AF37]/30" />
                <span className="absolute text-xs text-gray-600 font-mono">ANONYM INVITATION</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center py-10 bg-[#0F0A14] rounded-2xl border border-[#D4AF37]/20">
          <h3 className="text-2xl font-serif font-bold text-[#F3E5AB] mb-3">
            Découvrez votre identité olfactive
          </h3>
          <p className="text-sm text-gray-400 mb-6 max-w-lg mx-auto">
            Une fragrance unique qui vous ressemble. Personnalisez votre signature olfactive avec ANONYM.
          </p>
          <button
            onClick={onOpenCustomizer}
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Simulateur d'identité olfactive
          </button>
        </div>
      </div>
    </section>
  );
};