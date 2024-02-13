import process from 'node:process'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

export default function useImageUpload() {
  async function imageUploader(imageUploaded: string) {
    try {
      const res = await cloudinary.uploader.upload(imageUploaded, {
        folder: 'EstudioEHE',
        width: 400,
        height: 300,
        crop: 'fill',
        format: 'webp',
      })
      return res.url
    }
    catch (err) {
      console.error(err)
      throw err
    }
  }

  return { imageUploader }
}
