import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const creaciones = await prisma.creacion.findMany()
  return creaciones
})
