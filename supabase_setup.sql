-- ================================================
-- SUPABASE SETUP FOR BOOKING SAAS
-- ================================================
-- Copy and paste this entire SQL into Supabase SQL Editor
-- Run it to create tables and insert demo data

-- 1. DROP EXISTING TABLES (if they exist)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS salons CASCADE;

-- 2. CREATE TABLES
CREATE TABLE salons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  working_hours_open TEXT NOT NULL,
  working_hours_close TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration INT NOT NULL,
  price DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Salon policies: anyone can read
CREATE POLICY "Public can read salons" ON salons FOR SELECT USING (true);

-- Services policies: anyone can read
CREATE POLICY "Public can read services" ON services FOR SELECT USING (true);

-- Bookings policies: anyone can read and insert (for booking)
CREATE POLICY "Public can read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public can insert bookings" ON bookings FOR INSERT WITH CHECK (true);

-- 4. INSERT DEMO DATA FOR "NaujasSalonas"
-- First, insert the salon and get its ID
WITH inserted_salon AS (
  INSERT INTO salons (slug, name, description, logo, working_hours_open, working_hours_close)
  VALUES (
    'NaujasSalonas',
    'Glow Beauty',
    'Elegantiškas grožio salonas, kuriame pasirūpinsime jūsų išvaizda ir savijauta. Mūsų profesionalų komanda užtikrins geriausią rezultatą kiekvieną kartą.',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=200&h=200',
    '09:00',
    '18:00'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    logo = EXCLUDED.logo,
    working_hours_open = EXCLUDED.working_hours_open,
    working_hours_close = EXCLUDED.working_hours_close
  RETURNING id
)
-- Insert services for the salon
INSERT INTO services (salon_id, name, duration, price)
SELECT 
  inserted_salon.id,
  service.name,
  service.duration,
  service.price
FROM inserted_salon,
(VALUES
  ('Moteriškas kirpimas', 60, 45),
  ('Plaukų dažymas', 120, 80),
  ('Manikiūras', 45, 25),
  ('Pedikiūras', 60, 35),
  ('Veido valymas', 90, 55)
) AS service(name, duration, price)
ON CONFLICT DO NOTHING;

-- 5. OPTIONAL: INSERT TEST BOOKINGS
-- First get salon ID and service IDs
DO $$
DECLARE
  salon_uuid UUID;
  service1_uuid UUID;
  service3_uuid UUID;
BEGIN
  -- Get salon ID
  SELECT id INTO salon_uuid FROM salons WHERE slug = 'NaujasSalonas';
  
  -- Get service IDs
  SELECT id INTO service1_uuid FROM services WHERE salon_id = salon_uuid AND name = 'Moteriškas kirpimas';
  SELECT id INTO service3_uuid FROM services WHERE salon_id = salon_uuid AND name = 'Manikiūras';
  
  -- Insert test bookings (for today to show unavailability)
  INSERT INTO bookings (salon_id, service_id, date, time, customer_name, customer_email, customer_phone)
  VALUES
    (salon_uuid, service1_uuid, to_char(CURRENT_DATE, 'YYYY-MM-DD'), '10:00', 'Test Customer', 'test@example.com', '+37060000000'),
    (salon_uuid, service3_uuid, to_char(CURRENT_DATE, 'YYYY-MM-DD'), '14:30', 'Test Customer 2', 'test2@example.com', '+37060000001')
  ON CONFLICT DO NOTHING;
END $$;

-- 6. VERIFY DATA
SELECT 'Salons:' as table_name, COUNT(*) as count FROM salons
UNION ALL
SELECT 'Services:', COUNT(*) FROM services
UNION ALL
SELECT 'Bookings:', COUNT(*) FROM bookings;

-- 7. VIEW DATA
SELECT '--- SALONS ---' as info;
SELECT slug, name, working_hours_open, working_hours_close FROM salons;

SELECT '--- SERVICES ---' as info;
SELECT name, duration, price FROM services WHERE salon_id = (SELECT id FROM salons WHERE slug = 'NaujasSalonas');

SELECT '--- BOOKINGS ---' as info;
SELECT date, time, customer_name, customer_email FROM bookings WHERE salon_id = (SELECT id FROM salons WHERE slug = 'NaujasSalonas');