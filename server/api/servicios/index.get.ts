import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const servicios = await prisma.servicio.findMany()
  return servicios
})
