import { AnalyticsData, CartItem, Collection, Notification, Order, Product, QuoteRequest, RealisationCollection, Review, StoreInfo, SubCategoryLevel1, SubCategoryLevel2 } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_COLLECTIONS } from '../data/collections';
import { STORE_INFO } from '../data/storeInfo';

const PRODUCTS_STORAGE_KEY = 'anonym_catalog_products_v1';
const STORE_INFO_STORAGE_KEY = 'anonym_store_info_v1';
const COLLECTIONS_STORAGE_KEY = 'anonym_collections_v1';
const REVIEWS_STORAGE_KEY = 'anonym_reviews_v1';
const NOTIFICATIONS_STORAGE_KEY = 'anonym_notifications_v1';
const QUOTE_REQUESTS_STORAGE_KEY = 'anonym_quote_requests_v1';
const ORDERS_STORAGE_KEY = 'anonym_orders_v1';
const ANALYTICS_STORAGE_KEY = 'anonym_analytics_v1';
const ADMIN_PASSWORD_STORAGE_KEY = 'anonym_admin_password_v1';
const REALISATIONS_STORAGE_KEY = 'anonym_realisations_v1';

export function formatPriceFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(amount) + ' FCFA';
}

export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateSingleProductWhatsAppMsg(product: Product, customizationNotes?: string, metalFinish?: string, selectedColor?: string, customText?: string, quantity: number = 1): string {
  let msg = `Bonjour *ANONYM*,\n\nJe souhaite commander le produit suivant :\n\n`;
  msg += `📌 *Produit :* ${product.name}\n🔢 *Référence :* ${product.refCode}\n💰 *Prix :* ${formatPriceFCFA(product.price)}${product.priceVariable ? ' (variable)' : ''}\n📦 *Quantité :* ${quantity}\n`;
  if (product.availability) {
    const availMap: Record<string, string> = { 'disponible': '🟢 Disponible', 'en-arrivage': '🟡 En cours d’arrivage', 'epuise': '🔴 Épuisé' };
    msg += `📊 *Statut :* ${availMap[product.availability] || product.availability}\n`;
  }
  if (product.deliveryDelay) msg += `⏱ *Délai estimé :* ${product.deliveryDelay}\n`;
  if (metalFinish) msg += `✨ *Finition :* ${metalFinish}\n`;
  if (selectedColor) msg += `🎨 *Couleur :* ${selectedColor}\n`;
  if (customizationNotes?.trim()) msg += `✍️ *Personnalisation :* ${customizationNotes.trim()}\n`;
  if (customText?.trim()) msg += `💬 *Texte à graver/imprimer :* ${customText.trim()}\n`;
  msg += `\nMerci de me confirmer les détails pour valider ma commande. 🙏\n« L'art de se démarquer »`;
  return msg;
}

export function generateQuoteWhatsAppMsg(productType: string, description: string, quantity: number, budget?: string, deadline?: string, contactName?: string): string {
  let msg = `Bonjour *ANONYM*,\n\nJe souhaite faire une demande de devis sur mesure :\n\n📂 *Type de produit :* ${productType}\n📝 *Description du projet :* ${description}\n📦 *Quantité souhaitée :* ${quantity}\n`;
  if (budget) msg += `💰 *Budget approximatif :* ${budget}\n`;
  if (deadline) msg += `📅 *Date souhaitée :* ${deadline}\n`;
  if (contactName) msg += `👤 *Nom :* ${contactName}\n`;
  msg += `\nMerci de me recontacter pour discuter du projet. 🙏`;
  return msg;
}

export function generateCartWhatsAppMsg(items: CartItem[], storeInfo: StoreInfo): string {
  let total = 0;
  let msg = `Bonjour *${storeInfo.fullName}*,\n\nJe souhaite passer une commande :\n\n`;
  items.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    total += itemTotal;
    msg += `${index+1}. *${item.product.name}* (Réf #${item.product.refCode})\n   - Quantité : ${item.quantity}\n   - Prix unitaire : ${formatPriceFCFA(item.product.price)}\n`;
    if (item.metalFinish) msg += `   - Finition : ${item.metalFinish}\n`;
    if (item.selectedColor) msg += `   - Couleur : ${item.selectedColor}\n`;
    if (item.engravingText) msg += `   - Gravure : "${item.engravingText}"\n`;
    if (item.customText) msg += `   - Texte : "${item.customText}"\n`;
    if (item.specialNotes) msg += `   - Notes : "${item.specialNotes}"\n`;
    msg += `\n`;
  });
  msg += `💵 *Total estimé :* ${formatPriceFCFA(total)}\n\n📍 *Livraison :* À préciser\nMerci de me contacter pour valider et finaliser ma commande.`;
  return msg;
}

