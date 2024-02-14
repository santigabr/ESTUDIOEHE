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

  if (!data.url) {
    return createError({
      statusCode: 400,
      message: 'Coloca el nombre',
    })
  }

  await prisma.creacion.update({
    where: {
      id,
    },
    data,
  })
})
