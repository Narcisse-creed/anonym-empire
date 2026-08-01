export type CategoryId = 'all' | 'bijoux' | 'parfums' | 'emballages' | 'accessoires';

export type SubCategory =
  | 'all'
  | 'colliers-femme'
  | 'colliers-homme-couple'
  | 'boucles-oreilles'
  | 'bracelets'
  | 'bagues'
  | 'manchettes'
  | 'parfums'
  | 'emballages'
  | 'accessoires';

export type GenderCategory = 'femme' | 'homme' | 'couple' | 'mixte';

export type MetalFinish = 'or-jaune' | 'argent-massif' | 'or-rose' | 'noir-mat';

export type AvailabilityStatus = 'disponible' | 'en-arrivage' | 'epuise';

export interface Product {
  id: string;
  refCode: string;
  name: string;
  category: CategoryId;
  subCategory: SubCategory;
  gender: GenderCategory;
  price: number;
  priceVariable?: boolean;
  description: string;
  imageUrl: string;
  images?: string[];
  isFeatured?: boolean;
  badge?: string;
  material?: string;
  guarantee?: string;
  availability?: AvailabilityStatus;
  deliveryDelay?: string;
  colors?: string[];
  collectionIds?: string[];
  customizationOptions?: {
    allowName?: boolean;
    allowDoubleName?: boolean;
    allowDate?: boolean;
    allowLogo?: boolean;
    allowText?: boolean;
    allowColorChoice?: boolean;
    allowFontChoice?: boolean;
    allowFileUpload?: boolean;
    colorOptions?: string[];
    fontOptions?: string[];
  };
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  productIds: string[];
  order: number;
  createdAt: string;
  coverImage?: string;
}

export interface Review {
  id: string;
  productId?: string;
  productName?: string;
  rating: number;
  comment: string;
  authorName: string;
  photoUrl?: string;
  date: string;
  approved: boolean;
}

export interface Notification {
  id: string;
  type: 'new-collection' | 'back-in-stock' | 'new-product' | 'order-update' | 'promo';
  title: string;
  message: string;
  read: boolean;
  date: string;
  link?: string;
}

export interface QuoteRequest {
  id: string;
  productType: string;
  description: string;
  quantity: number;
  budget?: string;
  deadline?: string;
  inspirationPhotoUrl?: string;
  contactName?: string;
  contactPhone?: string;
  status: 'nouvelle' | 'en-cours' | 'acceptee' | 'refusee';
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productRefCode: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  customizationNotes?: string;
  metalFinish?: string;
  selectedColor?: string;
  customText?: string;
  totalPrice: number;
  status: 'nouvelle' | 'en-preparation' | 'livree';
  createdAt: string;
}

export interface PageTexts {
  accueil: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroDescription?: string;
  };
  bijoux: {
    title?: string;
    description?: string;
  };
  emballages: {
    title?: string;
    description?: string;
  };
  parfums: {
    title?: string;
    description?: string;
    invitationDescription?: string;
  };
  accessoires: {
    title?: string;
    description?: string;
  };
}

export interface UniverseCategory {
  id: CategoryId | 'accueil';
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  engravingText?: string;
  metalFinish?: MetalFinish;
  selectedFont?: string;
  selectedColor?: string;
  customText?: string;
  uploadedFileUrl?: string;
  specialNotes?: string;
}

export interface FilterOptions {
  categoryId: CategoryId;
  subCategory: SubCategory;
  gender: GenderCategory | 'all';
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name';
  maxPrice: number;
  availability: AvailabilityStatus | 'all';
}

export interface StoreInfo {
  name: string;
  fullName: string;
  tagline: string;
  values: string[];
  address: string;
  city: string;
  country: string;
  email: string;
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  facebookUrl: string;
  instagramUrl: string;
  rccm: string;
  ifu: string;
  bankAccountInfo: string;
  pageTexts?: PageTexts;
}

export interface AnalyticsData {
  productViews: Record<string, number>;
  favorites: Record<string, number>;
  totalOrders: number;
  totalRevenue: number;
  updatedAt: string;
}