export function loadProducts(): Product[] {
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (data) { const parsed = JSON.parse(data); if (Array.isArray(parsed) && parsed.length > 0) return parsed; }
  } catch (err) { console.warn('Failed to load products from localStorage', err); }
  return INITIAL_PRODUCTS;
}

export function saveProducts(products: Product[]): void {
  try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products)); }
  catch (err) { console.error('Failed to save products to localStorage', err); }
}

export function loadStoreInfo(): StoreInfo {
  try {
    const data = localStorage.getItem(STORE_INFO_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...STORE_INFO,
        ...parsed,
        pageTexts: { ...STORE_INFO.pageTexts, ...(parsed.pageTexts || {}) },
        founderSection: { ...STORE_INFO.founderSection, ...(parsed.founderSection || {}) },
      };
    }
  } catch (err) { console.warn('Failed to load store info from localStorage', err); }
  return STORE_INFO;
}

export function saveStoreInfo(info: StoreInfo): void {
  try { localStorage.setItem(STORE_INFO_STORAGE_KEY, JSON.stringify(info)); }
  catch (err) { console.error('Failed to save store info to localStorage', err); }
}

export function loadCollections(): Collection[] {
  try {
    const data = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) { console.warn('Failed to load collections from localStorage', err); }
  return INITIAL_COLLECTIONS;
}

export function saveCollections(collections: Collection[]): void {
  try { localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections)); }
  catch (err) { console.error('Failed to save collections to localStorage', err); }
}

export function loadReviews(): Review[] {
  try { const data = localStorage.getItem(REVIEWS_STORAGE_KEY); if (data) return JSON.parse(data); }
  catch (err) { console.warn('Failed to load reviews from localStorage', err); }
  return [];
}

export function saveReviews(reviews: Review[]): void {
  try { localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews)); }
  catch (err) { console.error('Failed to save reviews to localStorage', err); }
}

export function loadNotifications(): Notification[] {
  try { const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY); if (data) return JSON.parse(data); }
  catch (err) { console.warn('Failed to load notifications from localStorage', err); }
  return [];
}

export function saveNotifications(notifications: Notification[]): void {
  try { localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications)); }
  catch (err) { console.error('Failed to save notifications to localStorage', err); }
}

export function loadQuoteRequests(): QuoteRequest[] {
  try { const data = localStorage.getItem(QUOTE_REQUESTS_STORAGE_KEY); if (data) return JSON.parse(data); }
  catch (err) { console.warn('Failed to load quote requests from localStorage', err); }
  return [];
}

export function saveQuoteRequests(requests: QuoteRequest[]): void {
  try { localStorage.setItem(QUOTE_REQUESTS_STORAGE_KEY, JSON.stringify(requests)); }
  catch (err) { console.error('Failed to save quote requests to localStorage', err); }
}

export function loadOrders(): Order[] {
  try { const data = localStorage.getItem(ORDERS_STORAGE_KEY); if (data) return JSON.parse(data); }
  catch (err) { console.warn('Failed to load orders from localStorage', err); }
  return [];
}

export function saveOrders(orders: Order[]): void {
  try { localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders)); }
  catch (err) { console.error('Failed to save orders to localStorage', err); }
}

export function loadAnalytics(): AnalyticsData {
  try {
    const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        productViews: parsed.productViews || {},
        favorites: parsed.favorites || {},
        totalOrders: parsed.totalOrders || 0,
        totalRevenue: parsed.totalRevenue || 0,
        updatedAt: parsed.updatedAt || new Date().toISOString(),
        visitorLogs: parsed.visitorLogs || [],
        totalVisits: parsed.totalVisits || (parsed.visitorLogs ? parsed.visitorLogs.length : 0),
      };
    }
  } catch (err) {
    console.warn('Failed to load analytics from localStorage', err);
  }
  return {
    productViews: {},
    favorites: {},
    totalOrders: 0,
    totalRevenue: 0,
    updatedAt: new Date().toISOString(),
    visitorLogs: [],
    totalVisits: 0,
  };
}

