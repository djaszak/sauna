import Prisma from '@prisma/client'
export type { Prisma, User, Booking, PrismaClient } from '@prisma/client'

let DB = new Prisma.PrismaClient()

export default DB
