import DB, { Prisma } from '$lib/db'
import argon2 from 'argon2'
import type { RequestHandler } from '@sveltejs/kit'
import { sign } from '$lib/auth/jwt'
import { set } from '$lib/auth/cookie'

export const post: RequestHandler<{}, Prisma.UserCreateInput, any> = async ({ body }) => {
  try {
    body.password = await argon2.hash(body.password)

    await DB.user.create({
      data: body,
    })

    const token = await sign({ email: body.email })
    const c = set('token', token)
    return {
      status: 200,
      headers: { 'set-cookie': [c] },
    } as any
  } catch (error) {
    return { status: 400, body: { error } }
  }
}
