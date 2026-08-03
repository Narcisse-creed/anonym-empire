import React, { useState, useRef } from 'react';
import { StoreInfo, MetalFinish } from '../types';
import { Sparkles, MessageCircle, Copy, Check, Bot, RefreshCw } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/helpers';
import { generateAIEngravingPreview, AIEngravingAnalysis } from '../utils/aiEngravingSimulator';

interface CustomizerPreviewProps {
  storeInfo: StoreInfo;
}

type EngravingEffect = 'laser-deep' | 'relief-gold' | 'sparkle-diamond';

interface ItemSupportConfig {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  shape: 'necklace' | 'dogtag' | 'bangle' | 'ring' | 'bottle' | 'keychain';
}

export const CustomizerPreview: React.FC<CustomizerPreviewProps> = ({ storeInfo }) => {
  // 3D ENGRAVING STATE
  const [customText, setCustomText] = useState('Kimberly');
  const [selectedFont, setSelectedFont] = useState<string>('cursive-royale');
  const [selectedFinish, setSelectedFinish] = useState<MetalFinish>('or-jaune');
  const [selectedSupportId, setSelectedSupportId] = useState<string>('necklace');
  const [selectedSymbol] = useState<string>('👑');
  const [engravingEffect, setEngravingEffect] = useState<EngravingEffect>('laser-deep');

  const [copied, setCopied] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIEngravingAnalysis | null>(null);

  const previewBoxRef = useRef<HTMLDivElement>(null);

  const supports: ItemSupportConfig[] = [
    { id: 'necklace', name: 'Collier Prénom Sur-Mesure', category: 'Bijoux', subtitle: 'Pendentif découpé & chaîne gourmette fine 316L', shape: 'necklace' },
    { id: 'dogtag', name: 'Plaque Militaire Homme King', category: 'Homme & Prestige', subtitle: 'Plaque biseautée brossée & chaîne boules', shape: 'dogtag' },
    { id: 'bangle', name: 'Bracelet Jonc Rigide Gravé', category: 'Bracelets', subtitle: 'Jonc d\'exception avec gravure intérieure ou extérieure', shape: 'bangle' },
    { id: 'ring', name: 'Bague Impériale Cursive', category: 'Bagues', subtitle: 'Anneau poli miroir sur-mesure', shape: 'ring' },
    { id: 'bottle', name: 'Gourde Isotherme Prestige', category: 'Accessoires', subtitle: 'Gourde inox mat & détails métalliques gravés', shape: 'bottle' },
    { id: 'keychain', name: 'Porte-Clés Cuir & Médaille', category: 'Accessoires', subtitle: 'Médaille en métal noble & lanière cuir véritable', shape: 'keychain' },
  ];

  const fontStyles = [
    { id: 'cursive-royale', name: 'Cursive Royale', fontFamily: "'Great Vibes', cursive" },
    { id: 'romain-imperial', name: 'Romain Impérial', fontFamily: "'Cinzel', serif" },
    { id: 'calligraphie-elegante', name: 'Calligraphie Élégante', fontFamily: "'Alex Brush', cursive" },
    { id: 'moderne-bold', name: 'Moderne Bold King', fontFamily: "'Montserrat', sans-serif", fontWeight: '900' },
    { id: 'script-majestueux', name: 'Majestueuse Script', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' },
  ];

  const finishes = [
    {
      id: 'or-jaune' as MetalFinish,
      name: 'Or Jaune 18K',
      badge: 'Finition Royale',
      bgGradient: 'from-[#FFE082] via-[#D4AF37] to-[#8A6D14]',
      metalBg: 'linear-gradient(135deg, #1C170B 0%, #2A2210 50%, #151108 100%)',
      textColor: '#F5D77F',
      borderColor: '#D4AF37',
    },
    {
      id: 'argent-massif' as MetalFinish,
      name: 'Argent Massif 925',
      badge: 'Chrome Platine',
      bgGradient: 'from-[#FFFFFF] via-[#CBD5E1] to-[#64748B]',
      metalBg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #090D16 100%)',
      textColor: '#E2E8F0',
      borderColor: '#CBD5E1',
    },
    {
      id: 'or-rose' as MetalFinish,
      name: 'Or Rose Flamboyant',
      badge: 'Champagne Rose',
      bgGradient: 'from-[#FFE4E6] via-[#F472B6] to-[#9D174D]',
      metalBg: 'linear-gradient(135deg, #1F0D15 0%, #2D1420 50%, #14080E 100%)',
      textColor: '#FBCFE8',
      borderColor: '#F472B6',
    },
    {
      id: 'noir-mat' as MetalFinish,
      name: 'Noir Mat / Gunmetal',
      badge: 'Laser Contrasté',
      bgGradient: 'from-[#6B7280] via-[#1F2937] to-[#030712]',
      metalBg: 'linear-gradient(135deg, #0A0A0A 0%, #171717 50%, #050505 100%)',
      textColor: '#F3E5AB',
      borderColor: '#4B5563',
    },
  ];

  const activeFinishObj = finishes.find((f) => f.id === selectedFinish) || finishes[0];
  const activeFontObj = fontStyles.find((f) => f.id === selectedFont) || fontStyles[0];
  const activeSupport = supports.find((s) => s.id === selectedSupportId) || supports[0];
  const fullTextToEngrave = `${customText} ${selectedSymbol}`.trim();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewBoxRef.current) return;
    // keep for future lighting effects
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(fullTextToEngrave);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAiAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const res = await generateAIEngravingPreview(
        customText,
        activeSupport.name,
        activeFinishObj.name,
        activeFontObj.name,
        selectedSymbol
      );
      setAiAnalysis(res);
    } catch (err) {
      console.error('AI Error', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <section id="customizer" className="py-20 bg-[#060606] text-white relative border-b border-[#D4AF37]/20 overflow-hidden">
      {/* Glow Ambient Lights */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#B8935F]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C180C] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span>Studio de Gravure Bijoux 3D</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
            Simulateur de Gravure
            <span className="block text-xl sm:text-3xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA771C] mt-2">
              « Visualisez votre gravure laser sur-mesure »
            </span>
          </h2>
        </div>

        {/* 3D METAL ENGRAVING SIMULATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Controls */}
          <div className="lg:col-span-5 space-y-6 bg-[#101010] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-2xl backdrop-blur-md">

            {/* Text Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  Prénom ou Inscription à Graver
                </label>
                <span className="text-[11px] font-mono text-gray-400">
                  {customText.length}/24 car.
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={24}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Ex: Kimberly, Shawn, 1997..."
                  className="w-full bg-black/90 border-2 border-[#D4AF37]/50 rounded-2xl px-4 py-3.5 text-white font-serif text-xl focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 shadow-inner"
                />
                <button
                  onClick={handleCopyText}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#D4AF37]"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Product Support Selector */}
            <div className="space-y-2 pt-2 border-t border-gray-800/80">
              <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                Type de Support
              </label>
              <div className="grid grid-cols-2 gap-2">
                {supports.map((sup) => (
                  <button
                    key={sup.id}
                    onClick={() => setSelectedSupportId(sup.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedSupportId === sup.id
                        ? 'border-[#D4AF37] bg-[#1E190D] text-white shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                        : 'border-gray-800 bg-black/60 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <span className="text-xs font-bold font-serif text-amber-100 block">{sup.name}</span>
                    <span className="text-[10px] text-gray-400 font-sans block">{sup.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Metal Finish */}
            <div className="space-y-2 pt-2 border-t border-gray-800/80">
              <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                Finition Métal Nobles
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {finishes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFinish(f.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedFinish === f.id
                        ? 'border-[#D4AF37] bg-[#1E190D] text-white shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        : 'border-gray-800 bg-black/60 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-gradient-to-tr ${f.bgGradient} border border-white/30 shrink-0`} />
                    <span className="text-xs font-bold truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div className="space-y-2 pt-2 border-t border-gray-800/80">
              <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                Style Typographique
              </label>
              <div className="grid grid-cols-1 gap-2">
                {fontStyles.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setSelectedFont(font.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedFont === font.id
                        ? 'border-[#D4AF37] bg-[#1E190D] text-[#F3E5AB]'
                        : 'border-gray-800 bg-black/60 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <span className="text-xs font-sans font-semibold">{font.name}</span>
                    <span style={{ fontFamily: font.fontFamily }} className="text-lg text-amber-200">
                      {customText || 'Kimberly'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Preview Stage */}
          <div className="lg:col-span-7 space-y-6">
            <div
              ref={previewBoxRef}
              onMouseMove={handleMouseMove}
              style={{ background: activeFinishObj.metalBg }}
              className="relative rounded-3xl border-2 border-[#D4AF37]/50 p-6 sm:p-10 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-between min-h-[480px]"
            >
              <div className="flex justify-between items-center relative z-10">
                <span className="text-xs font-mono text-[#D4AF37] bg-black/70 px-3 py-1 rounded-full border border-[#D4AF37]/40">
                  APERÇU 3D GRAVURE LASER
                </span>
                <span className="text-xs font-bold text-amber-200">{activeSupport.name}</span>
              </div>

              <div className="my-12 py-10 px-4 text-center">
                <span
                  className="block text-4xl sm:text-6xl tracking-wide font-medium text-transparent bg-clip-text transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${activeFinishObj.textColor}, #FFFFFF, ${activeFinishObj.textColor})`,
                    fontFamily: activeFontObj.fontFamily,
                    filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.6))',
                  }}
                >
                  {fullTextToEngrave || 'Kimberly'}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-800/80 pt-4">
                <span className="text-xs text-gray-400">Certifié Acier Inoxydable 316L — ANONYM</span>
                <a
                  href={buildWhatsAppLink(storeInfo.whatsappNumber, `Bonjour ANONYM, je souhaite commander la gravure : "${fullTextToEngrave}" sur ${activeSupport.name} en ${activeFinishObj.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Commander sur WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Gemini AI Analysis Card */}
            <div className="bg-[#12100B] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3 text-[#D4AF37]">
                <div className="flex items-center gap-2 font-bold font-serif">
                  <Bot className="w-5 h-5 animate-bounce" />
                  <span>Analyse &amp; Rendu Joaillerie Gemini IA</span>
                </div>
                <button onClick={handleRunAiAnalysis} className="p-2 bg-black/60 rounded-xl border border-gray-800 text-gray-300 hover:text-[#D4AF37]">
                  <RefreshCw className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {aiAnalysis && (
                <p className="text-xs text-gray-300 leading-relaxed bg-black/60 p-3 rounded-xl border border-gray-800">
                  {aiAnalysis.visualDescription}
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
