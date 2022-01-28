import pkg, { PrismaClient } from '@prisma/client'
export type { Prisma, User, Booking } from '@prisma/client'

let DB: PrismaClient

if (process.env.NODE_ENV === 'production') {
  const { PrismaClient: PrismaClientProd } = pkg
  DB = new PrismaClientProd()
} else {
  DB = new PrismaClient()
}

export default DB
