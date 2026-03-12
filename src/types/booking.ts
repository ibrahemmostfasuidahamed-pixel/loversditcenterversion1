export interface Booking {
  id: string;
  booking_ref: string;
  client_id: string;
  service_id: string;
  staff_id?: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  location_type?: 'clinic' | 'online' | 'home';
  price?: number;
  notes?: string;
  created_at: string;
  clients?: Client;
  services?: Service;
}

export interface Client {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  weight_goal?: string;
  notes?: string;
}

export interface Service {
  id: string;
  name_ar: string;
  name_en: string;
  icon: string;
  price_from?: number;
  is_free: boolean;
  duration_minutes?: number;
}

export interface BookingFormData {
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  fullName: string;
  phone: string;
  email: string;
  weightGoal: string;
  notes: string;
}
