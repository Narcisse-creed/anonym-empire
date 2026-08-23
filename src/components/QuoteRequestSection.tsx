import React, { useState } from 'react';
import { QuoteRequest, StoreInfo } from '../types';
import { loadQuoteRequests, saveQuoteRequests, buildWhatsAppLink } from '../utils/helpers';
import { FileText, Send, ShieldCheck, Sparkles, Download, Upload, MessageCircle } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { EditableText } from './editor/EditableText';

interface QuoteRequestSectionProps {
  storeInfo: StoreInfo;
  onAddQuoteRequest?: (req: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const QuoteRequestSection: React.FC<QuoteRequestSectionProps> = ({ storeInfo, onAddQuoteRequest }) => {
  const [formData, setFormData] = useState({
    productType: 'Bijoux',
    description: '',
    quantity: 1,
    budget: '',
    deadline: '',
    inspirationPhotoUrl: '',
    contactName: '',
    contactPhone: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const productTypes = ['Emballages', 'Bijoux', 'Accessoires', 'Parfums'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactName.trim() || !formData.contactPhone.trim()) return;

    const requestPayload = {
      productType: formData.productType || 'bijoux',
      category: (formData.productType.toLowerCase() as any) || 'bijoux',
      description: formData.description,
      quantity: formData.quantity,
      budget: formData.budget || undefined,
      deadline: formData.deadline || undefined,
      inspirationPhotoUrl: formData.inspirationPhotoUrl || undefined,
      contactName: formData.contactName.trim(),
      contactPhone: formData.contactPhone.trim(),
    };

    if (onAddQuoteRequest) {
      onAddQuoteRequest(requestPayload);
    } else {
      const newRequest: QuoteRequest = {
        id: `quote-${Date.now()}`,
        ...requestPayload,
        status: 'nouvelle',
        createdAt: new Date().toISOString(),
      };
      const existing = loadQuoteRequests();
      saveQuoteRequests([newRequest, ...existing]);
    }

    const msg = `Bonjour *ANONYM*,\n\nNouvelle demande de devis :\n\n📂 *Type :* ${formData.productType}\n📝 *Description :* ${formData.description}\n📦 *Quantité :* ${formData.quantity}\n${formData.budget ? `💰 *Budget :* ${formData.budget}\n` : ''}${formData.deadline ? `📅 *Deadline :* ${formData.deadline}\n` : ''}👤 *Contact :* ${formData.contactName}\n📞 *Téléphone :* ${formData.contactPhone}`;

    window.open(buildWhatsAppLink(storeInfo.whatsappNumber, msg), '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="devis" className="py-20 bg-[#F0EDE7] text-[#1A1A1A] relative border-b border-[#D4AF37]/20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ShieldCheck className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Demande de Devis Envoyée</h2>
          <p className="text-sm text-gray-400 mb-6">
            Nous vous remercions pour votre demande. Un conseiller ANONYM vous contactera sous peu via WhatsApp.
          </p>
          <button
            onClick={() => window.open(buildWhatsAppLink(storeInfo.whatsappNumber, `Bonjour ANONYM, je souhaite un suivi sur ma demande de devis.`), '_blank')}
            className="inline-flex items-center gap-2 bg-[#0F291E] hover:bg-[#143D2C] text-emerald-400 border border-emerald-500/40 font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-400 text-emerald-600" />
            Suivi via WhatsApp
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="devis" className="py-16 bg-[#F0EDE7] text-[#1A1A1A] relative border-b border-[#D4AF37]/20">
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A160C] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <FileText className="w-3.5 h-3.5" />
            <EditableText path="pageTexts.devis.badgeLabel" value={storeInfo.pageTexts?.devis?.badgeLabel} defaultValue="Sur Mesure / Demande de Devis" as="span" label="Badge Devis" />
          </div>
          <EditableText path="pageTexts.devis.title" value={storeInfo.pageTexts?.devis?.title} defaultValue="Demande de Devis Personnalisé" as="h2" className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight" label="Titre Devis" />
          <EditableText path="pageTexts.devis.subtitle" value={storeInfo.pageTexts?.devis?.subtitle} defaultValue="Décrivez votre projet et un conseiller ANONYM vous contactera sous peu." as="p" className="text-sm text-gray-600 mt-2 font-sans" multiline label="Sous-titre Devis" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Type de Produit</label>
              <select
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#D4AF37]"
              >
                {productTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Quantité</label>
              <input
                type="text"
                required
                value={formData.quantity}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, quantity: val ? Math.max(1, parseInt(val)) : 1 });
                }}
                placeholder="1"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Description du Projet</label>
            <textarea
              rows={3}
              required
              maxLength={1000}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez ce que vous souhaitez commander en détail..."
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Budget Estimatif (FCFA)</label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value.replace(/\D/g, '') })}
                placeholder="Ex: 50000 (Chiffres uniquement)"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Date Limite Souhaitée</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <ImageUploader
              label="Photo d'Inspiration (Optionnelle)"
              value={formData.inspirationPhotoUrl}
              onChange={(val) => setFormData({ ...formData, inspirationPhotoUrl: val })}
              placeholder="Sélectionner une photo depuis votre galerie..."
              helperText="Format image (JPG, PNG, WEBP) — Max 5 Mo"
            />
          </div>

          <div className="bg-[#FAF8F3] rounded-xl p-4 border border-[#D4AF37]/30">
            <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3">Vos Coordonnées</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Nom Complet</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Ex: Marie Dossou"
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Téléphone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value.replace(/[^\d\s+\-()]/g, '') })}
                  placeholder="Ex: +229 97 00 00 00"
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#996515] hover:from-[#F3E5AB] hover:to-[#B8935F] text-black font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-black" />
            <span>Envoyer la Demande de Devis via WhatsApp</span>
          </button>
        </form>
      </div>
    </section>
  );
};