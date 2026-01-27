import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary is configured
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured. Please set environment variables.' },
        { status: 500 }
      )
    }

    // Configure Cloudinary (fresh config for each request to avoid stale signatures)
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Use upload_stream for better reliability (avoids timestamp issues)
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'luxe-beauty',
          resource_type: 'auto',
          // Use unsigned upload if preset is available, otherwise use signed
          ...(process.env.CLOUDINARY_UPLOAD_PRESET && {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            unsigned: true,
          }),
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(error)
          } else {
            resolve(result)
          }
        }
      )

      uploadStream.end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: (result as any).secure_url,
      public_id: (result as any).public_id,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    
    // Provide more helpful error messages
    let errorMessage = 'Upload failed'
    if (error.message?.includes('stale')) {
      errorMessage = 'Upload request expired. Please try again.'
    } else if (error.message?.includes('Invalid')) {
      errorMessage = 'Invalid file or configuration. Please check your Cloudinary settings.'
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
