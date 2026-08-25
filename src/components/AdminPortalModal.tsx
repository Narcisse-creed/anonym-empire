import React, { useState, useMemo } from 'react';
import { Product, StoreInfo, CategoryId, SubCategory, GenderCategory, Collection, Review, QuoteRequest, Order, AnalyticsData, SubCategoryLevel1, SubCategoryLevel2, RealisationCollection, RealisationPhoto, AvailabilityStatus } from '../types';
import { UNIVERSE_CATEGORIES } from '../data/categories';
import { loadProducts, saveProducts, loadStoreInfo, saveStoreInfo, loadCollections, saveCollections, loadReviews, saveReviews, loadQuoteRequests, saveQuoteRequests, loadNotifications, saveNotifications, loadOrders, saveOrders, loadAnalytics, saveAnalytics, formatPriceFCFA } from '../utils/helpers';
import { X, Lock, Key, Plus, Edit2, Edit3, Trash2, RotateCcw, Save, ShieldCheck, Download, Upload, ChevronUp, ChevronDown, Filter, Star, FileText, BarChart3, MessageSquare, Clock, CheckCircle, XCircle, Package, Settings, Layout, Eye, EyeOff, Search, ArrowUpDown, ArrowUp, ArrowDown, Image as ImageIcon, Users, TrendingUp, Sparkles, ShoppingBag } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { useVisualEditor } from '../context/VisualEditorContext';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  products: Product[];
  onAddProduct: (newProduct: Omit<Product, 'id'>) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
  storeInfo: StoreInfo;
  onUpdateStoreInfo: (info: StoreInfo) => void;
  onChangeAdminPassword?: (newPassword: string) => void;
  collections: Collection[];
  reviews: Review[];
  notifications: any[];
  quoteRequests: QuoteRequest[];
  onAddCollection?: (c: Omit<Collection, 'id' | 'createdAt' | 'order'>) => void;
  onUpdateCollection?: (c: Collection) => void;
  onDeleteCollection?: (id: string) => void;
  onReorderCollections?: (collections: Collection[]) => void;
  onUpdateReview?: (r: Review) => void;
  onDeleteReview?: (id: string) => void;
  onUpdateQuoteRequestStatus?: (id: string, status: QuoteRequest['status']) => void;
  onDeleteQuoteRequest?: (id: string) => void;
  onAddNotification?: (n: any) => void;
  onMarkNotificationRead?: (id: string) => void;
  orders: Order[];
  onAddOrder: (order: Order) => void;
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
  analytics: AnalyticsData;
  onTrackProductView: (productId: string) => void;
  onUpdateAnalytics?: (data: AnalyticsData) => void;
  subCategoriesLvl1?: SubCategoryLevel1[];
  subCategoriesLvl2?: SubCategoryLevel2[];
  onAddSubCatLvl1?: (cat: Omit<SubCategoryLevel1, 'id' | 'order'>) => void;
  onUpdateSubCatLvl1?: (cat: SubCategoryLevel1) => void;
  onReorderSubCatsLvl1?: (cats: SubCategoryLevel1[]) => void;
  onDeleteSubCatLvl1?: (id: string) => void;
  onAddSubCatLvl2?: (cat: Omit<SubCategoryLevel2, 'id' | 'order'>) => void;
  onUpdateSubCatLvl2?: (cat: SubCategoryLevel2) => void;
  onReorderSubCatsLvl2?: (cats: SubCategoryLevel2[]) => void;
  onDeleteSubCatLvl2?: (id: string) => void;
  // Galerie Réalisations
  realisations?: RealisationCollection[];
  onAddRealisationCollection?: (col: Omit<RealisationCollection, 'id' | 'createdAt' | 'order'>) => void;
  onUpdateRealisationCollection?: (col: RealisationCollection) => void;
  onDeleteRealisationCollection?: (id: string) => void;
  onReorderRealisationCollections?: (cols: RealisationCollection[]) => void;
}

interface AdminErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

interface AdminErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class AdminErrorBoundary extends React.Component<AdminErrorBoundaryProps, AdminErrorBoundaryState> {
  public state: AdminErrorBoundaryState = { hasError: false, errorMessage: '' };

