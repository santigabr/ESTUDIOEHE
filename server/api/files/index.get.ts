import prisma from '../utils/prisma'

export default defineEventHandler(async () => {
  const files = await prisma.file.findMany()
  return files
})
