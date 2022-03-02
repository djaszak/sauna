import { verify } from '$lib/auth/code'
import DB from '$lib/db'
import type { RequestHandler } from '@sveltejs/kit'
import argon2 from 'argon2'
import { login } from './login'
import { Validators } from './_common'

export const post: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json()
    Validators.reset(body)
    const user = await DB.user.findFirst({
      where: { email: body.email },
    })

    if (user) {
      console.log(body)
      const code = await verify(body.code, user.id)
      if (!code) {
        return { status: 401 }
      } else {
        await DB.user.update({ data: { password: await argon2.hash(body.password) }, where: { id: user.id } })
        await DB.code.delete({ where: { id: code.id } })
        return await login(user)
      }
    }
    return {}
  } catch (error) {
    return { status: 400, body: { error: error as any } }
  }
}
