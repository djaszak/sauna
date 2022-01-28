import type { Booking } from '$lib/db'
import axios from 'axios'
import { writable } from 'svelte/store'

export const bookings = writable<Booking[]>([])

export async function create(booking: Pick<Booking, 'end' | 'start' | 'note'>): Promise<Booking> {
  const response = await axios({
    url: '/api/bookings',
    method: 'POST',
    data: booking,
  })
  return response.data
}

export async function all(): Promise<Booking[]> {
  const response = await axios({
    url: '/api/bookings',
    method: 'GET',
  })
  return response.data
}

export async function update(booking: Partial<Booking>) {
  const response = await axios({
    url: `/api/bookings/${booking.id}`,
    method: 'PATCH',
    data: booking,
  })
  return response.data
}

export async function remove(id: string) {
  const response = await axios({
    url: `/api/bookings/${id}`,
    method: 'DELETE',
  })
  return response.data
}