export function saveAnalytics(analytics: AnalyticsData): void {
  try { localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics)); }
  catch (err) { console.error('Failed to save analytics to localStorage', err); }
}

export function loadAdminPassword(): string {
  try {
    const data = localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY);
    if (data) return data;
  } catch (err) { console.warn('Failed to load admin password from localStorage', err); }
  return 'anonym2026';
}

export function saveAdminPassword(password: string): void {
  try { localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, password); }
  catch (err) { console.error('Failed to save admin password to localStorage', err); }
}

const ADMIN_LOGGED_IN_KEY = 'anonym_admin_logged_in_v1';

export function loadIsAdminLoggedIn(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_LOGGED_IN_KEY) === 'true';
  } catch (err) {
    return false;
  }
}

export function saveIsAdminLoggedIn(loggedIn: boolean): void {
  try {
    if (loggedIn) {
      sessionStorage.setItem(ADMIN_LOGGED_IN_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_LOGGED_IN_KEY);
    }
  } catch (err) {
    console.error('Failed to save admin login state to sessionStorage', err);
  }
}

const SUBCATS_LVL1_STORAGE_KEY = 'anonym_subcategories_lvl1_v1';
const SUBCATS_LVL2_STORAGE_KEY = 'anonym_subcategories_lvl2_v1';

import { INITIAL_SUBCATEGORIES_LVL1, INITIAL_SUBCATEGORIES_LVL2 } from '../data/categoriesData';

export function loadSubCategoriesLvl1(): SubCategoryLevel1[] {
  try {
    const data = localStorage.getItem(SUBCATS_LVL1_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.warn('Failed to load subcategories lvl1 from localStorage', err);
  }
  return INITIAL_SUBCATEGORIES_LVL1;
}

export function saveSubCategoriesLvl1(list: SubCategoryLevel1[]): void {
  try {
    localStorage.setItem(SUBCATS_LVL1_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save subcategories lvl1 to localStorage', err);
  }
}

export function loadSubCategoriesLvl2(): SubCategoryLevel2[] {
  try {
    const data = localStorage.getItem(SUBCATS_LVL2_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.warn('Failed to load subcategories lvl2 from localStorage', err);
  }
  return INITIAL_SUBCATEGORIES_LVL2;
}

export function saveSubCategoriesLvl2(list: SubCategoryLevel2[]): void {
  try {
    localStorage.setItem(SUBCATS_LVL2_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save subcategories lvl2 to localStorage', err);
  }
}

// ── Galerie de Réalisations ────────────────────────────────────────────────

const DEFAULT_REALISATIONS: RealisationCollection[] = [
  { id: 'real-femme',  name: 'Réalisation Femme',   description: 'Bijoux et accessoires pour femmes', photos: [], order: 0, visible: true, createdAt: new Date().toISOString() },
  { id: 'real-homme',  name: 'Réalisation Homme',   description: 'Bijoux et accessoires pour hommes', photos: [], order: 1, visible: true, createdAt: new Date().toISOString() },
  { id: 'real-autres', name: 'Autres réalisations', description: 'Emballages, accessoires personnalisés et autres créations', photos: [], order: 2, visible: true, createdAt: new Date().toISOString() },
];

export function loadRealisations(): RealisationCollection[] {
  try {
    const data = localStorage.getItem(REALISATIONS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load realisations from localStorage', err);
  }
  return DEFAULT_REALISATIONS;
}

export function saveRealisations(realisations: RealisationCollection[]): void {
  try {
    localStorage.setItem(REALISATIONS_STORAGE_KEY, JSON.stringify(realisations));
  } catch (err) {
    console.error('Failed to save realisations to localStorage', err);
  }
}

// ── Utilitaires de validation et d'assainissement des saisies ──────────────

export function sanitizeNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

export function sanitizePhone(value: string): string {
  return value.replace(/[^\d\s+\-()]/g, '');
}

export function isValidEmailFormat(email: string): boolean {
  if (!email) return false;
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

export function isValidPhoneFormat(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 15;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}
