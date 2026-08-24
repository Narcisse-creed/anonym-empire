import React from 'react';
import { motion } from 'motion/react';
import { StoreInfo, FounderCommitment } from '../types';
import { CrownLogo } from './CrownLogo';
import { Sparkles, CheckCircle2, Clock, Award, Shield, PhoneCall } from 'lucide-react';
import { EditableText } from './editor/EditableText';
import { EditableImage } from './editor/EditableImage';

interface AboutFounderProps {
  storeInfo: StoreInfo;
}

const FALLBACK_PHOTO = '/images/lizie-black-outfit.jpg';

function CommitmentIcon({ icon }: { icon: FounderCommitment['icon'] }) {
  const cls = 'w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5';
  switch (icon) {
    case 'award':    return <Award className={cls} />;
    case 'clock':    return <Clock className={cls} />;
    case 'sparkles': return <Sparkles className={cls} />;
    case 'phone':    return <PhoneCall className={cls} />;
    default:         return <CheckCircle2 className={cls} />;
  }
}

const DEFAULT_COMMITMENTS: FounderCommitment[] = [
  { icon: 'check',    label: 'Pour tous :',            text: 'Hommes, femmes, couples, enfants, bébés et animaux.' },
  { icon: 'award',    label: 'Garantie 1 An :',        text: 'Acier inoxydable 316L, ne rouille ni ne noircit au parfum.' },
  { icon: 'clock',    label: 'Délai de fabrication :', text: "4 à 6 semaines au plus tard pour les bijoux d'importation." },
  { icon: 'sparkles', label: 'Commission 10% :',       text: "Programme d'apporteurs d'affaires et récompenses partenaires." },
];

