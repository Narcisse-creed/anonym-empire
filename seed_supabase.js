import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS } from './src/data/products.ts';
import { INITIAL_SUBCATEGORIES_LVL1, INITIAL_SUBCATEGORIES_LVL2 } from './src/data/categoriesData.ts';
import { STORE_INFO } from './src/data/storeInfo.ts';

const url = 'https://kyzyffmkdqakvhettrnx.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5enlmZm1rZHFha3ZoZXR0cm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDU3MjUsImV4cCI6MjEwMzIyMTcyNX0.631UhAIQXBSQRGr490dKQLPkN16s-kV9jl_TV6xqG5g';

const sb = createClient(url, key);

async function seed() {
  console.log('--- SEEDING SUPABASE DATABASE ---');

  // 1. Seed Store Info
  console.log('Seeding store_info...');
  const { error: errStore } = await sb.from('store_info').upsert({
    id: 'main_store_info',
    data: STORE_INFO,
    updated_at: new Date().toISOString(),
  });
  if (errStore) console.error('Store info error:', errStore);
  else console.log('✅ store_info seeded successfully');

  // 2. Seed Subcategories Lvl 1
  console.log('Seeding subcategories_lvl1...');
  const lvl1Rows = INITIAL_SUBCATEGORIES_LVL1.map((item) => ({
    id: item.id,
    name: item.name,
    parent_category: item.parentCategory,
    order: item.order,
    visible: item.visible !== false,
    icon: item.icon || null,
    raw_data: item,
    updated_at: new Date().toISOString(),
  }));
  const { error: errL1 } = await sb.from('subcategories_lvl1').upsert(lvl1Rows);
  if (errL1) console.error('Lvl1 error:', errL1);
  else console.log(`✅ subcategories_lvl1 (${lvl1Rows.length} rows) seeded successfully`);

  // 3. Seed Subcategories Lvl 2
  console.log('Seeding subcategories_lvl2...');
  const lvl2Rows = INITIAL_SUBCATEGORIES_LVL2.map((item) => ({
    id: item.id,
    name: item.name,
    level1_id: item.level1Id,
    parent_category: item.parentCategory,
    order: item.order,
    visible: item.visible !== false,
    raw_data: item,
    updated_at: new Date().toISOString(),
  }));
  const { error: errL2 } = await sb.from('subcategories_lvl2').upsert(lvl2Rows);
  if (errL2) console.error('Lvl2 error:', errL2);
  else console.log(`✅ subcategories_lvl2 (${lvl2Rows.length} rows) seeded successfully`);

  // 4. Seed Products
  console.log('Seeding products...');
  const prodRows = INITIAL_PRODUCTS.map((p) => ({
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
  const { error: errProd } = await sb.from('products').upsert(prodRows);
  if (errProd) console.error('Products error:', errProd);
  else console.log(`✅ products (${prodRows.length} items) seeded successfully`);

  console.log('--- SEEDING COMPLETE ---');
}

seed();
