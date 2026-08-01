import React, { useState } from 'react';
import { Product, StoreInfo, CategoryId, SubCategory, GenderCategory, Collection, Review, QuoteRequest, Order, AnalyticsData } from '../types';
import { UNIVERSE_CATEGORIES } from '../data/categories';
import { loadProducts, saveProducts, loadStoreInfo, saveStoreInfo, loadCollections, saveCollections, loadReviews, saveReviews, loadQuoteRequests, saveQuoteRequests, loadNotifications, saveNotifications, loadOrders, saveOrders, loadAnalytics, saveAnalytics } from '../utils/helpers';
import { X, Lock, Key, Plus, Edit2, Trash2, RotateCcw, Save, ShieldCheck, Download, Upload, ChevronUp, ChevronDown, Filter, Star, FileText, BarChart3, MessageSquare, Clock, CheckCircle, XCircle, Package, Settings, Layout } from 'lucide-react';

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
  onUpdateReview?: (r: Review) => void;
  onUpdateQuoteRequestStatus?: (id: string, status: QuoteRequest['status']) => void;
  onAddNotification?: (n: any) => void;
  onMarkNotificationRead?: (id: string) => void;
  orders: Order[];
  onAddOrder: (order: Order) => void;
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
  analytics: AnalyticsData;
  onTrackProductView: (productId: string) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  isAdminLoggedIn,
  onLogin,
  onLogout,
  products,
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
  onUpdateQuoteRequestStatus,
  onAddNotification,
  onMarkNotificationRead,
  orders = [],
  onAddOrder,
  onUpdateOrderStatus,
  onDeleteOrder,
  analytics,
  onTrackProductView,
}) => {
  if (!isOpen) return null;

  // Login Form State
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Password Change State
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  // Admin View Tab
  const [adminTab, setAdminTab] = useState<'list' | 'add' | 'edit' | 'settings' | 'collections' | 'textes' | 'commandes' | 'devis' | 'avis' | 'analytics'>('list');

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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(passwordInput);
    if (success) {
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('Mot de passe incorrect. (Mot de passe par défaut : anonym2026)');
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        if (adminTab === 'add') {
          setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
        } else if (editingProduct) {
          setEditingProduct((prev) => (prev ? { ...prev, imageUrl: dataUrl } : null));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.refCode) return;
    onAddProduct(formData);
    setFormData(defaultFormState);
    setAdminTab('list');
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setAdminTab('edit');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#1a1a1a] border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#1A160C] border border-[#D4AF37]/40 text-[#D4AF37]">
              {isAdminLoggedIn ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">
                Espace d'Administration Privé — ANONYM
              </h2>
              <span className="text-xs text-amber-200/70 font-sans">
                Réservé à la propriétaire (Gestion du Catalogue)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={onLogout}
                className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-900 bg-rose-950/40"
              >
                Déconnexion
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAdminLoggedIn ? (
            /* Password Protection Screen */
            <div className="max-w-md mx-auto py-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#18150D] border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <Key className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  Accès Restreint Propriétaire
                </h3>
                <p className="text-xs text-gray-400">
                  Veuillez saisir votre mot de passe pour gérer les bijoux, ajouter des photos ou modifier les tarifs.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Entrez votre mot de passe gérant"
                    className="w-full bg-black border border-[#D4AF37]/50 rounded-xl px-4 py-3 text-sm text-center text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  {loginError && (
                    <p className="text-xs text-rose-400 mt-2">{loginError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:bg-[#F3E5AB] transition-all cursor-pointer"
                >
                  Se Connecter à l'Administration
                </button>
              </form>

              <p className="text-[11px] text-gray-500 italic">
                Mot de passe par défaut configuré : <strong className="text-amber-200">anonym2026</strong>
              </p>
            </div>
          ) : (
            /* Admin Logged-In Panel */
            <div className="space-y-6">
              
              {/* Tab Selector Bar */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-4 overflow-x-auto gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAdminTab('list')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'list'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-black text-gray-400 hover:text-white border border-gray-800'
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
                        : 'bg-black text-gray-400 hover:text-white border border-gray-800'
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
                        : 'bg-black text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    Paramètres Contact
                  </button>
                  <button
                    onClick={() => setAdminTab('collections')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'collections'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-black text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    Collections
                  </button>
                  <button
                    onClick={() => setAdminTab('textes')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'textes'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-black text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    Textes des Pages
                  </button>
                  <button
                    onClick={() => setAdminTab('commandes')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'commandes'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-black text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    Commandes
                  </button>
                  <button
                    onClick={() => setAdminTab('devis')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'devis'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-black text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    Devis
                  </button>
                  <button
                    onClick={() => setAdminTab('avis')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'avis'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-black text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    Avis
                  </button>
                  <button
                    onClick={() => setAdminTab('analytics')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      adminTab === 'analytics'
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-black text-gray-400 hover:text-white border border-gray-800'
                    }`}
                  >
                    Analytics
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJSON}
                    className="p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs flex items-center gap-1"
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
                    className="p-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 text-xs flex items-center gap-1"
                    title="Réinitialiser au catalogue PDF de base"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Réinitialiser PDF</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: Product List Table */}
              {adminTab === 'list' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto border border-gray-800 rounded-2xl">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead className="bg-[#181818] text-[#D4AF37] font-serif uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Aperçu</th>
                          <th className="p-3">Réf</th>
                          <th className="p-3">Nom du Produit</th>
                          <th className="p-3">Catégorie</th>
                          <th className="p-3">Prix FCFA</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800 bg-[#111111]">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-black/60 transition-colors">
                            <td className="p-3">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-10 h-10 object-cover rounded-lg border border-gray-800"
                              />
                            </td>
                            <td className="p-3 font-mono font-bold text-[#D4AF37]">
                              #{p.refCode}
                            </td>
                            <td className="p-3 font-semibold text-white max-w-[200px] truncate">
                              {p.name}
                            </td>
                            <td className="p-3 capitalize">{p.category}</td>
                            <td className="p-3 font-mono text-[#F3E5AB]">
                              {p.price} FCFA
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="p-1.5 rounded-lg bg-gray-800 hover:bg-[#D4AF37] hover:text-black transition-colors"
                                title="Modifier"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Supprimer le produit ${p.name} (#${p.refCode}) ?`)) {
                                    onDeleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-950 text-rose-400 hover:bg-rose-800 hover:text-white transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2 & 3: Add / Edit Product Form */}
              {(adminTab === 'add' || adminTab === 'edit') && (
                <form
                  onSubmit={adminTab === 'add' ? handleSaveAdd : handleSaveEdit}
                  className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4"
                >
                  <h3 className="text-lg font-serif font-bold text-[#D4AF37]">
                    {adminTab === 'add' ? 'Ajouter une Nouvelle Création' : 'Modifier la Fiche Produit'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-400 mb-1">Code Référence (#001, #212...)</label>
                      <input
                        type="text"
                        required
                        value={adminTab === 'add' ? formData.refCode : editingProduct?.refCode || ''}
                        onChange={(e) =>
                          adminTab === 'add'
                            ? setFormData({ ...formData, refCode: e.target.value })
                            : setEditingProduct(editingProduct ? { ...editingProduct, refCode: e.target.value } : null)
                        }
                        className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1">Nom du Produit</label>
                      <input
                        type="text"
                        required
                        value={adminTab === 'add' ? formData.name : editingProduct?.name || ''}
                        onChange={(e) =>
                          adminTab === 'add'
                            ? setFormData({ ...formData, name: e.target.value })
                            : setEditingProduct(editingProduct ? { ...editingProduct, name: e.target.value } : null)
                        }
                        className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1">Catégorie Principale</label>
                      <select
                        value={adminTab === 'add' ? formData.category : editingProduct?.category || 'bijoux'}
                        onChange={(e) =>
                          adminTab === 'add'
                            ? setFormData({ ...formData, category: e.target.value as any })
                            : setEditingProduct(editingProduct ? { ...editingProduct, category: e.target.value as any } : null)
                        }
                        className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                      >
                        <option value="bijoux">Bijoux</option>
                        <option value="parfums">Parfums</option>
                        <option value="emballages">Emballages</option>
                        <option value="accessoires">Accessoires</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1">Prix Indicatif (FCFA)</label>
                      <input
                        type="number"
                        required
                        value={adminTab === 'add' ? formData.price : editingProduct?.price || 0}
                        onChange={(e) =>
                          adminTab === 'add'
                            ? setFormData({ ...formData, price: Number(e.target.value) })
                            : setEditingProduct(editingProduct ? { ...editingProduct, price: Number(e.target.value) } : null)
                        }
                        className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-gray-300 font-semibold mb-1">
                        Photo du Produit (Téléverser depuis Téléphone / Galerie ou Lien)
                      </label>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A160C] border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold text-xs transition-all cursor-pointer shadow-md">
                          <Upload className="w-4 h-4" />
                          <span>Choisir une photo depuis votre téléphone</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-gray-500 text-xs text-center sm:text-left">ou coller un lien photo web :</span>
                      </div>

                      <input
                        type="text"
                        placeholder="https://..."
                        value={adminTab === 'add' ? formData.imageUrl : editingProduct?.imageUrl || ''}
                        onChange={(e) =>
                          adminTab === 'add'
                            ? setFormData({ ...formData, imageUrl: e.target.value })
                            : setEditingProduct(editingProduct ? { ...editingProduct, imageUrl: e.target.value } : null)
                        }
                        className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-xs text-white"
                      />

                      {/* Photo Thumbnail Preview */}
                      {(adminTab === 'add' ? formData.imageUrl : editingProduct?.imageUrl) && (
                        <div className="flex items-center gap-3 p-2 bg-black/80 border border-[#D4AF37]/30 rounded-xl mt-2">
                          <img
                            src={adminTab === 'add' ? formData.imageUrl : editingProduct?.imageUrl}
                            alt="Aperçu Produit"
                            className="w-14 h-14 object-cover rounded-lg border border-[#D4AF37]/50"
                          />
                          <div>
                            <span className="text-xs text-emerald-400 font-semibold block">✓ Photo chargée avec succès</span>
                             <span className="text-[10px] text-gray-400 block">Prête pour le catalogue ANONYM</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-gray-400 mb-1">Description Fiche Produit</label>
                      <textarea
                        rows={3}
                        value={adminTab === 'add' ? formData.description : editingProduct?.description || ''}
                        onChange={(e) =>
                          adminTab === 'add'
                            ? setFormData({ ...formData, description: e.target.value })
                            : setEditingProduct(editingProduct ? { ...editingProduct, description: e.target.value } : null)
                        }
                        className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setAdminTab('list')}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-xs"
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

              {/* TAB 4: Store Settings Form & Password Management */}
              {adminTab === 'settings' && (
                <div className="space-y-6">
                  <form onSubmit={handleSaveSettings} className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-serif font-bold text-[#D4AF37]">
                      Coordonnées de la Boutique
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-400 mb-1">Nom Commercial</label>
                        <input
                          type="text"
                          value={storeFormData.fullName}
                          onChange={(e) => setStoreFormData({ ...storeFormData, fullName: e.target.value })}
                          className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Numéro WhatsApp (Format Int. ex: 2290191118884)</label>
                        <input
                          type="text"
                          value={storeFormData.whatsappNumber}
                          onChange={(e) => setStoreFormData({ ...storeFormData, whatsappNumber: e.target.value })}
                          className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Téléphone 1 (Avec 01)</label>
                        <input
                          type="text"
                          value={storeFormData.phone1}
                          onChange={(e) => setStoreFormData({ ...storeFormData, phone1: e.target.value })}
                          className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Téléphone 2 (Avec 01)</label>
                        <input
                          type="text"
                          value={storeFormData.phone2}
                          onChange={(e) => setStoreFormData({ ...storeFormData, phone2: e.target.value })}
                          className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Email Officiel</label>
                        <input
                          type="email"
                          value={storeFormData.email}
                          onChange={(e) => setStoreFormData({ ...storeFormData, email: e.target.value })}
                          className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white"
                        />
                      </div>
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

                  {/* Password Change Box */}
                  <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                      <Key className="w-5 h-5 text-[#D4AF37]" />
                      <span>Changer le Mot de Passe Propriétaire</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      Définissez un nouveau mot de passe secret connu uniquement par vous.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (newPasswordInput.trim().length < 4) {
                          alert('Le mot de passe doit comporter au moins 4 caractères.');
                          return;
                        }
                        if (onChangeAdminPassword) {
                          onChangeAdminPassword(newPasswordInput.trim());
                          setPasswordChangeSuccess('Votre nouveau mot de passe a été enregistré avec succès !');
                          setNewPasswordInput('');
                        }
                      }}
                      className="flex flex-col sm:flex-row gap-3 items-end"
                    >
                      <div className="flex-1">
                        <label className="block text-xs text-gray-300 mb-1">Nouveau mot de passe secret</label>
                        <input
                          type="password"
                          required
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Entrez votre nouveau mot de passe"
                          className="w-full bg-black border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-[#F3E5AB] cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Changer le mot de passe</span>
                      </button>
                    </form>
                    {passwordChangeSuccess && (
                      <p className="text-xs text-emerald-400 font-semibold mt-2">{passwordChangeSuccess}</p>
                    )}
                  </div>

                  {/* Discreet Access Tip Box */}
                  <div className="p-4 rounded-xl bg-black/60 border border-amber-900/40 text-xs text-amber-200/90 space-y-2">
                    <h4 className="font-bold font-serif text-[#D4AF37]">Astuce d'Accès Discret Propriétaire :</h4>
                    <p>
                      Pour que personne d'autre ne voie le bouton d'accès au mot de passe, vous pouvez utiliser l'un des 3 raccourcis secrets suivants :
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px]">
                      <li><strong>Geste Secret :</strong> Triple-cliquez rapidement sur le Logo "Crown" ANONYM en haut à gauche.</li>
                      <li><strong>Raccourci Clavier :</strong> Appuyez sur <kbd className="bg-gray-800 px-1 rounded">Ctrl + Shift + A</kbd> n'importe où sur le site.</li>
                      <li><strong>Lien URL Direct :</strong> Ajoutez <code className="text-[#D4AF37]">/#admin</code> à la fin de l'adresse de votre site web.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB: Collections */}
              {adminTab === 'collections' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif font-bold text-[#D4AF37]">Gestion des Collections</h3>
                  <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-4 space-y-3">
                    <button
                      onClick={() => {
                        const name = prompt('Nom de la nouvelle collection :');
                        if (!name) return;
                        const desc = prompt('Description (optionnel) :') || '';
                        const coverImage = prompt('URL de la couverture (optionnel) :') || '';
                        if (onAddCollection) {
                          onAddCollection({ name, description: desc, coverImage, productIds: [], order: collections.length });
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-xl"
                    >
                      + Créer une collection
                    </button>
                  </div>
                  <div className="space-y-3">
                    {collections.length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-4">Aucune collection pour le moment.</p>
                    )}
                    {collections.map((col, idx) => (
                      <div key={col.id} className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-white text-sm">{col.name}</h4>
                          <p className="text-xs text-gray-400">{col.description || 'Pas de description'}</p>
                          <span className="text-[10px] text-[#D4AF37] font-mono">{col.productIds.length} produit(s) • Ordre : {col.order}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (onUpdateCollection && idx > 0) {
                                const updated = [...collections];
                                const temp = updated[idx];
                                updated[idx] = updated[idx - 1];
                                updated[idx - 1] = temp;
                                updated.forEach((c, i) => c.order = i);
                                onUpdateCollection(updated[idx]);
                                onUpdateCollection(updated[idx - 1]);
                              }
                            }}
                            className="p-2 rounded bg-gray-800 text-gray-400 hover:text-white"
                            title="Monter"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (onUpdateCollection && idx < collections.length - 1) {
                                const updated = [...collections];
                                const temp = updated[idx];
                                updated[idx] = updated[idx + 1];
                                updated[idx + 1] = temp;
                                updated.forEach((c, i) => c.order = i);
                                onUpdateCollection(updated[idx]);
                                onUpdateCollection(updated[idx - 1]);
                              }
                            }}
                            className="p-2 rounded bg-gray-800 text-gray-400 hover:text-white"
                            title="Descendre"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer la collection "${col.name}" ?`)) {
                                if (onDeleteCollection) onDeleteCollection(col.id);
                              }
                            }}
                            className="p-2 rounded bg-rose-950 text-rose-400 hover:bg-rose-800"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Textes des Pages */}
              {adminTab === 'textes' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUpdateStoreInfo(storeFormData);
                    alert('Textes des pages mis à jour avec succès !');
                  }}
                  className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-6"
                >
                  <h3 className="text-lg font-serif font-bold text-[#D4AF37]">Textes des Pages</h3>
                  {(['accueil', 'bijoux', 'emballages', 'parfums', 'accessoires'] as const).map((page) => (
                    <div key={page} className="border-b border-gray-800 pb-4 last:border-b-0">
                      <h4 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider mb-3 capitalize">{page}</h4>
                      {page === 'accueil' && (
                        <>
                          <div className="grid grid-cols-1 gap-3 mb-3">
                            <label className="text-xs text-gray-400">Hero Title</label>
                            <input
                              type="text"
                              value={(storeFormData.pageTexts?.accueil?.heroTitle || '')}
                              onChange={(e) =>
                                setStoreFormData({
                                  ...storeFormData,
                                  pageTexts: {
                                    ...storeFormData.pageTexts,
                                    accueil: { ...storeFormData.pageTexts?.accueil, heroTitle: e.target.value },
                                  },
                                })
                              }
                              className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-xs text-white"
                            />
                          </div>
                          <div className="grid grid-cols-1 gap-3 mb-3">
                            <label className="text-xs text-gray-400">Hero Subtitle</label>
                            <input
                              type="text"
                              value={(storeFormData.pageTexts?.accueil?.heroSubtitle || '')}
                              onChange={(e) =>
                                setStoreFormData({
                                  ...storeFormData,
                                  pageTexts: {
                                    ...storeFormData.pageTexts,
                                    accueil: { ...storeFormData.pageTexts?.accueil, heroSubtitle: e.target.value },
                                  },
                                })
                              }
                              className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-xs text-white"
                            />
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <label className="text-xs text-gray-400">Hero Description</label>
                            <textarea
                              rows={2}
                              value={(storeFormData.pageTexts?.accueil?.heroDescription || '')}
                              onChange={(e) =>
                                setStoreFormData({
                                  ...storeFormData,
                                  pageTexts: {
                                    ...storeFormData.pageTexts,
                                    accueil: { ...storeFormData.pageTexts?.accueil, heroDescription: e.target.value },
                                  },
                                })
                              }
                              className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-xs text-white"
                            />
                          </div>
                        </>
                      )}
                      {page !== 'accueil' && (
                        <>
                          <div className="grid grid-cols-1 gap-3 mb-3">
                            <label className="text-xs text-gray-400">Title</label>
                            <input
                              type="text"
                              value={(storeFormData.pageTexts?.[page]?.title || '')}
                              onChange={(e) =>
                                setStoreFormData({
                                  ...storeFormData,
                                  pageTexts: {
                                    ...storeFormData.pageTexts,
                                    [page]: { ...storeFormData.pageTexts?.[page], title: e.target.value },
                                  },
                                })
                              }
                              className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-xs text-white"
                            />
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <label className="text-xs text-gray-400">Description</label>
                            <textarea
                              rows={2}
                              value={(storeFormData.pageTexts?.[page]?.description || '')}
                              onChange={(e) =>
                                setStoreFormData({
                                  ...storeFormData,
                                  pageTexts: {
                                    ...storeFormData.pageTexts,
                                    [page]: { ...storeFormData.pageTexts?.[page], description: e.target.value },
                                  },
                                })
                              }
                              className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-xs text-white"
                            />
                          </div>
                          {page === 'parfums' && (
                            <div className="grid grid-cols-1 gap-3 mt-3">
                              <label className="text-xs text-gray-400">Invitation Description</label>
                              <textarea
                                rows={2}
                                value={(storeFormData.pageTexts?.parfums?.invitationDescription || '')}
                                onChange={(e) =>
                                  setStoreFormData({
                                    ...storeFormData,
                                    pageTexts: {
                                      ...storeFormData.pageTexts,
                                      parfums: { ...storeFormData.pageTexts?.parfums, invitationDescription: e.target.value },
                                    },
                                  })
                                }
                                className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-xs text-white"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer">
                      <Save className="w-4 h-4" />
                      <span>Sauvegarder les Textes</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB: Commandes */}
              {adminTab === 'commandes' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Commandes (WhatsApp Orders)
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">Les commandes WhatsApp sont sauvegardées automatiquement dans le localStorage.</p>
                  {quoteRequests.filter((q) => q.status === 'acceptee').length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-8">Aucune commande enregistrée pour le moment.</p>
                  )}
                  {quoteRequests.filter((q) => q.status === 'acceptee').map((qr) => (
                    <div key={qr.id} className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#D4AF37]">#{qr.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">{qr.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <span className="text-gray-400">Type :</span><span className="text-white">{qr.productType}</span>
                        <span className="text-gray-400">Quantité :</span><span className="text-white">{qr.quantity}</span>
                        {qr.contactName && <><span className="text-gray-400">Contact :</span><span className="text-white">{qr.contactName}</span></>}
                        {qr.deadline && <><span className="text-gray-400">Deadline :</span><span className="text-white">{qr.deadline}</span></>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: Devis */}
              {adminTab === 'devis' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Suivi des Devis
                  </h3>
                  {quoteRequests.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-8">Aucune demande de devis pour le moment.</p>
                  ) : (
                    <div className="space-y-3">
                      {quoteRequests.map((qr) => (
                        <div key={qr.id} className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#D4AF37]">#{qr.id}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${
                              qr.status === 'nouvelle' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                              qr.status === 'en-cours' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                              qr.status === 'acceptee' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                              'bg-rose-950 text-rose-400 border-rose-800'
                            }`}>{qr.status}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <span className="text-gray-400">Type :</span><span className="text-white">{qr.productType}</span>
                            <span className="text-gray-400">Quantité :</span><span className="text-white">{qr.quantity}</span>
                            {qr.contactName && <><span className="text-gray-400">Contact :</span><span className="text-white">{qr.contactName}</span></>}
                            {qr.contactPhone && <><span className="text-gray-400">Téléphone :</span><span className="text-white">{qr.contactPhone}</span></>}
                            <span className="text-gray-400">Créé le :</span><span className="text-white">{new Date(qr.createdAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                          {qr.description && (
                            <p className="text-xs text-gray-400 italic">"{qr.description}"</p>
                          )}
                          <div className="flex items-center gap-2">
                            {qr.status !== 'nouvelle' && (
                              <button
                                onClick={() => onUpdateQuoteRequestStatus?.(qr.id, 'nouvelle')}
                                className="px-2 py-1 bg-gray-800 text-gray-300 rounded-lg text-[10px] hover:text-white"
                              >Nouvelle</button>
                            )}
                            {qr.status !== 'en-cours' && (
                              <button
                                onClick={() => onUpdateQuoteRequestStatus?.(qr.id, 'en-cours')}
                                className="px-2 py-1 bg-blue-950 text-blue-400 rounded-lg text-[10px] hover:text-white"
                              >En cours</button>
                            )}
                            {qr.status !== 'acceptee' && (
                              <button
                                onClick={() => onUpdateQuoteRequestStatus?.(qr.id, 'acceptee')}
                                className="px-2 py-1 bg-emerald-950 text-emerald-400 rounded-lg text-[10px] hover:text-white"
                              >Acceptée</button>
                            )}
                            {qr.status !== 'refusee' && (
                              <button
                                onClick={() => onUpdateQuoteRequestStatus?.(qr.id, 'refusee')}
                                className="px-2 py-1 bg-rose-950 text-rose-400 rounded-lg text-[10px] hover:text-white"
                              >Refusée</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Avis */}
              {adminTab === 'avis' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Gestion des Avis
                  </h3>
                  {reviews.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-8">Aucun avis pour le moment.</p>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map((r) => (
                        <div key={r.id} className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{r.authorName}</span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-700'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 italic">"{r.comment}"</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-600 font-mono">{new Date(r.date).toLocaleDateString('fr-FR')}</span>
                            <button
                              onClick={() => onUpdateReview?.({ ...r, approved: !r.approved })}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                                r.approved
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}
                            >
                              {r.approved ? '✓ Approuvé' : '⏳ En attente'}
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
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-bold text-[#D4AF37] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analytics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Produits', value: products.length, icon: Package },
                      { label: 'Collections', value: collections.length, icon: Layout },
                      { label: 'Avis', value: reviews.length, icon: Star },
                      { label: 'Devis reçus', value: quoteRequests.length, icon: FileText },
                      { label: 'Notifications', value: notifications.length, icon: MessageSquare },
                      { label: 'Non lus', value: notifications.filter((n: any) => !n.read).length, icon: Clock },
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4 text-center">
                        <stat.icon className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                        <span className="text-xl font-serif font-bold text-white">{stat.value}</span>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
