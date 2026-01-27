import mongoose, { Schema, Document } from 'mongoose'

export interface IGalleryImage extends Document {
  title: string
  image: string
  category: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.GalleryImage || mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema)
