import process from 'node:process'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    })

    const data = await readBody(event)

    const uniquePublicId = `${Date.now()}`

    cloudinary.uploader.upload(data.image, {
      public_id: uniquePublicId,
      folder: 'EstudioEHE',
      width: 400,
      height: 300,
      crop: 'fill',
      format: 'webp',
    }).catch((error) => {
      console.error('Error al subir la imagen:', error)
    })

    return uniquePublicId
  }
  catch (error) {
    console.error('Error al crear la imagen:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor',
    })
  }
})
