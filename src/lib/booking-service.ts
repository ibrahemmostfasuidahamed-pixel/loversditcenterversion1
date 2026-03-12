import { supabase } from './supabase';
import type { Booking } from '@/types/booking';

export async function createBooking(data: {
  fullName: string;
  phone: string;
  email?: string;
  serviceId: string;
  date: string;
  time: string;
  weightGoal?: string;
  notes?: string;
}): Promise<{ bookingRef: string; error?: string }> {
  // 1. Create or find client
  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('phone', data.phone)
    .single();

  let clientId: string;

  if (existingClient) {
    clientId = existingClient.id;
  } else {
    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email || null,
        weight_goal: data.weightGoal || null,
        notes: data.notes || null,
      })
      .select('id')
      .single();

    if (error || !newClient) return { bookingRef: '', error: error?.message || 'فشل إنشاء العميل' };
    clientId = newClient.id;
  }

  // 2. Check time slot availability
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('booking_date', data.date)
    .eq('booking_time', data.time)
    .neq('status', 'cancelled')
    .single();

  if (existing) {
    return { bookingRef: '', error: 'هذا الموعد محجوز. اختر وقتاً آخر' };
  }

  // 3. Create booking
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      client_id: clientId,
      service_id: data.serviceId,
      booking_date: data.date,
      booking_time: data.time,
    })
    .select('booking_ref')
    .single();

  if (error || !booking) return { bookingRef: '', error: error?.message || 'فشل إنشاء الحجز' };
  return { bookingRef: booking.booking_ref };
}

export async function getAvailableSlots(date: string): Promise<string[]> {
  const allSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const { data: booked } = await supabase
    .from('bookings')
    .select('booking_time')
    .eq('booking_date', date)
    .neq('status', 'cancelled');

  const bookedTimes = (booked || []).map((b) => b.booking_time?.substring(0, 5));
  return allSlots.filter((slot) => !bookedTimes.includes(slot));
}

export async function getBookingByRef(ref: string): Promise<Booking | null> {
  const { data } = await supabase
    .from('bookings')
    .select('*, clients(full_name, phone, email), services(name_ar, name_en, icon)')
    .eq('booking_ref', ref)
    .single();

  return data as Booking | null;
}
