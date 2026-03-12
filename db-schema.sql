-- ============================================
-- Lovers Diet Center — Supabase Database Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- SERVICES table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT,
  price_from DECIMAL,
  price_currency TEXT DEFAULT 'AED',
  is_free BOOLEAN DEFAULT false,
  duration_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STAFF table
CREATE TABLE staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  role_ar TEXT,
  role_en TEXT,
  avatar_url TEXT,
  specialization TEXT[],
  is_active BOOLEAN DEFAULT true
);

-- AVAILABILITY table
CREATE TABLE availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID REFERENCES staff(id),
  date DATE NOT NULL,
  time_slot TIME NOT NULL,
  is_booked BOOLEAN DEFAULT false,
  UNIQUE(staff_id, date, time_slot)
);

-- CLIENTS table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  weight_goal TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  total_bookings INTEGER DEFAULT 0
);

-- BOOKINGS table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_ref TEXT UNIQUE NOT NULL DEFAULT
    'LDC-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0'),
  client_id UUID REFERENCES clients(id),
  service_id UUID REFERENCES services(id),
  staff_id UUID REFERENCES staff(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  location_type TEXT DEFAULT 'clinic'
    CHECK (location_type IN ('clinic', 'online', 'home')),
  price DECIMAL,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REVIEWS table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  client_id UUID REFERENCES clients(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OFFERS table
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT,
  title_en TEXT,
  discount_percent INTEGER,
  valid_until TIMESTAMPTZ,
  service_id UUID REFERENCES services(id),
  is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for booking flow
CREATE POLICY "allow_insert_bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_insert_clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_select_clients" ON clients FOR SELECT USING (true);
CREATE POLICY "allow_select_bookings" ON bookings FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_availability_date ON availability(date);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_bookings_ref ON bookings(booking_ref);

-- Seed default services
INSERT INTO services (name_ar, name_en, icon, price_from, is_free, duration_minutes) VALUES
  ('وجبات صحية متوازنة', 'Balanced Healthy Meals', '🍽️', 99, false, 0),
  ('استشارة غذائية متخصصة', 'Specialized Nutrition Consulting', '🌿', 0, true, 60),
  ('جلسة تكسير دهون احترافية', 'Professional Fat Burning Session', '💪', 199, false, 45),
  ('استشارة مكملات غذائية', 'Nutritional Supplements Consulting', '💊', 0, true, 30);
