import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const servicio = await prisma.servicio.findUnique({
    where: {
      id,
    },
  })
  return servicio
})
