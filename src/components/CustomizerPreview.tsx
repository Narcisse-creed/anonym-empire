import React, { useState, useRef, useEffect } from 'react';
import { StoreInfo, MetalFinish } from '../types';
import { Sparkles, MessageCircle, Copy, Check, Eye, Download, Bot, RefreshCw, Upload, Image as ImageIcon, Move, RotateCw, ZoomIn, Layers, ShieldCheck, Box, Tag } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/helpers';
import { generateAIEngravingPreview, analyzeLogoPackagingPlacement, AIEngravingAnalysis, AILogoPlacementSuggestion } from '../utils/aiEngravingSimulator';
import { motion, AnimatePresence } from 'motion/react';

interface CustomizerPreviewProps {
  storeInfo: StoreInfo;
}

type EngravingEffect = 'laser-deep' | 'relief-gold' | 'sparkle-diamond';
type StudioTab = 'engraving-3d' | 'logo-packaging';

interface ItemSupportConfig {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  shape: 'necklace' | 'dogtag' | 'bangle' | 'ring' | 'bottle' | 'keychain';
}

interface PackagingPreset {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export const CustomizerPreview: React.FC<CustomizerPreviewProps> = ({ storeInfo }) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('engraving-3d');

  // --- TAB 1: 3D ENGRAVING STATE ---
  const [customText, setCustomText] = useState('Kimberly');
  const [selectedFont, setSelectedFont] = useState<string>('cursive-royale');
  const [selectedFinish, setSelectedFinish] = useState<MetalFinish>('or-jaune');
  const [selectedSupportId, setSelectedSupportId] = useState<string>('necklace');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('👑');
  const [engravingEffect, setEngravingEffect] = useState<EngravingEffect>('laser-deep');
  
  const [copied, setCopied] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIEngravingAnalysis | null>(null);

  // Mouse lighting reflection
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const previewBoxRef = useRef<HTMLDivElement>(null);

  // --- TAB 2: LOGO INCRUSTATION & PACKAGING STATE ---
  const [selectedPackagingId, setSelectedPackagingId] = useState<string>('box-royale');
  const [customProductImage, setCustomProductImage] = useState<string | null>(null);
  const [customLogoImage, setCustomLogoImage] = useState<string | null>('/images/logo-anonym-empire-transparent.png');
  const [logoInscriptionText, setLogoInscriptionText] = useState('ANONYM');
  
