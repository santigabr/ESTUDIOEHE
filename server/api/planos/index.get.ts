import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const productos = await prisma.planos.findMany()
  return productos
})
