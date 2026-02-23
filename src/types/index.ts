// Frontend tipai
export interface Service {
  id: string;
  name: string;
  duration: number; // minutėmis
  price: number;
  description?: string;
}

export interface Salon {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  address?: string;
  phone?: string;
  email?: string;
  services: Service[];
  workingHours: {
    open: string;
    close: string;
  };
}

export interface Booking {
  id: string;
  salonId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  endTime?: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

// Duomenų bazės tipai (Supabase)
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

// Konvertavimo funkcijos iš duomenų bazės į frontend tipus
export const convertSalonFromDb = (dbSalon: DatabaseSalon, services: DatabaseService[]): Salon => ({
  id: dbSalon.id,
  slug: dbSalon.slug,
  name: dbSalon.name,
  description: dbSalon.description || '',
  logo: dbSalon.logo || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=200&h=200',
  address: dbSalon.address || '',
  phone: dbSalon.phone || '',
  email: dbSalon.email || '',
  services: services.map(convertServiceFromDb),
  workingHours: {
    open: dbSalon.working_hours_open,
    close: dbSalon.working_hours_close
  }
});

export const convertServiceFromDb = (dbService: DatabaseService): Service => ({
  id: dbService.id,
  name: dbService.name,
  duration: dbService.duration,
  price: Number(dbService.price),
  description: dbService.description || undefined
});

export const convertBookingFromDb = (dbBooking: DatabaseBooking): Booking => ({
  id: dbBooking.id,
  salonId: dbBooking.salon_id,
  serviceId: dbBooking.service_id,
  date: dbBooking.date,
  time: dbBooking.time,
  endTime: dbBooking.end_time || undefined,
  userName: dbBooking.customer_name,
  userPhone: dbBooking.customer_phone,
  userEmail: dbBooking.customer_email,
  status: dbBooking.status as Booking['status']
});
