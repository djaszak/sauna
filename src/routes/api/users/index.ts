import DB from '$lib/db'
import type { RequestHandler } from '@sveltejs/kit'
import type { Locals } from 'src/hooks'

export const get: RequestHandler<Locals> = async ({ locals }) => {
  if (!locals.user) return { status: 401 }
  const users = await DB.user.findMany()
  return { body: users }
}
