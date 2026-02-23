-- ============================================================
-- BOOKING SaaS - SUPABASE DUOMENŲ BAZĖS SCHEMA IR DUOMENYS
-- ============================================================
-- 
-- 🚀 INSTRUKCIJOS:
-- 1. Atidarykite savo Supabase projektą: https://supabase.com/dashboard
-- 2. Eikite į SQL Editor (šoninis meniu)
-- 3. Sukurkite naują užklausą (New Query)
-- 4. Nukopijuokite IR įklijuokite VISĄ šį failą
-- 5. Spauskite "Run" (arba CMD/CTRL + Enter)
--
-- 📋 JŪSŲ PROJEKTO INFORMACIJA:
-- Project URL: https://mfnkhsxgfjlljwlotkvi.supabase.co
-- Anon Key: jau sukonfigūruotas .env.local faile
--
-- ============================================================

-- 1. SALONŲ LENTELĖ
CREATE TABLE IF NOT EXISTS salons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  working_hours_open TEXT NOT NULL DEFAULT '09:00',
  working_hours_close TEXT NOT NULL DEFAULT '18:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PASLAUGŲ LENTELĖ
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  duration INT NOT NULL, -- trukmė minutėmis
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REZERVACIJŲ LENTELĖ
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD formatas
  time TEXT NOT NULL, -- HH:MM formatas
  end_time TEXT, -- HH:MM formatas (apskaičiuojama pagal paslaugos trukmę)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLITIKOS
-- Leidžia viešą skaitymą ir rezervacijų kūrimą be prisijungimo
-- ============================================================

ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Salons: viešas skaitymas
CREATE POLICY "Allow public read access to salons" 
ON salons FOR SELECT 
USING (true);

-- Services: viešas skaitymas
CREATE POLICY "Allow public read access to services" 
ON services FOR SELECT 
USING (true);

-- Bookings: viešas skaitymas (kalendoriaus pasiekiamumui)
CREATE POLICY "Allow public read access to bookings" 
ON bookings FOR SELECT 
USING (true);

-- Bookings: viešas kūrimas (rezervacijų pateikimui)
CREATE POLICY "Allow public to create bookings" 
ON bookings FOR INSERT 
WITH CHECK (true);

-- ============================================================
-- INDEKSAI GREITESNĖMS UŽKLAUSOMS
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_services_salon_id ON services(salon_id);
CREATE INDEX IF NOT EXISTS idx_bookings_salon_id ON bookings(salon_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_salon_date ON bookings(salon_id, date);

-- ============================================================
-- DEMO DUOMENYS - NAUJAS SALONAS
-- ============================================================
-- Įterpti demo saloną (NaujasSalonas slug)

INSERT INTO salons (id, slug, name, description, logo, address, phone, email, working_hours_open, working_hours_close)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'NaujasSalonas',
  'Glow Beauty',
  'Elegantiškas grožio salonas, kuriame pasirūpinsime jūsų išvaizda ir savijauta. Mūsų profesionalų komanda užtikrins geriausią rezultatą kiekvieną kartą. Siūlome platų paslaugų spektrą: nuo kirpimo ir dažymo iki manikiūro bei veido procedūrų.',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=200&h=200',
  'Gedimino pr. 15, Vilnius',
  '+370 600 12345',
  'info@glowbeauty.lt',
  '09:00',
  '18:00'
) ON CONFLICT (id) DO NOTHING;

-- Įterpti paslaugas demo salonui
INSERT INTO services (salon_id, name, duration, price, description) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Moteriškas kirpimas', 60, 45.00, 'Profesionalus kirpimas pagal jūsų pageidavimus'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Plaukų dažymas', 120, 80.00, 'Kokybiškas dažymas naudojant aukščiausios klasės dažus'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Manikiūras', 45, 25.00, 'Klasikinis manikiūras su nagų lako padengimu'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pedikiūras', 60, 35.00, 'Atpalaiduojantis pedikiūras su pėdų masažu'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Veido valymas', 90, 55.00, 'Gilus veido valymas su drėkinamąja kauke'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kirpimas + dažymas', 150, 110.00, 'Pilnas kirpimo ir dažymo kompleksas'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Vakarinis makiažas', 45, 40.00, 'Profesionalus makiažas specialioms progoms'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Antakių korekcija', 20, 15.00, 'Antakių formavimas ir korekcija')
ON CONFLICT DO NOTHING;

-- ============================================================
-- PATIKRINIMO UŽKLAUSOS
-- ============================================================

-- Patikrinti visus salonus:
-- SELECT * FROM salons;

-- Patikrinti visas paslaugas:
-- SELECT * FROM services;

-- Patikrinti visas rezervacijas:
-- SELECT * FROM bookings;

-- ============================================================
-- ✅ BAIGTA! Dabar galite atidaryti savo aplikaciją
-- ir užsiregistruoti vizitui!
-- ============================================================
