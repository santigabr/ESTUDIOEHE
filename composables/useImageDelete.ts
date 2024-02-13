import process from 'node:process'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

export default function useImageDelete() {
  async function deleteImage(publicId: string) {
    try {
      const res = await cloudinary.uploader.destroy(publicId)
      return res
    }
    catch (err) {
      console.error(err)
      throw err
    }
  }

  return { deleteImage }
}
