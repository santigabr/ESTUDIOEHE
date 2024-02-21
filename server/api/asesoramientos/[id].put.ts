import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const data = await readBody(event)

  if (!data.title) {
    return createError({
      statusCode: 400,
      message: 'Coloca la imagen',
    })
  }

  if (!data.desc) {
    return createError({
      statusCode: 400,
      message: 'Coloca el nombre',
    })
  }

  if (!data.content) {
    return createError({
      statusCode: 400,
      message: 'Coloca el nombre',
    })
  }

  await prisma.asesoramiento.update({
    where: {
      id,
    },
    data,
  })
})
