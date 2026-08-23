import React from 'react';
import { StoreInfo } from '../types';
import { CrownLogo } from './CrownLogo';
import { MessageCircle, Facebook, Instagram } from 'lucide-react';
import { EditableText } from './editor/EditableText';

interface FooterProps {
  storeInfo: StoreInfo;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ storeInfo, onOpenAdmin }) => {
  return (
    <footer className="bg-[#030303] text-white border-t border-[#D4AF37]/30 pt-12 pb-8 relative">
      <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Brand Baseline Banner */}
        <div className="text-center py-6 border-b border-gray-900">
          <EditableText
            path="pageTexts.footer.baseline"
            value={storeInfo.pageTexts?.footer?.baseline}
            defaultValue="QUALITÉ • CONFIANCE • ÉLÉGANCE"
            as="span"
            className="font-serif font-bold text-xs sm:text-base tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA771C]"
            label="Slogan Footer"
          />
        </div>

        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left: Crown Logo & Address */}
          <div className="md:col-span-5 space-y-2 text-center md:text-left">
            <CrownLogo size="md" />
            <p className="text-xs text-gray-400 font-sans">
              <EditableText
                path="address"
                value={storeInfo.address}
                defaultValue="Abomey-Calavi"
                as="span"
                label="Adresse"
              />
              {', '}
              <EditableText
                path="city"
                value={storeInfo.city}
                defaultValue="Cotonou"
                as="span"
                label="Ville"
              />
              {', '}
              <EditableText
                path="country"
                value={storeInfo.country}
                defaultValue="Bénin"
                as="span"
                label="Pays"
              />
            </p>
            <p className="text-xs text-amber-200/80 font-mono">
              WhatsApp / Tel :{' '}
              <EditableText
                path="phone1"
                value={storeInfo.phone1}
                defaultValue="+229 01 97 00 00"
                as="span"
                label="Téléphone 1"
              />
              {' / '}
              <EditableText
                path="phone2"
                value={storeInfo.phone2}
                defaultValue="+229 01 96 00 00"
                as="span"
                label="Téléphone 2"
              />
            </p>
          </div>

          {/* Center: Legal Reg Info (RCCM / IFU) */}
          <div className="md:col-span-4 text-center space-y-1 text-xs text-gray-400 font-mono bg-[#0D0D0D] p-3 rounded-xl border border-gray-900">
            <div>
              RCCM :{' '}
              <strong className="text-amber-200">
                <EditableText
                  path="rccm"
                  value={storeInfo.rccm}
                  defaultValue="RB/ABC/2026-A-000"
                  as="span"
                  label="RCCM"
                />
              </strong>
            </div>
            <div>
              IFU :{' '}
              <strong className="text-amber-200">
                <EditableText
                  path="ifu"
                  value={storeInfo.ifu}
                  defaultValue="0202612345678"
                  as="span"
                  label="IFU"
                />
              </strong>
            </div>
            <div className="text-[10px] text-gray-500 font-sans">
              <EditableText
                path="pageTexts.footer.copyright"
                value={storeInfo.pageTexts?.footer?.copyright}
                defaultValue={`Tous droits réservés © 2026 ${storeInfo.fullName || 'ANONYM'}`}
                as="span"
                label="Copyright"
              />
            </div>
          </div>

          {/* Right: Social Media Icons Aligned Right */}
          <div className="md:col-span-3 flex items-center justify-center md:justify-end gap-4">
            <a
              href={`https://wa.me/${storeInfo.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#121212] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all shadow-md"
              title="WhatsApp ANONYM"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <a
              href={storeInfo.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#121212] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-md"
              title="Facebook ANONYM"
            >
              <Facebook className="w-5 h-5" />
            </a>

            <a
              href={storeInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#121212] border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-pink-600 hover:text-white hover:border-pink-500 transition-all shadow-md"
              title="Instagram ANONYM"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

        </div>

        {/* Bottom Small Admin Trigger Link */}
        <div className="pt-4 border-t border-gray-900/60 text-center flex items-center justify-between text-[11px] text-gray-600">
          <EditableText
            path="pageTexts.footer.designedBy"
            value={storeInfo.pageTexts?.footer?.designedBy}
            defaultValue="Conçu par IAgenix pour ANONYM • « L'art de se démarquer »"
            as="span"
            label="Signature bas de page"
          />
          <button
            onClick={onOpenAdmin}
            className="text-gray-700 hover:text-gray-500 transition-colors cursor-pointer select-none"
            title="Accès administrateur"
          >
            © 2026
          </button>
        </div>

      </div>
    </footer>
  );
};
