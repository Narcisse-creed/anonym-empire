import { GoogleGenAI } from '@google/genai';

export interface AIEngravingAnalysis {
  visualDescription: string;
  luxuryCritique: string;
  recommendedFont: string;
  recommendedFinish: string;
  craftsmanshipNote: string;
}

export interface AILogoPlacementSuggestion {
  placementAdvice: string;
  contrastRating: string;
  printTechnique: string;
  packagingCritique: string;
}

export async function generateAIEngravingPreview(
  customText: string,
  itemType: string,
  finishName: string,
  fontName: string,
  symbol: string
): Promise<AIEngravingAnalysis> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return {
      visualDescription: `Rendu haute définition d'un ${itemType} en ${finishName}. Le prénom "${customText}" ${symbol ? `avec le symbole ${symbol}` : ''} est découpé avec une précision laser 3D millimétrique au style ${fontName}.`,
      luxuryCritique: `L'association du matériau ${finishName} avec la typographie ${fontName} crée un contraste spectaculaire. La lumière accroche subtilement les biseaux polis par les artisans ANONYM.`,
      recommendedFont: fontName,
      recommendedFinish: finishName,
      craftsmanshipNote: `Certifié Acier Inoxydable 316L — Garanti 1 an sans noircissement ni altération face à l'eau et aux parfums.`
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Tu es le maître joaillier et directeur créatif de la maison de haute bijouterie 'ANONYM'. 
Analyse et génère une critique visuelle somptueuse et poétique pour le produit sur-mesure suivant :
- Support : ${itemType}
- Inscription/Prénom gravé : "${customText}" ${symbol ? `avec le symbole ${symbol}` : ''}
- Finition métallique : ${finishName}
- Style Calligraphique : ${fontName}

Donne une réponse structurée en JSON valide avec les clés suivantes :
"visualDescription" (Description ultra-réaliste du bijou sous un éclairage studio haute joaillerie),
"luxuryCritique" (Commentaire sur le prestige et l'harmonie esthétique),
"craftsmanshipNote" (Note technique sur la gravure laser et la tenue du matériau 316L).
Format JSON strict uniquement.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      visualDescription: parsed.visualDescription || `Rendu joaillerie d'exception pour "${customText}".`,
      luxuryCritique: parsed.luxuryCritique || `Une harmonie parfaite en ${finishName}.`,
      recommendedFont: fontName,
      recommendedFinish: finishName,
      craftsmanshipNote: parsed.craftsmanshipNote || `Conception sur-mesure de haute précision 316L.`,
    };
  } catch (error) {
    console.warn('Gemini AI call fallback:', error);
    return {
      visualDescription: `Aperçu studio 3D : ${itemType} gravé avec "${customText}" en ${finishName}.`,
      luxuryCritique: `Une finition ${finishName} éclatante sublimée par une gravure haute précision.`,
      recommendedFont: fontName,
      recommendedFinish: finishName,
      craftsmanshipNote: `Acier inoxydable 316L haute durabilité garanti par ANONYM.`,
    };
  }
}

export async function analyzeLogoPackagingPlacement(
  productName: string,
  logoName: string,
  customInscription: string,
  imageBase64?: string
): Promise<AILogoPlacementSuggestion> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return {
      placementAdvice: `Centrage optimal suggéré au tiers supérieur de l'emballage/support pour maximiser la visibilité de la marque ANONYM.`,
      contrastRating: `Excellent contraste visuel (9.8/10) sur la surface noble choisie.`,
      printTechnique: `Recommandation technique : Sérigraphie UV Dorée à chaud ou Marquage à sec avec gaufrage relief 3D.`,
      packagingCritique: `L'incrustation du logo "${logoName}" ${customInscription ? `et de l'inscription "${customInscription}"` : ''} confère une allure de coffret haute couture digne des grandes maisons de luxe.`
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    let contents: any = `Tu es l'expert mondial en packaging de luxe et impression sur emballages de bijouterie pour 'ANONYM'.
Analyse l'incrustation du logo "${logoName}" et du texte "${customInscription}" sur le produit/emballage "${productName}".
Donne un avis au format JSON strict avec les clés :
"placementAdvice" (Conseil de positionnement et centrage),
"contrastRating" (Note et appréciation du contraste visuel),
"printTechnique" (Technique d'impression recommandée : Dorure à chaud, Gravure laser, Sérigraphie UV, Relief),
"packagingCritique" (Appréciation globale du rendu de l'emballage).`;

    if (imageBase64) {
      const mimeType = imageBase64.split(';')[0].split(':')[1] || 'image/png';
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      contents = [
        {
          inlineData: {
            mimeType,
            data: base64Data
          }
        },
        {
          text: `Analyse visuellement cette photo d'emballage/produit et suggère la meilleure incrustation du logo "${logoName}" et de l'inscription "${customInscription}". Format JSON strict avec placementAdvice, contrastRating, printTechnique, packagingCritique.`
        }
      ];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      placementAdvice: parsed.placementAdvice || `Positionnement équilibré au centre de la zone d'impression.`,
      contrastRating: parsed.contrastRating || `Rendu haute définition validé (10/10).`,
      printTechnique: parsed.printTechnique || `Dorure à chaud métallique & Gravure laser 3D.`,
      packagingCritique: parsed.packagingCritique || `Un visuel d'emballage d'exception prêt pour la fabrication.`
    };
  } catch (err) {
    console.warn('Gemini Packaging AI Error:', err);
    return {
      placementAdvice: `Centrage au milieu de l'emballage préconisé par le Studio ANONYM.`,
      contrastRating: `Superbe contraste lumineux sur le matériau support.`,
      printTechnique: `Marquage à chaud or 18K et découpure laser.`,
      packagingCritique: `Rendu personnalisé d'une élégance rare.`
    };
  }
}
