import re
path = r'src/components/AdminPortalModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "import { Product, StoreInfo, CategoryId, SubCategory, GenderCategory, Collection, Review, QuoteRequest } from '../types';",
    "import { Product, StoreInfo, CategoryId, SubCategory, GenderCategory, Collection, Review, QuoteRequest, Order, AnalyticsData } from '../types';"
)
text = text.replace(
    "import { loadProducts, saveProducts, loadStoreInfo, saveStoreInfo, loadCollections, saveCollections, loadReviews, saveReviews, loadQuoteRequests, saveQuoteRequests, loadNotifications, saveNotifications } from '../utils/helpers';",
    "import { loadProducts, saveProducts, loadStoreInfo, saveStoreInfo, loadCollections, saveCollections, loadReviews, saveReviews, loadQuoteRequests, saveQuoteRequests, loadNotifications, saveNotifications, loadOrders, saveOrders, loadAnalytics, saveAnalytics } from '../utils/helpers';"
)

text = text.replace(
    '  onMarkNotificationRead?: (id: string) => void;\n}',
    '''  onMarkNotificationRead?: (id: string) => void;
  orders: Order[];
  onAddOrder: (order: Order) => void;
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
  analytics: AnalyticsData;
  onTrackProductView: (productId: string) => void;
}'''
)

text = text.replace(
    '  onMarkNotificationRead,\n}) => {',
    '''  onMarkNotificationRead,
  orders = [],
  onAddOrder,
  onUpdateOrderStatus,
  onDeleteOrder,
  analytics,
  onTrackProductView,
}) => {'''
)

text = text.replace(
    '''  const defaultFormState: Omit<Product, 'id'> = {
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
  };''',
    '''  const defaultFormState: Omit<Product, 'id'> = {
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
  };'''
)

text = text.replace(
    '''  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.refCode) return;
    onAddProduct(formData);
    setFormData(defaultFormState);
    setAdminTab('list');
  };''',
    '''  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      let processed = 0;
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          processed++;
          if (processed === files.length) {
            if (adminTab === 'add') {
              setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
            } else if (editingProduct) {
              setEditingProduct((prev) => (prev ? { ...prev, images: [...(prev.images || []), ...newImages] } : null));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.refCode) return;
    onAddProduct(formData);
    setFormData(defaultFormState);
    setAdminTab('list');
  };'''
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print('PATCH1_OK')
