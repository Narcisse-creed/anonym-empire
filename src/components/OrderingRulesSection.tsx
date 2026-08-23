import React from 'react';
import { StoreInfo } from '../types';
import { buildWhatsAppLink } from '../utils/helpers';
import { ShoppingBag, Sparkles, MessageCircle, Clock, Truck, ShieldCheck, CheckCircle } from 'lucide-react';
import { EditableText } from './editor/EditableText';

interface OrderingRulesSectionProps {
  storeInfo: StoreInfo;
}

export const OrderingRulesSection: React.FC<OrderingRulesSectionProps> = ({ storeInfo }) => {
  const customRules = storeInfo.pageTexts?.processus?.rules || [];

  const defaultRules = [
    {
      icon: ShoppingBag,
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

  const rules = defaultRules.map((def, idx) => ({
    icon: def.icon,
    title: customRules[idx]?.title || def.title,
    description: customRules[idx]?.description || def.description,
  }));

  return (
    <section id="comment-commander" className="py-16 bg-[#F8F6F2] text-[#1A1A1A] relative border-b border-[#D4AF37]/20">
      <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A160C] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Comment Commander</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
            <EditableText
              path="processus.title"
              value={storeInfo.pageTexts?.processus?.title}
              defaultValue="Le Processus ANONYM"
              label="Titre Processus"
            />
          </h2>
          <div className="text-sm text-gray-600 mt-2 font-sans">
            <EditableText
              path="processus.subtitle"
              value={storeInfo.pageTexts?.processus?.subtitle}
              defaultValue="De la sélection à la livraison, chaque étape est pensée pour votre satisfaction."
              label="Sous-titre Processus"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center bg-white rounded-2xl border border-[#D4AF37]/20 p-6 hover:border-[#D4AF37]/50 hover:shadow-[0_4px_25px_rgba(212,175,55,0.15)] transition-all duration-300 group shadow-sm"
            >
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#D4AF37]/40 text-[#D4AF37] mb-4 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black transition-all shadow-sm">
                <rule.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-gray-900 text-base mb-2 group-hover:text-[#D4AF37] transition-colors">
                <EditableText
                  path={`processus.rules.${idx}.title`}
                  value={customRules[idx]?.title}
                  defaultValue={defaultRules[idx].title}
                  label={`Étape #${idx + 1} Titre`}
                />
              </h3>
              <div className="text-xs text-gray-600 font-sans leading-relaxed">
                <EditableText
                  path={`processus.rules.${idx}.description`}
                  value={customRules[idx]?.description}
                  defaultValue={defaultRules[idx].description}
                  multiline={true}
                  label={`Étape #${idx + 1} Description`}
                />
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