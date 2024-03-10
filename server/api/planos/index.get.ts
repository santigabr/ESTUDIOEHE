import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const planos = await prisma.planos.findMany()
  return planos
})
