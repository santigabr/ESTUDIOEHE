import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const asesoramiento = await prisma.asesoramiento.findUnique({
    where: {
      id,
    },
  })
  return asesoramiento
})
