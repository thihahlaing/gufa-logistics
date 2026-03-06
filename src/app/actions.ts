/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from '@/utils/supabase/server'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return { data: null, error };
  }

  return { data: profile, error: null };
}

export async function getSavedAddresses() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: { message: 'User not authenticated' }, data: null }
  }

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    return { error, data: null }
  }
  return { data, error: null }
}

export async function saveAddress(address: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: { message: 'User not authenticated' } }
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert([{ ...address, user_id: user.id }])

  if (error) {
    return { error }
  }
  return { data }
}

interface BookingData {
  pickupAddress: string
  dropoffAddress: string
  pickupCoords: { lat: number; lng: number }
  dropoffCoords: { lat: number; lng: number }
  vehicleType: string
  price: number
  distance: number
  duration: number
  sender_name: string
  sender_phone: string
  sender_note?: string
  receiver_name: string
  receiver_phone: string
  receiver_note?: string
  item_type: string
}

export async function createBooking(data: BookingData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const bookingData = {
    ...data,
    user_id: user.id,
    status: 'pending',
  }

  const { data: newBooking, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single()

  if (error) {
    console.error('Error creating booking:', error)
    throw new Error('Failed to create booking')
  }

  return newBooking
}

export async function getOrders(tab: 'Active' | 'Completed' | 'Cancelled') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  let statuses: string[] = [];
  if (tab === 'Active') {
    statuses = ['pending', 'searching', 'on_the_way', 'confirmed'];
  } else if (tab === 'Completed') {
    statuses = ['delivered'];
  } else if (tab === 'Cancelled') {
    statuses = ['cancelled'];
  }

  const { data: orders, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .in('status', statuses)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return { data: null, error };
  }

  return { data: orders, error: null };
}

export async function getOrderById(id: string) {
  const supabase = await createClient()
  const { data: order, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return { data: null, error };
  }

  return { data: order, error: null };
}

export async function cancelOrder(id: string, reason: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', cancellation_reason: reason })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error cancelling order:', error)
    return { error }
  }

  return { data }
}

export async function updateProfile(profileData: { fullName: string, phone: string, role: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: { message: 'User not authenticated' } }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id)

  if (error) {
    return { error }
  }

  return { data }
}
