import mongoose, { Schema, Document } from 'mongoose'

export interface IGallery extends Document {
  image: string
  category: 'nails' | 'beauty'
  title: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const GallerySchema = new Schema<IGallery>(
  {
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ['nails', 'beauty'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema)
