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

    const files = data.map((file: string, index: number) => {
      const uniquePublicId = `${Date.now()}_${index}`
      const uploadPromise = cloudinary.uploader.upload(file, {
        resource_type: 'raw',
        public_id: uniquePublicId,
        folder: 'EstudioEHE',
      })

      return { uploadPromise, uniquePublicId }
    })

    const uploadPromises = files.map((file: { uploadPromise: Promise<any>, uniquePublicId: string }) => file.uploadPromise)
    Promise.allSettled(uploadPromises)

    return files.map((file: { uploadPromise: Promise<any>, uniquePublicId: string }) => file.uniquePublicId)
  }
  catch (error) {
    console.error('Error al crear file:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor',
    })
  }
})
