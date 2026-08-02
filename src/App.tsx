import React, { useState, useEffect } from 'react';
import { StoreInfo, Product, CartItem, CategoryId, Collection, Notification, QuoteRequest, Order, AnalyticsData, Review } from './types';
import { STORE_INFO } from './data/storeInfo';
import { INITIAL_PRODUCTS } from './data/products';
import { CrownLogo } from './components/CrownLogo';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { UniverseGrid } from './components/UniverseGrid';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomizerPreview } from './components/CustomizerPreview';
import { AboutFounder } from './components/AboutFounder';
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
} from './utils/helpers';

const DEFAULT_ADMIN_PASSWORD = 'anonym2026';

export default function App() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(loadStoreInfo);
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [collections, setCollections] = useState<Collection[]>(loadCollections);
  const [reviews, setReviews] = useState<Review[]>(loadReviews);
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(loadQuoteRequests);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [analytics, setAnalytics] = useState<AnalyticsData>(loadAnalytics);

  const [activeCategory, setActiveCategory] = useState<CategoryId | 'accueil'>('accueil');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [adminPassword, setAdminPassword] = useState(DEFAULT_ADMIN_PASSWORD);

  useEffect(() => { saveStoreInfo(storeInfo); }, [storeInfo]);
  useEffect(() => { saveProducts(products); }, [products]);
  useEffect(() => { saveCollections(collections); }, [collections]);
  useEffect(() => { saveReviews(reviews); }, [reviews]);
  useEffect(() => { saveNotifications(notifications); }, [notifications]);
  useEffect(() => { saveQuoteRequests(quoteRequests); }, [quoteRequests]);
  useEffect(() => { saveOrders(orders); }, [orders]);
  useEffect(() => { saveAnalytics(analytics); }, [analytics]);

  const handleSelectCategory = (cat: CategoryId | 'accueil') => {
    setActiveCategory(cat);
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
    if (password === adminPassword) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
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

  const handleDeleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateReview = (updated: Review) => {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleUpdateQuoteRequestStatus = (id: string, status: QuoteRequest['status']) => {
    setQuoteRequests((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
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

  const handleTrackProductView = (productId: string) => {
    setAnalytics((prev) => ({
      ...prev,
      productViews: { ...prev.productViews, [productId]: (prev.productViews[productId] || 0) + 1 },
      updatedAt: new Date().toISOString(),
    }));
  };


  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <RoyalBackgroundAnimation />
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-10 w-[600px] h-[600px] bg-[#AA771C]/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <Navbar
        storeInfo={storeInfo}
        cartCount={cartCount}
        notifications={notifications}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onNavigateSection={handleNavigateSection}
      />

      <main className="relative z-10">
        {/* ── HERO (always visible) ── */}
        <HeroSection
          storeInfo={storeInfo}
          onExploreCatalog={handleExploreCatalog}
          onOpenCustomizer={handleOpenCustomizer}
        />

        {/* ── CATEGORY NAV BAR (always visible, sticky) ── */}
        <UniverseGrid
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          onNavigateCatalog={handleExploreCatalog}
        />

        {/* ── CATALOGUE : shown when a product category is selected ── */}
        {activeCategory !== 'accueil' && (
          <ProductCatalog
            products={products}
            collections={collections}
            selectedCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            whatsappNumber={storeInfo.whatsappNumber}
            onQuickView={(product) => setSelectedProduct(product)}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* ── ACCUEIL PAGE : shown only when activeCategory === 'accueil' ── */}
        {activeCategory === 'accueil' && (
          <>
            <AboutFounder storeInfo={storeInfo} />
            <OrderingRulesSection storeInfo={storeInfo} />
            <QuoteRequestSection storeInfo={storeInfo} />
            <ReviewsSection storeInfo={storeInfo} />
            <CustomizerPreview storeInfo={storeInfo} />
            <ContactSection storeInfo={storeInfo} />
          </>
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
      />

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
        onAddCollection={handleAddCollection}
        onUpdateCollection={handleUpdateCollection}
        onDeleteCollection={handleDeleteCollection}
        onUpdateReview={handleUpdateReview}
        onUpdateQuoteRequestStatus={handleUpdateQuoteRequestStatus}
        onAddNotification={handleAddNotification}
        onMarkNotificationRead={handleMarkNotificationRead}
        onAddOrder={handleAddOrder}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        onTrackProductView={handleTrackProductView}
      />
    </div>
  );
}