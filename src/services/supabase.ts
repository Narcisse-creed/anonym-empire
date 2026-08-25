import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Product,
  SubCategoryLevel1,
  SubCategoryLevel2,
  StoreInfo,
  Collection,
  RealisationCollection,
  Review,
  QuoteRequest,
  Order,
  AnalyticsData,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_SUBCATEGORIES_LVL1, INITIAL_SUBCATEGORIES_LVL2 } from '../data/categoriesData';
import { STORE_INFO } from '../data/storeInfo';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim() !== '' &&
    supabaseAnonKey.trim() !== '' &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder')
  );
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

// ── Store Info ─────────────────────────────────────────────────────────────
export async function fetchStoreInfoFromSupabase(): Promise<StoreInfo | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('store_info').select('data').eq('id', 'main_store_info').single();
    if (error) {
      if (error.code !== 'PGRST116') console.warn('Supabase fetchStoreInfo error:', error.message);
      return null;
    }
    return data?.data as StoreInfo || null;
  } catch (err) {
    console.warn('Supabase fetchStoreInfo failed:', err);
    return null;
  }
}

export async function saveStoreInfoToSupabase(info: StoreInfo): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('store_info').upsert({
      id: 'main_store_info',
      data: info,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error('Supabase saveStoreInfo error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveStoreInfo failed:', err);
    return false;
  }
}

// ── Products ───────────────────────────────────────────────────────────────
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('products').select('*');
    if (error) {
      console.warn('Supabase fetchProducts error:', error.message);
      return null;
    }
    if (!data || data.length === 0) return null;
    return data.map((row: any) => ({
      id: row.id,
      refCode: row.ref_code || '',
      name: row.name,
      category: row.category,
      subCategory: row.sub_category,
      gender: row.gender || 'mixte',
      price: Number(row.price || 0),
      priceVariable: Boolean(row.price_variable),
      description: row.description || '',
      imageUrl: row.image_url || '',
      images: Array.isArray(row.images) ? row.images : [],
      isFeatured: Boolean(row.is_featured),
      badge: row.badge,
      material: row.material,
      guarantee: row.guarantee,
      availability: row.availability || 'disponible',
      deliveryDelay: row.delivery_delay,
      colors: Array.isArray(row.colors) ? row.colors : [],
      collectionIds: Array.isArray(row.collection_ids) ? row.collection_ids : [],
      customizationOptions: row.customization_options || {},
      ...(row.raw_data || {}),
    })) as Product[];
  } catch (err) {
    console.warn('Supabase fetchProducts failed:', err);
    return null;
  }
}

export async function saveProductsToSupabase(products: Product[]): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const rows = products.map((p) => ({
      id: p.id,
      ref_code: p.refCode || '',
      name: p.name,
      category: p.category,
      sub_category: p.subCategory,
      gender: p.gender || 'mixte',
      price: p.price,
      price_variable: Boolean(p.priceVariable),
      description: p.description || '',
      image_url: p.imageUrl || '',
      images: p.images || [],
      is_featured: Boolean(p.isFeatured),
      badge: p.badge || null,
      material: p.material || null,
      guarantee: p.guarantee || null,
      availability: p.availability || 'disponible',
      delivery_delay: p.deliveryDelay || null,
      colors: p.colors || [],
      collection_ids: p.collectionIds || [],
      customization_options: p.customizationOptions || {},
      raw_data: p,
      updated_at: new Date().toISOString(),
    }));

    // First fetch current ids in DB to delete removed products
    const { data: existing } = await sb.from('products').select('id');
    if (existing && existing.length > 0) {
      const newIds = new Set(products.map((p) => p.id));
      const toDelete = existing.filter((e: any) => !newIds.has(e.id)).map((e: any) => e.id);
      if (toDelete.length > 0) {
        await sb.from('products').delete().in('id', toDelete);
      }
    }

    const { error } = await sb.from('products').upsert(rows);
    if (error) {
      console.error('Supabase saveProducts error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveProducts failed:', err);
    return false;
  }
}

// ── SubCategories Lvl 1 ───────────────────────────────────────────────────
export async function fetchSubCategoriesLvl1FromSupabase(): Promise<SubCategoryLevel1[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('subcategories_lvl1').select('*').order('order', { ascending: true });
    if (error) {
      console.warn('Supabase fetchSubCategoriesLvl1 error:', error.message);
      return null;
    }
    if (!data || data.length === 0) return null;
    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      parentCategory: row.parent_category,
      order: row.order ?? 0,
      visible: row.visible !== false,
      icon: row.icon,
      ...(row.raw_data || {}),
    })) as SubCategoryLevel1[];
  } catch (err) {
    console.warn('Supabase fetchSubCategoriesLvl1 failed:', err);
    return null;
  }
}

