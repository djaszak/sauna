import type { User } from '@prisma/client'
import { config } from 'dotenv'
import jwt from 'jsonwebtoken'

config()

const JWT_SECRET = process.env.JWT_SECRET as string

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is undefined')
}

export type JWT_TOKEN = {
  email: User['email']
}

export const Duration = '90d'

export async function sign(payload: JWT_TOKEN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: Duration })
}

export async function verify(token: string) {
  return (await jwt.verify(token, JWT_SECRET)) as JWT_TOKEN
}
