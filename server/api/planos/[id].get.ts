import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const plano = await prisma.planos.findUnique({
    where: {
      id,
    },
  })
  return plano
})