export const AboutFounder: React.FC<AboutFounderProps> = ({ storeInfo }) => {
  const fs = storeInfo.founderSection ?? {};

  const photoUrl     = fs.photoUrl     || FALLBACK_PHOTO;
  const name         = fs.name         || 'Lizie Fifamè ALLATIN';
  const title        = fs.title        || 'Fondatrice & Directrice Générale — ANONYM';
  const badge        = fs.badge        || 'Directrice Générale & CEO';
  const quote        = fs.quote        || "Inspirée par l'excellence et le prestige royal, Lizie Fifamè ALLATIN dirige ANONYM depuis Abomey-Calavi avec une vision claire...";
  const sectionTitle = fs.sectionTitle || 'La Fondatrice : Lizie Fifamè ALLATIN';
  const paragraph    = fs.paragraph    || "Basée à Abomey-Calavi (Zogbadjè, Bénin), ANONYM est une maison béninoise d'excellence dédiée aux bijoux personnalisés, la parfumerie et la conception de coffrets de prestige. Nous traduisons vos émotions, prénoms et dates mémorables en œuvres durables.";
  const commitments  = (fs.commitments && fs.commitments.length > 0) ? fs.commitments : DEFAULT_COMMITMENTS;

  return (
    <section id="about" className="py-20 bg-[#F0EDE7] relative border-b border-[#D4AF37]/20 overflow-hidden">
      {/* Background Subtle Floating Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#B8935F]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A160C] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>À Propos d'ANONYM</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight"
          >
            L'Histoire &amp; La Direction
            <span className="block text-2xl sm:text-3xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA771C] mt-2">
              « L'art de se démarquer »
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Single Founder Photo with Direct Inline Replacement */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 p-2 bg-white shadow-[0_4px_40px_rgba(212,175,55,0.15)]"
            >
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden bg-black">

                {/* Editable Founder Photo */}
                <EditableImage
                  path="founderSection.photoUrl"
                  src={photoUrl}
                  defaultSrc={FALLBACK_PHOTO}
                  alt={name}
                  className="w-full h-full object-cover object-top filter saturate-[1.05]"
                  label="Photo de la Fondatrice"
                />

                {/* Dark Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none z-10" />

                {/* Badge */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold">
                  <EditableText
                    path="founderSection.badge"
                    value={badge}
                    defaultValue="Directrice Générale & CEO"
                    label="Badge Rôle"
                  />
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-2xl bg-black/85 backdrop-blur-md border border-[#D4AF37]/40 text-center space-y-1 shadow-xl">
                  <span className="font-serif font-bold text-base sm:text-lg text-[#F3E5AB] block">
                    <EditableText
                      path="founderSection.name"
                      value={name}
                      defaultValue="Lizie Fifamè ALLATIN"
                      label="Nom de la Fondatrice"
                    />
                  </span>
                  <span className="text-xs font-sans text-amber-200/90 block">
                    <EditableText
                      path="founderSection.title"
                      value={title}
                      defaultValue="Fondatrice & Directrice Générale — ANONYM"
                      label="Titre & Fonction"
                    />
                  </span>
                  <div className="text-[11px] text-gray-300 font-sans italic line-clamp-3 pt-1 border-t border-gray-800/80 mt-1">
                    <EditableText
                      path="founderSection.quote"
                      value={quote}
                      defaultValue="Inspirée par l'excellence et le prestige royal..."
                      multiline={true}
                      label="Citation Fondatrice"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Detailed Brand Presentation & Commitments */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-center"
            >
              <div className="text-center">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 text-center">
                  <EditableText
                    path="founderSection.sectionTitle"
                    value={sectionTitle}
                    defaultValue="La Fondatrice : Lizie Fifamè ALLATIN"
                    label="Titre de la section À Propos"
                  />
                </h3>
                <div className="text-gray-700 font-sans text-sm sm:text-base leading-relaxed text-center max-w-xl mx-auto">
                  <EditableText
                    path="founderSection.paragraph"
                    value={paragraph}
                    defaultValue="Basée à Abomey-Calavi (Zogbadjè, Bénin), ANONYM est une maison béninoise d'excellence dédiée aux bijoux personnalisés..."
                    multiline={true}
                    label="Biographie / Présentation"
                  />
                </div>
              </div>

              {/* Brand Values Banner */}
              <div className="p-4 rounded-2xl bg-[#12100A] border border-[#D4AF37]/40 flex flex-wrap items-center justify-around gap-4 text-center shadow-lg">
                {storeInfo.values.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                    <span className="font-serif font-bold tracking-widest text-[#F3E5AB] uppercase text-xs sm:text-sm">
                      {val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Catalog Official Commitments */}
              <div className="space-y-3 pt-2">
                <h4 className="text-base font-serif font-semibold text-[#D4AF37] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  <span>Engagements &amp; Informations du Catalogue Officiel</span>
                </h4>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700">
                  {commitments.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-200 hover:border-[#D4AF37]/30 transition-all">
                      <CommitmentIcon icon={c.icon} />
                      <span>
                        <strong className="text-gray-900">
                          <EditableText
                            path={`founderSection.commitments.${idx}.label`}
                            value={c.label}
                            defaultValue={c.label}
                            label={`Engagement #${idx + 1} Titre`}
                          />
                        </strong>{' '}
                        <EditableText
                          path={`founderSection.commitments.${idx}.text`}
                          value={c.text}
                          defaultValue={c.text}
                          label={`Engagement #${idx + 1} Texte`}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Registrations & Official Payment Box */}
              <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <EditableText path="pageTexts.about.paymentLabel" value={storeInfo.pageTexts?.about?.paymentLabel} defaultValue="Paiements & Transferts de Validation :" as="span" className="text-xs text-gray-500 block" label="Label Paiements" />
                    <span className="font-mono font-bold text-[#1A0F0A] text-sm">
                      <EditableText path="phone1" value={storeInfo.phone1} defaultValue="+229 01 97 00 00" as="span" label="Téléphone 1" /> / <EditableText path="phone2" value={storeInfo.phone2} defaultValue="+229 01 96 00 00" as="span" label="Téléphone 2" />
                    </span>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                      RCCM: <EditableText path="rccm" value={storeInfo.rccm} defaultValue="RB/ABC/..." as="span" label="RCCM" /> | IFU: <EditableText path="ifu" value={storeInfo.ifu} defaultValue="020..." as="span" label="IFU" />
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <CrownLogo size="sm" showText={false} />
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
