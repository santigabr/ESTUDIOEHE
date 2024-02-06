import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const sizes = await prisma.size.findMany()
  return sizes
})
