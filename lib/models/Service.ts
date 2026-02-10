import mongoose, { Schema, Document } from 'mongoose'

export type ServiceSizeOption = 'S' | 'M' | 'L' | 'XL'

export interface IServiceSize {
  size: ServiceSizeOption
  price: number
}

export interface IServiceSubService {
  name: string
  price: number
}

export interface IService extends Document {
  name: string
  category: string
  duration: number
  price: number
  description: string
  isActive: boolean
  /** Optional size-based pricing. If set, client picks a size and price comes from here. */
  sizes?: IServiceSize[]
  /** Optional sub-services. If set, client must pick one or more; each adds a line with sub name + price. */
  subServices?: IServiceSubService[]
  createdAt: Date
  updatedAt: Date
}

const ServiceSizeSchema = new Schema<IServiceSize>(
  { size: { type: String, required: true, enum: ['S', 'M', 'L', 'XL'] }, price: { type: Number, required: true, min: 0 } },
  { _id: false }
)

const ServiceSubServiceSchema = new Schema<IServiceSubService>(
  { name: { type: String, required: true }, price: { type: Number, required: true, min: 0 } },
  { _id: false }
)

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
    sizes: { type: [ServiceSizeSchema], default: undefined },
    subServices: { type: [ServiceSubServiceSchema], default: undefined },
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