  constructor(props: AdminErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error?.message || 'Erreur d\'affichage inconnue' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AdminPortalModal caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-gray-50 border border-rose-800 rounded-2xl space-y-4 max-w-lg mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1A0F0A]">Une erreur est survenue lors de l'affichage du tableau de bord</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Un incident de chargement a été intercepté pour éviter un écran noir. Détail : <br />
            <code className="text-rose-300 bg-white/60 px-2 py-1 rounded text-[11px] mt-1 inline-block">{this.state.errorMessage}</code>
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, errorMessage: '' });
                if (this.props.onReset) this.props.onReset();
              }}
              className="px-5 py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl hover:bg-[#F3E5AB] transition-all cursor-pointer shadow-lg"
            >
              Recharger le Tableau de Bord
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  isAdminLoggedIn,
  onLogin,
  onLogout,
  products = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts,
  storeInfo,
  onUpdateStoreInfo,
  onChangeAdminPassword,
  collections = [],
  reviews = [],
  notifications = [],
  quoteRequests = [],
  onAddCollection,
  onUpdateCollection,
  onDeleteCollection,
  onUpdateReview,
  onDeleteReview,
  onUpdateQuoteRequestStatus,
  onDeleteQuoteRequest,
  onAddNotification,
  onMarkNotificationRead,
  orders = [],
  onAddOrder,
  onUpdateOrderStatus,
  onDeleteOrder,
  analytics = { productViews: {}, favorites: {}, totalOrders: 0, totalRevenue: 0, updatedAt: new Date().toISOString(), visitorLogs: [], totalVisits: 0 },
  onTrackProductView,
  subCategoriesLvl1 = [],
  subCategoriesLvl2 = [],
  onAddSubCatLvl1,
  onUpdateSubCatLvl1,
  onReorderSubCatsLvl1,
  onDeleteSubCatLvl1,
  onAddSubCatLvl2,
  onUpdateSubCatLvl2,
  onReorderSubCatsLvl2,
  onDeleteSubCatLvl2,
  onReorderCollections,
  // Galerie Réalisations
  realisations = [],
  onAddRealisationCollection,
  onUpdateRealisationCollection,
  onDeleteRealisationCollection,
  onReorderRealisationCollections,
}) => {
  if (!isOpen) return null;

  // Admin Active Tab State
  const [adminTab, setAdminTab] = useState<
    'list' | 'add' | 'edit' | 'settings' | 'collections' | 'subcategories' | 'textes' | 'commandes' | 'devis' | 'avis' | 'analytics' | 'realisations'
  >('list');

  const { setIsEditMode } = useVisualEditor();

  // Login Form State
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Password Change State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  
  // Password Visibility Toggle States (§21)
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Deletion Confirmation Modal States (Across All Tabs)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [subCatLvl1ToDelete, setSubCatLvl1ToDelete] = useState<SubCategoryLevel1 | null>(null);
  const [subCatLvl2ToDelete, setSubCatLvl2ToDelete] = useState<SubCategoryLevel2 | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [quoteToDelete, setQuoteToDelete] = useState<QuoteRequest | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  // Admin Catalog Search & Filter State
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<'all' | CategoryId>('all');
  const [adminAvailabilityFilter, setAdminAvailabilityFilter] = useState<'all' | 'disponible' | 'en-arrivage' | 'epuise'>('all');
  const [adminSortColumn, setAdminSortColumn] = useState<'refCode' | 'name' | 'category' | 'price'>('refCode');
  const [adminSortDirection, setAdminSortDirection] = useState<'asc' | 'desc'>('asc');

  // Computed filtered & sorted products for admin list with defensive checks
  const filteredAdminProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    let list = [...products];

    // 1. Search filter
    if (adminSearchQuery.trim()) {
      const q = adminSearchQuery.toLowerCase();
      list = list.filter((p) => {
        if (!p) return false;
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const refMatch = (p.refCode || '').toLowerCase().includes(q);
        const subMatch = (p.subCategory || '').toLowerCase().includes(q);
        return nameMatch || refMatch || subMatch;
      });
    }

    // 2. Category filter
    if (adminCategoryFilter !== 'all') {
      list = list.filter((p) => p && p.category === adminCategoryFilter);
    }

    // 3. Availability filter
    if (adminAvailabilityFilter !== 'all') {
      list = list.filter((p) => p && p.availability === adminAvailabilityFilter);
    }

    // 4. Sort
    list.sort((a, b) => {
      if (!a || !b) return 0;
      let comp = 0;
      if (adminSortColumn === 'refCode') {
        comp = (a.refCode || '').localeCompare(b.refCode || '', undefined, { numeric: true });
      } else if (adminSortColumn === 'name') {
        comp = (a.name || '').localeCompare(b.name || '');
      } else if (adminSortColumn === 'category') {
        comp = (a.category || '').localeCompare(b.category || '');
      } else if (adminSortColumn === 'price') {
        comp = (a.price || 0) - (b.price || 0);
      }
      return adminSortDirection === 'asc' ? comp : -comp;
    });

    return list;
  }, [products, adminSearchQuery, adminCategoryFilter, adminAvailabilityFilter, adminSortColumn, adminSortDirection]);

  const handleSortColumnToggle = (column: 'refCode' | 'name' | 'category' | 'price') => {
    if (adminSortColumn === column) {
      setAdminSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setAdminSortColumn(column);
      setAdminSortDirection('asc');
    }
  };

  // Collection Management State
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [colProductSearch, setColProductSearch] = useState('');
  const [colFormData, setColFormData] = useState<{
    name: string;
    icon: string;
    description: string;
    category: CategoryId;
    coverImage: string;
    visible: boolean;
    productIds: string[];
  }>({
    name: '',
    icon: '📿',
    description: '',
    category: 'bijoux',
  coverImage: '',
    visible: true,
    productIds: [],
  });

  // SubCategories Tab State & Forms
  const [subCatParentFilter, setSubCatParentFilter] = useState<CategoryId>('bijoux');
  const [editingSubLvl1, setEditingSubLvl1] = useState<SubCategoryLevel1 | null>(null);
  const [editingSubLvl2, setEditingSubLvl2] = useState<SubCategoryLevel2 | null>(null);
  const [isAddLvl1Open, setIsAddLvl1Open] = useState(false);
  const [isAddLvl2Open, setIsAddLvl2Open] = useState(false);

  const [lvl1ToDelete, setLvl1ToDelete] = useState<SubCategoryLevel1 | null>(null);
  const [lvl2ToDelete, setLvl2ToDelete] = useState<SubCategoryLevel2 | null>(null);

  const [lvl1FormData, setLvl1FormData] = useState<{
    name: string;
    parentCategory: CategoryId;
    icon: string;
    visible: boolean;
  }>({
    name: '',
    parentCategory: 'bijoux',
    icon: '💎',
    visible: true,
  });

  const [lvl2FormData, setLvl2FormData] = useState<{
    name: string;
    level1Id: string;
    parentCategory: CategoryId;
    visible: boolean;
  }>({
    name: '',
    level1Id: '',
    parentCategory: 'bijoux',
    visible: true,
  });

  const handleStartAddLvl1 = () => {
    setEditingSubLvl1(null);
    setLvl1FormData({
      name: '',
      parentCategory: subCatParentFilter,
      icon: '💎',
      visible: true,
    });
    setIsAddLvl1Open(true);
  };

  const handleStartEditLvl1 = (item: SubCategoryLevel1) => {
    setEditingSubLvl1(item);
    setLvl1FormData({
      name: item.name,
      parentCategory: item.parentCategory,
      icon: item.icon || '💎',
      visible: item.visible !== false,
    });
    setIsAddLvl1Open(true);
  };

  const handleSaveSubLvl1Form = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lvl1FormData.name.trim()) return;

    if (editingSubLvl1) {
      if (onUpdateSubCatLvl1) {
        onUpdateSubCatLvl1({
          ...editingSubLvl1,
          name: lvl1FormData.name.trim().toUpperCase(),
          parentCategory: lvl1FormData.parentCategory,
          icon: lvl1FormData.icon || '💎',
          visible: lvl1FormData.visible,
        });
      }
    } else {
      if (onAddSubCatLvl1) {
        onAddSubCatLvl1({
          name: lvl1FormData.name.trim().toUpperCase(),
          parentCategory: lvl1FormData.parentCategory,
          icon: lvl1FormData.icon || '💎',
          visible: lvl1FormData.visible,
        });
      }
    }
    setIsAddLvl1Open(false);
    setEditingSubLvl1(null);
  };
  const handleSaveLvl1Form = handleSaveSubLvl1Form;

  const handleStartAddLvl2 = (lvl1Id?: string) => {
    setEditingSubLvl2(null);
    const targetLvl1 = lvl1Id || (subCategoriesLvl1?.find((c) => c.parentCategory === subCatParentFilter)?.id || '');
    const parentL1 = subCategoriesLvl1?.find((c) => c.id === targetLvl1);
    setLvl2FormData({
      name: '',
      level1Id: targetLvl1,
      parentCategory: parentL1?.parentCategory || subCatParentFilter,
      visible: true,
    });
    setIsAddLvl2Open(true);
  };

  const handleStartEditLvl2 = (item: SubCategoryLevel2) => {
    setEditingSubLvl2(item);
    setLvl2FormData({
      name: item.name,
      level1Id: item.level1Id,
      parentCategory: item.parentCategory,
      visible: item.visible !== false,
    });
    setIsAddLvl2Open(true);
  };

  const handleSaveSubLvl2Form = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lvl2FormData.name.trim() || !lvl2FormData.level1Id) return;

    const parentL1 = subCategoriesLvl1?.find((c) => c.id === lvl2FormData.level1Id);
    const resolvedParentCategory = parentL1?.parentCategory || lvl2FormData.parentCategory || subCatParentFilter;

    if (editingSubLvl2) {
      if (onUpdateSubCatLvl2) {
        onUpdateSubCatLvl2({
          ...editingSubLvl2,
          name: lvl2FormData.name.trim().toUpperCase(),
          level1Id: lvl2FormData.level1Id,
          parentCategory: resolvedParentCategory,
          visible: lvl2FormData.visible,
        });
      }
    } else {
      if (onAddSubCatLvl2) {
        onAddSubCatLvl2({
          name: lvl2FormData.name.trim().toUpperCase(),
          level1Id: lvl2FormData.level1Id,
          parentCategory: resolvedParentCategory,
          visible: lvl2FormData.visible,
        });
      }
    }
    setIsAddLvl2Open(false);
    setEditingSubLvl2(null);
  };
  const handleSaveLvl2Form = handleSaveSubLvl2Form;

  const handleMoveSubLvl1Item = (list: SubCategoryLevel1[], index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const newList = [...list];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    const reorderedInGroup = newList.map((c, i) => ({ ...c, order: i + 1 }));
    const otherCats = (subCategoriesLvl1 || []).filter((c) => c.parentCategory !== subCatParentFilter);
    const fullUpdated = [...otherCats, ...reorderedInGroup];

    if (onReorderSubCatsLvl1) {
      onReorderSubCatsLvl1(fullUpdated);
    }
  };

  const handleMoveSubLvl2Item = (list: SubCategoryLevel2[], index: number, direction: 'up' | 'down', level1Id: string) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const newList = [...list];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    const reorderedInGroup = newList.map((c, i) => ({ ...c, order: i + 1 }));
    const otherCats = (subCategoriesLvl2 || []).filter((c) => c.level1Id !== level1Id);
    const fullUpdated = [...otherCats, ...reorderedInGroup];

    if (onReorderSubCatsLvl2) {
      onReorderSubCatsLvl2(fullUpdated);
    }
  };

  const handleStartAddCollection = () => {
    setEditingCollection(null);
    setColFormData({
      name: '',
      icon: '📿',
      description: '',
      category: 'bijoux',
      coverImage: '',
      visible: true,
      productIds: [],
    });
    setColProductSearch('');
    setIsAddCollectionOpen(true);
    setTimeout(() => {
      const sb = document.getElementById('admin-modal-scroll-body');
      if (sb) sb.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleStartEditCollection = (col: Collection) => {
    setEditingCollection(col);
    setColFormData({
      name: col.name,
      icon: col.icon || '📿',
      description: col.description || '',
      category: col.category || 'bijoux',
      coverImage: col.coverImage || '',
      visible: col.visible !== false,
      productIds: col.productIds || [],
    });
    setColProductSearch('');
    setIsAddCollectionOpen(true);
    setTimeout(() => {
      const sb = document.getElementById('admin-modal-scroll-body');
      if (sb) sb.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const sortedCollections = useMemo(() => {
    return [...collections].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [collections]);

  const handleMoveCollection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedCollections.length) return;

    const newCols = [...sortedCollections];
    const temp = newCols[index];
    newCols[index] = newCols[targetIndex];
    newCols[targetIndex] = temp;

    // Recalculate explicit order values
    const reordered = newCols.map((c, i) => ({ ...c, order: i + 1 }));

    if (onReorderCollections) {
      onReorderCollections(reordered);
    } else {
      reordered.forEach((c) => onUpdateCollection && onUpdateCollection(c));
    }
  };

  const handleSaveCollectionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colFormData.name.trim()) return;

    if (editingCollection) {
      if (onUpdateCollection) {
        onUpdateCollection({
          ...editingCollection,
          name: colFormData.name.trim(),
          icon: colFormData.icon || '📿',
          description: colFormData.description,
          category: colFormData.category,
          coverImage: colFormData.coverImage,
          visible: colFormData.visible,
          productIds: colFormData.productIds,
        });
      }
    } else {
      if (onAddCollection) {
        onAddCollection({
          name: colFormData.name.trim(),
          icon: colFormData.icon || '📿',
          description: colFormData.description,
          category: colFormData.category,
          coverImage: colFormData.coverImage,
          color: '#D4AF37',
          visible: colFormData.visible,
          productIds: colFormData.productIds,
        });
      }
    }
    setIsAddCollectionOpen(false);
    setEditingCollection(null);
  };

  const handleToggleProductInCollection = (productId: string) => {
    setColFormData((prev) => {
      const exists = prev.productIds.includes(productId);
      const newIds = exists
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId];
      return { ...prev, productIds: newIds };
    });
  };

  const handleCollectionImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setColFormData((prev) => ({ ...prev, coverImage: event.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Edit / Add Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const defaultFormState: Omit<Product, 'id'> = {
    refCode: `${products.length + 1}`.padStart(3, '0'),
    name: '',
    category: 'bijoux',
    subCategory: 'colliers-femme',
    gender: 'femme',
    price: 9500,
    priceVariable: false,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    isFeatured: false,
    badge: 'Nouveauté',
    material: 'Acier Inoxydable 316L',
    guarantee: '1 An de Garantie',
    availability: 'disponible',
    deliveryDelay: '',
    colors: [],
    images: [],
    customizationOptions: {},
  };

  const [formData, setFormData] = useState<Omit<Product, 'id'>>(defaultFormState);
  const [storeFormData, setStoreFormData] = useState<StoreInfo>(storeInfo);

  React.useEffect(() => {
    setStoreFormData(storeInfo);
  }, [storeInfo]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(passwordInput);
    if (success) {
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('Mot de passe incorrect. Veuillez réessayer.');
    }
  };

  const handleImageFileUploadAtIndex = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        updateProductImageAtIndex(index, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProductImageAtIndex = (index: number, url: string) => {
    if (adminTab === 'add') {
      const currentImgs = [...(formData.images || [])];
      while (currentImgs.length <= index) currentImgs.push('');
      currentImgs[index] = url;
      const cleanImgs = currentImgs.slice(0, 3);
      setFormData((prev) => ({
        ...prev,
        imageUrl: cleanImgs[0] || url || prev.imageUrl,
        images: cleanImgs,
      }));
    } else if (editingProduct) {
      const currentImgs = [...(editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : [editingProduct.imageUrl])];
      while (currentImgs.length <= index) currentImgs.push('');
      currentImgs[index] = url;
      const cleanImgs = currentImgs.slice(0, 3);
      setEditingProduct((prev) =>
        prev
          ? {
              ...prev,
              imageUrl: cleanImgs[0] || url || prev.imageUrl,
              images: cleanImgs,
            }
          : null
      );
    }
  };

  const moveProductImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex > 2) return;

    if (adminTab === 'add') {
      const imgs = [...(formData.images || [])];
      if (!imgs[index] || !imgs[targetIndex]) return;
      const temp = imgs[index];
      imgs[index] = imgs[targetIndex];
      imgs[targetIndex] = temp;
      setFormData((prev) => ({
        ...prev,
        imageUrl: imgs[0] || prev.imageUrl,
        images: imgs,
      }));
    } else if (editingProduct) {
      const imgs = [...(editingProduct.images || [editingProduct.imageUrl])];
      if (!imgs[index] || !imgs[targetIndex]) return;
      const temp = imgs[index];
      imgs[index] = imgs[targetIndex];
      imgs[targetIndex] = temp;
      setEditingProduct((prev) =>
        prev
          ? {
              ...prev,
              imageUrl: imgs[0] || prev.imageUrl,
              images: imgs,
            }
          : null
      );
    }
  };

  const removeProductImage = (index: number) => {
    if (adminTab === 'add') {
      const imgs = [...(formData.images || [])];
      imgs.splice(index, 1);
      setFormData((prev) => ({
        ...prev,
        imageUrl: imgs[0] || '',
        images: imgs,
      }));
    } else if (editingProduct) {
      const imgs = [...(editingProduct.images || [editingProduct.imageUrl])];
      imgs.splice(index, 1);
      setEditingProduct((prev) =>
        prev
          ? {
              ...prev,
              imageUrl: imgs[0] || '',
              images: imgs,
            }
          : null
      );
    }
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.refCode) return;
    const finalImgs = (formData.images || []).filter((i) => i && i.trim().length > 0);
    const finalMain = finalImgs[0] || formData.imageUrl;
    onAddProduct({
      ...formData,
      imageUrl: finalMain,
      images: finalImgs.length > 0 ? finalImgs : [finalMain],
    });
    setFormData(defaultFormState);
    setAdminTab('list');
  };

  const handleStartEdit = (product: Product) => {
    const list = [product.imageUrl, ...(product.images || []).filter((i) => i && i !== product.imageUrl)];
    const unique = Array.from(new Set(list)).slice(0, 3);
    setEditingProduct({
      ...product,
      imageUrl: unique[0] || product.imageUrl,
      images: unique,
    });
    setAdminTab('edit');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const finalImgs = (editingProduct.images || []).filter((i) => i && i.trim().length > 0);
    const finalMain = finalImgs[0] || editingProduct.imageUrl;
    onUpdateProduct({
      ...editingProduct,
      imageUrl: finalMain,
      images: finalImgs.length > 0 ? finalImgs : [finalMain],
    });
    setEditingProduct(null);
    setAdminTab('list');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreInfo(storeFormData);
    alert('Coordonnées du catalogue mises à jour avec succès !');
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `anonym_empire_catalogue_export_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div className="relative w-full max-w-6xl h-[88vh] max-h-[92vh] min-h-[480px] bg-white border-2 border-[#D4AF37]/60 rounded-3xl overflow-hidden shadow-[0_0_90px_rgba(212,175,55,0.35)] flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-amber-50 border border-[#D4AF37]/40 text-[#D4AF37]">
              {isAdminLoggedIn ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A0F0A]">
                ANONYM
              </h2>
              {isAdminLoggedIn && (
                <span className="text-xs text-amber-700/70 font-sans">
                  Réservé à la propriétaire (Gestion du Catalogue)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={onLogout}
                className="text-xs text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50"
              >
                Déconnexion
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-600 hover:text-[#1A0F0A] hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div id="admin-modal-scroll-body" className="flex-1 overflow-y-auto p-6">
          <AdminErrorBoundary onReset={() => setAdminTab('list')}>
            {!isAdminLoggedIn ? (
            /* Password Protection Screen */
            <div className="max-w-md mx-auto py-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <Key className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-[#1A0F0A] mb-2 tracking-wide">
                  Espace Privé
                </h3>
                <p className="text-xs text-gray-600">
                  Veuillez saisir votre mot de passe.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    className="w-full bg-white border border-[#D4AF37]/50 rounded-xl px-4 py-3 text-sm text-center text-[#1A0F0A] focus:outline-none focus:border-[#D4AF37] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#D4AF37] p-1"
                    title={showLoginPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {loginError && (
                    <p className="text-xs text-rose-400 mt-2">{loginError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:bg-[#F3E5AB] transition-all cursor-pointer"
                >
                  SE CONNECTER
                </button>
              </form>
            </div>
          ) : (
            /* Admin Logged-In Panel */
            <div className="space-y-6">
              
              {/* Visual Inline Editor CTA Banner */}
              <div className="p-3.5 bg-gradient-to-r from-[#17140B] via-[#221C11] to-[#17140B] border-2 border-[#D4AF37] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5 text-center sm:text-left">
                  <div className="p-2 rounded-xl bg-[#D4AF37] text-black shrink-0">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#F3E5AB]">
                      Nouveau : Éditeur Visuel en Direct (Mode Odoo)
                    </h4>
                    <p className="text-[11px] text-amber-200/80">
                      Modifiez les textes, photos et sections directement sur vos pages publiques en un clic !
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsEditMode(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-black font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 cursor-pointer shrink-0 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>🎨 Modifier le site en direct</span>
                </button>
              </div>

              {/* Tab Selector Bar */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 overflow-x-auto gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAdminTab('list')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'list'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white text-gray-600 hover:text-[#1A0F0A] border border-gray-200'
                    }`}
                  >
                    Gérer le Catalogue ({products.length})
                  </button>
                  <button
                    onClick={() => {
                      setFormData(defaultFormState);
                      setAdminTab('add');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      adminTab === 'add'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white text-gray-600 hover:text-[#1A0F0A] border border-gray-200'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter un Produit</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('settings')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'settings'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white text-gray-600 hover:text-[#1A0F0A] border border-gray-200'
                    }`}
                  >
                    Paramètres Contact
                  </button>
                  <button
                    onClick={() => setAdminTab('subcategories')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'subcategories'
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'bg-white text-amber-400 hover:text-[#1A0F0A] border border-[#D4AF37]/50'
                    }`}
                  >
                    📂 Catégories & Sous-cat.
                  </button>
                  <button
                    onClick={() => setAdminTab('collections')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'collections'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white text-gray-600 hover:text-[#1A0F0A] border border-gray-200'
                    }`}
                  >
                    Collections
                  </button>
                  <button
                    onClick={() => setAdminTab('textes')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'textes'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white text-gray-600 hover:text-[#1A0F0A] border border-gray-200'
                    }`}
                  >
                    Textes des Pages
                  </button>
                  <button
                    onClick={() => setAdminTab('commandes')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'commandes'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white text-gray-600 hover:text-[#1A0F0A] border border-gray-200'
                    }`}
                  >
                    Commandes
                  </button>
                  <button
                    onClick={() => setAdminTab('devis')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'devis'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white text-gray-600 hover:text-[#1A0F0A] border border-gray-200'
                    }`}
                  >
                    Devis
                  </button>
                  <button
                    onClick={() => setAdminTab('avis')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'avis'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white text-gray-600 hover:text-[#1A0F0A] border border-gray-200'
                    }`}
                  >
                    Avis
                  </button>
                  <button
                    onClick={() => setAdminTab('analytics')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'analytics'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white text-gray-600 hover:text-[#1A0F0A] border border-gray-200'
                    }`}
                  >
                    Analytics
                  </button>
                  <button
                    onClick={() => setAdminTab('realisations')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      adminTab === 'realisations'
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'bg-white text-emerald-400 hover:text-[#1A0F0A] border border-emerald-800/60'
                    }`}
                  >
                    📸 Réalisations
                  </button>
                  <button
                    onClick={() => setAdminTab('settings')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      adminTab === 'settings'
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'bg-white text-[#D4AF37] hover:bg-amber-50 border border-[#D4AF37]/40'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Mot de Passe</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJSON}
                    className="p-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-600 hover:text-[#1A0F0A] hover:bg-gray-200 text-xs flex items-center gap-1"
                    title="Sauvegarder le catalogue (JSON)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export Backup</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous réinitialiser le catalogue avec les produits initiaux du PDF ?')) {
                        onResetProducts();
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-600 hover:bg-rose-100 text-xs flex items-center gap-1"
                    title="Réinitialiser au catalogue PDF de base"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Réinitialiser PDF</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: Product List Table with Search, Filters & Sorting */}
              {adminTab === 'list' && (
                <div className="space-y-4">
                  {/* Search & Filter Toolbar */}
                  <div className="bg-gray-50 border border-[#D4AF37]/30 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      {/* Search Bar */}
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={adminSearchQuery}
                          onChange={(e) => setAdminSearchQuery(e.target.value)}
                          placeholder="Rechercher par nom, #REF ou sous-catégorie..."
                          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-9 py-2.5 text-xs text-[#1A0F0A] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                        />
                        {adminSearchQuery && (
                          <button
                            onClick={() => setAdminSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#1A0F0A]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Category Filter */}
                      <div className="flex items-center gap-2">
                        <select
                          value={adminCategoryFilter}
                          onChange={(e) => setAdminCategoryFilter(e.target.value as any)}
                          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#1A0F0A] focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="all">Toutes les catégories</option>
                          <option value="bijoux">💎 Bijoux</option>
                          <option value="emballages">📦 Emballages</option>
                          <option value="parfums">👑 Parfums (Anonym)</option>
                          <option value="accessoires">✨ Accessoires</option>
                        </select>

                        {/* Availability Filter */}
                        <select
                          value={adminAvailabilityFilter}
                          onChange={(e) => setAdminAvailabilityFilter(e.target.value as any)}
                          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-[#1A0F0A] focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="all">Tous les statuts</option>
                          <option value="disponible">🟢 En Stock / Disponible</option>
                          <option value="en-arrivage">📦 Sur commande / Arrivage</option>
                          <option value="epuise">🔴 Épuisé</option>
                        </select>

                        {/* Reset Filters Button */}
                        {(adminSearchQuery || adminCategoryFilter !== 'all' || adminAvailabilityFilter !== 'all') && (
                          <button
                            onClick={() => {
                              setAdminSearchQuery('');
                              setAdminCategoryFilter('all');
                              setAdminAvailabilityFilter('all');
                            }}
                            className="px-3 py-2.5 bg-rose-50 border border-rose-800 text-rose-300 hover:bg-rose-100 rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                            title="Réinitialiser les filtres"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Effacer</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filter Info Counter */}
                    <div className="flex items-center justify-between text-[11px] text-gray-600 border-t border-gray-200/80 pt-2 px-1">
                      <span>
                        Affichage de <strong className="text-[#D4AF37] font-mono">{filteredAdminProducts.length}</strong> sur{' '}
                        <strong className="text-[#1A0F0A] font-mono">{products.length}</strong> produit(s)
                      </span>
                      <span className="hidden sm:inline text-gray-500">
                        Cliquez sur un en-tête de colonne pour trier les résultats
                      </span>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                    <table className="w-full text-left text-xs text-gray-600">
                      <thead className="bg-gray-50 border-b border-gray-200 text-[#8C6D23] font-serif uppercase tracking-wider select-none">
                        <tr>
                          <th className="p-3">Aperçu</th>

                          {/* Clickable Header: Réf */}
                          <th
                            onClick={() => handleSortColumnToggle('refCode')}
                            className="p-3 cursor-pointer hover:bg-gray-100/60 transition-colors"
                            title="Trier par référence"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>Réf</span>
                              {adminSortColumn === 'refCode' ? (
                                adminSortDirection === 'asc' ? (
                                  <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
                                ) : (
                                  <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-600" />
                              )}
                            </div>
                          </th>

                          {/* Clickable Header: Nom */}
                          <th
                            onClick={() => handleSortColumnToggle('name')}
                            className="p-3 cursor-pointer hover:bg-gray-100/60 transition-colors"
                            title="Trier par nom"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>Nom du Produit</span>
                              {adminSortColumn === 'name' ? (
                                adminSortDirection === 'asc' ? (
                                  <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
                                ) : (
                                  <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-600" />
                              )}
                            </div>
                          </th>

                          {/* Clickable Header: Catégorie */}
                          <th
                            onClick={() => handleSortColumnToggle('category')}
                            className="p-3 cursor-pointer hover:bg-gray-100/60 transition-colors"
                            title="Trier par catégorie"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>Catégorie</span>
                              {adminSortColumn === 'category' ? (
                                adminSortDirection === 'asc' ? (
                                  <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
                                ) : (
                                  <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-600" />
                              )}
                            </div>
                          </th>

                          {/* Clickable Header: Prix */}
                          <th
                            onClick={() => handleSortColumnToggle('price')}
                            className="p-3 cursor-pointer hover:bg-gray-100/60 transition-colors"
                            title="Trier par prix"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>Prix FCFA</span>
                              {adminSortColumn === 'price' ? (
                                adminSortDirection === 'asc' ? (
                                  <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
                                ) : (
                                  <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-600" />
                              )}
                            </div>
                          </th>

                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredAdminProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500 font-sans">
                              Aucun produit ne correspond à vos critères de recherche.
                            </td>
                          </tr>
                        ) : (
                          filteredAdminProducts.map((p) => {
                            const safeImg = p?.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop';
                            const safeName = p?.name || 'Produit Sans Nom';
                            const safeRef = p?.refCode || '000';
                            const safeCat = p?.category || 'bijoux';
                            const safePrice = typeof p?.price === 'number' ? p.price : (p?.price || 0);

                            return (
                              <tr key={p?.id || safeRef} className="hover:bg-white/60 transition-colors">
                                <td className="p-3">
                                  <img
                                    src={safeImg}
                                    alt={safeName}
                                    className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                                  />
                                </td>
                                <td className="p-3 font-mono font-bold text-[#D4AF37]">
                                  #{safeRef}
                                </td>
                                <td className="p-3 font-semibold text-[#1A0F0A] max-w-[200px] truncate">
                                  {safeName}
                                </td>
                                <td className="p-3 capitalize">{safeCat}</td>
                                <td className="p-3 font-mono text-[#8C6D23] font-semibold">
                                  {safePrice} FCFA
                                </td>
                                <td className="p-3 text-right space-x-2">
                                  <button
                                    onClick={() => handleStartEdit(p)}
                                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#D4AF37] hover:text-black transition-colors"
                                    title="Modifier"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setProductToDelete(p)}
                                    className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer"
                                    title="Supprimer ce produit"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2 & 3: Add / Edit Product Form */}
              {(adminTab === 'add' || adminTab === 'edit') && (
                <form
                  onSubmit={adminTab === 'add' ? handleSaveAdd : handleSaveEdit}
                  className="bg-gray-50 border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4"
                >
                  <h3 className="text-lg font-serif font-bold text-[#D4AF37]">
                    {adminTab === 'add' ? 'Ajouter une Nouvelle Création' : 'Modifier la Fiche Produit'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-600 mb-1">Code Référence (#001, #212...)</label>
                      <input
                        type="text"
                        required
                        value={adminTab === 'add' ? formData.refCode : editingProduct?.refCode || ''}
                        onChange={(e) =>
                          adminTab === 'add'
                            ? setFormData({ ...formData, refCode: e.target.value })
                            : setEditingProduct(editingProduct ? { ...editingProduct, refCode: e.target.value } : null)
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[#1A0F0A]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Nom du Produit</label>
                      <input
                        type="text"
                        required
                        value={adminTab === 'add' ? formData.name : editingProduct?.name || ''}
                        onChange={(e) =>
                          adminTab === 'add'
                            ? setFormData({ ...formData, name: e.target.value })
                            : setEditingProduct(editingProduct ? { ...editingProduct, name: e.target.value } : null)
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[#1A0F0A]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Catégorie Principale *</label>
                      <select
                        value={adminTab === 'add' ? formData.category : editingProduct?.category || 'bijoux'}
                        onChange={(e) => {
                          const cat = e.target.value as CategoryId;
                          if (adminTab === 'add') {
                            setFormData({ ...formData, category: cat });
                          } else if (editingProduct) {
                            setEditingProduct({ ...editingProduct, category: cat });
                          }
                        }}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[#1A0F0A] focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="bijoux">💎 Bijoux</option>
                        <option value="emballages">📦 Emballages</option>
                        <option value="parfums">👑 Parfums (ANONYM)</option>
                        <option value="accessoires">✨ Accessoires</option>
                      </select>
                    </div>

                    {/* ── 1ST LEVEL SUBCATEGORY SELECTOR ── */}
                    <div>
                      <label className="block text-[#D4AF37] font-semibold mb-1">
                        Sous-Catégorie 1er Niveau (Cible / Mode / Collection)
                      </label>
                      {/* Bijoux: gender field (femme/homme/couple/enfant/mixte) — used directly by the catalogue filter */}
                      {(adminTab === 'add' ? formData.category : editingProduct?.category || 'bijoux') === 'bijoux' && (
                        <select
                          value={adminTab === 'add' ? (formData.gender || 'femme') : (editingProduct?.gender || 'femme')}
                          onChange={(e) => {
                            const val = e.target.value as GenderCategory;
                            if (adminTab === 'add') setFormData({ ...formData, gender: val });
                            else if (editingProduct) setEditingProduct({ ...editingProduct, gender: val });
                          }}
                          className="w-full bg-white border border-[#D4AF37]/50 rounded-lg p-2.5 text-[#1A0F0A] font-semibold focus:border-[#D4AF37] focus:outline-none"
                        >
                          <option value="femme">👩 Bijoux Femme</option>
                          <option value="homme">👨 Bijoux Homme</option>
                          <option value="couple">👩‍❤️‍👨 Bijoux Couple</option>
                          <option value="enfant">👶 Bijoux Enfant</option>
                          <option value="animaux">🐾 Bijoux pour Animaux</option>
                          <option value="mixte">✨ Bijoux Mixte</option>
                        </select>
                      )}
                      {/* Emballages: informative only — le filtre catalogue utilise la Sous-Cat 2 (subCategory) directement */}
                      {(adminTab === 'add' ? formData.category : editingProduct?.category) === 'emballages' && (
                        <select
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-gray-600 italic"
                          disabled
                          value=""
                        >
                          <option value="">📌 Utilisez la Sous-Cat 2 pour classer l'emballage</option>
                        </select>
                      )}
                      {/* Parfums: non applicable — le subCategory du Niv 2 suffit */}
                      {(adminTab === 'add' ? formData.category : editingProduct?.category) === 'parfums' && (
                        <select
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-gray-600 italic"
                          disabled
                          value=""
                        >
                          <option value="">📌 Collection définie par la Sous-Cat 2</option>
                        </select>
                      )}
                      {/* Accessoires: informative only — le filtre catalogue utilise la Sous-Cat 2 (subCategory) directement */}
                      {(adminTab === 'add' ? formData.category : editingProduct?.category) === 'accessoires' && (
                        <select
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-gray-600 italic"
                          disabled
                          value=""
                        >
                          <option value="">📌 Utilisez la Sous-Cat 2 pour classer l'accessoire</option>
                        </select>
                      )}
                    </div>

                    {/* ── 2ND LEVEL SUBCATEGORY SELECTOR ── */}
                    <div>
                      <label className="block text-[#D4AF37] font-semibold mb-1">
                        Sous-Catégorie 2e Niveau (Élément Spécifique) *
                      </label>
                      <select
                        value={
                          adminTab === 'add'
                            ? (formData.subCategory || 'colliers')
                            : (editingProduct?.subCategory || 'colliers')
                        }
                        onChange={(e) => {
                          const val = e.target.value as SubCategory;
                          if (adminTab === 'add') {
                            setFormData({ ...formData, subCategory: val });
                          } else if (editingProduct) {
                            setEditingProduct({ ...editingProduct, subCategory: val });
                          }
                        }}
                        className="w-full bg-white border border-[#D4AF37]/50 rounded-lg p-2.5 text-[#1A0F0A] font-semibold focus:border-[#D4AF37] focus:outline-none"
                      >
                        {(adminTab === 'add' ? formData.category : editingProduct?.category || 'bijoux') === 'bijoux' && (
                          <>
                            <option value="colliers">📿 Colliers</option>
                            <option value="bracelets">🔗 Bracelets</option>
                            <option value="bagues">💍 Bagues</option>
                            <option value="boucles-oreilles">✨ Boucles d'oreilles</option>
                            <option value="chaines-pieds">🦶 Chaînes de pieds</option>
                            <option value="perles-hanche">💃 Perles de hanche</option>
                            <option value="montres">⌚ Montres</option>
                            <option value="medailles">🏅 Médailles</option>
                            <option value="manchettes">💪 Manchettes</option>
                            <option value="autres">✨ Autres Bijoux</option>
                          </>
                        )}
                        {(adminTab === 'add' ? formData.category : editingProduct?.category) === 'emballages' && (
                          <>
                            <option value="boites">📦 Boîtes</option>
                            <option value="sachets">🛍️ Sachets</option>
                            <option value="sacs">👜 Sacs</option>
                            <option value="pots">🫙 Pots</option>
                            <option value="flacons">🧪 Flacons</option>
                            <option value="papier">📄 Papier</option>
                            <option value="plastique">🥤 Plastique</option>
                            <option value="verre">🥛 Verre</option>
                            <option value="aluminium">🥫 Aluminium</option>
                            <option value="biodegradable">🌱 Biodégradable</option>
                            <option value="restauration">🍽️ Restauration / Alimentation</option>
                            <option value="cosmetiques">💄 Cosmétiques</option>
                            <option value="boutiques">🏪 Boutiques</option>
                            <option value="mariage">💒 Mariage</option>
                            <option value="anniversaire">🎂 Anniversaire</option>
                            <option value="cadeaux">🎁 Cadeaux</option>
                            <option value="pro">💼 Professionnel</option>
                            <option value="autres">📦 Autres Emballages</option>
                          </>
                        )}
                        {(adminTab === 'add' ? formData.category : editingProduct?.category) === 'parfums' && (
                          <>
                            <option value="anonym-invitation">👑 ANONYM INVITATION</option>
                            <option value="extrait-50ml">👑 Extrait de Parfum 50ml</option>
                            <option value="huile-olfactive">✨ Huile Olfactive Sur-Mesure</option>
                            <option value="brume">🌸 Brume Parfumée</option>
                            <option value="collections-privees">✨ Collections Privées</option>
                          </>
                        )}
                        {(adminTab === 'add' ? formData.category : editingProduct?.category) === 'accessoires' && (
                          <>
                            <option value="verres">🥂 Verres Personnalisés</option>
                            <option value="tasses">☕ Tasses & Mugs</option>
                            <option value="stylos">🖊️ Stylos Personnalisés</option>
                            <option value="portecles">🔑 Porte-Clés Personnalisés</option>
                            <option value="nounours">🧸 Nounours Personnalisés</option>
                            <option value="bijoux">💍 Bijoux Personnalisés</option>
                            <option value="cadeaux">🎁 Cadeaux</option>
                            <option value="social">🎉 Événements Sociaux</option>
                            <option value="pro">💼 Événements Professionnels</option>
                            <option value="entreprises">🏢 Entreprises</option>
                            <option value="autres">✨ Autres Accessoires</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Collection principale</label>
                      <select
                        value={
                          adminTab === 'add'
                            ? (formData.collectionIds?.[0] || '')
                            : (editingProduct?.collectionIds?.[0] || '')
                        }
                        onChange={(e) => {
                          const colId = e.target.value;
                          const newCols = colId ? [colId] : [];
                          if (adminTab === 'add') {
                            setFormData({ ...formData, collectionIds: newCols });
                          } else if (editingProduct) {
                            setEditingProduct({ ...editingProduct, collectionIds: newCols });
                          }
                        }}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[#1A0F0A]"
                      >
                        <option value="">-- Aucune collection spécifiée --</option>
                        {collections.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.icon || '📿'} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1">Prix Indicatif (FCFA) *</label>
                      <input
                        type="text"
                        required
                        value={adminTab === 'add' ? formData.price : editingProduct?.price || ''}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/g, '');
                          const parsed = clean ? parseInt(clean) : 0;
                          if (adminTab === 'add') {
                            setFormData({ ...formData, price: parsed });
                          } else if (editingProduct) {
                            setEditingProduct({ ...editingProduct, price: parsed });
                          }
                        }}
                        placeholder="Ex: 9500 (Chiffres uniquement)"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[#1A0F0A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#D4AF37] font-semibold mb-1">
                        Statut du Produit (Disponibilité / Badge) *
                      </label>
                      <select
                        value={
                          adminTab === 'add'
                            ? (formData.availability || 'disponible')
                            : (editingProduct?.availability || 'disponible')
                        }
                        onChange={(e) => {
                          const val = e.target.value as AvailabilityStatus;
                          const isNouv = val === 'nouveau';
                          if (adminTab === 'add') {
                            setFormData({
                              ...formData,
                              availability: val,
                              badge: isNouv ? 'Nouveauté' : val === 'epuise' ? 'Épuisé' : val === 'sur-commande' ? 'Sur commande' : 'Disponible',
                              isFeatured: isNouv ? true : formData.isFeatured,
                            });
                          } else if (editingProduct) {
                            setEditingProduct({
                              ...editingProduct,
                              availability: val,
                              badge: isNouv ? 'Nouveauté' : val === 'epuise' ? 'Épuisé' : val === 'sur-commande' ? 'Sur commande' : 'Disponible',
                              isFeatured: isNouv ? true : editingProduct.isFeatured,
                            });
                          }
                        }}
                        className="w-full bg-white border border-[#D4AF37]/50 rounded-lg p-2.5 text-[#1A0F0A] font-semibold focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="disponible">🟢 Disponible (En stock)</option>
                        <option value="sur-commande">🟡 Sur commande (Confection sur-mesure)</option>
                        <option value="epuise">🔴 Épuisé (Rupture de stock)</option>
                        <option value="nouveau">✨ Nouveau (Nouveauté / En Vedette)</option>
                      </select>
                    </div>

                    {/* ── 3-PHOTO CAROUSEL MANAGEMENT (CENTRAL SPEC REQUIREMENT) ── */}
                    <div className="sm:col-span-2 bg-[#0C0C0C] border border-[#D4AF37]/40 rounded-2xl p-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                          <Upload className="w-4 h-4 text-[#D4AF37]" />
                          <span>Gestion des 3 Photos du Carrousel Produit</span>
                        </h4>
                        <p className="text-[11px] text-gray-600 mt-0.5">
                          Ajoutez jusqu'à 3 photos défilantes pour ce produit (principale, secondaire, troisième vue).
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[0, 1, 2].map((slotIdx) => {
                          const currentImgs = adminTab === 'add'
                            ? (formData.images && formData.images.length > 0 ? formData.images : [formData.imageUrl])
                            : (editingProduct?.images && editingProduct.images.length > 0 ? editingProduct.images : [editingProduct?.imageUrl || '']);
                          
                          const imgVal = currentImgs[slotIdx] || '';
                          const isMain = slotIdx === 0;

                          return (
                            <div
                              key={slotIdx}
                              className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 bg-white ${
                                isMain ? 'border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)]' : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold font-mono ${isMain ? 'text-[#D4AF37]' : 'text-gray-600'}`}>
                                  Photo #{slotIdx + 1} {isMain && '(Principale)'}
                                </span>
                              </div>
                              <ImageUploader
                                value={imgVal}
                                onChange={(val) => updateProductImageAtIndex(slotIdx, val)}
                                compact={true}
                                allowUrlInput={false}
                                aspectRatio="square"
                                maxSizeMB={5}
                                placeholder={`Sélectionner Photo #${slotIdx + 1}...`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setAdminTab('list')}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB: Collections */}
              {adminTab === 'collections' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 border border-[#D4AF37]/30 rounded-2xl p-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                        <Layout className="w-5 h-5 text-[#D4AF37]" />
                        <span>Gestion des Collections & Univers</span>
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Organisez vos créations en univers personnalisés (titre, icône, catégorie parente, image & liste des produits).
                      </p>
                    </div>

                    {!isAddCollectionOpen && (
                      <button
                        onClick={handleStartAddCollection}
                        className="px-4 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F3E5AB] transition-all cursor-pointer shadow-md flex items-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Créer une Collection</span>
                      </button>
                    )}
                  </div>

                  {/* Collection Form (Add or Edit) */}
                  {isAddCollectionOpen && (
                    <form onSubmit={handleSaveCollectionForm} className="bg-gray-50 border border-[#D4AF37]/50 rounded-2xl p-6 space-y-4">
                      <h4 className="text-base font-serif font-bold text-[#D4AF37] flex items-center justify-between">
                        <span>{editingCollection ? `Éditer la Collection: ${editingCollection.name}` : 'Nouvelle Collection'}</span>
                        <button
                          type="button"
                          onClick={() => setIsAddCollectionOpen(false)}
                          className="text-gray-600 hover:text-[#1A0F0A] text-xs flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Fermer</span>
                        </button>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">Nom de la Collection *</label>
                          <input
                            type="text"
                            required
                            value={colFormData.name}
                            onChange={(e) => setColFormData({ ...colFormData, name: e.target.value })}
                            placeholder="ex: Colliers Prestige Femme"
                            className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#1A0F0A] focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">Catégorie Parente *</label>
                          <select
                            value={colFormData.category}
                            onChange={(e) => setColFormData({ ...colFormData, category: e.target.value as CategoryId })}
                            className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#1A0F0A] focus:border-[#D4AF37] focus:outline-none"
                          >
                            <option value="bijoux">💎 Bijoux</option>
                            <option value="emballages">📦 Emballages</option>
                            <option value="parfums">👑 Parfums (ANONYM)</option>
                            <option value="accessoires">✨ Accessoires</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">Icône / Émoji</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={colFormData.icon}
                              onChange={(e) => setColFormData({ ...colFormData, icon: e.target.value })}
                              className="w-20 bg-white border border-gray-200 rounded-xl p-2.5 text-center text-base text-[#1A0F0A] focus:border-[#D4AF37] focus:outline-none"
                            />
                            <div className="flex flex-wrap gap-1">
                              {['📿', '💍', '⌚', '📦', '🎁', '✨', '👑', '🎨', '🕯️'].map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => setColFormData({ ...colFormData, icon: emoji })}
                                  className="p-1.5 rounded-lg bg-white border border-gray-200 text-sm hover:border-[#D4AF37]"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <ImageUploader
                            value={colFormData.coverImage}
                            onChange={(val) => setColFormData({ ...colFormData, coverImage: val })}
                            label="Image de Couverture (Optionnelle)"
                            allowUrlInput={false}
                            maxSizeMB={5}
                            placeholder="Sélectionner l'image de couverture depuis votre appareil..."
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-gray-600 font-semibold mb-1">Description courte</label>
                          <input
                            type="text"
                            value={colFormData.description}
                            onChange={(e) => setColFormData({ ...colFormData, description: e.target.value })}
                            placeholder="Courte présentation de cet univers..."
                            className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-[#1A0F0A] focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="colVisibleToggle"
                            checked={colFormData.visible}
                            onChange={(e) => setColFormData({ ...colFormData, visible: e.target.checked })}
                            className="w-4 h-4 accent-[#D4AF37] rounded"
                          />
                          <label htmlFor="colVisibleToggle" className="text-xs text-gray-600 cursor-pointer">
                            Afficher cette collection sur le site public
                          </label>
                        </div>

                        {/* Product Attachment Selector */}
                        <div className="sm:col-span-2 bg-white/60 border border-gray-200 rounded-2xl p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div>
                              <h5 className="text-xs font-serif font-bold text-[#D4AF37]">
                                Produits Rattachés ({colFormData.productIds.length} sélectionné(s))
                              </h5>
                              <p className="text-[11px] text-gray-600">Cochez les produits faisant partie de cette collection.</p>
                            </div>

                            {/* Product search box */}
                            <div className="relative w-full sm:w-60">
                              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={colProductSearch}
                                onChange={(e) => setColProductSearch(e.target.value)}
                                placeholder="Chercher un produit..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-[#1A0F0A] focus:outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                          </div>

                          <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1 scrollbar-thin scrollbar-thumb-gray-800">
                            {products
                              .filter((p) => {
                                if (colFormData.category && p.category !== colFormData.category) return false;
                                if (colProductSearch.trim()) {
                                  const q = colProductSearch.toLowerCase();
                                  return p.name.toLowerCase().includes(q) || p.refCode.toLowerCase().includes(q);
                                }
                                return true;
                              })
                              .map((p) => {
                                const isChecked = colFormData.productIds.includes(p.id);
                                return (
                                  <label
                                    key={p.id}
                                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                                      isChecked ? 'bg-[#D4AF37]/15 border-[#D4AF37]/60 text-[#1A0F0A]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-200'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleToggleProductInCollection(p.id)}
                                      className="w-3.5 h-3.5 accent-[#D4AF37]"
                                    />
                                    <img src={p.imageUrl} alt={p.name} className="w-7 h-7 object-cover rounded border border-gray-200" />
                                    <div className="flex-1 min-w-0 truncate">
                                      <span className="font-semibold text-[#1A0F0A] truncate block">{p.name}</span>
                                      <span className="text-[10px] text-[#D4AF37] font-mono">#{p.refCode} • {p.price} FCFA</span>
                                    </div>
                                  </label>
                                );
                              })}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => setIsAddCollectionOpen(false)}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs cursor-pointer"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Save className="w-4 h-4" />
                          <span>Enregistrer la Collection</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Existing Collections Cards List */}
                  <div className="space-y-3">
                    {sortedCollections.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 border border-gray-200 rounded-2xl">
                        <p className="text-xs text-gray-600">Aucune collection créée pour le moment.</p>
                        <button
                          onClick={handleStartAddCollection}
                          className="mt-3 px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-xl"
                        >
                          + Créer la première collection
                        </button>
                      </div>
                    ) : (
                      sortedCollections.map((col, idx) => (
                        <div key={col.id} className="bg-white border border-gray-200 hover:border-[#D4AF37]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                          <div className="flex items-center gap-3.5">
                            {col.coverImage ? (
                              <img src={col.coverImage} alt={col.name} className="w-12 h-12 object-cover rounded-xl border border-gray-200" />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl">
                                {col.icon || '📿'}
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-base font-serif font-bold text-[#1A0F0A]">{col.name}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-mono capitalize">
                                  {col.category || 'bijoux'}
                                </span>
                                {col.visible === false && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-400 border border-rose-800">
                                    Masquée
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5">{col.description || 'Pas de description'}</p>
                              <div className="text-[10px] text-gray-500 font-mono mt-1">
                                <strong className="text-[#F3E5AB]">{col.productIds?.length || 0}</strong> produit(s) rattaché(s) • Ordre: {col.order || idx + 1}
                              </div>
                            </div>
                          </div>

                          {/* Actions: Edit, Move Up, Move Down, Delete */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => handleStartEditCollection(col)}
                              className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-200 hover:bg-[#D4AF37] hover:text-black text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Modifier cette collection"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Éditer</span>
                            </button>

                            <button
                              onClick={() => handleMoveCollection(idx, 'up')}
                              disabled={idx === 0}
                              className="p-2 rounded-xl bg-gray-100 text-[#D4AF37] hover:text-black hover:bg-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              title="Déplacer vers le haut"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleMoveCollection(idx, 'down')}
                              disabled={idx === sortedCollections.length - 1}
                              className="p-2 rounded-xl bg-gray-100 text-[#D4AF37] hover:text-black hover:bg-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              title="Déplacer vers le bas"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setCollectionToDelete(col)}
                              className="p-2 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-800 hover:text-[#1A0F0A] transition-colors cursor-pointer"
                              title="Supprimer la collection"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB: SubCategories (Niv 1 & Niv 2) */}
              {adminTab === 'subcategories' && (
                <div className="space-y-6">
                  {/* Category Selector Filter Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 border border-[#D4AF37]/30 rounded-2xl p-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                        <Filter className="w-5 h-5 text-[#D4AF37]" />
                        <span>Gestion des Sous-Catégories (Niveaux 1 & 2)</span>
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Gérez et personnalisez en direct les cibles, filtres et sous-arborescences de chacune des 5 cartes parentes.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                      {(['bijoux', 'emballages', 'parfums', 'accessoires'] as CategoryId[]).map((catId) => (
                        <button
                          key={catId}
                          type="button"
                          onClick={() => setSubCatParentFilter(catId)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                            subCatParentFilter === catId
                              ? 'bg-[#D4AF37] text-black shadow-md'
                              : 'bg-white text-gray-600 border border-gray-200 hover:text-[#1A0F0A]'
                          }`}
                        >
                          {catId}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* LEVEL 1 SECTION */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <div>
                        <h4 className="text-sm font-serif font-bold text-[#1A0F0A] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                          <span>Sous-Catégories Niveau 1 — Carte {subCatParentFilter.toUpperCase()}</span>
                        </h4>
                        <p className="text-[11px] text-gray-600">Ex: Femme, Homme, Par type, Cadeaux, etc.</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleStartAddLvl1}
                        className="px-3.5 py-1.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl hover:bg-[#F3E5AB] cursor-pointer shadow-md flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Ajouter Niv. 1</span>
                      </button>
                    </div>

                    {/* Level 1 Form Modal / Inline Box */}
                    {isAddLvl1Open && (
                      <form onSubmit={handleSaveLvl1Form} className="bg-[#1A1A1A] border border-[#D4AF37]/50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-[#D4AF37]">
                          <span>{editingSubLvl1 ? `Éditer Niv 1: ${editingSubLvl1.name}` : 'Nouvelle Sous-Catégorie Niveau 1'}</span>
                          <button type="button" onClick={() => setIsAddLvl1Open(false)} className="text-gray-600 hover:text-[#1A0F0A]">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="block text-gray-600 mb-1">Nom Commercial *</label>
                            <input
                              type="text"
                              required
                              value={lvl1FormData.name}
                              onChange={(e) => setLvl1FormData({ ...lvl1FormData, name: e.target.value })}
                              placeholder="ex: BIJOUX ADO"
                              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-[#1A0F0A] uppercase focus:border-[#D4AF37]"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-600 mb-1">Catégorie Parente</label>
                            <select
                              value={lvl1FormData.parentCategory}
                              onChange={(e) => setLvl1FormData({ ...lvl1FormData, parentCategory: e.target.value as CategoryId })}
                              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-[#1A0F0A] capitalize focus:border-[#D4AF37]"
                            >
                              <option value="bijoux">Bijoux</option>
                              <option value="emballages">Emballages</option>
                              <option value="parfums">Parfums (ANONYM)</option>
                              <option value="accessoires">Accessoires</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-gray-600 mb-1">Icône / Émoji</label>
                            <input
                              type="text"
                              value={lvl1FormData.icon}
                              onChange={(e) => setLvl1FormData({ ...lvl1FormData, icon: e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-[#1A0F0A] text-center focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={lvl1FormData.visible}
                              onChange={(e) => setLvl1FormData({ ...lvl1FormData, visible: e.target.checked })}
                              className="w-3.5 h-3.5 accent-[#D4AF37]"
                            />
                            <span>Visible côté public</span>
                          </label>

                          <div className="flex gap-2">
                            <button type="button" onClick={() => setIsAddLvl1Open(false)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg">
                              Annuler
                            </button>
                            <button type="submit" className="px-4 py-1.5 bg-[#D4AF37] text-black font-bold text-xs rounded-lg">
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Level 1 List */}
                    {(() => {
                      const lvl1Items = (subCategoriesLvl1 || []).filter((c) => c.parentCategory === subCatParentFilter);
                      if (lvl1Items.length === 0) {
                        return <p className="text-xs text-gray-500 italic py-2">Aucune sous-catégorie niveau 1 configurée pour {subCatParentFilter}.</p>;
                      }
                      return (
                        <div className="space-y-2">
                          {lvl1Items.map((item, idx) => (
                            <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{item.icon || '📌'}</span>
                                <div>
                                  <span className="font-bold text-[#1A0F0A] font-mono">{item.name}</span>
                                  {item.visible === false && <span className="ml-2 text-[10px] text-rose-400 font-mono">(Masquée)</span>}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleStartAddLvl2(item.id)}
                                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#D4AF37] hover:text-black text-gray-600 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                                  title="Ajouter un sous-élément Niv 2 sous cet élément"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>+ Niv 2</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStartEditLvl1(item)}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#D4AF37] hover:text-black text-gray-600 cursor-pointer"
                                  title="Éditer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveSubLvl1Item(lvl1Items, idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:text-[#1A0F0A] disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveSubLvl1Item(lvl1Items, idx, 'down')}
                                  disabled={idx === lvl1Items.length - 1}
                                  className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:text-[#1A0F0A] disabled:opacity-30 cursor-pointer"
                                >
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLvl1ToDelete(item)}
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-800 hover:text-[#1A0F0A] cursor-pointer"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* LEVEL 2 SECTION */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-3 gap-3">
                      <div>
                        <h4 className="text-sm font-serif font-bold text-[#1A0F0A] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span>Sous-Catégories Niveau 2 (Types & Articles Spécifiques)</span>
                        </h4>
                        <p className="text-[11px] text-gray-600">Ex: Colliers, Bagues, Boîtes, Sachets, Verres, etc.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartAddLvl2()}
                        className="px-3.5 py-1.5 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400 cursor-pointer shadow-md flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Ajouter Niv. 2</span>
                      </button>
                    </div>

                    {/* Level 2 Form Modal / Inline Box */}
                    {isAddLvl2Open && (
                      <form onSubmit={handleSaveSubLvl2Form} className="bg-[#1A1A1A] border border-emerald-500/50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                          <span>{editingSubLvl2 ? `Éditer Niv 2: ${editingSubLvl2.name}` : 'Nouvelle Sous-Catégorie Niveau 2'}</span>
                          <button type="button" onClick={() => setIsAddLvl2Open(false)} className="text-gray-600 hover:text-[#1A0F0A]">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-gray-600 mb-1">Nom Commercial *</label>
                            <input
                              type="text"
                              required
                              value={lvl2FormData.name}
                              onChange={(e) => setLvl2FormData({ ...lvl2FormData, name: e.target.value })}
                              placeholder="ex: COLLIERS SUR MESURE"
                              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-[#1A0F0A] uppercase focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-600 mb-1">Parent Niveau 1 *</label>
                            <select
                              required
                              value={lvl2FormData.level1Id}
                              onChange={(e) => {
                                const l1 = subCategoriesLvl1?.find((c) => c.id === e.target.value);
                                setLvl2FormData({
                                  ...lvl2FormData,
                                  level1Id: e.target.value,
                                  parentCategory: l1?.parentCategory || subCatParentFilter,
                                });
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-[#1A0F0A] focus:border-emerald-500"
                            >
                              <option value="">-- Sélectionner le parent Niv. 1 --</option>
                              {(subCategoriesLvl1 || []).map((l1) => (
                                <option key={l1.id} value={l1.id}>
                                  [{l1.parentCategory.toUpperCase()}] {l1.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={lvl2FormData.visible}
                              onChange={(e) => setLvl2FormData({ ...lvl2FormData, visible: e.target.checked })}
                              className="w-3.5 h-3.5 accent-emerald-500"
                            />
                            <span>Visible côté public</span>
                          </label>

                          <div className="flex gap-2">
                            <button type="button" onClick={() => setIsAddLvl2Open(false)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg">
                              Annuler
                            </button>
                            <button type="submit" className="px-4 py-1.5 bg-emerald-500 text-black font-bold text-xs rounded-lg">
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Level 2 List grouped by Level 1 */}
                    {(() => {
                      const parentLvl1s = (subCategoriesLvl1 || []).filter((c) => c.parentCategory === subCatParentFilter);
                      if (parentLvl1s.length === 0) {
                        return <p className="text-xs text-gray-500 italic">Créez d'abord une sous-catégorie niveau 1 ci-dessus.</p>;
                      }

                      return (
                        <div className="space-y-4">
                          {parentLvl1s.map((l1) => {
                            const lvl2Items = (subCategoriesLvl2 || []).filter((c) => c.level1Id === l1.id);
                            return (
                              <div key={l1.id} className="bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 space-y-2">
                                <div className="flex items-center justify-between text-xs border-b border-gray-200/60 pb-2">
                                  <span className="font-bold text-[#D4AF37] font-serif flex items-center gap-1.5">
                                    <span>{l1.icon || '📌'}</span>
                                    <span>Niv. 1: {l1.name}</span>
                                    <span className="text-[10px] text-gray-500 font-mono">({lvl2Items.length} élément(s))</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleStartAddLvl2(l1.id)}
                                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Ajouter sous {l1.name}</span>
                                  </button>
                                </div>

                                {lvl2Items.length === 0 ? (
                                  <p className="text-[11px] text-gray-500 italic pl-2">Aucun sous-élément niveau 2 rattaché.</p>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                    {lvl2Items.map((item, idx) => (
                                      <div key={item.id} className="bg-white/60 border border-gray-200/80 rounded-lg p-2.5 flex items-center justify-between text-xs">
                                        <div className="truncate">
                                          <span className="font-mono text-gray-200">{item.name}</span>
                                          {item.visible === false && <span className="ml-1 text-[10px] text-rose-400">(Masqué)</span>}
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <button
                                            type="button"
                                            onClick={() => handleStartEditLvl2(item)}
                                            className="p-1 rounded bg-gray-100 text-gray-600 hover:text-[#1A0F0A]"
                                            title="Éditer"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleMoveSubLvl2Item(lvl2Items, idx, 'up', l1.id)}
                                            disabled={idx === 0}
                                            className="p-1 rounded bg-gray-100 text-gray-600 hover:text-[#1A0F0A] disabled:opacity-30"
                                          >
                                            <ChevronUp className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleMoveSubLvl2Item(lvl2Items, idx, 'down', l1.id)}
                                            disabled={idx === lvl2Items.length - 1}
                                            className="p-1 rounded bg-gray-100 text-gray-600 hover:text-[#1A0F0A] disabled:opacity-30"
                                          >
                                            <ChevronDown className="w-3 h-3" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setLvl2ToDelete(item)}
                                            className="p-1 rounded bg-rose-50 text-rose-400 hover:bg-rose-800 hover:text-[#1A0F0A]"
                                            title="Supprimer"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Level 1 Delete Confirmation Modal */}
                  {lvl1ToDelete && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm animate-fadeIn" onClick={() => setLvl1ToDelete(null)}>
                      <div className="bg-[#161616] border-2 border-rose-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
                          <Trash2 className="w-7 h-7" />
                        </div>
                        <h4 className="text-lg font-serif font-bold text-[#1A0F0A]">
                          Supprimer la Sous-Catégorie Niveau 1 ?
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Êtes-vous sûre de vouloir supprimer la sous-catégorie <strong className="text-rose-300">"{lvl1ToDelete.name}"</strong> ? Ses sous-éléments de niveau 2 seront également supprimés. Cette action est irréversible.
                        </p>
                        <div className="flex justify-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setLvl1ToDelete(null)}
                            className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (onDeleteSubCatLvl1) onDeleteSubCatLvl1(lvl1ToDelete.id);
                              setLvl1ToDelete(null);
                            }}
                            className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-[#1A0F0A] font-bold text-xs rounded-xl cursor-pointer shadow-lg"
                          >
                            Oui, Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Level 2 Delete Confirmation Modal */}
                  {lvl2ToDelete && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm animate-fadeIn" onClick={() => setLvl2ToDelete(null)}>
                      <div className="bg-[#161616] border-2 border-rose-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
                          <Trash2 className="w-7 h-7" />
                        </div>
                        <h4 className="text-lg font-serif font-bold text-[#1A0F0A]">
                          Supprimer la Sous-Catégorie Niveau 2 ?
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Êtes-vous sûre de vouloir supprimer la sous-catégorie <strong className="text-rose-300">"{lvl2ToDelete.name}"</strong> ? Cette action est irréversible.
                        </p>
                        <div className="flex justify-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setLvl2ToDelete(null)}
                            className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (onDeleteSubCatLvl2) onDeleteSubCatLvl2(lvl2ToDelete.id);
                              setLvl2ToDelete(null);
                            }}
                            className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-[#1A0F0A] font-bold text-xs rounded-xl cursor-pointer shadow-lg"
                          >
                            Oui, Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {adminTab === 'settings' && (
                <div className="space-y-6">
                  <form onSubmit={handleSaveSettings} className="bg-gray-50 border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-serif font-bold text-[#D4AF37]">
                      Coordonnées de la Boutique
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-600 mb-1">Nom Commercial</label>
                        <input
                          type="text"
                          value={storeFormData.fullName}
                          onChange={(e) => setStoreFormData({ ...storeFormData, fullName: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[#1A0F0A]"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 mb-1">Numéro WhatsApp (Format Int. ex: 2290191118884)</label>
                        <input
                          type="text"
                          value={storeFormData.whatsappNumber}
                          onChange={(e) => setStoreFormData({ ...storeFormData, whatsappNumber: e.target.value.replace(/[^\d\s+\-()]/g, '') })}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[#1A0F0A]"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 mb-1">Téléphone 1 (Avec 01)</label>
                        <input
                          type="text"
                          value={storeFormData.phone1}
                          onChange={(e) => setStoreFormData({ ...storeFormData, phone1: e.target.value.replace(/[^\d\s+\-()]/g, '') })}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[#1A0F0A]"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 mb-1">Téléphone 2 (Avec 01)</label>
                        <input
                          type="text"
                          value={storeFormData.phone2}
                          onChange={(e) => setStoreFormData({ ...storeFormData, phone2: e.target.value.replace(/[^\d\s+\-()]/g, '') })}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[#1A0F0A]"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 mb-1">Email Officiel</label>
                        <input
                          type="email"
                          value={storeFormData.email}
                          onChange={(e) => setStoreFormData({ ...storeFormData, email: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-[#1A0F0A]"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <h4 className="text-sm font-serif font-bold text-[#D4AF37]">
                        Photo de la Fondatrice (Section À Propos)
                      </h4>
                      <ImageUploader
                        value={storeFormData.founderSection?.photoUrl || ''}
                        onChange={(val) =>
                          setStoreFormData({
                            ...storeFormData,
                            founderSection: {
                              ...(storeFormData.founderSection || {}),
                              photoUrl: val,
                            },
                          })
                        }
                        label="Changer la photo de la Fondatrice (Lizie Fifamè ALLATIN)"
                        allowUrlInput={false}
                        maxSizeMB={5}
                        placeholder="Sélectionner une nouvelle photo de la fondatrice..."
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Sauvegarder les Coordonnées</span>
                      </button>
                    </div>
                  </form>

                  {/* Single Unified Password Change Box */}
                  <div className="bg-gray-50 border border-[#D4AF37]/30 rounded-2xl p-6 space-y-5">
                    <div className="flex items-center gap-3 border-b border-[#D4AF37]/20 pb-4">
                      <div className="p-3 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                        <Key className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-[#1A0F0A]">Changer le Mot de Passe Administrateur</h3>
                        <p className="text-xs text-gray-600 font-sans">
                          Sécurisez votre accès administrateur à tout moment.
                        </p>
                      </div>
                    </div>

                    {passwordChangeSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{passwordChangeSuccess}</span>
                      </div>
                    )}

                    {passwordError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-500/60 text-rose-300 text-xs font-semibold flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{passwordError}</span>
                      </div>
                    )}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setPasswordError('');
                        setPasswordChangeSuccess('');

                        if (!currentPasswordInput) {
                          setPasswordError('Veuillez saisir votre mot de passe actuel.');
                          return;
                        }
                        if (newPasswordInput.trim().length < 4) {
                          setPasswordError('Le nouveau mot de passe doit comporter au moins 4 caractères.');
                          return;
                        }
                        if (newPasswordInput !== confirmPasswordInput) {
                          setPasswordError('Le nouveau mot de passe et sa confirmation ne correspondent pas.');
                          return;
                        }
                        if (onChangeAdminPassword) {
                          onChangeAdminPassword(newPasswordInput.trim());
                          setPasswordChangeSuccess('Votre mot de passe administrateur a été mis à jour avec succès !');
                          setCurrentPasswordInput('');
                          setNewPasswordInput('');
                          setConfirmPasswordInput('');
                        } else {
                          setPasswordError('Une erreur est survenue lors de la mise à jour.');
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Mot de passe actuel <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              required
                              value={currentPasswordInput}
                              onChange={(e) => setCurrentPasswordInput(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#1A0F0A] pr-10 focus:border-[#D4AF37] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#D4AF37] cursor-pointer"
                              title={showCurrentPassword ? 'Masquer' : 'Afficher'}
                            >
                              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Nouveau mot de passe <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              required
                              value={newPasswordInput}
                              onChange={(e) => setNewPasswordInput(e.target.value)}
                              placeholder="Nouveau mot de passe"
                              className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#1A0F0A] pr-10 focus:border-[#D4AF37] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#D4AF37] cursor-pointer"
                              title={showNewPassword ? 'Masquer' : 'Afficher'}
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Confirmer le mot de passe <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              value={confirmPasswordInput}
                              onChange={(e) => setConfirmPasswordInput(e.target.value)}
                              placeholder="Confirmation"
                              className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs text-[#1A0F0A] pr-10 focus:border-[#D4AF37] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#D4AF37] cursor-pointer"
                              title={showConfirmPassword ? 'Masquer' : 'Afficher'}
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#996515] hover:from-[#F3E5AB] hover:to-[#B8935F] text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Mettre à jour le mot de passe</span>
                        </button>
                      </div>
                    </form>

                    <div className="p-4 rounded-xl bg-white/60 border border-amber-900/40 text-xs text-amber-700/90 space-y-2 mt-4">
                      <h4 className="font-bold font-serif text-[#D4AF37]">Astuces d'Accès Discret Administrateur :</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 text-[11px]">
                        <li><strong>Geste Mobile Secret :</strong> Maintenez appuyé le Logo ANONYM pendant 2,5 secondes en haut à gauche.</li>
                        <li><strong>Raccourci Clavier :</strong> Appuyez sur <kbd className="bg-gray-100 px-1 rounded">Ctrl + Shift + A</kbd> n'importe où sur le site.</li>
                        <li><strong>Lien URL Direct :</strong> Ajoutez <code className="text-[#D4AF37]">/#admin</code> à la fin de l'adresse de votre site web.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {adminTab === 'textes' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUpdateStoreInfo(storeFormData);
                    alert('Tous les textes du site ont été mis à jour avec succès !');
                  }}
                  className="bg-gray-50 border border-[#D4AF37]/30 rounded-2xl p-6 space-y-6"
                >
                  <h3 className="text-lg font-serif font-bold text-[#D4AF37]">Éditeur Complet des Textes du Site</h3>

                  {/* 1. HERO & ACCUEIL */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white/40 space-y-3">
                    <h4 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider">1. En-tête Principal (Hero & Accueil)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Badge Haut ("Maison de...")</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.accueil?.badgeTop || ''}
                          placeholder="Maison de Création & Personnalisation"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accueil: { ...storeFormData.pageTexts?.accueil, badgeTop: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Titre Principal ("ANONYM")</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.accueil?.heroTitle || ''}
                          placeholder="ANONYM"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accueil: { ...storeFormData.pageTexts?.accueil, heroTitle: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Sous-titre / Slogan</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.accueil?.heroSubtitle || ''}
                          placeholder="« L'art de se démarquer »"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accueil: { ...storeFormData.pageTexts?.accueil, heroSubtitle: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Badge Qualité</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.accueil?.badgeQuality || ''}
                          placeholder="Qualité · Confiance · Élégance"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accueil: { ...storeFormData.pageTexts?.accueil, badgeQuality: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Paragraphe d'Accroche</label>
                      <textarea
                        rows={2}
                        value={storeFormData.pageTexts?.accueil?.heroDescription || ''}
                        placeholder="Créations d'exception gravées sur-mesure..."
                        onChange={(e) =>
                          setStoreFormData({
                            ...storeFormData,
                            pageTexts: {
                              ...storeFormData.pageTexts,
                              accueil: { ...storeFormData.pageTexts?.accueil, heroDescription: e.target.value },
                            },
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                      />
                    </div>
                    {/* Chiffres Clés */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                      <div>
                        <label className="text-[10px] text-gray-500 block mb-0.5">Stat 1 (Valeur)</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.accueil?.stat1Value || ''}
                          placeholder="211+"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accueil: { ...storeFormData.pageTexts?.accueil, stat1Value: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-[#1A0F0A]"
                        />
                        <label className="text-[10px] text-gray-500 block mt-1 mb-0.5">Stat 1 (Libellé)</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.accueil?.stat1Label || ''}
                          placeholder="Modèles de Bijoux"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accueil: { ...storeFormData.pageTexts?.accueil, stat1Label: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block mb-0.5">Stat 2 (Valeur)</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.accueil?.stat2Value || ''}
                          placeholder="1 An"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accueil: { ...storeFormData.pageTexts?.accueil, stat2Value: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-[#1A0F0A]"
                        />
                        <label className="text-[10px] text-gray-500 block mt-1 mb-0.5">Stat 2 (Libellé)</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.accueil?.stat2Label || ''}
                          placeholder="Garantie Inox 316L"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accueil: { ...storeFormData.pageTexts?.accueil, stat2Label: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block mb-0.5">Stat 3 (Valeur)</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.accueil?.stat3Value || ''}
                          placeholder="100%"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accueil: { ...storeFormData.pageTexts?.accueil, stat3Value: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-[#1A0F0A]"
                        />
                        <label className="text-[10px] text-gray-500 block mt-1 mb-0.5">Stat 3 (Libellé)</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.accueil?.stat3Label || ''}
                          placeholder="Sur-Mesure"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accueil: { ...storeFormData.pageTexts?.accueil, stat3Label: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-[#1A0F0A]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. CARTE & SECTION "À PROPOS" (FONDATRICE & DIRECTION) */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white/40 space-y-3">
                    <h4 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider">2. Carte & Section "À PROPOS" (Fondatrice & Direction)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Nom de la Fondatrice</label>
                        <input
                          type="text"
                          value={storeFormData.founderSection?.name || ''}
                          placeholder="Lizie Fifamè ALLATIN"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              founderSection: { ...(storeFormData.founderSection || {}), name: e.target.value },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Titre / Fonction Officielle</label>
                        <input
                          type="text"
                          value={storeFormData.founderSection?.title || ''}
                          placeholder="Fondatrice & Directrice Générale — ANONYM"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              founderSection: { ...(storeFormData.founderSection || {}), title: e.target.value },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Badge Photo ("Directrice Générale...")</label>
                        <input
                          type="text"
                          value={storeFormData.founderSection?.badge || ''}
                          placeholder="Directrice Générale & CEO"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              founderSection: { ...(storeFormData.founderSection || {}), badge: e.target.value },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Titre de la Section ("La Fondatrice...")</label>
                        <input
                          type="text"
                          value={storeFormData.founderSection?.sectionTitle || ''}
                          placeholder="La Fondatrice : Lizie Fifamè ALLATIN"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              founderSection: { ...(storeFormData.founderSection || {}), sectionTitle: e.target.value },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Citation Inspirante</label>
                      <textarea
                        rows={2}
                        value={storeFormData.founderSection?.quote || ''}
                        placeholder="Inspirée par l'excellence et le prestige royal..."
                        onChange={(e) =>
                          setStoreFormData({
                            ...storeFormData,
                            founderSection: { ...(storeFormData.founderSection || {}), quote: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Paragraphe Présentation / Histoire</label>
                      <textarea
                        rows={3}
                        value={storeFormData.founderSection?.paragraph || ''}
                        placeholder="Basée à Abomey-Calavi (Bénin)..."
                        onChange={(e) =>
                          setStoreFormData({
                            ...storeFormData,
                            founderSection: { ...(storeFormData.founderSection || {}), paragraph: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Badges de Valeurs de Marque (Séparés par une virgule)</label>
                      <input
                        type="text"
                        value={(storeFormData.values || []).join(', ')}
                        placeholder="UNICITÉ, ÉLÉGANCE, PERSONNALISATION"
                        onChange={(e) =>
                          setStoreFormData({
                            ...storeFormData,
                            values: e.target.value.split(',').map((v) => v.trim()).filter(Boolean),
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                      />
                    </div>

                    {/* Engagements du Catalogue Officiel */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <label className="text-[11px] font-semibold text-[#D4AF37] block">Engagements & Informations Officieuses (1 à 4)</label>
                      {[0, 1, 2, 3].map((idx) => {
                        const defaultCommitments: import('../types').FounderCommitment[] = [
                          { icon: 'check', label: 'Garantie Inox 316L 1 An :', text: 'Nos bijoux ne rouillent pas, ne noircissent pas et résistent à l\'eau.' },
                          { icon: 'check', label: 'Gravure Laser & Impression HD :', text: 'Personnalisation millimétrée des prénoms, dates, symboles et logos.' },
                          { icon: 'check', label: 'Expédition & Livraison Bénin :', text: 'Livraison sécurisée à Cotonou, Abomey-Calavi, Parakou et toute la sous-région.' },
                          { icon: 'check', label: 'Service Client Direct WhatsApp :', text: 'Accompagnement personnalisé et réponse sous 24h par notre équipe.' },
                        ];
                        const currentCommitments = storeFormData.founderSection?.commitments || defaultCommitments;
                        const itemLabel = currentCommitments[idx]?.label || defaultCommitments[idx].label;
                        const itemText = currentCommitments[idx]?.text || defaultCommitments[idx].text;

                        return (
                          <div key={idx} className="p-2 bg-white border border-gray-200 rounded-lg space-y-1.5">
                            <span className="text-[10px] font-mono text-gray-600">Engagement #{idx + 1}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={itemLabel}
                                placeholder="Libellé / Titre..."
                                onChange={(e) => {
                                  const updated = [...currentCommitments];
                                  while (updated.length <= idx) updated.push({ icon: 'check', label: '', text: '' });
                                  updated[idx] = { icon: (updated[idx]?.icon || 'check'), label: e.target.value, text: (updated[idx]?.text || '') };
                                  setStoreFormData({
                                    ...storeFormData,
                                    founderSection: { ...(storeFormData.founderSection || {}), commitments: updated },
                                  });
                                }}
                                className="w-full bg-[#111] border border-gray-200 rounded p-1.5 text-xs text-[#1A0F0A]"
                              />
                              <input
                                type="text"
                                value={itemText}
                                placeholder="Texte explicatif..."
                                onChange={(e) => {
                                  const updated: import('../types').FounderCommitment[] = [...currentCommitments];
                                  while (updated.length <= idx) updated.push({ icon: 'check', label: '', text: '' });
                                  updated[idx] = { icon: (updated[idx]?.icon || 'check'), label: (updated[idx]?.label || ''), text: e.target.value };
                                  setStoreFormData({
                                    ...storeFormData,
                                    founderSection: { ...(storeFormData.founderSection || {}), commitments: updated },
                                  });
                                }}
                                className="w-full bg-[#111] border border-gray-200 rounded p-1.5 text-xs text-[#1A0F0A]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. LE PROCESSUS ANONYM */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white/40 space-y-3">
                    <h4 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider">3. Section "Le Processus ANONYM"</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Titre de la section</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.processus?.title || ''}
                          placeholder="Le Processus ANONYM"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                processus: { ...storeFormData.pageTexts?.processus, title: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Sous-titre de la section</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.processus?.subtitle || ''}
                          placeholder="De la sélection à la livraison..."
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                processus: { ...storeFormData.pageTexts?.processus, subtitle: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <label className="text-[11px] font-semibold text-[#D4AF37] block">Étapes du Processus (1 à 6)</label>
                      {[0, 1, 2, 3, 4, 5].map((idx) => {
                        const defaultTitles = [
                          '1. Choisissez votre produit',
                          '2. Personnalisation',
                          '3. Commande via WhatsApp',
                          '4. Délai de fabrication',
                          '5. Livraison partout au Bénin',
                          '6. Garantie ANONYM',
                        ];
                        const currentRules = storeFormData.pageTexts?.processus?.rules || [];
                        const ruleTitle = currentRules[idx]?.title || '';
                        const ruleDesc = currentRules[idx]?.description || '';

                        return (
                          <div key={idx} className="p-2 bg-white border border-gray-200 rounded-lg space-y-1.5">
                            <span className="text-[10px] font-mono text-gray-600">Étape #{idx + 1} ({defaultTitles[idx]})</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={ruleTitle}
                                placeholder={defaultTitles[idx]}
                                onChange={(e) => {
                                  const updatedRules = [...currentRules];
                                  while (updatedRules.length <= idx) updatedRules.push({});
                                  updatedRules[idx] = { ...updatedRules[idx], title: e.target.value };
                                  setStoreFormData({
                                    ...storeFormData,
                                    pageTexts: {
                                      ...storeFormData.pageTexts,
                                      processus: { ...storeFormData.pageTexts?.processus, rules: updatedRules },
                                    },
                                  });
                                }}
                                className="w-full bg-[#111] border border-gray-200 rounded p-1.5 text-xs text-[#1A0F0A]"
                              />
                              <input
                                type="text"
                                value={ruleDesc}
                                placeholder="Description de cette étape..."
                                onChange={(e) => {
                                  const updatedRules = [...currentRules];
                                  while (updatedRules.length <= idx) updatedRules.push({});
                                  updatedRules[idx] = { ...updatedRules[idx], description: e.target.value };
                                  setStoreFormData({
                                    ...storeFormData,
                                    pageTexts: {
                                      ...storeFormData.pageTexts,
                                      processus: { ...storeFormData.pageTexts?.processus, rules: updatedRules },
                                    },
                                  });
                                }}
                                className="w-full bg-[#111] border border-gray-200 rounded p-1.5 text-xs text-[#1A0F0A]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. CARTES D'UNIVERS & PAGES DE CATÉGORIES */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white/40 space-y-3">
                    <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">4. Cartes des Univers & Pages de Catégories (Bijoux, Emballages, Parfums, Accessoires)</h4>
                    {(['bijoux', 'emballages', 'parfums', 'accessoires'] as const).map((cat) => (
                      <div key={cat} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-white border border-gray-200 rounded-lg">
                        <div>
                          <label className="text-[10px] text-[#D4AF37] uppercase font-bold block mb-1">{cat} — Titre</label>
                          <input
                            type="text"
                            value={storeFormData.pageTexts?.[cat]?.title || ''}
                            placeholder={cat.toUpperCase()}
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  [cat]: { ...storeFormData.pageTexts?.[cat], title: e.target.value },
                                },
                              })
                            }
                            className="w-full bg-[#111] border border-gray-200 rounded p-1.5 text-xs text-[#1A0F0A]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-600 block mb-1">{cat} — Description courte</label>
                          <input
                            type="text"
                            value={storeFormData.pageTexts?.[cat]?.description || ''}
                            placeholder="Description affichée sur la carte..."
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  [cat]: { ...storeFormData.pageTexts?.[cat], description: e.target.value },
                                },
                              })
                            }
                            className="w-full bg-[#111] border border-gray-200 rounded p-1.5 text-xs text-[#1A0F0A]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 4bis. PAGE PARFUMS — BLOC DESCRIPTION & HISTOIRE */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                        ✨ Page Parfums — Bloc Histoire & Description (L'essence d'un nom)
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                        <input
                          type="checkbox"
                          checked={storeFormData.pageTexts?.parfums?.storyVisible !== false}
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                parfums: {
                                  ...storeFormData.pageTexts?.parfums,
                                  storyVisible: e.target.checked,
                                },
                              },
                            })
                          }
                          className="rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span>Afficher sur la page Parfums</span>
                      </label>
                    </div>

                    <div className="space-y-2.5 p-3 bg-white border border-gray-200 rounded-xl">
                      <div>
                        <label className="text-[11px] text-[#D4AF37] font-semibold block mb-1">Titre du Récit</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.parfums?.storyTitle || ''}
                          placeholder="L'essence d'un nom"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                parfums: {
                                  ...storeFormData.pageTexts?.parfums,
                                  storyTitle: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-gray-600 block mb-1">Paragraphe 1 (Histoire & Philosophie)</label>
                          <textarea
                            rows={3}
                            value={storeFormData.pageTexts?.parfums?.storyText1 || ''}
                            placeholder="ANONYM n'est pas qu'un parfum..."
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  parfums: {
                                    ...storeFormData.pageTexts?.parfums,
                                    storyText1: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-gray-600 block mb-1">Paragraphe 2 (Signature & Raffinement)</label>
                          <textarea
                            rows={3}
                            value={storeFormData.pageTexts?.parfums?.storyText2 || ''}
                            placeholder="Nous avons voulu créer un univers..."
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  parfums: {
                                    ...storeFormData.pageTexts?.parfums,
                                    storyText2: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-gray-600 block mb-1">Photo 1 (URL ou Upload)</label>
                          <input
                            type="text"
                            value={storeFormData.pageTexts?.parfums?.storyImageUrl1 || ''}
                            placeholder="https://..."
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  parfums: {
                                    ...storeFormData.pageTexts?.parfums,
                                    storyImageUrl1: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-gray-600 block mb-1">Photo 2 (URL ou Upload)</label>
                          <input
                            type="text"
                            value={storeFormData.pageTexts?.parfums?.storyImageUrl2 || ''}
                            placeholder="https://..."
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  parfums: {
                                    ...storeFormData.pageTexts?.parfums,
                                    storyImageUrl2: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4ter. PAGE BIJOUX — BLOC DESCRIPTION & HISTOIRE */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                        ✨ Page Bijoux — Bloc Histoire & Description
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                        <input
                          type="checkbox"
                          checked={storeFormData.pageTexts?.bijoux?.storyVisible !== false}
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                bijoux: {
                                  ...storeFormData.pageTexts?.bijoux,
                                  storyVisible: e.target.checked,
                                },
                              },
                            })
                          }
                          className="rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span>Afficher sur la page Bijoux</span>
                      </label>
                    </div>
                    <div className="space-y-2.5 p-3 bg-white border border-gray-200 rounded-xl">
                      <div>
                        <label className="text-[11px] text-[#D4AF37] font-semibold block mb-1">Titre du Récit</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.bijoux?.storyTitle || ''}
                          placeholder="Une empreinte qui vous ressemble"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                bijoux: {
                                  ...storeFormData.pageTexts?.bijoux,
                                  storyTitle: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Paragraphe (Histoire & Savoir-faire)</label>
                        <textarea
                          rows={3}
                          value={storeFormData.pageTexts?.bijoux?.storyText1 || ''}
                          placeholder="Chez ANONYM, chaque bijou commence par une histoire..."
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                bijoux: {
                                  ...storeFormData.pageTexts?.bijoux,
                                  storyText1: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-gray-600 block mb-1">Photo 1 (URL)</label>
                          <input
                            type="text"
                            value={storeFormData.pageTexts?.bijoux?.storyImageUrl1 || ''}
                            placeholder="https://..."
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  bijoux: {
                                    ...storeFormData.pageTexts?.bijoux,
                                    storyImageUrl1: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-gray-600 block mb-1">Photo 2 (URL)</label>
                          <input
                            type="text"
                            value={storeFormData.pageTexts?.bijoux?.storyImageUrl2 || ''}
                            placeholder="https://..."
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  bijoux: {
                                    ...storeFormData.pageTexts?.bijoux,
                                    storyImageUrl2: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4quater. PAGE EMBALLAGES — BLOC DESCRIPTION & HISTOIRE */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                        ✨ Page Emballages — Bloc Histoire & Description
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                        <input
                          type="checkbox"
                          checked={storeFormData.pageTexts?.emballages?.storyVisible !== false}
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                emballages: {
                                  ...storeFormData.pageTexts?.emballages,
                                  storyVisible: e.target.checked,
                                },
                              },
                            })
                          }
                          className="rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span>Afficher sur la page Emballages</span>
                      </label>
                    </div>
                    <div className="space-y-2.5 p-3 bg-white border border-gray-200 rounded-xl">
                      <div>
                        <label className="text-[11px] text-[#D4AF37] font-semibold block mb-1">Titre du Récit</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.emballages?.storyTitle || ''}
                          placeholder="Le premier geste d'une histoire"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                emballages: {
                                  ...storeFormData.pageTexts?.emballages,
                                  storyTitle: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Paragraphe (Histoire & Philosophie)</label>
                        <textarea
                          rows={3}
                          value={storeFormData.pageTexts?.emballages?.storyText1 || ''}
                          placeholder="Un cadeau se raconte avant même d'être ouvert..."
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                emballages: {
                                  ...storeFormData.pageTexts?.emballages,
                                  storyText1: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-gray-600 block mb-1">Photo 1 (URL)</label>
                          <input
                            type="text"
                            value={storeFormData.pageTexts?.emballages?.storyImageUrl1 || ''}
                            placeholder="https://..."
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  emballages: {
                                    ...storeFormData.pageTexts?.emballages,
                                    storyImageUrl1: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-gray-600 block mb-1">Photo 2 (URL)</label>
                          <input
                            type="text"
                            value={storeFormData.pageTexts?.emballages?.storyImageUrl2 || ''}
                            placeholder="https://..."
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  emballages: {
                                    ...storeFormData.pageTexts?.emballages,
                                    storyImageUrl2: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4quinquies. PAGE ACCESSOIRES — BLOC DESCRIPTION & HISTOIRE */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                        ✨ Page Accessoires — Bloc Histoire & Description
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                        <input
                          type="checkbox"
                          checked={storeFormData.pageTexts?.accessoires?.storyVisible !== false}
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accessoires: {
                                  ...storeFormData.pageTexts?.accessoires,
                                  storyVisible: e.target.checked,
                                },
                              },
                            })
                          }
                          className="rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <span>Afficher sur la page Accessoires</span>
                      </label>
                    </div>
                    <div className="space-y-2.5 p-3 bg-white border border-gray-200 rounded-xl">
                      <div>
                        <label className="text-[11px] text-[#D4AF37] font-semibold block mb-1">Titre du Récit</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.accessoires?.storyTitle || ''}
                          placeholder="L'élégance au quotidien"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accessoires: {
                                  ...storeFormData.pageTexts?.accessoires,
                                  storyTitle: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Paragraphe (Histoire & Style de vie)</label>
                        <textarea
                          rows={3}
                          value={storeFormData.pageTexts?.accessoires?.storyText1 || ''}
                          placeholder="Au-delà des bijoux, ANONYM imagine des accessoires..."
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                accessoires: {
                                  ...storeFormData.pageTexts?.accessoires,
                                  storyText1: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-gray-600 block mb-1">Photo 1 (URL)</label>
                          <input
                            type="text"
                            value={storeFormData.pageTexts?.accessoires?.storyImageUrl1 || ''}
                            placeholder="https://..."
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  accessoires: {
                                    ...storeFormData.pageTexts?.accessoires,
                                    storyImageUrl1: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-gray-600 block mb-1">Photo 2 (URL)</label>
                          <input
                            type="text"
                            value={storeFormData.pageTexts?.accessoires?.storyImageUrl2 || ''}
                            placeholder="https://..."
                            onChange={(e) =>
                              setStoreFormData({
                                ...storeFormData,
                                pageTexts: {
                                  ...storeFormData.pageTexts,
                                  accessoires: {
                                    ...storeFormData.pageTexts?.accessoires,
                                    storyImageUrl2: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full bg-white border border-gray-200 rounded p-2 text-xs text-[#1A0F0A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. DEMANDE DE DEVIS & FOOTER */}
                  <div className="border border-gray-200 rounded-xl p-4 bg-white/40 space-y-3">
                    <h4 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider">5. Demande de Devis & Pied de Page (Footer)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Titre Devis</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.devis?.title || ''}
                          placeholder="Demande de Devis Personnalisé"
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                devis: { ...storeFormData.pageTexts?.devis, title: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Sous-titre Devis</label>
                        <input
                          type="text"
                          value={storeFormData.pageTexts?.devis?.subtitle || ''}
                          placeholder="Décrivez votre projet..."
                          onChange={(e) =>
                            setStoreFormData({
                              ...storeFormData,
                              pageTexts: {
                                ...storeFormData.pageTexts,
                                devis: { ...storeFormData.pageTexts?.devis, subtitle: e.target.value },
                              },
                            })
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Bannière Baseline Footer</label>
                      <input
                        type="text"
                        value={storeFormData.pageTexts?.footer?.baseline || ''}
                        placeholder="QUALITÉ • CONFIANCE • ÉLÉGANCE"
                        onChange={(e) =>
                          setStoreFormData({
                            ...storeFormData,
                            pageTexts: {
                              ...storeFormData.pageTexts,
                              footer: { ...storeFormData.pageTexts?.footer, baseline: e.target.value },
                            },
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1A0F0A]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#D4AF37] hover:bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg"
                    >
                      Enregistrer Tous les Textes du Site
                    </button>
                  </div>
                </form>
              )}

              {/* TAB: Commandes */}
              {adminTab === 'commandes' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 border border-[#D4AF37]/30 rounded-2xl p-4 gap-3">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        <span>Suivi des Commandes ({orders.length})</span>
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Historique et gestion des commandes soumises par vos clients.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-600">Total Ventes : </span>
                      <span className="text-sm font-serif font-bold text-[#F3E5AB]">
                        {formatPriceFCFA(orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0))}
                      </span>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
                      <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">Aucune commande enregistrée pour le moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((ord) => (
                        <div key={ord.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                            <div>
                              <span className="font-mono text-xs font-bold text-[#D4AF37]">#{ord.id}</span>
                              <span className="ml-2 text-xs font-serif font-semibold text-[#1A0F0A]">{ord.productName}</span>
                              {ord.productRefCode && (
                                <span className="ml-2 text-[10px] font-mono text-gray-600">(Réf #{ord.productRefCode})</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#F3E5AB] font-serif">
                                {formatPriceFCFA(ord.totalPrice || 0)}
                              </span>
                              <select
                                value={ord.status}
                                onChange={(e) => onUpdateOrderStatus && onUpdateOrderStatus(ord.id, e.target.value as any)}
                                className="bg-white border border-gray-200 text-xs text-[#1A0F0A] rounded-lg p-1 focus:border-[#D4AF37]"
                              >
                                <option value="nouvelle">🟡 Nouvelle</option>
                                <option value="en-preparation">🔵 En préparation</option>
                                <option value="livree">🟢 Livrée</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => onDeleteOrder && onDeleteOrder(ord.id)}
                                className="p-1 rounded bg-rose-50 text-rose-400 hover:bg-rose-800 hover:text-[#1A0F0A]"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                            <div>
                              <span className="text-gray-500 block text-[10px]">Client / Contact :</span>
                              <span>{ord.customerName || 'Client anonyme'} {ord.customerPhone ? `(${ord.customerPhone})` : ''}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">Quantité :</span>
                              <span>{ord.quantity} unité(s)</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px]">Date :</span>
                              <span>
                                {new Date(ord.createdAt).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>

                          {(ord.customizationNotes || ord.metalFinish || ord.selectedColor || ord.customText) && (
                            <div className="p-2.5 rounded-xl bg-white/60 border border-gray-200 text-[11px] space-y-1">
                              <span className="text-[#D4AF37] font-semibold block">Spécifications & Personnalisation :</span>
                              {ord.metalFinish && <p className="text-gray-600">• Finition Métal : {ord.metalFinish}</p>}
                              {ord.selectedColor && <p className="text-gray-600">• Couleur : {ord.selectedColor}</p>}
                              {ord.customText && <p className="text-gray-600">• Texte personnalisé : « {ord.customText} »</p>}
                              {ord.customizationNotes && <p className="text-gray-600">• Note : {ord.customizationNotes}</p>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Devis */}
              {adminTab === 'devis' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-gray-50 border border-[#D4AF37]/30 rounded-2xl p-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span>Demandes de Devis Sur Mesure ({quoteRequests.length})</span>
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Consultez et modifiez le statut des demandes personnalisées soumises par vos clients.
                      </p>
                    </div>
                  </div>

                  {quoteRequests.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
                      <FileText className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">Aucune demande de devis reçue pour le moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quoteRequests.map((req) => (
                        <div key={req.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                            <div>
                              <span className="font-mono text-xs font-bold text-[#D4AF37]">#{req.id}</span>
                              <span className="ml-2 text-xs font-bold text-[#1A0F0A] uppercase bg-gray-100 px-2 py-0.5 rounded">
                                {req.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={req.status}
                                onChange={(e) => onUpdateQuoteRequestStatus && onUpdateQuoteRequestStatus(req.id, e.target.value as any)}
                                className="bg-white border border-gray-200 text-xs text-[#1A0F0A] rounded-lg p-1 focus:border-[#D4AF37]"
                              >
                                <option value="nouvelle">🟡 Nouvelle</option>
                                <option value="en-cours">🔵 En cours</option>
                                <option value="acceptee">🟢 Acceptée</option>
                                <option value="refusee">🔴 Refusée</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => setQuoteToDelete(req)}
                                className="p-1 rounded bg-rose-50 text-rose-400 hover:bg-rose-800 hover:text-[#1A0F0A]"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <p className="text-gray-600"><strong>Contact :</strong> {req.contactName} ({req.contactPhone})</p>
                              <p className="text-gray-600"><strong>Quantité :</strong> {req.quantity || 1}</p>
                              {req.budget && <p className="text-gray-600"><strong>Budget :</strong> {req.budget}</p>}
                              {req.deadline && <p className="text-gray-600"><strong>Date souhaitée :</strong> {req.deadline}</p>}
                            </div>

                            {req.inspirationPhotoUrl && (
                              <div>
                                <span className="text-[10px] text-gray-500 block mb-1">Photo d'inspiration :</span>
                                <img
                                  src={req.inspirationPhotoUrl}
                                  alt="Inspiration"
                                  className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                                />
                              </div>
                            )}
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/60 border border-gray-200 text-xs text-gray-600 italic">
                            « {req.description} »
                          </div>

                          <div className="text-[10px] text-gray-500 text-right">
                            Reçu le {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Avis */}
              {adminTab === 'avis' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 border border-[#D4AF37]/30 rounded-2xl p-4 gap-3">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        <span>Modération des Avis Clients ({reviews.length})</span>
                      </h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Validez les avis déposés par vos clients pour les publier publiquement sur le site, ou rejetez-les.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl">
                        🟡 {reviews.filter((r) => !r.approved).length} en attente
                      </span>
                      <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl">
                        🟢 {reviews.filter((r) => r.approved).length} approuvés
                      </span>
                    </div>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
                      <Star className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">Aucun avis client reçu pour le moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className={`bg-gray-50 border rounded-2xl p-4 space-y-3 transition-all ${
                            rev.approved ? 'border-emerald-500/30' : 'border-amber-500/40 bg-amber-950/10'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-[#1A0F0A] text-sm font-serif">{rev.authorName}</span>
                              <div className="flex items-center gap-0.5 text-[#D4AF37]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-700'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {new Date(rev.date).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {rev.approved ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600/40 text-[10px] font-bold">
                                  🟢 Approuvé (Publié sur le site)
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50 text-[10px] font-bold animate-pulse">
                                  🟡 En Attente de Modération
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 italic leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>

                          {rev.photoUrl && (
                            <img
                              src={rev.photoUrl}
                              alt="Photo avis"
                              className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                            />
                          )}

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200/60">
                            {!rev.approved ? (
                              <button
                                type="button"
                                onClick={() => onUpdateReview && onUpdateReview({ ...rev, approved: true })}
                                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-md"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approuver & Publier</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onUpdateReview && onUpdateReview({ ...rev, approved: false })}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-100 text-amber-300 font-semibold text-xs rounded-xl cursor-pointer"
                              >
                                Masquer du site
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setReviewToDelete(rev)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-800 text-rose-300 font-semibold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Rejeter / Supprimer</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Analytics */}
              {adminTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
                      <span>Tableau de Bord & Analytics Réels</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Statistiques réelles sur la fréquentation, l'intérêt des visiteurs et les ventes afin d'orienter vos publications et promotions (WhatsApp, Instagram, Facebook).
                    </p>
                  </div>

                  {/* CALCULATED TIME-BASED VISITOR LOGS */}
                  {(() => {
                    const now = new Date();
                    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;
                    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

                    const logs = analytics.visitorLogs || [];
                    const visitsToday = logs.filter((isoStr) => new Date(isoStr).getTime() >= todayStart).length;
                    const visitsThisWeek = logs.filter((isoStr) => new Date(isoStr).getTime() >= weekStart).length;
                    const visitsThisMonth = logs.filter((isoStr) => new Date(isoStr).getTime() >= monthStart).length;
                    const totalVisits = analytics.totalVisits || logs.length;

                    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
                    const viewsMap: Record<string, number> = analytics.productViews || {};
                    const totalViews = Object.values(viewsMap).reduce((a, b) => (a || 0) + (b || 0), 0);

                    // Top viewed product
                    const topViewedEntry = Object.entries(viewsMap)
                      .sort(([, a], [, b]) => (b || 0) - (a || 0))[0];
                    const topViewedProduct = topViewedEntry ? products.find((p) => p.id === topViewedEntry[0]) : null;

                    // Top ordered product
                    const orderCountMap: Record<string, number> = {};
                    orders.forEach((o) => {
                      if (o.productId) orderCountMap[o.productId] = (orderCountMap[o.productId] || 0) + (o.quantity || 1);
                    });
                    const topOrderedEntry = Object.entries(orderCountMap).sort(([, a], [, b]) => b - a)[0];
                    const topOrderedProduct = topOrderedEntry ? products.find((p) => p.id === topOrderedEntry[0]) : null;

                    return (
                      <>
                        {/* 1. VISITOR TRAFFIC EVOLUTION (TODAY, WEEK, MONTH, TOTAL) */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#D4AF37]" />
                            <span>Fréquentation du Site (Évolution temporelle réellle)</span>
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-gray-50 border border-[#D4AF37]/40 rounded-2xl p-4 text-center shadow-lg relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-12 h-12 bg-[#D4AF37]/10 rounded-bl-full pointer-events-none" />
                              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#F3E5AB] block">{visitsToday}</span>
                              <span className="text-[11px] font-semibold text-gray-600 block mt-0.5">Visiteurs Aujourd'hui</span>
                              <span className="text-[9px] text-gray-500 font-mono block mt-1">Sessions uniques</span>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center shadow-lg">
                              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1A0F0A] block">{visitsThisWeek}</span>
                              <span className="text-[11px] font-semibold text-gray-600 block mt-0.5">Cette Semaine</span>
                              <span className="text-[9px] text-gray-500 font-mono block mt-1">7 derniers jours</span>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center shadow-lg">
                              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1A0F0A] block">{visitsThisMonth}</span>
                              <span className="text-[11px] font-semibold text-gray-600 block mt-0.5">Ce Mois-ci</span>
                              <span className="text-[9px] text-gray-500 font-mono block mt-1">30 derniers jours</span>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center shadow-lg">
                              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37] block">{totalVisits}</span>
                              <span className="text-[11px] font-semibold text-gray-600 block mt-0.5">Visites Cumulées</span>
                              <span className="text-[9px] text-gray-500 font-mono block mt-1">Total historique</span>
                            </div>
                          </div>
                        </div>

                        {/* 2. SALES & QUOTES OVERVIEW */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="bg-gradient-to-br from-[#1A160C] to-[#121212] border border-[#D4AF37]/50 rounded-2xl p-4 text-center shadow-xl">
                            <span className="text-xl sm:text-2xl font-serif font-bold text-[#F3E5AB] block truncate">
                              {formatPriceFCFA(totalRevenue)}
                            </span>
                            <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">Chiffre d'Affaires Enregistré</span>
                          </div>

                          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center shadow-lg">
                            <span className="text-xl sm:text-2xl font-serif font-bold text-[#1A0F0A] block">{orders.length}</span>
                            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Commandes Totales</span>
                          </div>

                          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center shadow-lg col-span-2 sm:col-span-1">
                            <span className="text-xl sm:text-2xl font-serif font-bold text-[#1A0F0A] block">{quoteRequests.length}</span>
                            <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Demandes de Devis</span>
                          </div>
                        </div>

                        {/* 3. STRATEGIC RECOMMENDATIONS FOR LIZIE (WHAT TO POST ON WHATSAPP & SOCIAL MEDIA) */}
                        <div className="bg-gradient-to-r from-[#17140B] via-[#121212] to-[#17140B] border border-[#D4AF37]/40 rounded-2xl p-5 space-y-3 shadow-xl">
                          <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                            <span>Conseils Marketing pour vos Statuts WhatsApp & Réseaux Sociaux</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {/* Product Trending */}
                            <div className="bg-white/60 border border-amber-900/40 rounded-xl p-3.5 space-y-1.5">
                              <span className="text-[#F3E5AB] font-bold font-serif flex items-center gap-1.5 text-xs">
                                🔥 Produit le Plus Consulté sur le site
                              </span>
                              {topViewedProduct ? (
                                <div className="flex items-center gap-2.5 pt-1">
                                  <img src={topViewedProduct.imageUrl} alt={topViewedProduct.name} className="w-10 h-10 object-cover rounded-lg border border-[#D4AF37]/30" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-[#1A0F0A] truncate">{topViewedProduct.name}</p>
                                    <p className="text-[11px] text-amber-700/90 italic">
                                      💡 <strong>Action recommandée :</strong> Postez ce bijou sur votre statut WhatsApp ! Il génère le plus de curiosité.
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-[11px] text-gray-600 italic">Consultez des fiches produits sur le site pour identifier le bijou star du moment.</p>
                              )}
                            </div>

                            {/* Product Top Seller */}
                            <div className="bg-white/60 border border-emerald-900/40 rounded-xl p-3.5 space-y-1.5">
                              <span className="text-emerald-400 font-bold font-serif flex items-center gap-1.5 text-xs">
                                🛍️ Produit le Plus Commandé
                              </span>
                              {topOrderedProduct ? (
                                <div className="flex items-center gap-2.5 pt-1">
                                  <img src={topOrderedProduct.imageUrl} alt={topOrderedProduct.name} className="w-10 h-10 object-cover rounded-lg border border-emerald-700/40" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-[#1A0F0A] truncate">{topOrderedProduct.name}</p>
                                    <p className="text-[11px] text-emerald-200/90 italic">
                                      💡 <strong>Action recommandée :</strong> Mettez en avant ce best-seller en story avec un témoignage cliente.
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-[11px] text-gray-600 italic">Enregistrez des commandes pour identifier votre pièce la plus vendue.</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 4. TOP 5 MOST VIEWED PRODUCTS */}
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 shadow-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-serif font-bold text-[#1A0F0A] flex items-center gap-2">
                              <Eye className="w-4 h-4 text-[#D4AF37]" />
                              <span>Produits les Plus Consultés (Vues Fiches Produits)</span>
                            </h4>
                            <span className="text-[11px] font-mono text-gray-600">Total : {totalViews} vue(s)</span>
                          </div>

                          {(() => {
                            const pViews: Record<string, number> = analytics.productViews || {};
                            const topViewed = Object.entries(pViews)
                              .sort(([, a], [, b]) => (b || 0) - (a || 0))
                              .slice(0, 5)
                              .map(([id, views]) => ({
                                product: products.find((p) => p.id === id),
                                views: Number(views) || 0,
                              }))
                              .filter((item) => item.product);

                            if (topViewed.length === 0) {
                              return (
                                <div className="text-center py-6 bg-white/40 rounded-xl border border-gray-200/60">
                                  <Eye className="w-7 h-7 text-gray-700 mx-auto mb-2" />
                                  <p className="text-xs text-gray-500 italic">Aucune vue enregistrée pour l'instant.</p>
                                  <p className="text-[11px] text-gray-600 mt-1">
                                    Dès qu'un visiteur clique sur un bijou ou un produit, le compteur s'incrémente immédiatement.
                                  </p>
                                </div>
                              );
                            }

                            return (
                              <div className="space-y-2.5">
                                {topViewed.map(({ product, views }, idx) => {
                                  const percent = totalViews > 0 ? Math.round((views / totalViews) * 100) : 0;
                                  return (
                                    <div key={product!.id} className="bg-white/70 border border-gray-200 hover:border-[#D4AF37]/30 rounded-xl p-3 space-y-2 transition-all">
                                      <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-3 min-w-0">
                                          <span className="font-bold text-[#D4AF37] font-mono text-sm w-6 text-center">#{idx + 1}</span>
                                          <img src={product!.imageUrl} alt={product!.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0" />
                                          <div className="min-w-0">
                                            <span className="font-bold text-[#1A0F0A] block truncate">{product!.name}</span>
                                            <span className="text-[10px] text-gray-500 font-mono">
                                              Réf #{product!.refCode} • {formatPriceFCFA(product!.price)}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/40 text-xs inline-block">
                                            👁️ {views} vue{views > 1 ? 's' : ''}
                                          </span>
                                          <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{percent}% du total</span>
                                        </div>
                                      </div>

                                      {/* View Bar */}
                                      <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-500 rounded-full" style={{ width: `${Math.min(100, Math.max(5, percent))}%` }} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>

                        {/* 5. TOP MOST ORDERED PRODUCTS */}
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 shadow-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-serif font-bold text-[#1A0F0A] flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                              <span>Produits les Plus Commandés (Ventes Réelles)</span>
                            </h4>
                            <span className="text-[11px] font-mono text-gray-600">{orders.length} commande(s)</span>
                          </div>

                          {(() => {
                            const orderStatsMap: Record<string, { count: number; totalQty: number; totalRev: number; name: string }> = {};
                            orders.forEach((o) => {
                              const key = o.productId || o.productName || 'inconnu';
                              if (!orderStatsMap[key]) {
                                orderStatsMap[key] = { count: 0, totalQty: 0, totalRev: 0, name: o.productName || 'Produit' };
                              }
                              orderStatsMap[key].count += 1;
                              orderStatsMap[key].totalQty += o.quantity || 1;
                              orderStatsMap[key].totalRev += o.totalPrice || 0;
                            });

                            const topOrderedList = Object.entries(orderStatsMap)
                              .sort(([, a], [, b]) => b.count - a.count)
                              .slice(0, 5);

                            if (topOrderedList.length === 0) {
                              return (
                                <div className="text-center py-6 bg-white/40 rounded-xl border border-gray-200/60">
                                  <ShoppingBag className="w-7 h-7 text-gray-700 mx-auto mb-2" />
                                  <p className="text-xs text-gray-500 italic">Aucune commande enregistrée pour l'instant.</p>
                                  <p className="text-[11px] text-gray-600 mt-1">
                                    Les commandes passées depuis le panier s'afficheront ici avec le classement des produits les plus vendus.
                                  </p>
                                </div>
                              );
                            }

                            return (
                              <div className="space-y-2">
                                {topOrderedList.map(([key, stats], idx) => {
                                  const matchingProduct = products.find((p) => p.id === key || p.name === stats.name);
                                  return (
                                    <div key={key} className="bg-white/70 border border-gray-200 rounded-xl p-3 flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <span className="font-bold text-[#D4AF37] font-mono text-sm w-6 text-center">#{idx + 1}</span>
                                        {matchingProduct ? (
                                          <img src={matchingProduct.imageUrl} alt={matchingProduct.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0" />
                                        ) : (
                                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-[10px]">ANONYM</div>
                                        )}
                                        <div className="min-w-0">
                                          <span className="font-bold text-[#1A0F0A] block truncate">{matchingProduct?.name || stats.name}</span>
                                          <span className="text-[10px] text-gray-500 font-mono">
                                            {stats.count} commande(s) • {stats.totalQty} pièce(s)
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <span className="font-mono font-bold text-[#F3E5AB] block text-xs">
                                          {formatPriceFCFA(stats.totalRev)}
                                        </span>
                                        <span className="text-[10px] text-emerald-400 font-mono">Revenu cumulé</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>

                        {/* 6. QUOTE REQUESTS BREAKDOWN */}
                        {quoteRequests.length > 0 && (
                          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3 shadow-lg">
                            <h4 className="text-sm font-serif font-bold text-[#1A0F0A] flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#D4AF37]" />
                              <span>Demandes de Devis par Type de Création</span>
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {(() => {
                                const typeMap: Record<string, number> = {};
                                quoteRequests.forEach((q) => {
                                  const t = q.productType || 'Sur-mesure';
                                  typeMap[t] = (typeMap[t] || 0) + 1;
                                });
                                return Object.entries(typeMap).map(([type, cnt]) => (
                                  <div key={type} className="bg-white/60 border border-gray-200/80 rounded-xl p-3 text-center">
                                    <span className="text-lg font-bold font-mono text-[#F3E5AB] block">{cnt}</span>
                                    <span className="text-[11px] text-gray-600 capitalize block truncate">{type}</span>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* GLOBAL DELETION CONFIRMATION MODALS */}
              {productToDelete && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm animate-fadeIn" onClick={() => setProductToDelete(null)}>
                  <div className="bg-[#161616] border-2 border-rose-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-serif font-bold text-[#1A0F0A]">Supprimer le Produit ?</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Êtes-vous sûre de vouloir supprimer le produit <strong className="text-rose-300">"{productToDelete.name}"</strong> (#{productToDelete.refCode}) ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setProductToDelete(null)}
                        className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteProduct(productToDelete.id);
                          setProductToDelete(null);
                        }}
                        className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-[#1A0F0A] font-bold text-xs rounded-xl cursor-pointer shadow-lg"
                      >
                        Oui, Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {quoteToDelete && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm animate-fadeIn" onClick={() => setQuoteToDelete(null)}>
                  <div className="bg-[#161616] border-2 border-rose-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-serif font-bold text-[#1A0F0A]">Supprimer cet Éléments / Devis ?</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Êtes-vous sûre de vouloir supprimer cet élément <strong className="text-rose-300">#{quoteToDelete.id}</strong> ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setQuoteToDelete(null)}
                        className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onDeleteQuoteRequest) onDeleteQuoteRequest(quoteToDelete.id);
                          setQuoteToDelete(null);
                        }}
                        className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-[#1A0F0A] font-bold text-xs rounded-xl cursor-pointer shadow-lg"
                      >
                        Oui, Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {reviewToDelete && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm animate-fadeIn" onClick={() => setReviewToDelete(null)}>
                  <div className="bg-[#161616] border-2 border-rose-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-serif font-bold text-[#1A0F0A]">Supprimer cet Avis Client ?</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Êtes-vous sûre de vouloir supprimer l'avis de <strong className="text-rose-300">"{reviewToDelete.authorName}"</strong> ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setReviewToDelete(null)}
                        className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onDeleteReview) onDeleteReview(reviewToDelete.id);
                          setReviewToDelete(null);
                        }}
                        className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-[#1A0F0A] font-bold text-xs rounded-xl cursor-pointer shadow-lg"
                      >
                        Oui, Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {collectionToDelete && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm animate-fadeIn" onClick={() => setCollectionToDelete(null)}>
                  <div className="bg-[#161616] border-2 border-rose-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-serif font-bold text-[#1A0F0A]">Supprimer la Collection ?</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Êtes-vous sûre de vouloir supprimer la collection <strong className="text-rose-300">"{collectionToDelete.name}"</strong> ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setCollectionToDelete(null)}
                        className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onDeleteCollection) onDeleteCollection(collectionToDelete.id);
                          setCollectionToDelete(null);
                        }}
                        className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-[#1A0F0A] font-bold text-xs rounded-xl cursor-pointer shadow-lg"
                      >
                        Oui, Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {lvl1ToDelete && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm animate-fadeIn" onClick={() => setLvl1ToDelete(null)}>
                  <div className="bg-[#161616] border-2 border-rose-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-serif font-bold text-[#1A0F0A]">Supprimer la Sous-Catégorie Niveau 1 ?</h4>
                    {(() => {
                      const childCount = (subCategoriesLvl2 || []).filter((c) => c.level1Id === lvl1ToDelete.id).length;
                      return (
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Êtes-vous sûre de vouloir supprimer la sous-catégorie <strong className="text-rose-300">"{lvl1ToDelete.name}"</strong> ?
                          {childCount > 0 && (
                            <span className="block mt-1 text-rose-400 font-semibold">
                              ⚠️ Warning: {childCount} sous-élément(s) Niveau 2 rattaché(s) seront également supprimés.
                            </span>
                          )}
                          <span className="block mt-1 font-semibold">Cette action est irréversible.</span>
                        </p>
                      );
                    })()}
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setLvl1ToDelete(null)}
                        className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onDeleteSubCatLvl1) onDeleteSubCatLvl1(lvl1ToDelete.id);
                          setLvl1ToDelete(null);
                        }}
                        className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-[#1A0F0A] font-bold text-xs rounded-xl cursor-pointer shadow-lg"
                      >
                        Oui, Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {lvl2ToDelete && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm animate-fadeIn" onClick={() => setLvl2ToDelete(null)}>
                  <div className="bg-[#161616] border-2 border-rose-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
                      <Trash2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-serif font-bold text-[#1A0F0A]">Supprimer la Sous-Catégorie Niveau 2 ?</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Êtes-vous sûre de vouloir supprimer la sous-catégorie Niveau 2 <strong className="text-rose-300">"{lvl2ToDelete.name}"</strong> ? Cette action est irréversible.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setLvl2ToDelete(null)}
                        className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onDeleteSubCatLvl2) onDeleteSubCatLvl2(lvl2ToDelete.id);
                          setLvl2ToDelete(null);
                        }}
                        className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-[#1A0F0A] font-bold text-xs rounded-xl cursor-pointer shadow-lg"
                      >
                        Oui, Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Réalisations */}
              {adminTab === 'realisations' && (
                <RealisationsAdminTab
                  realisations={realisations}
                  onAddCollection={onAddRealisationCollection}
                  onUpdateCollection={onUpdateRealisationCollection}
                  onDeleteCollection={onDeleteRealisationCollection}
                  onReorderCollections={onReorderRealisationCollections}
                />
              )}

            </div>
            )}
          </AdminErrorBoundary>
        </div>
      </div>
    </div>
  );
};

// ─── Réalisations Admin Tab Component ─────────────────────────────────────────

interface RealisationsAdminTabProps {
  realisations: RealisationCollection[];
  onAddCollection?: (col: Omit<RealisationCollection, 'id' | 'createdAt' | 'order'>) => void;
  onUpdateCollection?: (col: RealisationCollection) => void;
  onDeleteCollection?: (id: string) => void;
  onReorderCollections?: (cols: RealisationCollection[]) => void;
}

const RealisationsAdminTab: React.FC<RealisationsAdminTabProps> = ({
  realisations,
  onAddCollection,
  onUpdateCollection,
  onDeleteCollection,
  onReorderCollections,
}) => {
  const sorted = [...realisations].sort((a, b) => a.order - b.order);

  // New collection form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  // Edit collection name
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editColName, setEditColName] = useState('');
  const [editColDesc, setEditColDesc] = useState('');

  // Delete confirm
  const [deleteColId, setDeleteColId] = useState<string | null>(null);

  // Photo add form per collection
  const [addingPhotoForColId, setAddingPhotoForColId] = useState<string | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Delete photo
  const [deletingPhoto, setDeletingPhoto] = useState<{ colId: string; photoId: string } | null>(null);

  // Edit photo (image & caption)
  const [editingPhoto, setEditingPhoto] = useState<{ colId: string; photoId: string } | null>(null);
  const [editPhotoUrl, setEditPhotoUrl] = useState('');
  const [editCaptionText, setEditCaptionText] = useState('');

  // Expanded collections
  const [expandedColId, setExpandedColId] = useState<string | null>(sorted[0]?.id || null);

  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    if (onAddCollection) {
      onAddCollection({
        name: newColName.trim(),
        description: newColDesc.trim() || undefined,
        photos: [],
        visible: true,
      });
    }
    setNewColName('');
    setNewColDesc('');
    setShowAddForm(false);
  };

  const handleSaveEditCol = (col: RealisationCollection) => {
    if (!editColName.trim()) return;
    if (onUpdateCollection) {
      onUpdateCollection({ ...col, name: editColName.trim(), description: editColDesc.trim() || undefined });
    }
    setEditingColId(null);
  };

  const handleToggleVisible = (col: RealisationCollection) => {
    if (onUpdateCollection) onUpdateCollection({ ...col, visible: !col.visible });
  };

  const handleMoveCol = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sorted.length) return;
    const newSorted = [...sorted];
    [newSorted[index], newSorted[target]] = [newSorted[target], newSorted[index]];
    const reordered = newSorted.map((c, i) => ({ ...c, order: i }));
    if (onReorderCollections) onReorderCollections(reordered);
  };

  const handleAddPhoto = (col: RealisationCollection) => {
    if (!newPhotoUrl.trim()) return;
    const newPhoto: RealisationPhoto = {
      id: 'photo-' + Date.now(),
      imageUrl: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || undefined,
      order: col.photos.length,
    };
    if (onUpdateCollection) {
      onUpdateCollection({ ...col, photos: [...col.photos, newPhoto] });
    }
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setAddingPhotoForColId(null);
  };

  const handleDeletePhoto = (col: RealisationCollection, photoId: string) => {
    if (onUpdateCollection) {
      const newPhotos = col.photos
        .filter((p) => p.id !== photoId)
        .map((p, i) => ({ ...p, order: i }));
      onUpdateCollection({ ...col, photos: newPhotos });
    }
    setDeletingPhoto(null);
  };

  const handleSavePhotoEdit = (col: RealisationCollection, photoId: string) => {
    if (!editPhotoUrl.trim()) return;
    if (onUpdateCollection) {
      const newPhotos = col.photos.map((p) =>
        p.id === photoId
          ? { ...p, imageUrl: editPhotoUrl.trim(), caption: editCaptionText.trim() || undefined }
          : p
      );
      onUpdateCollection({ ...col, photos: newPhotos });
    }
    setEditingPhoto(null);
  };

  const handleMovePhoto = (col: RealisationCollection, index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    const sortedPhotos = [...col.photos].sort((a, b) => a.order - b.order);
    if (target < 0 || target >= sortedPhotos.length) return;
    [sortedPhotos[index], sortedPhotos[target]] = [sortedPhotos[target], sortedPhotos[index]];
    const reordered = sortedPhotos.map((p, i) => ({ ...p, order: i }));
    if (onUpdateCollection) onUpdateCollection({ ...col, photos: reordered });
  };

  const totalPhotos = realisations.reduce((sum, c) => sum + c.photos.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#1A0F0A] flex items-center gap-2">
            📸 Galerie de Réalisations
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {realisations.length} collection(s) • {totalPhotos} photo(s) au total
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold rounded-xl hover:bg-[#F3E5AB] transition-all cursor-pointer shadow-lg"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouvelle catégorie
        </button>
      </div>

      {/* Storage warning */}
      <div className="p-3 bg-amber-950/30 border border-amber-700/40 rounded-xl text-[11px] text-amber-700/80 leading-relaxed">
        ℹ️ <strong>Information stockage :</strong> Les photos sont stockées directement dans le navigateur (localStorage). Pour de meilleures performances, privilégiez des photos compressées (moins de 500 Ko par photo). Si l'espace est plein, un message d'erreur s'affichera.
      </div>

      {/* Add collection form */}
      {showAddForm && (
        <form onSubmit={handleAddCollection} className="bg-gray-50 border border-[#D4AF37]/30 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-semibold text-[#D4AF37]">Nouvelle catégorie de réalisation</h4>
          <div className="space-y-2">
            <label className="block text-xs text-gray-600">Nom de la catégorie *</label>
            <input
              type="text"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              placeholder="ex : Réalisation Femme, Réalisation Enfants..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A0F0A] focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-gray-600">Description (optionnel)</label>
            <input
              type="text"
              value={newColDesc}
              onChange={(e) => setNewColDesc(e.target.value)}
              placeholder="ex : Bijoux et accessoires pour femmes"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A0F0A] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="px-5 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-xl hover:bg-[#F3E5AB] cursor-pointer">
              Créer la catégorie
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Collections list */}
      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="text-center py-12 bg-[#0F0F0F] rounded-2xl border border-gray-200">
            <ImageIcon className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500 italic">Aucune catégorie de réalisation. Créez-en une pour commencer.</p>
          </div>
        ) : (
          sorted.map((col, colIndex) => {
            const isExpanded = expandedColId === col.id;
            const sortedPhotos = [...col.photos].sort((a, b) => a.order - b.order);
            const isEditingCol = editingColId === col.id;

            return (
              <div key={col.id} className={`bg-[#111] border rounded-2xl overflow-hidden transition-all ${col.visible ? 'border-gray-200' : 'border-gray-200/40 opacity-60'}`}>
                {/* Collection header */}
                <div className="p-4 flex items-center gap-3">
                  {/* Reorder */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMoveCol(colIndex, 'up')}
                      disabled={colIndex === 0}
                      className="p-0.5 text-gray-600 hover:text-[#D4AF37] disabled:opacity-20 cursor-pointer"
                    ><ChevronUp className="w-3.5 h-3.5" /></button>
                    <button
                      onClick={() => handleMoveCol(colIndex, 'down')}
                      disabled={colIndex === sorted.length - 1}
                      className="p-0.5 text-gray-600 hover:text-[#D4AF37] disabled:opacity-20 cursor-pointer"
                    ><ChevronDown className="w-3.5 h-3.5" /></button>
                  </div>

                  {/* Col info / edit form */}
                  <div className="flex-1 min-w-0">
                    {isEditingCol ? (
                      <div className="flex gap-2 flex-wrap">
                        <input
                          type="text"
                          value={editColName}
                          onChange={(e) => setEditColName(e.target.value)}
                          className="flex-1 min-w-[140px] bg-white border border-[#D4AF37]/50 rounded-lg px-3 py-1.5 text-xs text-[#1A0F0A] focus:outline-none"
                        />
                        <input
                          type="text"
                          value={editColDesc}
                          onChange={(e) => setEditColDesc(e.target.value)}
                          placeholder="Description..."
                          className="flex-1 min-w-[140px] bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none"
                        />
                        <button onClick={() => handleSaveEditCol(col)} className="px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-bold rounded-lg cursor-pointer">
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditingColId(null)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg cursor-pointer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm font-semibold text-[#1A0F0A]">{col.name}</span>
                        {col.description && <span className="text-xs text-gray-500 ml-2">{col.description}</span>}
                        <span className="ml-2 text-[10px] font-mono text-gray-600">({sortedPhotos.length} photo{sortedPhotos.length !== 1 ? 's' : ''})</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!isEditingCol && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleToggleVisible(col)}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer ${col.visible ? 'border-emerald-700/40 text-emerald-400 bg-emerald-950/30' : 'border-gray-200 text-gray-600 bg-gray-50'}`}
                        title={col.visible ? 'Masquer du site' : 'Afficher sur le site'}
                      >
                        {col.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => { setEditingColId(col.id); setEditColName(col.name); setEditColDesc(col.description || ''); }}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteColId(col.id)}
                        className="p-1.5 rounded-lg border border-rose-900/50 text-rose-400 hover:bg-rose-50/40 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setExpandedColId(isExpanded ? null : col.id)}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-[#1A0F0A] cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded content: photos grid */}
                {isExpanded && (
                  <div className="border-t border-gray-200/60 p-4 space-y-4 bg-[#0C0C0C]">
                    {/* Add photo button */}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Photos ({sortedPhotos.length})</p>
                      <button
                        onClick={() => { setAddingPhotoForColId(col.id); setNewPhotoUrl(''); setNewPhotoCaption(''); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#D4AF37]/40 text-[#D4AF37] text-xs rounded-lg hover:bg-amber-50 cursor-pointer transition-all"
                      >
                        <Plus className="w-3 h-3" /> Ajouter une photo
                      </button>
                    </div>

                    {/* Add photo form */}
                    {addingPhotoForColId === col.id && (
                      <div className="bg-gray-50 border border-[#D4AF37]/20 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-semibold text-[#D4AF37]">Nouvelle photo</p>
                        <div className="space-y-1">
                          <label className="block text-[11px] text-gray-500">Photo (upload depuis votre appareil) *</label>
                          <ImageUploader
                            value={newPhotoUrl}
                            onChange={setNewPhotoUrl}
                            label="Photo de réalisation"
                            aspectRatio="square"
                            allowUrlInput={false}
                            maxSizeMB={3}
                            placeholder="Sélectionner une photo..."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] text-gray-500">Légende (optionnel)</label>
                          <input
                            type="text"
                            value={newPhotoCaption}
                            onChange={(e) => setNewPhotoCaption(e.target.value)}
                            placeholder="ex : Bracelet personnalisé, initiales gravées"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#1A0F0A] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddPhoto(col)}
                            disabled={!newPhotoUrl.trim()}
                            className="px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-lg hover:bg-[#F3E5AB] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Ajouter
                          </button>
                          <button
                            onClick={() => setAddingPhotoForColId(null)}
                            className="px-4 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-100 cursor-pointer"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Photos grid */}
                    {sortedPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {sortedPhotos.map((photo, photoIdx) => (
                          <div key={photo.id} className="group relative bg-[#111] border border-gray-200 rounded-xl overflow-hidden">
                            <img
                              src={photo.imageUrl}
                              alt={photo.caption || 'Réalisation'}
                              className="w-full aspect-square object-cover"
                            />
                            {/* Photo edit overlay (replace image + edit caption) */}
                            {editingPhoto?.colId === col.id && editingPhoto.photoId === photo.id ? (
                              <div className="p-3 space-y-2 border-t border-[#D4AF37]/30 bg-[#161616]">
                                <p className="text-[11px] font-semibold text-[#D4AF37]">Modifier la photo</p>
                                <ImageUploader
                                  value={editPhotoUrl}
                                  onChange={setEditPhotoUrl}
                                  label="Remplacer la photo"
                                  aspectRatio="square"
                                  allowUrlInput={false}
                                  maxSizeMB={3}
                                  placeholder="Changer d'image..."
                                />
                                <input
                                  type="text"
                                  value={editCaptionText}
                                  onChange={(e) => setEditCaptionText(e.target.value)}
                                  placeholder="Légende..."
                                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#1A0F0A] focus:outline-none focus:border-[#D4AF37]"
                                />
                                <div className="flex gap-1.5 pt-1">
                                  <button
                                    onClick={() => handleSavePhotoEdit(col, photo.id)}
                                    disabled={!editPhotoUrl.trim()}
                                    className="flex-1 py-1.5 bg-[#D4AF37] text-black text-xs font-bold rounded-lg cursor-pointer hover:bg-[#F3E5AB] disabled:opacity-40"
                                  >
                                    Enregistrer
                                  </button>
                                  <button
                                    onClick={() => setEditingPhoto(null)}
                                    className="flex-1 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg cursor-pointer hover:bg-gray-100"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {photo.caption && (
                                  <div className="px-2 py-1.5 border-t border-gray-200">
                                    <p className="text-[10px] text-gray-600 italic truncate">{photo.caption}</p>
                                  </div>
                                )}
                                {/* Action bar */}
                                <div className="flex items-center justify-between px-2 py-1.5 bg-[#0A0A0A] border-t border-gray-200/60 gap-1">
                                  <div className="flex gap-0.5">
                                    <button onClick={() => handleMovePhoto(col, photoIdx, 'up')} disabled={photoIdx === 0} className="p-1 text-gray-600 hover:text-[#D4AF37] disabled:opacity-20 cursor-pointer"><ChevronUp className="w-3 h-3" /></button>
                                    <button onClick={() => handleMovePhoto(col, photoIdx, 'down')} disabled={photoIdx === sortedPhotos.length - 1} className="p-1 text-gray-600 hover:text-[#D4AF37] disabled:opacity-20 cursor-pointer"><ChevronDown className="w-3 h-3" /></button>
                                  </div>
                                  <div className="flex gap-0.5">
                                    <button
                                      onClick={() => {
                                        setEditingPhoto({ colId: col.id, photoId: photo.id });
                                        setEditPhotoUrl(photo.imageUrl);
                                        setEditCaptionText(photo.caption || '');
                                      }}
                                      className="p-1 text-gray-500 hover:text-[#D4AF37] cursor-pointer"
                                      title="Modifier / Remplacer la photo"
                                    ><Edit2 className="w-3 h-3" /></button>
                                    <button
                                      onClick={() => setDeletingPhoto({ colId: col.id, photoId: photo.id })}
                                      className="p-1 text-gray-500 hover:text-rose-400 cursor-pointer"
                                      title="Supprimer"
                                    ><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-[#0A0A0A] rounded-xl border border-gray-200/60">
                        <ImageIcon className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 italic">Aucune photo dans cette catégorie.</p>
                        <p className="text-[11px] text-gray-700 mt-1">Cliquez sur "Ajouter une photo" pour commencer.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Delete collection confirm modal */}
      {deleteColId && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm" onClick={() => setDeleteColId(null)}>
          <div className="bg-[#161616] border-2 border-rose-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
              <Trash2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-serif font-bold text-[#1A0F0A]">Supprimer la catégorie ?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Êtes-vous sûre de vouloir supprimer cette catégorie et <strong className="text-rose-300">toutes ses photos</strong> ? Cette action est irréversible.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setDeleteColId(null)} className="px-5 py-2.5 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer">Annuler</button>
              <button
                onClick={() => { if (onDeleteCollection) onDeleteCollection(deleteColId); setDeleteColId(null); }}
                className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-[#1A0F0A] font-bold text-xs rounded-xl cursor-pointer shadow-lg"
              >
                Oui, Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete photo confirm */}
      {deletingPhoto && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm" onClick={() => setDeletingPhoto(null)}>
          <div className="bg-[#161616] border-2 border-rose-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-700 flex items-center justify-center mx-auto text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-serif font-bold text-[#1A0F0A]">Supprimer cette photo ?</h4>
            <p className="text-xs text-gray-600">Cette action est irréversible.</p>
            <div className="flex justify-center gap-3 pt-1">
              <button onClick={() => setDeletingPhoto(null)} className="px-4 py-2 bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer">Annuler</button>
              <button
                onClick={() => {
                  const col = realisations.find((c) => c.id === deletingPhoto.colId);
                  if (col) handleDeletePhoto(col, deletingPhoto.photoId);
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-[#1A0F0A] font-bold text-xs rounded-xl cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
