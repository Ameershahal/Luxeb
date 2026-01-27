import mongoose, { Schema, Document } from 'mongoose'

export interface ICourse extends Document {
  title: string
  description: string
  price: number
  duration: string
  location: string
  maxStudents: number
  currentStudents: number
  image: string
  category: string
  status: 'active' | 'inactive' | 'completed'
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    maxStudents: { type: Number, required: true, default: 10 },
    currentStudents: { type: Number, default: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'completed'], default: 'active' },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)