export async function saveSubCategoriesLvl1ToSupabase(list: SubCategoryLevel1[]): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const rows = list.map((item) => ({
      id: item.id,
      name: item.name,
      parent_category: item.parentCategory,
      order: item.order,
      visible: item.visible !== false,
      icon: item.icon || null,
      raw_data: item,
      updated_at: new Date().toISOString(),
    }));

    const { data: existing } = await sb.from('subcategories_lvl1').select('id');
    if (existing && existing.length > 0) {
      const newIds = new Set(list.map((c) => c.id));
      const toDelete = existing.filter((e: any) => !newIds.has(e.id)).map((e: any) => e.id);
      if (toDelete.length > 0) {
        await sb.from('subcategories_lvl1').delete().in('id', toDelete);
      }
    }

    const { error } = await sb.from('subcategories_lvl1').upsert(rows);
    if (error) {
      console.error('Supabase saveSubCategoriesLvl1 error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveSubCategoriesLvl1 failed:', err);
    return false;
  }
}

// ── SubCategories Lvl 2 ───────────────────────────────────────────────────
export async function fetchSubCategoriesLvl2FromSupabase(): Promise<SubCategoryLevel2[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('subcategories_lvl2').select('*').order('order', { ascending: true });
    if (error) {
      console.warn('Supabase fetchSubCategoriesLvl2 error:', error.message);
      return null;
    }
    if (!data || data.length === 0) return null;
    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      level1Id: row.level1_id,
      parentCategory: row.parent_category,
      order: row.order ?? 0,
      visible: row.visible !== false,
      ...(row.raw_data || {}),
    })) as SubCategoryLevel2[];
  } catch (err) {
    console.warn('Supabase fetchSubCategoriesLvl2 failed:', err);
    return null;
  }
}

export async function saveSubCategoriesLvl2ToSupabase(list: SubCategoryLevel2[]): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const rows = list.map((item) => ({
      id: item.id,
      name: item.name,
      level1_id: item.level1Id,
      parent_category: item.parentCategory,
      order: item.order,
      visible: item.visible !== false,
      raw_data: item,
      updated_at: new Date().toISOString(),
    }));

    const { data: existing } = await sb.from('subcategories_lvl2').select('id');
    if (existing && existing.length > 0) {
      const newIds = new Set(list.map((c) => c.id));
      const toDelete = existing.filter((e: any) => !newIds.has(e.id)).map((e: any) => e.id);
      if (toDelete.length > 0) {
        await sb.from('subcategories_lvl2').delete().in('id', toDelete);
      }
    }

    const { error } = await sb.from('subcategories_lvl2').upsert(rows);
    if (error) {
      console.error('Supabase saveSubCategoriesLvl2 error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveSubCategoriesLvl2 failed:', err);
    return false;
  }
}

// ── Collections ────────────────────────────────────────────────────────────
export async function fetchCollectionsFromSupabase(): Promise<Collection[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('collections').select('*').order('order', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      productIds: Array.isArray(row.product_ids) ? row.product_ids : [],
      order: row.order ?? 0,
      createdAt: row.created_at || new Date().toISOString(),
      coverImage: row.cover_image,
      category: row.category,
      icon: row.icon,
      color: row.color,
      visible: row.visible !== false,
      ...(row.raw_data || {}),
    })) as Collection[];
  } catch {
    return null;
  }
}

export async function saveCollectionsToSupabase(list: Collection[]): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const rows = list.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description || null,
      product_ids: c.productIds || [],
      order: c.order,
      created_at: c.createdAt,
      cover_image: c.coverImage || null,
      category: c.category || null,
      icon: c.icon || null,
      color: c.color || null,
      visible: c.visible !== false,
      raw_data: c,
      updated_at: new Date().toISOString(),
    }));
    await sb.from('collections').upsert(rows);
    return true;
  } catch {
    return false;
  }
}

// ── Initial Seeding Helper ─────────────────────────────────────────────────
export async function seedInitialDataIfNeeded(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;

  try {
    // 1. Check Store Info
    const { data: storeData } = await sb.from('store_info').select('id').limit(1);
    if (!storeData || storeData.length === 0) {
      await saveStoreInfoToSupabase(STORE_INFO);
      console.log('✅ Supabase seeded: store_info');
    }

    // 2. Check SubCategories Lvl1
    const { data: lvl1Data } = await sb.from('subcategories_lvl1').select('id').limit(1);
    if (!lvl1Data || lvl1Data.length === 0) {
      await saveSubCategoriesLvl1ToSupabase(INITIAL_SUBCATEGORIES_LVL1);
      console.log('✅ Supabase seeded: subcategories_lvl1');
    }

    // 3. Check SubCategories Lvl2
    const { data: lvl2Data } = await sb.from('subcategories_lvl2').select('id').limit(1);
    if (!lvl2Data || lvl2Data.length === 0) {
      await saveSubCategoriesLvl2ToSupabase(INITIAL_SUBCATEGORIES_LVL2);
      console.log('✅ Supabase seeded: subcategories_lvl2');
    }

    // 4. Check Products
    const { data: prodData } = await sb.from('products').select('id').limit(1);
    if (!prodData || prodData.length === 0) {
      await saveProductsToSupabase(INITIAL_PRODUCTS);
      console.log('✅ Supabase seeded: products');
    }
  } catch (err) {
    console.warn('Supabase initial seed check error:', err);
  }
}
