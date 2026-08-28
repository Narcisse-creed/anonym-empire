import React, { useState, useEffect, useCallback } from 'react';
import { StoreInfo, Product, CartItem, CategoryId, Collection, Notification, QuoteRequest, Order, AnalyticsData, Review, RealisationCollection } from './types';
import { STORE_INFO } from './data/storeInfo';
import { INITIAL_PRODUCTS } from './data/products';
import { CheckCircle, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { CrownLogo } from './components/CrownLogo';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { UniverseGrid } from './components/UniverseGrid';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AboutFounder } from './components/AboutFounder';
import { RealisationsGallery } from './components/RealisationsGallery';
import { OrderingRulesSection } from './components/OrderingRulesSection';
import { QuoteRequestSection } from './components/QuoteRequestSection';
import { ContactSection } from './components/ContactSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { SelectionBasketDrawer } from './components/SelectionBasketDrawer';
import { AdminPortalModal } from './components/AdminPortalModal';
import { RoyalBackgroundAnimation } from './components/RoyalBackgroundAnimation';
import { VisualEditorProvider } from './context/VisualEditorContext';
import { VisualEditorToolbar } from './components/editor/VisualEditorToolbar';
import { CustomDynamicSection } from './components/editor/CustomDynamicSection';
import { AddSectionButton } from './components/editor/AddSectionButton';
import {
  loadProducts,
  saveProducts,
  loadStoreInfo,
  saveStoreInfo,
  loadCollections,
  saveCollections,
  loadReviews,
  saveReviews,
  loadNotifications,
  saveNotifications,
  loadQuoteRequests,
  saveQuoteRequests,
  loadOrders,
  saveOrders,
  loadAnalytics,
  saveAnalytics,
  loadIsAdminLoggedIn,
  saveIsAdminLoggedIn,
  loadAdminPassword,
  saveAdminPassword,
  loadSubCategoriesLvl1,
  saveSubCategoriesLvl1,
  loadSubCategoriesLvl2,
  saveSubCategoriesLvl2,
  loadRealisations,
  saveRealisations,
} from './utils/helpers';
import { SubCategoryLevel1, SubCategoryLevel2 } from './types';
import {
  isSupabaseConfigured,
  seedInitialDataIfNeeded,
  fetchStoreInfoFromSupabase,
  saveStoreInfoToSupabase,
  fetchProductsFromSupabase,
  saveSingleProductToSupabase,
  deleteSingleProductFromSupabase,
  saveProductsToSupabase,
  fetchSubCategoriesLvl1FromSupabase,
  saveSingleSubCategoryLvl1ToSupabase,
  deleteSingleSubCategoryLvl1FromSupabase,
  saveSubCategoriesLvl1ToSupabase,
  fetchSubCategoriesLvl2FromSupabase,
  saveSingleSubCategoryLvl2ToSupabase,
  deleteSingleSubCategoryLvl2FromSupabase,
  saveSubCategoriesLvl2ToSupabase,
  fetchCollectionsFromSupabase,
  saveSingleCollectionToSupabase,
  deleteSingleCollectionFromSupabase,
  saveCollectionsToSupabase,
  fetchRealisationsFromSupabase,
  saveRealisationsToSupabase,
  subscribeToDatabaseChanges,
} from './services/supabase';

interface AdminOuterErrorBoundaryProps {
  children: React.ReactNode;
  onClose: () => void;
}

interface AdminOuterErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminOuterErrorBoundary extends React.Component<AdminOuterErrorBoundaryProps, AdminOuterErrorBoundaryState> {
  public state: AdminOuterErrorBoundaryState = { hasError: false, error: null };

