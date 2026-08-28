import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Product,
  SubCategoryLevel1,
  SubCategoryLevel2,
  StoreInfo,
  Collection,
  RealisationCollection,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_SUBCATEGORIES_LVL1, INITIAL_SUBCATEGORIES_LVL2 } from '../data/categoriesData';
import { STORE_INFO } from '../data/storeInfo';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  'https://kyzyffmkdqakvhettrnx.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5enlmZm1rZHFha3ZoZXR0cm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDU3MjUsImV4cCI6MjEwMzIyMTcyNX0.631UhAIQXBSQRGr490dKQLPkN16s-kV9jl_TV6xqG5g';

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
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
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
    return (data?.data as StoreInfo) || null;
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
function mapProductRowToProduct(row: any): Product {
  return {
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
  } as Product;
}

function mapProductToRow(p: Product) {
  return {
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
  };
}

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('products').select('*').order('id', { ascending: true });
    if (error) {
      console.warn('Supabase fetchProducts error:', error.message);
      return null;
    }
    if (!data || data.length === 0) return null;
    return data.map(mapProductRowToProduct);
  } catch (err) {
    console.warn('Supabase fetchProducts failed:', err);
    return null;
  }
}

/**
 * Save a single product to Supabase (Fast & Targeted)
 */
export async function saveSingleProductToSupabase(product: Product): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const row = mapProductToRow(product);
    const { error } = await sb.from('products').upsert(row);
    if (error) {
      console.error('Supabase saveSingleProduct error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveSingleProduct failed:', err);
    return false;
  }
}

/**
 * Delete a single product from Supabase
 */
export async function deleteSingleProductFromSupabase(productId: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('products').delete().eq('id', productId);
    if (error) {
      console.error('Supabase deleteSingleProduct error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteSingleProduct failed:', err);
    return false;
  }
}

/**
 * Batch save products with chunking to avoid payload limit errors
 */
export async function saveProductsToSupabase(products: Product[]): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const rows = products.map(mapProductToRow);

    // Fetch existing IDs to remove deleted ones
    const { data: existing } = await sb.from('products').select('id');
    if (existing && existing.length > 0) {
      const newIds = new Set(products.map((p) => p.id));
      const toDelete = existing.filter((e: any) => !newIds.has(e.id)).map((e: any) => e.id);
      if (toDelete.length > 0) {
        await sb.from('products').delete().in('id', toDelete);
      }
    }

    // Upsert in small batches of 25 to guarantee HTTP payload compliance
    const chunkSize = 25;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error } = await sb.from('products').upsert(chunk);
      if (error) {
        console.error('Supabase saveProducts batch error:', error);
        return false;
      }
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

export async function saveSingleSubCategoryLvl1ToSupabase(item: SubCategoryLevel1): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const row = {
      id: item.id,
      name: item.name,
      parent_category: item.parentCategory,
      order: item.order,
      visible: item.visible !== false,
      icon: item.icon || null,
      raw_data: item,
      updated_at: new Date().toISOString(),
    };
    const { error } = await sb.from('subcategories_lvl1').upsert(row);
    if (error) {
      console.error('Supabase saveSingleSubCategoryLvl1 error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveSingleSubCategoryLvl1 failed:', err);
    return false;
  }
}

export async function deleteSingleSubCategoryLvl1FromSupabase(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('subcategories_lvl1').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteSingleSubCategoryLvl1 error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteSingleSubCategoryLvl1 failed:', err);
    return false;
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

export async function saveSingleSubCategoryLvl2ToSupabase(item: SubCategoryLevel2): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const row = {
      id: item.id,
      name: item.name,
      level1_id: item.level1Id,
      parent_category: item.parentCategory,
      order: item.order,
      visible: item.visible !== false,
      raw_data: item,
      updated_at: new Date().toISOString(),
    };
    const { error } = await sb.from('subcategories_lvl2').upsert(row);
    if (error) {
      console.error('Supabase saveSingleSubCategoryLvl2 error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveSingleSubCategoryLvl2 failed:', err);
    return false;
  }
}

