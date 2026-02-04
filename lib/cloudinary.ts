import { v2 as cloudinary } from 'cloudinary'

if (typeof window === 'undefined') {
  let cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  let apiKey = process.env.CLOUDINARY_API_KEY
  let apiSecret = process.env.CLOUDINARY_API_SECRET

  // Derive from CLOUDINARY_URL if set (format: cloudinary://api_key:api_secret@cloud_name)
  if ((!apiKey || !apiSecret || !cloudName) && process.env.CLOUDINARY_URL) {
    try {
      const url = new URL(process.env.CLOUDINARY_URL)
      if (url.protocol === 'cloudinary:' && url.username && url.password && url.hostname) {
        apiKey = apiKey || url.username
        apiSecret = apiSecret || url.password
        cloudName = cloudName || url.hostname
      }
    } catch {
      // ignore invalid URL
    }
  }

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })
  }
}

export default cloudinary
