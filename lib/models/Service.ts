import mongoose, { Schema, Document } from 'mongoose'

export interface IService extends Document {
  name: string
  category: string
  duration: number
  price: number
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    duration: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

// Clear cached model if it exists to ensure fresh schema
if (mongoose.models.Service) {
  delete mongoose.models.Service
}

export default mongoose.model<IService>('Service', ServiceSchema)
