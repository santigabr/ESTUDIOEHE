import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event)

    if (!data.title || !data.url)
      throw new Error('Faltan datos necesarios')

    await prisma.creacion.create({
      data,
    })
  }
  catch (error) {
    console.error('Error al crear la creación:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor',
    })
  }
})
