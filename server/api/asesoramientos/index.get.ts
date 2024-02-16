import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const asesoramientos = await prisma.asesoramiento.findMany()
  return asesoramientos
})
