export default function usePublicIdExtractor() {
  const extractPublicIds = (content: string) => {
    const publicIds: string[] = []
    const images = content.split('<img').slice(1) // divide el contenido por la etiqueta img

    images.forEach((img) => {
      const srcMatch = img.match(/src="([^"]*)"/) // busca el atributo src
      if (srcMatch) {
        const url = srcMatch[1]
        if (url.includes('cloudinary')) { // verifica si la url es de cloudinary
          const parts = url.split('/')
          const publicId = parts[parts.length - 1] // el publicId es la última parte de la url
          publicIds.push(publicId)
        }
      }
    })

    return publicIds
  }

  return { extractPublicIds }
}
