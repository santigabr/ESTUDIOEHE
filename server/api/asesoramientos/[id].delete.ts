import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  await prisma.asesoramiento.delete({
    where: {
      id,
    },
  })
})
