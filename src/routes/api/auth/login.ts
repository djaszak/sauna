import DB, { User } from '$lib/db'
import argon2 from 'argon2'
import type { RequestHandler } from '@sveltejs/kit'
import { sign } from '$lib/auth/jwt'
import { set } from '$lib/auth/cookie'

export type UserLoginDTO = Pick<User, 'email' | 'password'>

export const post: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json()
    const user = await DB.user.findFirst({
      where: { email: body.email },
    })

    const verified = await argon2.verify(user?.password || '', body.password)

    if (verified) {
      const token = await sign({ email: user?.email || '' })
      const c = set('token', token)
      return {
        status: 200,
        headers: { 'set-cookie': [c] },
      }
    } else {
      return {
        status: 401,
      }
    }
  } catch (error) {
    return { status: 400, body: { error: error as any } }
  }
}
