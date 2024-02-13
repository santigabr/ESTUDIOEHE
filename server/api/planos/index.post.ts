import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event)

    if (!data.title || !data.desc || !data.images || !data.files || !data.price)
      throw new Error('Faltan datos necesarios')

    await prisma.planos.create({
      data: {
        ...data,
        files: ['asd', 'das'],
      },
    })
  }
  catch (error) {
    console.error('Error al crear el plano:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor',
    })
  }
})
