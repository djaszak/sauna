import type { Handle } from '@sveltejs/kit'
import cookie from 'cookie'
import { verify } from '$lib/auth/jwt'
import DB, { User } from '$lib/db'

export type Locals = {
  user: User | null
}

export const handle: Handle<Locals> = async ({ event, resolve }) => {
  const c = cookie.parse(event.request.headers.get('cookie') || '')['token']
  if (c) {
    try {
      const token = await verify(c)
      const user = await DB.user.findFirst({ where: { email: token.email } })
      event.locals.user = user
    } catch {
      event.locals.user = null
    }
  }
  return await resolve(event)
}
