import React from 'react';
import { StoreInfo } from '../types';
import { buildWhatsAppLink } from '../utils/helpers';
import { MessageCircle, Clock, ShieldCheck, Sparkles, Truck, CheckCircle } from 'lucide-react';

interface OrderingRulesSectionProps {
  storeInfo: StoreInfo;
}

export const OrderingRulesSection: React.FC<OrderingRulesSectionProps> = ({ storeInfo }) => {
  const rules = [
    {
      icon: Sparkles,
      title: '1. Choisissez votre produit',
      description: 'Parcourez le catalogue ANONYM et sélectionnez le bijou, parfum, emballage ou accessoire de votre choix. Chaque pièce est unique et personnalisable.',
    },
    {
      icon: Sparkles,
      title: '2. Personnalisation',
      description: 'Ajoutez vos prénoms, dates, symboles ou choix de couleur directement via le simulateur de gravure ou contactez-nous pour une commande sur mesure.',
    },
    {
      icon: MessageCircle,
      title: '3. Commande via WhatsApp',
      description: `Envoyez votre sélection directement via WhatsApp au ${storeInfo.phone1}. Confirmez les détails de personnalisation et le délai souhaité.`,
    },
    {
      icon: Clock,
      title: '4. Délai de fabrication',
      description: 'Les bijoux sur mesure sont fabriqués en 4 à 6 semaines. Les produits en stock sont expédiés sous 24 à 48h. Les parfums et emballages sur mesure nécessitent 2 à 3 semaines.',
    },
    {
      icon: Truck,
      title: '5. Livraison partout au Bénin',
      description: 'Nous livrons à Cotonou, Abomey-Calavi, Parakou, Borgou et dans toute la sous-région. Les frais de livraison sont calculés selon la destination.',
    },
    {
      icon: ShieldCheck,
      title: '6. Garantie ANONYM',
      description: 'Tous les bijoux en acier inoxydable 316L bénéficient d\'une garantie d\'un an contre la rouille et le noircissement. Satisfaction garantie ou échange possible.',
    },
  ];
  return (
    <section id="comment-commander" className="py-16 bg-[#080808] text-white relative border-b border-[#D4AF37]/20">
      <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A160C] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Comment Commander</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Le Processus ANONYM
          </h2>
          <p className="text-sm text-gray-400 mt-2 font-sans">
            De la sélection à la livraison, chaque étape est pensée pour votre satisfaction.
          </p>
        </div>

        <div className="space-y-6">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 bg-[#0F0F0F] rounded-2xl border border-[#D4AF37]/15 p-5 hover:border-[#D4AF37]/30 transition-all group"
            >
              <div className="p-3 rounded-xl bg-[#1A160C] border border-[#D4AF37]/30 text-[#D4AF37] shrink-0 group-hover:bg-[#D4AF37]/10 transition-colors">
                <rule.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-sm mb-1">{rule.title}</h4>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-10 text-center">
          <a
            href={buildWhatsAppLink(storeInfo.whatsappNumber, `Bonjour ANONYM, je souhaite passer une commande. Pouvez-vous m'accompagner?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            Commander via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};