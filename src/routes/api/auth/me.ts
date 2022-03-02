import type { User } from '$lib/db'
import type { RequestHandler } from '@sveltejs/kit'

export type UserLoginDTO = Pick<User, 'email' | 'password'>

export const get: RequestHandler = async ({ locals }) => {
  return {
    status: locals.user ? 200 : 401,
    body: { user: locals.user },
  }
}