  constructor(props: AdminOuterErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AdminOuterErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="max-w-xl w-full bg-[#141414] border-2 border-[#D4AF37] rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-[#D4AF37]">
              ANONYM — Tableau de Bord Sécurisé
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Une interruption s'est produite lors du chargement du tableau de bord. Cliquez sur le bouton ci-dessous pour réinitialiser la session administrateur et ouvrir directement le panel.
            </p>
            {this.state.error && (
              <div className="p-3 bg-black border border-gray-800 rounded-xl text-[11px] font-mono text-amber-200 text-left overflow-x-auto max-h-28">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  try {
                    sessionStorage.removeItem('anonym_admin_logged_in_v1');
                  } catch (e) {}
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-5 py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl hover:bg-[#F3E5AB] cursor-pointer shadow-lg"
              >
                Réinitialiser & Ouvrir le Tableau de Bord
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  this.props.onClose();
                }}
                className="px-5 py-2.5 bg-gray-800 text-gray-300 font-semibold text-xs rounded-xl hover:bg-gray-700 cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(loadStoreInfo);
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [collections, setCollections] = useState<Collection[]>(loadCollections);
  const [reviews, setReviews] = useState<Review[]>(loadReviews);
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(loadQuoteRequests);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [analytics, setAnalytics] = useState<AnalyticsData>(loadAnalytics);
  const [subCategoriesLvl1, setSubCategoriesLvl1] = useState<SubCategoryLevel1[]>(loadSubCategoriesLvl1);
  const [subCategoriesLvl2, setSubCategoriesLvl2] = useState<SubCategoryLevel2[]>(loadSubCategoriesLvl2);
  const [realisations, setRealisations] = useState<RealisationCollection[]>(loadRealisations);

  const [activeCategory, setActiveCategory] = useState<CategoryId | 'accueil' | 'contact'>('accueil');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(loadIsAdminLoggedIn);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [adminPassword, setAdminPassword] = useState<string>(loadAdminPassword);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showSyncToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSyncToast({ message, type });
    setTimeout(() => {
      setSyncToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  // 1. Fetch fresh data from Supabase and synchronize local storage
  const refreshAllDataFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const [sbStore, sbProds, sbL1, sbL2, sbCols, sbReals] = await Promise.all([
        fetchStoreInfoFromSupabase(),
        fetchProductsFromSupabase(),
        fetchSubCategoriesLvl1FromSupabase(),
        fetchSubCategoriesLvl2FromSupabase(),
        fetchCollectionsFromSupabase(),
        fetchRealisationsFromSupabase(),
      ]);

      if (sbStore) {
        setStoreInfo(sbStore);
        saveStoreInfo(sbStore);
      }
      if (sbProds && sbProds.length > 0) {
        setProducts(sbProds);
        saveProducts(sbProds);
      }
      if (sbL1 && sbL1.length > 0) {
        setSubCategoriesLvl1(sbL1);
        saveSubCategoriesLvl1(sbL1);
      }
      if (sbL2 && sbL2.length > 0) {
        setSubCategoriesLvl2(sbL2);
        saveSubCategoriesLvl2(sbL2);
      }
      if (sbCols && sbCols.length > 0) {
        setCollections(sbCols);
        saveCollections(sbCols);
      }
      if (sbReals && sbReals.length > 0) {
        setRealisations(sbReals);
        saveRealisations(sbReals);
      }
    } catch (err) {
      console.warn('Supabase data refresh warning:', err);
    }
  }, []);

  // Bootstrap on Mount + Realtime Multi-Device synchronization
  useEffect(() => {
    if (isSupabaseConfigured()) {
      seedInitialDataIfNeeded().then(() => {
        refreshAllDataFromSupabase();
      });

      // Subscribe to Realtime changes across any other browser/device
      const unsubscribe = subscribeToDatabaseChanges((table) => {
        console.log(`⚡ Mise à jour Supabase détectée sur [${table}] — actualisation des données`);
        refreshAllDataFromSupabase();
      });

      return () => {
        unsubscribe();
      };
    }
  }, [refreshAllDataFromSupabase]);

  // Sync to local cache only (NEVER automatically overwrite Supabase on visitor mount)
  useEffect(() => { saveStoreInfo(storeInfo); }, [storeInfo]);
  useEffect(() => { saveProducts(products); }, [products]);
  useEffect(() => { saveCollections(collections); }, [collections]);
  useEffect(() => { saveReviews(reviews); }, [reviews]);
  useEffect(() => { saveNotifications(notifications); }, [notifications]);
  useEffect(() => { saveQuoteRequests(quoteRequests); }, [quoteRequests]);
  useEffect(() => { saveOrders(orders); }, [orders]);
  useEffect(() => { saveAnalytics(analytics); }, [analytics]);
  useEffect(() => { saveSubCategoriesLvl1(subCategoriesLvl1); }, [subCategoriesLvl1]);
  useEffect(() => { saveSubCategoriesLvl2(subCategoriesLvl2); }, [subCategoriesLvl2]);
  useEffect(() => { saveRealisations(realisations); }, [realisations]);

  useEffect(() => {
    // 1. URL Hash listener (e.g. /#admin)
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    // 2. Keyboard shortcut: Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Real site visitor tracking per browser session
  useEffect(() => {
    try {
      const hasSession = sessionStorage.getItem('anonym_visitor_session_v1');
      if (!hasSession) {
        sessionStorage.setItem('anonym_visitor_session_v1', 'true');
        const nowIso = new Date().toISOString();
        setAnalytics((prev) => {
          const logs = prev.visitorLogs || [];
          return {
            ...prev,
            visitorLogs: [nowIso, ...logs],
            totalVisits: (prev.totalVisits || logs.length) + 1,
            updatedAt: nowIso,
          };
        });
      }
    } catch (e) {
      console.warn('Session storage inaccessible pour les analytics', e);
    }
  }, []);

  const handleSelectCategory = (cat: CategoryId | 'accueil' | 'contact') => {
    setActiveCategory(cat);
    setShowGrid(false);
    // Scroll to top of universe-nav to reveal content below
    setTimeout(() => {
      const el = document.getElementById('universe-nav');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleBackToGrid = () => {
    setShowGrid(true);
    // Scroll back to the nav grid
    setTimeout(() => {
      const el = document.getElementById('universe-nav');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleGoToHomeHero = () => {
    setActiveCategory('accueil');
    setShowGrid(true);
    // Always scroll to absolute top so the Hero section is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Extra fallback: force scroll to hero element directly
    setTimeout(() => {
      const heroEl = document.getElementById('hero');
      if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreCatalog = () => {
    const el = document.getElementById('catalogue');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenCustomizer = () => {
    setActiveCategory('accueil');
    setShowGrid(false);
    setTimeout(() => handleNavigateSection('customizer'), 100);
  };

  const handleAddToCart = (product: Product, engravingText?: string, metalFinish?: string, selectedColor?: string, customText?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, engravingText, metalFinish: metalFinish as any, selectedColor, customText }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => setCartItems([]);

  const handleAdminLogin = (password: string) => {
    if (password === adminPassword || password === 'anonyme2026') {
      setIsAdminLoggedIn(true);
      saveIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    saveIsAdminLoggedIn(false);
    setIsAdminOpen(false);
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    const product: Product = { ...newProduct, id: 'prod-' + Date.now() };
    setProducts((prev) => [...prev, product]);
    saveProducts([...products, product]);
    const ok = await saveSingleProductToSupabase(product);
    if (ok) {
      showSyncToast('✅ Produit ajouté et synchronisé sur le Cloud !');
    } else {
      showSyncToast('⚠️ Enregistré localement, mais échec de synchronisation Cloud.', 'error');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    const nextList = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    setProducts(nextList);
    saveProducts(nextList);
    const ok = await saveSingleProductToSupabase(updatedProduct);
    if (ok) {
      showSyncToast('✅ Produit mis à jour et synchronisé sur le Cloud !');
    } else {
      showSyncToast('⚠️ Enregistré localement, mais échec de synchronisation Cloud.', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const nextList = products.filter((p) => p.id !== productId);
    setProducts(nextList);
    saveProducts(nextList);
    const ok = await deleteSingleProductFromSupabase(productId);
    if (ok) {
      showSyncToast('✅ Produit supprimé du Cloud.');
    } else {
      showSyncToast('⚠️ Supprimé localement, mais échec de suppression Cloud.', 'error');
    }
  };

  const handleResetProducts = async () => {
    setProducts(INITIAL_PRODUCTS);
    saveProducts(INITIAL_PRODUCTS);
    const ok = await saveProductsToSupabase(INITIAL_PRODUCTS);
    if (ok) {
      showSyncToast('✅ Catalogue réinitialisé sur le Cloud.');
    } else {
      showSyncToast('⚠️ Réinitialisé localement, échec Cloud.', 'error');
    }
  };

  const handleUpdateStoreInfo = async (info: StoreInfo) => {
    setStoreInfo(info);
    saveStoreInfo(info);
    const ok = await saveStoreInfoToSupabase(info);
    if (ok) {
      showSyncToast('✅ Paramètres et textes synchronisés sur le Cloud !');
    } else {
      showSyncToast('⚠️ Enregistré localement, mais échec de synchronisation Cloud.', 'error');
    }
  };

  const handleChangeAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
    saveAdminPassword(newPassword);
    showSyncToast('✅ Mot de passe administrateur mis à jour.');
  };

  const handleAddCollection = async (c: Omit<Collection, 'id' | 'createdAt' | 'order'>) => {
    const collection: Collection = {
      ...c,
      id: 'col-' + Date.now(),
      order: collections.length,
      createdAt: new Date().toISOString(),
    };
    const nextCols = [...collections, collection];
    setCollections(nextCols);
    saveCollections(nextCols);
    const ok = await saveSingleCollectionToSupabase(collection);
    if (ok) {
      showSyncToast('✅ Collection ajoutée et synchronisée !');
    } else {
      showSyncToast('⚠️ Enregistrée localement, échec Cloud.', 'error');
    }
  };

  const handleUpdateCollection = async (updated: Collection) => {
    const nextCols = collections.map((c) => (c.id === updated.id ? updated : c));
    setCollections(nextCols);
    saveCollections(nextCols);
    const ok = await saveSingleCollectionToSupabase(updated);
    if (ok) {
      showSyncToast('✅ Collection mise à jour et synchronisée !');
    } else {
      showSyncToast('⚠️ Enregistrée localement, échec Cloud.', 'error');
    }
  };

  const handleReorderCollections = async (newCollections: Collection[]) => {
    setCollections(newCollections);
    saveCollections(newCollections);
    const ok = await saveCollectionsToSupabase(newCollections);
    if (ok) {
      showSyncToast('✅ Ordre des collections synchronisé !');
    }
  };

  const handleDeleteCollection = async (id: string) => {
    const nextCols = collections.filter((c) => c.id !== id);
    setCollections(nextCols);
    saveCollections(nextCols);
    const ok = await deleteSingleCollectionFromSupabase(id);
    if (ok) {
      showSyncToast('✅ Collection supprimée du Cloud.');
    }
  };

  // Level 1 SubCategories CRUD
  const handleAddSubCatLvl1 = async (cat: Omit<SubCategoryLevel1, 'id' | 'order'>) => {
    const newCat: SubCategoryLevel1 = {
      ...cat,
      id: 'lvl1-' + Date.now(),
      order: subCategoriesLvl1.filter((c) => c.parentCategory === cat.parentCategory).length + 1,
    };
    const nextList = [...subCategoriesLvl1, newCat];
    setSubCategoriesLvl1(nextList);
    saveSubCategoriesLvl1(nextList);
    const ok = await saveSingleSubCategoryLvl1ToSupabase(newCat);
    if (ok) {
      showSyncToast('✅ Sous-catégorie niveau 1 synchronisée !');
    }
  };

  const handleUpdateSubCatLvl1 = async (updated: SubCategoryLevel1) => {
    const nextList = subCategoriesLvl1.map((c) => (c.id === updated.id ? updated : c));
    setSubCategoriesLvl1(nextList);
    saveSubCategoriesLvl1(nextList);
    const ok = await saveSingleSubCategoryLvl1ToSupabase(updated);
    if (ok) {
      showSyncToast('✅ Sous-catégorie mise à jour sur le Cloud !');
    }
  };

  const handleReorderSubCatsLvl1 = async (reordered: SubCategoryLevel1[]) => {
    setSubCategoriesLvl1(reordered);
    saveSubCategoriesLvl1(reordered);
    await saveSubCategoriesLvl1ToSupabase(reordered);
  };

  const handleDeleteSubCatLvl1 = async (id: string) => {
    const nextL1 = subCategoriesLvl1.filter((c) => c.id !== id);
    const nextL2 = subCategoriesLvl2.filter((c) => c.level1Id !== id);
    setSubCategoriesLvl1(nextL1);
    setSubCategoriesLvl2(nextL2);
    saveSubCategoriesLvl1(nextL1);
    saveSubCategoriesLvl2(nextL2);
    await deleteSingleSubCategoryLvl1FromSupabase(id);
    showSyncToast('✅ Sous-catégorie supprimée du Cloud.');
  };

  // Level 2 SubCategories CRUD
  const handleAddSubCatLvl2 = async (cat: Omit<SubCategoryLevel2, 'id' | 'order'>) => {
    const newCat: SubCategoryLevel2 = {
      ...cat,
      id: 'lvl2-' + Date.now(),
      order: subCategoriesLvl2.filter((c) => c.level1Id === cat.level1Id).length + 1,
    };
    const nextList = [...subCategoriesLvl2, newCat];
    setSubCategoriesLvl2(nextList);
    saveSubCategoriesLvl2(nextList);
    const ok = await saveSingleSubCategoryLvl2ToSupabase(newCat);
    if (ok) {
      showSyncToast('✅ Sous-catégorie niveau 2 synchronisée !');
    }
  };

  const handleUpdateSubCatLvl2 = async (updated: SubCategoryLevel2) => {
    const nextList = subCategoriesLvl2.map((c) => (c.id === updated.id ? updated : c));
    setSubCategoriesLvl2(nextList);
    saveSubCategoriesLvl2(nextList);
    const ok = await saveSingleSubCategoryLvl2ToSupabase(updated);
    if (ok) {
      showSyncToast('✅ Sous-catégorie niveau 2 mise à jour !');
    }
  };

  const handleReorderSubCatsLvl2 = async (reordered: SubCategoryLevel2[]) => {
    setSubCategoriesLvl2(reordered);
    saveSubCategoriesLvl2(reordered);
    await saveSubCategoriesLvl2ToSupabase(reordered);
  };

  const handleDeleteSubCatLvl2 = async (id: string) => {
    const nextList = subCategoriesLvl2.filter((c) => c.id !== id);
    setSubCategoriesLvl2(nextList);
    saveSubCategoriesLvl2(nextList);
    await deleteSingleSubCategoryLvl2FromSupabase(id);
    showSyncToast('✅ Sous-catégorie niveau 2 supprimée.');
  };

  // Realisations CRUD
  const handleAddRealisationCollection = async (c: Omit<RealisationCollection, 'id' | 'createdAt' | 'order'>) => {
    const col: RealisationCollection = {
      ...c,
      id: 'real-' + Date.now(),
      order: realisations.length,
      createdAt: new Date().toISOString(),
    };
    const nextList = [...realisations, col];
    setRealisations(nextList);
    saveRealisations(nextList);
    const ok = await saveRealisationsToSupabase(nextList);
    if (ok) {
      showSyncToast('✅ Réalisation ajoutée et synchronisée sur le Cloud !');
    }
  };

  const handleUpdateRealisationCollection = async (updated: RealisationCollection) => {
    const nextList = realisations.map((c) => (c.id === updated.id ? updated : c));
    setRealisations(nextList);
    saveRealisations(nextList);
    const ok = await saveRealisationsToSupabase(nextList);
    if (ok) {
      showSyncToast('✅ Réalisation mise à jour et synchronisée !');
    }
  };

  const handleReorderRealisationCollections = async (newCols: RealisationCollection[]) => {
    setRealisations(newCols);
    saveRealisations(newCols);
    await saveRealisationsToSupabase(newCols);
  };

  const handleDeleteRealisationCollection = async (id: string) => {
    const nextList = realisations.filter((c) => c.id !== id);
    setRealisations(nextList);
    saveRealisations(nextList);
    await saveRealisationsToSupabase(nextList);
    showSyncToast('✅ Réalisation supprimée.');
  };

  const handleUpdateReview = (updated: Review) => {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDeleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateQuoteRequestStatus = (id: string, status: QuoteRequest['status']) => {
    setQuoteRequests((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  };

  const handleDeleteQuoteRequest = (id: string) => {
    setQuoteRequests((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAddNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleAddOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleAddReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      id: `review-${Date.now()}`,
      ...reviewData,
      date: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleAddQuoteRequest = (reqData: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: QuoteRequest = {
      id: `quote-${Date.now()}`,
      ...reqData,
      status: 'nouvelle',
      createdAt: new Date().toISOString(),
    };
    setQuoteRequests((prev) => [newReq, ...prev]);
  };

  const handleCreateOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      ...orderData,
      status: 'nouvelle',
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setAnalytics((prev) => ({
      ...prev,
      totalOrders: prev.totalOrders + 1,
      totalRevenue: prev.totalRevenue + (orderData.totalPrice || 0),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleTrackProductView = (productId: string) => {
    setAnalytics((prev) => ({
      ...prev,
      productViews: { ...prev.productViews, [productId]: (prev.productViews[productId] || 0) + 1 },
      updatedAt: new Date().toISOString(),
    }));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <VisualEditorProvider storeInfo={storeInfo} onUpdateStoreInfo={handleUpdateStoreInfo}>
      <div className="min-h-screen flex flex-col bg-[#F8F6F2] text-[#1A1A1A] font-sans antialiased overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <RoyalBackgroundAnimation />
          <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-10 w-[600px] h-[600px] bg-[#AA771C]/5 rounded-full blur-[160px] pointer-events-none" />
        </div>

        {/* Visual Editor Floating Toolbar */}
        <VisualEditorToolbar onOpenAdmin={() => setIsAdminOpen(true)} />

        <Navbar
          storeInfo={storeInfo}
          cartCount={cartCount}
          notifications={notifications}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          isAdminLoggedIn={isAdminLoggedIn}
          activeCategory={activeCategory}
          showGrid={showGrid}
          onSelectCategory={handleSelectCategory}
          onBackToGrid={handleBackToGrid}
          onGoToHomeHero={handleGoToHomeHero}
          onNavigateSection={handleNavigateSection}
        />

        <main className="relative z-10 flex-1 flex flex-col w-full">
          {/* ── HERO (always visible) ── */}
          <HeroSection
            storeInfo={storeInfo}
            onExploreCatalog={handleExploreCatalog}
            onOpenCustomizer={handleOpenCustomizer}
          />

          {/* ── UNIVERSE GRID / NAV (always visible, sticky) ── */}
          <UniverseGrid
            activeCategory={activeCategory}
            showGrid={showGrid}
            onSelectCategory={handleSelectCategory}
            onBackToGrid={handleBackToGrid}
            storeInfo={storeInfo}
          />

          {/* ── CONTENT AREA : ONLY displayed when a card or page is active (!showGrid) ── */}
          {!showGrid && (
            <div id="content-area" className="flex-1 w-full">
              {/* Product Catalog for Bijoux, Emballages, Parfums, Accessoires */}
              {['bijoux', 'emballages', 'parfums', 'accessoires'].includes(activeCategory) && (
                <div id="catalogue">
                  <ProductCatalog
                    products={products}
                    collections={collections}
                    selectedCategory={activeCategory as CategoryId}
                    onSelectCategory={handleSelectCategory}
                    whatsappNumber={storeInfo.whatsappNumber}
                    onQuickView={(product) => {
                      setSelectedProduct(product);
                      handleTrackProductView(product.id);
                    }}
                    onAddToCart={handleAddToCart}
                    subCategoriesLvl1={subCategoriesLvl1}
                    subCategoriesLvl2={subCategoriesLvl2}
                    storeInfo={storeInfo}
                    isAdminLoggedIn={isAdminLoggedIn}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onAddSubCatLvl1={handleAddSubCatLvl1}
                    onUpdateSubCatLvl1={handleUpdateSubCatLvl1}
                    onDeleteSubCatLvl1={handleDeleteSubCatLvl1}
                    onAddSubCatLvl2={handleAddSubCatLvl2}
                    onUpdateSubCatLvl2={handleUpdateSubCatLvl2}
                    onDeleteSubCatLvl2={handleDeleteSubCatLvl2}
                  />

                  {/* Dynamic sections for this catalog category */}
                  {(() => {
                    const filtered = (storeInfo.customSections || []).filter((s) => s.pageId === activeCategory);
                    return filtered.map((s, idx) => (
                      <CustomDynamicSection key={s.id} section={s} index={idx} totalSections={filtered.length} />
                    ));
                  })()}
                  <AddSectionButton pageId={activeCategory as any} />
                </div>
              )}

              {/* À propos card content — ONLY shown when user clicks 'À PROPOS' card */}
              {activeCategory === 'accueil' && (
                <div id="about-sections">
                  <AboutFounder storeInfo={storeInfo} />
                  
                  {/* Dynamic custom sections added for Accueil / À Propos */}
                  {(() => {
                    const filtered = (storeInfo.customSections || []).filter((s) => s.pageId === 'accueil');
                    return filtered.map((s, idx) => (
                      <CustomDynamicSection key={s.id} section={s} index={idx} totalSections={filtered.length} />
                    ));
                  })()}
                  <AddSectionButton pageId="accueil" />

                  <RealisationsGallery realisations={realisations} storeInfo={storeInfo} />
                  <OrderingRulesSection storeInfo={storeInfo} />
                  <QuoteRequestSection storeInfo={storeInfo} onAddQuoteRequest={handleAddQuoteRequest} />
                  <ReviewsSection storeInfo={storeInfo} reviews={reviews} onAddReview={handleAddReview} />
                </div>
              )}

              {/* Dedicated Contact Page — ONLY shown when user clicks "CONTACT" in header */}
              {activeCategory === 'contact' && (
                <div id="contact-page">
                  <ContactSection storeInfo={storeInfo} />

                  {/* Dynamic custom sections added for Contact */}
                  {(() => {
                    const filtered = (storeInfo.customSections || []).filter((s) => s.pageId === 'contact');
                    return filtered.map((s, idx) => (
                      <CustomDynamicSection key={s.id} section={s} index={idx} totalSections={filtered.length} />
                    ));
                  })()}
                  <AddSectionButton pageId="contact" />
                </div>
              )}
            </div>
          )}
        </main>

        <Footer storeInfo={storeInfo} onOpenAdmin={() => setIsAdminOpen(true)} />

        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            whatsappNumber={storeInfo.whatsappNumber}
            onAddToCart={(product, engravingText, metalFinish, selectedColor, customText) => {
              handleAddToCart(product, engravingText, metalFinish, selectedColor, customText);
              setSelectedProduct(null);
            }}
            onCreateOrder={handleCreateOrder}
          />
        )}

        <SelectionBasketDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          storeInfo={storeInfo}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onCreateOrder={handleCreateOrder}
        />

        <AdminOuterErrorBoundary onClose={() => setIsAdminOpen(false)}>
          <AdminPortalModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            isAdminLoggedIn={isAdminLoggedIn}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetProducts={handleResetProducts}
            storeInfo={storeInfo}
            onUpdateStoreInfo={handleUpdateStoreInfo}
            onChangeAdminPassword={handleChangeAdminPassword}
            collections={collections}
            reviews={reviews}
            notifications={notifications}
            quoteRequests={quoteRequests}
            orders={orders}
            analytics={analytics}
            realisations={realisations}
            onAddRealisationCollection={handleAddRealisationCollection}
            onUpdateRealisationCollection={handleUpdateRealisationCollection}
            onDeleteRealisationCollection={handleDeleteRealisationCollection}
            onReorderRealisationCollections={handleReorderRealisationCollections}
            onAddCollection={handleAddCollection}
            onUpdateCollection={handleUpdateCollection}
            onDeleteCollection={handleDeleteCollection}
            onReorderCollections={handleReorderCollections}
            onUpdateReview={handleUpdateReview}
            onDeleteReview={handleDeleteReview}
            onUpdateQuoteRequestStatus={handleUpdateQuoteRequestStatus}
            onDeleteQuoteRequest={handleDeleteQuoteRequest}
            onAddNotification={handleAddNotification}
            onMarkNotificationRead={handleMarkNotificationRead}
            onAddOrder={handleAddOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onTrackProductView={handleTrackProductView}
            onUpdateAnalytics={setAnalytics}
            subCategoriesLvl1={subCategoriesLvl1}
            subCategoriesLvl2={subCategoriesLvl2}
            onAddSubCatLvl1={handleAddSubCatLvl1}
            onUpdateSubCatLvl1={handleUpdateSubCatLvl1}
            onReorderSubCatsLvl1={handleReorderSubCatsLvl1}
            onDeleteSubCatLvl1={handleDeleteSubCatLvl1}
            onAddSubCatLvl2={handleAddSubCatLvl2}
            onUpdateSubCatLvl2={handleUpdateSubCatLvl2}
            onReorderSubCatsLvl2={handleReorderSubCatsLvl2}
            onDeleteSubCatLvl2={handleDeleteSubCatLvl2}
          />
        </AdminOuterErrorBoundary>

        {/* ── Realtime Sync Toast Notification ── */}
        {syncToast && (
          <div className="fixed bottom-6 right-6 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-xs font-semibold ${
                syncToast.type === 'error'
                  ? 'bg-rose-950/95 border-rose-600 text-rose-100'
                  : 'bg-black/90 border-[#D4AF37] text-white'
              }`}
            >
              {syncToast.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
              )}
              <span>{syncToast.message}</span>
            </div>
          </div>
        )}
      </div>
    </VisualEditorProvider>
  );
}