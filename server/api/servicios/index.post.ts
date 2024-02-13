import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event)

    if (!data.title || !data.desc || !data.image)
      throw new Error('Faltan datos necesarios')

    await prisma.servicio.create({
      data,
    })
  }
  catch (error) {
    console.error('Error al crear el servicio:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor',
    })
  }
})
