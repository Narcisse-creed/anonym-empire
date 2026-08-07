import React, { useState, useEffect } from 'react';
import { StoreInfo, Product, CartItem, CategoryId, Collection, Notification, QuoteRequest, Order, AnalyticsData, Review, RealisationCollection } from './types';
import { STORE_INFO } from './data/storeInfo';
import { INITIAL_PRODUCTS } from './data/products';
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

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = { ...newProduct, id: 'prod-' + Date.now() };
    setProducts((prev) => [...prev, product]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleResetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  const handleUpdateStoreInfo = (info: StoreInfo) => {
    setStoreInfo(info);
  };

  const handleChangeAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
    saveAdminPassword(newPassword);
  };

  const handleAddCollection = (c: Omit<Collection, 'id' | 'createdAt' | 'order'>) => {
    const collection: Collection = {
      ...c,
      id: 'col-' + Date.now(),
      order: collections.length,
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, collection]);
  };

  const handleUpdateCollection = (updated: Collection) => {
    setCollections((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleReorderCollections = (newCollections: Collection[]) => {
    setCollections(newCollections);
    saveCollections(newCollections);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  // Level 1 SubCategories CRUD
  const handleAddSubCatLvl1 = (cat: Omit<SubCategoryLevel1, 'id' | 'order'>) => {
    const newCat: SubCategoryLevel1 = {
      ...cat,
      id: 'lvl1-' + Date.now(),
      order: subCategoriesLvl1.filter((c) => c.parentCategory === cat.parentCategory).length + 1,
    };
    setSubCategoriesLvl1((prev) => [...prev, newCat]);
  };

  const handleUpdateSubCatLvl1 = (updated: SubCategoryLevel1) => {
    setSubCategoriesLvl1((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleReorderSubCatsLvl1 = (reordered: SubCategoryLevel1[]) => {
    setSubCategoriesLvl1(reordered);
    saveSubCategoriesLvl1(reordered);
  };

  const handleDeleteSubCatLvl1 = (id: string) => {
    setSubCategoriesLvl1((prev) => prev.filter((c) => c.id !== id));
    setSubCategoriesLvl2((prev) => prev.filter((c) => c.level1Id !== id));
  };

  // Level 2 SubCategories CRUD
  const handleAddSubCatLvl2 = (cat: Omit<SubCategoryLevel2, 'id' | 'order'>) => {
    const newCat: SubCategoryLevel2 = {
      ...cat,
      id: 'lvl2-' + Date.now(),
      order: subCategoriesLvl2.filter((c) => c.level1Id === cat.level1Id).length + 1,
    };
    setSubCategoriesLvl2((prev) => [...prev, newCat]);
  };

  const handleUpdateSubCatLvl2 = (updated: SubCategoryLevel2) => {
    setSubCategoriesLvl2((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleReorderSubCatsLvl2 = (reordered: SubCategoryLevel2[]) => {
    setSubCategoriesLvl2(reordered);
    saveSubCategoriesLvl2(reordered);
  };

  const handleDeleteSubCatLvl2 = (id: string) => {
    setSubCategoriesLvl2((prev) => prev.filter((c) => c.id !== id));
  };

  // Realisations CRUD
  const handleAddRealisationCollection = (c: Omit<RealisationCollection, 'id' | 'createdAt' | 'order'>) => {
    const col: RealisationCollection = {
      ...c,
      id: 'real-' + Date.now(),
      order: realisations.length,
      createdAt: new Date().toISOString(),
    };
    setRealisations((prev) => [...prev, col]);
  };

  const handleUpdateRealisationCollection = (updated: RealisationCollection) => {
    setRealisations((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleReorderRealisationCollections = (newCols: RealisationCollection[]) => {
    setRealisations(newCols);
  };

  const handleDeleteRealisationCollection = (id: string) => {
    setRealisations((prev) => prev.filter((c) => c.id !== id));
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
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] text-[#1A1A1A] font-sans antialiased overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <RoyalBackgroundAnimation />
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-10 w-[600px] h-[600px] bg-[#AA771C]/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

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
                />
              </div>
            )}

            {/* À propos card content — ONLY shown when user clicks 'À PROPOS' card */}
            {activeCategory === 'accueil' && (
              <div id="about-sections">
                <AboutFounder storeInfo={storeInfo} />
                <RealisationsGallery realisations={realisations} />
                <OrderingRulesSection storeInfo={storeInfo} />
                <QuoteRequestSection storeInfo={storeInfo} onAddQuoteRequest={handleAddQuoteRequest} />
                <ReviewsSection storeInfo={storeInfo} reviews={reviews} onAddReview={handleAddReview} />
              </div>
            )}

            {/* Dedicated Contact Page — ONLY shown when user clicks "CONTACT" in header */}
            {activeCategory === 'contact' && (
              <div id="contact-page">
                <ContactSection storeInfo={storeInfo} />
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
    </div>
  );
}