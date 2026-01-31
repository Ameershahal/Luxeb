import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { 
      type: String, 
      required: false, 
      unique: true, 
      lowercase: true, 
      sparse: true
    },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

// Clear cached model if it exists to ensure fresh schema
if (mongoose.models.Category) {
  delete mongoose.models.Category
}

export default mongoose.model<ICategory>('Category', CategorySchema)
