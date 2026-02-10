import mongoose, { Schema, Document } from 'mongoose'

export interface ICourse extends Document {
  title: string
  description: string
  price: number
  duration: string
  location: string
  students: string
  image: string
  featured: boolean
  rating?: number
  reviews?: number
  isActive: boolean
  /** Optional marketing count: how many people enrolled */
  enrollmentCount?: number
  /** Optional start dates (ISO date strings) so students can pick a comfortable date */
  startDates?: string[]
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    duration: { type: String, default: '' },
    location: { type: String, default: '' },
    students: { type: String, default: '' },
    image: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    rating: { type: Number },
    reviews: { type: Number },
    isActive: { type: Boolean, default: true },
    enrollmentCount: { type: Number, default: undefined },
    startDates: { type: [String], default: undefined },
  },
  { timestamps: true }
)

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)
