import { createClient } from '@supabase/supabase-js';

// Supabase konfigūracija - naudojami realūs kredencialiai
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Trūksta Supabase kredencialų! Patikrinkite .env.local failą.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipai
export interface DatabaseSalon {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  working_hours_open: string;
  working_hours_close: string;
  created_at: string;
}

export interface DatabaseService {
  id: string;
  salon_id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
  created_at: string;
}

export interface DatabaseBooking {
  id: string;
  salon_id: string;
  service_id: string;
  date: string;
  time: string;
  end_time: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string | null;
  status: string;
  created_at: string;
}

// Pagalbinės funkcijos duomenų bazės operacijoms

export const getSalonBySlug = async (slug: string): Promise<DatabaseSalon | null> => {
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .ilike('slug', slug)
    .single();
  
  if (error) {
    console.error('Klaida gaunant saloną:', error.message);
    return null;
  }
  return data as DatabaseSalon;
};

export const getServicesBySalonId = async (salonId: string): Promise<DatabaseService[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Klaida gaunant paslaugas:', error.message);
    return [];
  }
  return data as DatabaseService[];
};

export const getBookingsBySalonId = async (salonId: string): Promise<DatabaseBooking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('salon_id', salonId);
  
  if (error) {
    console.error('Klaida gaunant rezervacijas:', error.message);
    return [];
  }
  return data as DatabaseBooking[];
};

export const createBooking = async (bookingData: {
  salon_id: string;
  service_id: string;
  date: string;
  time: string;
  end_time?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}): Promise<{ success: boolean; data?: DatabaseBooking; error?: string }> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();
  
  if (error) {
    console.error('Klaida kuriant rezervaciją:', error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data: data as DatabaseBooking };
};

// Patikrinti ryšį su duomenų baze
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('salons').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};
