import type { Booking, Prisma } from '$lib/db'
import DB from '$lib/db'
import type { RequestHandler } from '@sveltejs/kit'
import type { Locals } from 'src/hooks'

export const post: RequestHandler<Locals> = async ({ request, locals }) => {
  try {
    const body: Prisma.BookingCreateInput = await request.json()
    if (!locals.user) return { status: 401 }
    body.user = { connect: { id: locals.user.id } }
    const booking = await DB.booking.create({ data: body })
    return { body: booking }
  } catch (e) {
    console.error(e)
    return { body: { error: e as any } }
  }
}

export const get: RequestHandler = async ({ request, locals }) => {
  try {
    if (!locals.user) return { status: 401 }
    const bookings = await DB.booking.findMany()
    return { body: bookings }
  } catch (e) {
    return { body: { error: e as any } }
  }
}
