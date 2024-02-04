import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const data = await readBody(event)

  if (!data.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coloca un titulo',
    })
  }

  if (!data.desc) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coloca una descripción',
    })
  }

  if (!data.images) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coloca al menos una imagen',
    })
  }

  if (!data.files) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coloca al menos un archivo',
    })
  }

  const createdFiles = await Promise.all(data.files.map((file: { url: string, name: string }) => prisma.file.create({ data: file })))

  await prisma.planos.create({
    data: {
      ...data,
      files: {
        connect: createdFiles.map(file => ({ id: file.id })),
      },
    },
  })
})