export async function deleteSingleSubCategoryLvl2FromSupabase(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('subcategories_lvl2').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteSingleSubCategoryLvl2 error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteSingleSubCategoryLvl2 failed:', err);
    return false;
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

export async function saveSingleCollectionToSupabase(c: Collection): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const row = {
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
    };
    const { error } = await sb.from('collections').upsert(row);
    if (error) {
      console.error('Supabase saveSingleCollection error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveSingleCollection failed:', err);
    return false;
  }
}

export async function deleteSingleCollectionFromSupabase(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('collections').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteSingleCollection error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteSingleCollection failed:', err);
    return false;
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

    const { data: existing } = await sb.from('collections').select('id');
    if (existing && existing.length > 0) {
      const newIds = new Set(list.map((c) => c.id));
      const toDelete = existing.filter((e: any) => !newIds.has(e.id)).map((e: any) => e.id);
      if (toDelete.length > 0) {
        await sb.from('collections').delete().in('id', toDelete);
      }
    }

    const { error } = await sb.from('collections').upsert(rows);
    if (error) {
      console.error('Supabase saveCollections error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase saveCollections failed:', err);
    return false;
  }
}

// ── Realisations (Stored in store_info or dedicated table) ────────────────
export async function fetchRealisationsFromSupabase(): Promise<RealisationCollection[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('store_info').select('data').eq('id', 'main_realisations').single();
    if (error || !data?.data) return null;
    return (data.data as RealisationCollection[]) || null;
  } catch {
    return null;
  }
}

export async function saveRealisationsToSupabase(list: RealisationCollection[]): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('store_info').upsert({
      id: 'main_realisations',
      data: list,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

// ── Realtime Multi-Device Synchronization ──────────────────────────────────
export function subscribeToDatabaseChanges(
  onTableChange: (table: string, payload: any) => void
): () => void {
  const sb = getSupabase();
  if (!sb) return () => {};

  try {
    const channel = sb
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => onTableChange('products', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_info' },
        (payload) => onTableChange('store_info', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'collections' },
        (payload) => onTableChange('collections', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subcategories_lvl1' },
        (payload) => onTableChange('subcategories_lvl1', payload)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subcategories_lvl2' },
        (payload) => onTableChange('subcategories_lvl2', payload)
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('⚡ Supabase Realtime channel connected successfully');
        }
      });

    return () => {
      sb.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription warning:', err);
    return () => {};
  }
}

// ── Initial Seeding Helper ─────────────────────────────────────────────────
export async function seedInitialDataIfNeeded(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;

  try {
    // 1. Check Store Info
    const { data: storeData } = await sb.from('store_info').select('id').eq('id', 'main_store_info').limit(1);
    if (!storeData || storeData.length === 0) {
      await saveStoreInfoToSupabase(STORE_INFO);
    }

    // 2. Check SubCategories Lvl1
    const { data: lvl1Data } = await sb.from('subcategories_lvl1').select('id').limit(1);
    if (!lvl1Data || lvl1Data.length === 0) {
      await saveSubCategoriesLvl1ToSupabase(INITIAL_SUBCATEGORIES_LVL1);
    }

    // 3. Check SubCategories Lvl2
    const { data: lvl2Data } = await sb.from('subcategories_lvl2').select('id').limit(1);
    if (!lvl2Data || lvl2Data.length === 0) {
      await saveSubCategoriesLvl2ToSupabase(INITIAL_SUBCATEGORIES_LVL2);
    }

    // 4. Check Products
    const { data: prodData } = await sb.from('products').select('id').limit(1);
    if (!prodData || prodData.length === 0) {
      await saveProductsToSupabase(INITIAL_PRODUCTS);
    }
  } catch (err) {
    console.warn('Supabase initial seed check error:', err);
  }
}

// ── Storage Upload Helper with Fallback ────────────────────────────────────
export async function uploadMediaToSupabase(file: File, folder = 'uploads'): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { data, error } = await sb.storage.from('anonym-media').upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      return null;
    }

    const { data: publicUrlData } = sb.storage.from('anonym-media').getPublicUrl(data.path);
    return publicUrlData?.publicUrl || null;
  } catch {
    return null;
  }
}
