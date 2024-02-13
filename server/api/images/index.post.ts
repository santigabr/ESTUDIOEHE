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

    const images = data.map((image: string, index: number) => {
      const uniquePublicId = `${Date.now()}_${index}`
      const uploadPromise = cloudinary.uploader.upload(image, {
        public_id: uniquePublicId,
        folder: 'EstudioEHE',
        width: 400,
        height: 300,
        crop: 'fill',
        format: 'webp',
      })

      return { uploadPromise, uniquePublicId }
    })

    const uploadPromises = images.map((image: { uploadPromise: Promise<any>, uniquePublicId: string }) => image.uploadPromise)
    Promise.allSettled(uploadPromises)

    return images.map((image: { uploadPromise: Promise<any>, uniquePublicId: string }) => image.uniquePublicId)
  }
  catch (error) {
    console.error('Error al crear imagenes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor',
    })
  }
})