  // Logo transform state (X, Y in %, scale, rotation, opacity, blend)
  const [logoX, setLogoX] = useState<number>(50);
  const [logoY, setLogoY] = useState<number>(45);
  const [logoScale, setLogoScale] = useState<number>(100);
  const [logoRotate, setLogoRotate] = useState<number>(0);
  const [logoOpacity, setLogoOpacity] = useState<number>(100);
  const [printEffect, setPrintEffect] = useState<'gold-foil' | 'uv-white' | 'laser-engraved' | 'silver-foil'>('gold-foil');

  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isPackagingAiLoading, setIsPackagingAiLoading] = useState(false);
  const [packagingAiSuggestion, setPackagingAiSuggestion] = useState<AILogoPlacementSuggestion | null>(null);

  const packagingCanvasRef = useRef<HTMLCanvasElement>(null);

  const supports: ItemSupportConfig[] = [
    { id: 'necklace', name: 'Collier Prénom Sur-Mesure', category: 'Bijoux', subtitle: 'Pendentif découpé & chaîne gourmette fine 316L', shape: 'necklace' },
    { id: 'dogtag', name: 'Plaque Militaire Homme King', category: 'Homme & Prestige', subtitle: 'Plaque biseautée brossée & chaîne boules', shape: 'dogtag' },
    { id: 'bangle', name: 'Bracelet Jonc Rigide Gravé', category: 'Bracelets', subtitle: 'Jonc d’exception avec gravure intérieure ou extérieure', shape: 'bangle' },
    { id: 'ring', name: 'Bague Impériale Cursive', category: 'Bagues', subtitle: 'Anneau poli miroir sur-mesure', shape: 'ring' },
    { id: 'bottle', name: 'Gourde Isotherme Prestige', category: 'Accessoires', subtitle: 'Gourde inox mat & détails métalliques gravés', shape: 'bottle' },
    { id: 'keychain', name: 'Porte-Clés Cuir & Médaille', category: 'Accessoires', subtitle: 'Médaille en métal noble & lanière cuir véritable', shape: 'keychain' },
  ];

  const packagingPresets: PackagingPreset[] = [
    { id: 'box-royale', name: 'Coffret Cadeau Noir & Or', imageUrl: '/images/logo-anonym-empire.jpg', description: 'Coffret d’emballage luxe rigide velours noir' },
    { id: 'ceo-office', name: 'Présentoir Bijouterie CEO', imageUrl: '/images/lizie-office-ceo.jpg', description: 'Présentoir vitrine et bijouterie officielle' },
    { id: 'white-suit', name: 'Mannequin & Collier Porté', imageUrl: '/images/lizie-white-suit.jpg', description: 'Mise en situation collier / bijou porté' },
    { id: 'black-suit', name: 'Packaging Signature Étoile', imageUrl: '/images/lizie-black-outfit.jpg', description: 'Écrin signature ANONYM' },
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
      svgColor: '#D4AF37',
    },
    {
      id: 'argent-massif' as MetalFinish,
      name: 'Argent Massif 925',
      badge: 'Chrome Platine',
      bgGradient: 'from-[#FFFFFF] via-[#CBD5E1] to-[#64748B]',
      metalBg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #090D16 100%)',
      textColor: '#E2E8F0',
      borderColor: '#CBD5E1',
      svgColor: '#E2E8F0',
    },
    {
      id: 'or-rose' as MetalFinish,
      name: 'Or Rose Flamboyant',
      badge: 'Champagne Rose',
      bgGradient: 'from-[#FFE4E6] via-[#F472B6] to-[#9D174D]',
      metalBg: 'linear-gradient(135deg, #1F0D15 0%, #2D1420 50%, #14080E 100%)',
      textColor: '#FBCFE8',
      borderColor: '#F472B6',
      svgColor: '#F472B6',
    },
    {
      id: 'noir-mat' as MetalFinish,
      name: 'Noir Mat / Gunmetal',
      badge: 'Laser Contrasté',
      bgGradient: 'from-[#6B7280] via-[#1F2937] to-[#030712]',
      metalBg: 'linear-gradient(135deg, #0A0A0A 0%, #171717 50%, #050505 100%)',
      textColor: '#F3E5AB',
      borderColor: '#4B5563',
      svgColor: '#9CA3AF',
    },
  ];

  const activeFinishObj = finishes.find((f) => f.id === selectedFinish) || finishes[0];
  const activeFontObj = fontStyles.find((f) => f.id === selectedFont) || fontStyles[0];
  const activeSupport = supports.find((s) => s.id === selectedSupportId) || supports[0];
  const activePresetPackaging = packagingPresets.find((p) => p.id === selectedPackagingId) || packagingPresets[0];

  const activeProductImage = customProductImage || activePresetPackaging.imageUrl;
  const fullTextToEngrave = `${customText} ${selectedSymbol}`.trim();

  // Mouse move reflection
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewBoxRef.current) return;
    const rect = previewBoxRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(fullTextToEngrave);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run AI analysis for 3D Engraving
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

  // Run AI analysis for Packaging Logo Placement
  const handleRunPackagingAiAnalysis = async () => {
    setIsPackagingAiLoading(true);
    try {
      const res = await analyzeLogoPackagingPlacement(
        activePresetPackaging.name,
        customLogoImage ? 'Logo Personnalisé Client' : 'Logo ANONYM',
        logoInscriptionText,
        activeProductImage
      );
      setPackagingAiSuggestion(res);
    } catch (err) {
      console.error('Packaging AI Error', err);
    } finally {
      setIsPackagingAiLoading(false);
    }
  };

   // AI analysis is now triggered only by explicit user action,
   // not automatically on text change, to avoid unwanted API calls.

  // Handle custom product/packaging image upload
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomProductImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle custom logo upload
  const handleLogoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomLogoImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw Packaging Composite Canvas
  useEffect(() => {
    if (activeTab !== 'logo-packaging') return;
    const canvas = packagingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 700;

    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';
    baseImg.src = activeProductImage;

    baseImg.onload = () => {
      ctx.clearRect(0, 0, 1000, 700);

      // Draw background product/packaging image
      ctx.drawImage(baseImg, 0, 0, 1000, 700);

      // Dark vignette overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, 1000, 700);

      // Save context state for logo & text transform
      ctx.save();

      const posX = (logoX / 100) * 1000;
      const posY = (logoY / 100) * 700;

      ctx.translate(posX, posY);
      ctx.rotate((logoRotate * Math.PI) / 180);
      ctx.globalAlpha = logoOpacity / 100;

      // Draw Logo if loaded
      if (customLogoImage) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.src = customLogoImage;
        logoImg.onload = () => {
          const size = (logoScale / 100) * 220;
          
          if (printEffect === 'gold-foil') {
            ctx.shadowColor = '#D4AF37';
            ctx.shadowBlur = 15;
          } else if (printEffect === 'silver-foil') {
            ctx.shadowColor = '#E2E8F0';
            ctx.shadowBlur = 15;
          } else if (printEffect === 'uv-white') {
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 10;
          }

          ctx.drawImage(logoImg, -size / 2, -size / 2, size, size);

          // Draw Text under logo
          if (logoInscriptionText.trim()) {
            ctx.shadowBlur = 5;
            if (printEffect === 'gold-foil') ctx.fillStyle = '#F5D77F';
            else if (printEffect === 'silver-foil') ctx.fillStyle = '#FFFFFF';
            else if (printEffect === 'uv-white') ctx.fillStyle = '#FFFFFF';
            else ctx.fillStyle = '#111827';

            ctx.font = 'bold 28px serif';
            ctx.textAlign = 'center';
            ctx.fillText(logoInscriptionText, 0, size / 2 + 35);
          }

          ctx.restore();
        };
      } else {
        // Text only
        if (logoInscriptionText.trim()) {
          if (printEffect === 'gold-foil') ctx.fillStyle = '#F5D77F';
          else ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 36px serif';
          ctx.textAlign = 'center';
          ctx.fillText(logoInscriptionText, 0, 0);
        }
        ctx.restore();
      }
    };
  }, [activeTab, activeProductImage, customLogoImage, logoInscriptionText, logoX, logoY, logoScale, logoRotate, logoOpacity, printEffect]);

  // Handle Dragging Logo on Preview
  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingLogo || activeTab !== 'logo-packaging') return;
    const stage = e.currentTarget.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - stage.left) / stage.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - stage.top) / stage.height) * 100));
    setLogoX(Math.round(x));
    setLogoY(Math.round(y));
  };

  // WhatsApp Message for Logo Incrustation Order
  const whatsappPackagingMessage = `Bonjour *ANONYM*,\n\nJe souhaite faire personnaliser des emballages / coffrets avec l'incrustation de logo suivante :\n\n📦 *Support/Emballage :* ${activePresetPackaging.name}\n✍️ *Texte/Marque :* "${logoInscriptionText}"\n✨ *Finition d'impression :* ${printEffect}\n\nPouvez-vous me transmettre un devis pour la fabrication sur-mesure ? Merci !`;

  // Download High-Res Snapshot function
  const handleDownloadPackagingSnapshot = () => {
    const canvas = packagingCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Packaging-Logo-ANONYM-${logoInscriptionText || 'Custom'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
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
            <span>Studio de Gravure 3D & Incrustation Logo IA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
            Visualisez Vos Produits & Emballages
            <span className="block text-xl sm:text-3xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA771C] mt-2">
              « Gravure sur-mesure & Incrustation Logo par IA »
            </span>
          </h2>
        </div>

        {/* Studio Mode Tabs Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#121212] p-1.5 rounded-2xl border border-[#D4AF37]/40 flex items-center gap-2 shadow-xl">
            <button
              onClick={() => setActiveTab('engraving-3d')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'engraving-3d'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>1. Gravure Bijoux 3D</span>
            </button>

            <button
              onClick={() => setActiveTab('logo-packaging')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'logo-packaging'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>2. Incrustation Logo IA (Emballages)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: 3D METAL ENGRAVING SIMULATOR */}
        {activeTab === 'engraving-3d' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-6 bg-[#101010] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-2xl backdrop-blur-md">
              
              {/* Text & Symbol Input */}
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
                    <span>Analyse & Rendu Joaillerie Gemini IA</span>
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
        )}

        {/* TAB 2: INCRUSTATION LOGO & EMBALLAGES PAR IA */}
        {activeTab === 'logo-packaging' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-6 bg-[#101010] p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/30 shadow-2xl backdrop-blur-md">
              
              {/* 1. Select / Upload Packaging Image */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center justify-between">
                  <span>1. Photo Produit / Emballage</span>
                  <span className="text-[10px] text-amber-200 font-mono">Modèles ou Import</span>
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                  {packagingPresets.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackagingId(pkg.id);
                        setCustomProductImage(null);
                      }}
                      className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        selectedPackagingId === pkg.id && !customProductImage
                          ? 'border-[#D4AF37] bg-[#1E190D] text-white shadow-md'
                          : 'border-gray-800 bg-black/60 text-gray-400'
                      }`}
                    >
                      <img src={pkg.imageUrl} alt={pkg.name} className="w-10 h-10 rounded-xl object-cover" />
                      <span className="text-xs font-bold truncate">{pkg.name}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Photo Upload Input */}
                <div className="pt-2">
                  <label className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-[#D4AF37]/60 bg-[#16130B] hover:bg-[#201C11] text-amber-200 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>{customProductImage ? '✓ Photo Importée (Modifier)' : '📷 Importer ma propre photo de produit/emballage'}</span>
                    <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* 2. Logo & Inscription Input */}
              <div className="space-y-3 pt-3 border-t border-gray-800/80">
                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  2. Logo & Texte à Imprimer
                </label>
                
                {/* Logo Upload */}
                <label className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-gray-800 bg-black/60 hover:border-[#D4AF37] text-gray-300 text-xs cursor-pointer transition-all">
                  <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                  <span>{customLogoImage ? '✓ Logo Sélectionné (Changer)' : 'Importer le fichier Logo (PNG/JPG)'}</span>
                  <input type="file" accept="image/*" onChange={handleLogoImageUpload} className="hidden" />
                </label>

                {/* Text Inscription */}
                <input
                  type="text"
                  value={logoInscriptionText}
                  onChange={(e) => setLogoInscriptionText(e.target.value)}
                  placeholder="Inscription sur emballage (Ex: ANONYM)..."
                  className="w-full bg-black/80 border border-[#D4AF37]/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* 3. Logo Controls (Scale, Rotation, Opacity, Position) */}
              <div className="space-y-4 pt-3 border-t border-gray-800/80">
                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1">
                  <Move className="w-3.5 h-3.5" />
                  <span>3. Ajustement & Positionnement du Logo</span>
                </label>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-1">Taille Logo : {logoScale}%</span>
                    <input
                      type="range"
                      min={20}
                      max={200}
                      value={logoScale}
                      onChange={(e) => setLogoScale(Number(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <span className="text-gray-400 block mb-1">Rotation : {logoRotate}°</span>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      value={logoRotate}
                      onChange={(e) => setLogoRotate(Number(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <span className="text-gray-400 block mb-1">Position Horiz. (X) : {logoX}%</span>
                    <input
                      type="range"
                      min={5}
                      max={95}
                      value={logoX}
                      onChange={(e) => setLogoX(Number(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <span className="text-gray-400 block mb-1">Position Vert. (Y) : {logoY}%</span>
                    <input
                      type="range"
                      min={5}
                      max={95}
                      value={logoY}
                      onChange={(e) => setLogoY(Number(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Print Finish Effect */}
              <div className="space-y-2 pt-3 border-t border-gray-800/80">
                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  4. Technique d'Impression sur Emballage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPrintEffect('gold-foil')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      printEffect === 'gold-foil' ? 'border-[#D4AF37] bg-[#241D0D] text-amber-200' : 'border-gray-800 bg-black/50 text-gray-400'
                    }`}
                  >
                    ✨ Dorure à Chaud Or 18K
                  </button>
                  <button
                    onClick={() => setPrintEffect('silver-foil')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      printEffect === 'silver-foil' ? 'border-[#D4AF37] bg-[#241D0D] text-amber-200' : 'border-gray-800 bg-black/50 text-gray-400'
                    }`}
                  >
                    💎 Argent Chrome Metallisé
                  </button>
                  <button
                    onClick={() => setPrintEffect('uv-white')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      printEffect === 'uv-white' ? 'border-[#D4AF37] bg-[#241D0D] text-amber-200' : 'border-gray-800 bg-black/50 text-gray-400'
                    }`}
                  >
                    ⚪ Sérigraphie UV Blanche
                  </button>
                  <button
                    onClick={() => setPrintEffect('laser-engraved')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      printEffect === 'laser-engraved' ? 'border-[#D4AF37] bg-[#241D0D] text-amber-200' : 'border-gray-800 bg-black/50 text-gray-400'
                    }`}
                  >
                    🔪 Gravure Laser Noir Biseauté
                  </button>
                </div>
              </div>

            </div>

            {/* Right Interactive Canvas Preview Stage (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div
                onPointerMove={handleStagePointerMove}
                onPointerDown={() => setIsDraggingLogo(true)}
                onPointerUp={() => setIsDraggingLogo(false)}
                className="relative rounded-3xl border-2 border-[#D4AF37]/50 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-black group"
              >
                {/* Canvas Render */}
                <canvas ref={packagingCanvasRef} className="w-full h-[460px] object-cover block cursor-move" />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>INCRUSTATION IA — ANONYM</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-gray-800 flex justify-between items-center text-xs">
                  <span className="text-gray-300">💡 Glissez avec la souris/doigt sur la photo pour ajuster le logo</span>
                  <span className="text-[#D4AF37] font-mono">{printEffect}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleDownloadPackagingSnapshot}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C1A14] hover:bg-[#2A261A] text-amber-200 border border-[#D4AF37]/40 px-5 py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  <span>Exporter la Photo Haute Définition</span>
                </button>

                <a
                  href={buildWhatsAppLink(storeInfo.whatsappNumber, whatsappPackagingMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs tracking-wider uppercase px-7 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all transform hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Commander cet Emballage sur WhatsApp</span>
                </a>
              </div>

              {/* Gemini AI Packaging Placement Critique */}
              <div className="bg-[#12100B] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-[#D4AF37]">
                  <div className="flex items-center gap-2 font-bold font-serif">
                    <Bot className="w-5 h-5 animate-bounce" />
                    <span>Analyse IA Gemini : Placement Logo & Impression Emballage</span>
                  </div>

                  <button
                    onClick={handleRunPackagingAiAnalysis}
                    disabled={isPackagingAiLoading}
                    className="p-2 rounded-xl bg-black/60 border border-gray-700 text-gray-300 hover:text-[#D4AF37]"
                  >
                    <RefreshCw className={`w-4 h-4 ${isPackagingAiLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {isPackagingAiLoading ? (
                  <div className="py-4 text-center text-xs text-gray-400 font-sans animate-pulse">
                    ✨ Gemini analyse l'image de l'emballage, le centrage et la lumière d'incrustation...
                  </div>
                ) : packagingAiSuggestion ? (
                  <div className="space-y-2 text-xs text-gray-300 font-sans">
                    <div className="bg-black/60 p-3 rounded-xl border border-gray-800">
                      <span className="font-bold text-[#F3E5AB] block mb-1">📍 Positionnement Recommandé :</span>
                      <p>{packagingAiSuggestion.placementAdvice}</p>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-gray-800">
                      <span className="font-bold text-[#D4AF37] block mb-1">✨ Technique d'Impression :</span>
                      <p>{packagingAiSuggestion.printTechnique}</p>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-gray-800">
                      <span className="font-bold text-emerald-400 block mb-1">👑 Critique du Coffret :</span>
                      <p>{packagingAiSuggestion.packagingCritique}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    Cliquez sur l'icône de rafraîchissement ci-dessus pour obtenir l'analyse IA de votre incrustation de logo sur emballage.
                  </p>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
