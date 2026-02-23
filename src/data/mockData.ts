/* 
import { Salon, Booking } from '../types';

export const mockSalon: Salon = {
  id: "1",
  slug: "NaujasSalonas",
  name: "Glow Beauty",
  description: "Elegantiškas grožio salonas, kuriame pasirūpinsime jūsų išvaizda ir savijauta. Mūsų profesionalų komanda užtikrins geriausią rezultatą kiekvieną kartą.",
  logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=200&h=200",
  services: [
    { id: "s1", name: "Moteriškas kirpimas", duration: 60, price: 45 },
    { id: "s2", name: "Plaukų dažymas", duration: 120, price: 80 },
    { id: "s3", name: "Manikiūras", duration: 45, price: 25 },
    { id: "s4", name: "Pedikiūras", duration: 60, price: 35 },
    { id: "s5", name: "Veido valymas", duration: 90, price: 55 },
  ],
  workingHours: {
    open: "09:00",
    close: "18:00"
  }
};

// Create a couple of mock bookings for today to test slot unavailability
const today = new Date().toISOString().split('T')[0];

export const mockBookings: Booking[] = [
  {
    id: "b1",
    serviceId: "s1",
    date: today,
    time: "10:00",
    userName: "Test",
    userPhone: "Test",
    userEmail: "Test"
  },
  {
    id: "b2",
    serviceId: "s3",
    date: today,
    time: "14:30",
    userName: "Test",
    userPhone: "Test",
    userEmail: "Test"
  }
];


===========================================================================
SUPABASE INTEGRATION GUIDE (Replace Mock Data with Real Database)
===========================================================================

Jei norite pereiti nuo šio mockData prie tikros Supabase duomenų bazės:

1. SQL SCHEMA (Vykdyti Supabase SQL Editor aplinkoje):
------------------------------------------------------
CREATE TABLE salons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  working_hours_open TEXT NOT NULL,
  working_hours_close TEXT NOT NULL
);

CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration INT NOT NULL,
  price DECIMAL NOT NULL DEFAULT 0
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

-- Policies (RLS)
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read salons" ON salons FOR SELECT USING (true);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);

2. REACT KODO INTEGRACIJA:
------------------------------------------------------
A. Įdiekite paketą: npm install @supabase/supabase-js

B. Sukurkite failą src/lib/supabase.ts:
   import { createClient } from '@supabase/supabase-js';
   export const supabase = createClient('JŪSŲ_URL', 'JŪSŲ_ANON_KEY');

C. Pakeiskite SalonPage.tsx useEffect bloką:
   const { data: salon } = await supabase.from('salons').select('*').eq('slug', salonSlug).single();
   const { data: services } = await supabase.from('services').select('*').eq('salon_id', salon.id);
   const { data: bookings } = await supabase.from('bookings').select('*').eq('salon_id', salon.id);

D. Pakeiskite handleBookingSubmit:
   const { error } = await supabase.from('bookings').insert([{
     salon_id: salon.id,
     service_id: selectedService.id,
     date: selectedDate,
     time: selectedTime,
     customer_name: formData.name,
     customer_email: formData.email,
     customer_phone: formData.phone
   }]);
===========================================================================
*/
