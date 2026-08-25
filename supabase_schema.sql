-- ==============================================================================
-- ANONYM EMPIRE — SUPABASE DATABASE SCHEMA
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase (SQL Editor)
-- ==============================================================================

-- 1. Table: store_info (Configuration générale, textes de pages, bannières, etc.)
CREATE TABLE IF NOT EXISTS public.store_info (
  id TEXT PRIMARY KEY DEFAULT 'main_store_info',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: products (Produits du catalogue)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  ref_code TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  gender TEXT DEFAULT 'mixte',
  price NUMERIC DEFAULT 0,
  price_variable BOOLEAN DEFAULT false,
  description TEXT DEFAULT '',
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  badge TEXT,
  material TEXT,
  guarantee TEXT,
  availability TEXT DEFAULT 'disponible',
  delivery_delay TEXT,
  colors JSONB DEFAULT '[]'::jsonb,
  collection_ids JSONB DEFAULT '[]'::jsonb,
  customization_options JSONB DEFAULT '{}'::jsonb,
  raw_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table: subcategories_lvl1 (Sous-catégories Niveau 1)
CREATE TABLE IF NOT EXISTS public.subcategories_lvl1 (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_category TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  icon TEXT,
  raw_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table: subcategories_lvl2 (Sous-catégories Niveau 2)
CREATE TABLE IF NOT EXISTS public.subcategories_lvl2 (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level1_id TEXT NOT NULL,
  parent_category TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  raw_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Table: collections (Collections & Sélections)
CREATE TABLE IF NOT EXISTS public.collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  product_ids JSONB DEFAULT '[]'::jsonb,
  "order" INTEGER DEFAULT 0,
  created_at TEXT,
  cover_image TEXT,
  category TEXT,
  icon TEXT,
  color TEXT,
  visible BOOLEAN DEFAULT true,
  raw_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Table: realisations (Galerie de Réalisations)
CREATE TABLE IF NOT EXISTS public.realisations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  "order" INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TEXT,
  raw_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Table: reviews (Avis clients)
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  product_name TEXT,
  rating NUMERIC DEFAULT 5,
  comment TEXT NOT NULL,
  author_name TEXT NOT NULL,
  photo_url TEXT,
  date TEXT,
  approved BOOLEAN DEFAULT true,
  raw_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Table: quote_requests (Demandes de devis)
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id TEXT PRIMARY KEY,
  product_type TEXT,
  category TEXT,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  budget TEXT,
  deadline TEXT,
  inspiration_photo_url TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'nouvelle',
  created_at TEXT,
  raw_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Table: orders (Commandes reçues)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  product_name TEXT,
  product_ref_code TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  quantity INTEGER DEFAULT 1,
  customization_notes TEXT,
  metal_finish TEXT,
  selected_color TEXT,
  custom_text TEXT,
  total_price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'nouvelle',
  created_at TEXT,
  raw_data JSONB,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Table: analytics (Statistiques de visites et vues)
CREATE TABLE IF NOT EXISTS public.analytics (
  id TEXT PRIMARY KEY DEFAULT 'main_analytics',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ACTIVER ROW LEVEL SECURITY (RLS) AVEC POLITIQUES PERMISSIVES POUR L'APPLICATION
-- ==============================================================================

ALTER TABLE public.store_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories_lvl1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories_lvl2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique (permet à tous les visiteurs de lire le catalogue)
CREATE POLICY "Public Read store_info" ON public.store_info FOR SELECT USING (true);
CREATE POLICY "Public Read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read subcategories_lvl1" ON public.subcategories_lvl1 FOR SELECT USING (true);
CREATE POLICY "Public Read subcategories_lvl2" ON public.subcategories_lvl2 FOR SELECT USING (true);
CREATE POLICY "Public Read collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public Read realisations" ON public.realisations FOR SELECT USING (true);
CREATE POLICY "Public Read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Read quote_requests" ON public.quote_requests FOR SELECT USING (true);
CREATE POLICY "Public Read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Read analytics" ON public.analytics FOR SELECT USING (true);

-- Politiques d'écriture / modification
CREATE POLICY "Allow All Insert/Update/Delete store_info" ON public.store_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Insert/Update/Delete products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Insert/Update/Delete subcategories_lvl1" ON public.subcategories_lvl1 FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Insert/Update/Delete subcategories_lvl2" ON public.subcategories_lvl2 FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Insert/Update/Delete collections" ON public.collections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Insert/Update/Delete realisations" ON public.realisations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Insert/Update/Delete reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Insert/Update/Delete quote_requests" ON public.quote_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Insert/Update/Delete orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Insert/Update/Delete analytics" ON public.analytics FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 11. BUCKET SUPABASE STORAGE : anonym-media
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('anonym-media', 'anonym-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Media" ON storage.objects FOR SELECT USING (bucket_id = 'anonym-media');
CREATE POLICY "Allow Upload Media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'anonym-media');
CREATE POLICY "Allow Update Media" ON storage.objects FOR UPDATE USING (bucket_id = 'anonym-media');
CREATE POLICY "Allow Delete Media" ON storage.objects FOR DELETE USING (bucket_id = 'anonym-media');
