import React, { useState } from 'react';
import { StoreInfo } from '../types';
import { CrownLogo } from './CrownLogo';
import { MapPin, Phone, Mail, Facebook, MessageCircle, Send, Sparkles } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/helpers';
import { EditableText } from './editor/EditableText';

interface ContactSectionProps {
  storeInfo: StoreInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ storeInfo }) => {
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderSubject, setSenderSubject] = useState('Demande de catalogue / Personnalisation');
  const [senderMessage, setSenderMessage] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Bonjour *ANONYM*,\n\nNouveau message depuis le site web :\n\n👤 *Nom :* ${senderName}\n📞 *Téléphone :* ${senderPhone}\n📋 *Sujet :* ${senderSubject}\n💬 *Message :* ${senderMessage}`;
    const url = buildWhatsAppLink(storeInfo.whatsappNumber, msg);
    window.open(url, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-[#F8F6F2] text-[#1A1A1A] relative border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#18150D] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            <EditableText path="pageTexts.contact.badgeLabel" value={storeInfo.pageTexts?.contact?.badgeLabel} defaultValue="Prise de Contact Directe" as="span" label="Badge Contact" />
          </div>
          <EditableText path="pageTexts.contact.title" value={storeInfo.pageTexts?.contact?.title} defaultValue="Contactez ANONYM" as="h2" className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight" label="Titre Contact" />
          <EditableText path="pageTexts.contact.subtitle" value={storeInfo.pageTexts?.contact?.subtitle} defaultValue="Pour toute commande spéciale, partenariat, devis entreprise ou demande de renseignements." as="p" className="text-sm text-gray-600 mt-2 font-sans" multiline label="Sous-titre Contact" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Coordinates Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#D4AF37]/30 p-8 space-y-8 shadow-sm">
              <CrownLogo size="md" />

              <div className="space-y-6 text-sm">
                
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-[#FAF8F3] border border-[#D4AF37]/40 text-[#D4AF37] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <EditableText path="pageTexts.contact.addressLabel" value={storeInfo.pageTexts?.contact?.addressLabel} defaultValue="Adresse Physique" as="h4" className="font-serif font-bold text-gray-900" label="Titre Adresse" />
                    <p className="text-xs text-gray-600 mt-0.5">
                      <EditableText path="city" value={storeInfo.city || storeInfo.address} defaultValue="Abomey-Calavi" as="span" label="Ville" />, <EditableText path="country" value={storeInfo.country} defaultValue="Bénin" as="span" label="Pays" />
                    </p>
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-[#FAF8F3] border border-[#D4AF37]/40 text-[#D4AF37] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <EditableText path="pageTexts.contact.phoneLabel" value={storeInfo.pageTexts?.contact?.phoneLabel} defaultValue="Téléphone & WhatsApp" as="h4" className="font-serif font-bold text-gray-900" label="Titre Téléphone" />
                    <p className="text-xs text-[#8A6A20] font-mono mt-0.5">
                      <EditableText path="phone1" value={storeInfo.phone1} defaultValue="+229 01 97 00 00" as="span" label="Téléphone 1" /> / <EditableText path="phone2" value={storeInfo.phone2} defaultValue="+229 01 96 00 00" as="span" label="Téléphone 2" />
                    </p>
                    <EditableText path="pageTexts.contact.hours" value={storeInfo.pageTexts?.contact?.hours} defaultValue="Disponibilité : Lundi au Samedi 08h00 - 20h00" as="span" className="text-[11px] text-gray-500 block mt-1" label="Horaires" />
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-[#FAF8F3] border border-[#D4AF37]/40 text-[#D4AF37] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-gray-900">Email Officiel</h4>
                    <a
                      href={`mailto:${storeInfo.email}`}
                      className="text-xs text-[#D4AF37] hover:underline font-mono mt-0.5 block"
                    >
                      {storeInfo.email}
                    </a>
                  </div>
                </div>

                {/* Social Networks */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-[#FAF8F3] border border-[#D4AF37]/40 text-[#D4AF37] shrink-0">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-gray-900">Réseaux Sociaux</h4>
                    <a
                      href={storeInfo.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-600 hover:text-[#D4AF37] mt-0.5 block"
                    >
                      Page Facebook : <strong>ANONYM</strong>
                    </a>
                  </div>
                </div>

              </div>

              {/* Direct WhatsApp Call to Action */}
              <a
                href={`https://wa.me/${storeInfo.whatsappNumber}?text=${encodeURIComponent(
                  `Bonjour ${storeInfo.fullName}, je vous contacte depuis votre site web.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 bg-[#161616] hover:bg-[#222222] text-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] font-bold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-xl transition-all cursor-pointer group"
              >
                <MessageCircle className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span>Ouvrir une Discussion WhatsApp</span>
              </a>

            </div>
          </div>

          {/* Right Column: Contact Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-[#D4AF37]/30 p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <EditableText path="pageTexts.contact.formTitle" value={storeInfo.pageTexts?.contact?.formTitle} defaultValue="Envoyer un Message Instantané" as="span" label="Titre Formulaire" />
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                      Votre Nom & Prénom
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Ex: Armelle Dossou"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                      Téléphone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value.replace(/[^\d\s+\-()]/g, ''))}
                      placeholder="Ex: +229 97 00 00 00"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Sujet de la demande
                  </label>
                  <select
                    value={senderSubject}
                    onChange={(e) => setSenderSubject(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Commande Bijoux Personnalisés">Commande Bijoux Personnalisés</option>
                    <option value="Coffrets Parfums ou Emballages">Coffrets Parfums ou Emballages</option>
                    <option value="Devis Entreprise / Objets de Marque">Devis Entreprise / Objets de Marque</option>
                    <option value="Demande de Catalogue VIP">Demande de Catalogue VIP (1000 FCFA)</option>
                    <option value="Partenariat / Programme Commission 10%">Partenariat / Programme Commission 10%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Votre Message ou Précisions
                  </label>
                  <textarea
                    rows={4}
                    required
                    maxLength={1000}
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    placeholder="Décrivez les modèles souhaités, prénoms à graver, quantité..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#996515] hover:from-[#F3E5AB] hover:to-[#B8935F] text-black font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>Envoyer via WhatsApp Direct</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
