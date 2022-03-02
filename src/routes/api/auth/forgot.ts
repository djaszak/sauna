import { randomCode } from '$lib/auth/code'
import DB from '$lib/db'
import { send } from '$lib/mail'
import type { RequestHandler } from '@sveltejs/kit'
import { Validators } from './_common'

export const post: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json()
    Validators.forgot(body)
    const user = await DB.user.findFirst({
      where: { email: body.email },
    })

    if (user) {
      const code = await DB.code.create({ data: randomCode(user.id) })
      send({
        to: user.email,
        title: 'Sauna Code',
        body: `Your code: ${code.code}`,
      }).catch(console.error)
    }
    return {}
  } catch (error) {
    return { status: 400, body: { error: error as any } }
  }
}
