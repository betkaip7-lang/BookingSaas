// Supabase Database Types (exact schema match)
export interface DBSalon {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  working_hours_open: string;
  working_hours_close: string;
}

export interface DBService {
  id: string;
  salon_id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface DBBooking {
  id: string;
  salon_id: string;
  service_id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
}

// Application Types (converted from database types)
export interface Salon {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  services: Service[];
  workingHours: {
    open: string;
    close: string;
  };
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface Booking {
  id: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  userName: string;
  userPhone: string;
  userEmail: string;
}

// Helper functions to convert DB types to app types
export function convertDBSalonToSalon(dbSalon: DBSalon, services: Service[]): Salon {
  return {
    id: dbSalon.id,
    slug: dbSalon.slug,
    name: dbSalon.name,
    description: dbSalon.description,
    logo: dbSalon.logo,
    services,
    workingHours: {
      open: dbSalon.working_hours_open,
      close: dbSalon.working_hours_close
    }
  };
}

export function convertDBServiceToService(dbService: DBService): Service {
  return {
    id: dbService.id,
    name: dbService.name,
    duration: dbService.duration,
    price: dbService.price
  };
}

export function convertDBBookingToBooking(dbBooking: DBBooking): Booking {
  return {
    id: dbBooking.id,
    serviceId: dbBooking.service_id,
    date: dbBooking.date,
    time: dbBooking.time,
    userName: dbBooking.customer_name,
    userPhone: dbBooking.customer_phone,
    userEmail: dbBooking.customer_email
  };
}
