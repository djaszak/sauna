import DB from '$lib/db'
import type { Code, Prisma } from '@prisma/client'
import crypto from 'crypto'

// 5 Minutes
const expiration = 1000 * 60 * 5

export function randomCode(id: string): Prisma.CodeCreateInput {
  return {
    code: crypto.randomBytes(4).toString('hex'),
    expiration: new Date(Date.now() + expiration),
    user: { connect: { id } },
  }
}

export async function purge() {
  return DB.code.deleteMany({
    where: {
      expiration: { lt: new Date() },
    },
  })
}

export async function verify(code: string, userId: string): Promise<null | Code> {
  await purge()
  return DB.code.findFirst({
    where: {
      code,
      userId,
    },
  })
}
