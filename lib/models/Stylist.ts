import mongoose, { Schema, Document } from 'mongoose'

export interface IAvailableTime {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  startTime: string
  endTime: string
}

export interface IStylist extends Document {
  name: string
  image: string
  specialty: 'nails' | 'beauty' | 'all'
  rating: number
  experience: string
  bio: string
  isActive: boolean
  availableTimes: IAvailableTime[]
  createdAt: Date
  updatedAt: Date
}

const AvailableTimeSchema = new Schema<IAvailableTime>({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true,
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
})

const StylistSchema = new Schema<IStylist>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    specialty: {
      type: String,
      enum: ['nails', 'beauty', 'all'],
      required: true,
    },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    experience: { type: String, default: '' },
    bio: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    availableTimes: { type: [AvailableTimeSchema], default: [] },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Stylist || mongoose.model<IStylist>('Stylist', StylistSchema)
