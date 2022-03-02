import DB from '$lib/db'
import type { Prisma } from '$lib/db'
import type { RequestHandler } from '@sveltejs/kit'

type ParamID = { id: string }

export const get: RequestHandler<ParamID> = async ({ locals, params }) => {
  if (!locals.user) return { status: 401 }

  const booking = await DB.booking.findFirst({ where: { id: params.id } })
  return { body: booking }
}

export const patch: RequestHandler<ParamID> = async ({ request, locals, params }) => {
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

export const del: RequestHandler<ParamID> = async ({ locals, params }) => {
  if (!locals.user) return { status: 401 }
  const deleted = await DB.booking.delete({ where: { id: params.id } })
  return { body: deleted }
}
