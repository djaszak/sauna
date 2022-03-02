import { set } from '$lib/auth/cookie'
import { sign } from '$lib/auth/jwt'
import type { User } from '$lib/db'
import DB from '$lib/db'
import type { RequestHandler } from '@sveltejs/kit'
import argon2 from 'argon2'
import { Validators } from './_common'

export async function login(user: User) {
  const token = await sign({ email: user.email || '' })
  const c = set('token', token)
  return {
    status: 200,
    headers: { 'set-cookie': [c] },
  }
}

export const post: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json()
    Validators.login(body)
    const user = await DB.user.findFirst({
      where: { email: body.email },
    })

    const verified = await argon2.verify(user?.password || '', body.password)

    if (verified && user) {
      return await login(user)
    } else {
      return {
        status: 401,
      }
    }
  } catch (error) {
    return { status: 400, body: { error: error as any } }
  }
}
