import DB from '$lib/db'
import type { Prisma } from '$lib/db'
import type { RequestHandler } from '@sveltejs/kit'
import type { Locals } from 'src/hooks'

export const get: RequestHandler<Locals> = async ({ request, locals, params }) => {
  if (!locals.user) return { status: 401 }

  const booking = await DB.booking.findFirst({ where: { id: params.id } })
  return { body: booking }
}

export const patch: RequestHandler<Locals> = async ({ request, locals, params }) => {
  try {
    if (!locals.user) return { status: 401 }
    const body: Prisma.BookingUpdateInput = await request.json()
    delete body.id
    delete body.user
    const updated = await DB.booking.update({ data: body, where: { id: params.id } })
    return { body: updated }
  } catch {
    return { status: 400 }
  }
}
