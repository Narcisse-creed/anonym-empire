import { createClient } from '@supabase/supabase-js';

const url = 'https://kyzyffmkdqakvhettrnx.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5enlmZm1rZHFha3ZoZXR0cm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDU3MjUsImV4cCI6MjEwMzIyMTcyNX0.631UhAIQXBSQRGr490dKQLPkN16s-kV9jl_TV6xqG5g';

const sb = createClient(url, key, {
  auth: { persistSession: false },
});

console.log('Testing Supabase...');
const { data: prods, error: errP } = await sb.from('products').select('id, name').limit(3);
console.log('Products table:', { count: prods?.length, error: errP ? errP.message : null });

const { data: store, error: errS } = await sb.from('store_info').select('id').limit(1);
console.log('StoreInfo table:', { count: store?.length, error: errS ? errS.message : null });

const { data: lvl1, error: errL1 } = await sb.from('subcategories_lvl1').select('id, name').limit(3);
console.log('SubCategories Lvl1 table:', { count: lvl1?.length, error: errL1 ? errL1.message : null });

const { data: lvl2, error: errL2 } = await sb.from('subcategories_lvl2').select('id, name').limit(3);
console.log('SubCategories Lvl2 table:', { count: lvl2?.length, error: errL2 ? errL2.message : null });
