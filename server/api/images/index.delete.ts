import process from 'node:process'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  })

  const data = await readBody(event)

  const images = data.map((image: string) => {
    return cloudinary.uploader.destroy(`EstudioEHE/${image}`)
  })

  await Promise.all(images)
})
