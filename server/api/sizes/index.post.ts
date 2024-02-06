import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const data = await readBody(event)

  if (!data.size) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coloca un size',
    })
  }

  const existe = await prisma.size.findFirst({
    where: {
      size: data.size,
    },
  })

  if (existe) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El tamaño ya existe',
    })
  }

  await prisma.size.create({
    data,
  })
})
