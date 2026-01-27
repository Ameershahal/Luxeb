import mongoose, { Schema, Document } from 'mongoose'

export interface ICourseEnrollment extends Document {
  course: {
    id: string
    title: string
    description: string
    duration: string
    location: string
    price: number
  }
  student: {
    name: string
    email: string
    phone: string
  }
  payment: {
    stripeSessionId: string
    amount: number
    currency: string
    status: 'pending' | 'completed' | 'failed'
    paidAt?: Date
  }
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  enrollmentNumber: string
  createdAt: Date
  updatedAt: Date
}

const CourseEnrollmentSchema = new Schema<ICourseEnrollment>(
  {
    course: {
      id: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      duration: { type: String, required: true },
      location: { type: String, required: true },
      price: { type: Number, required: true },
    },
    student: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    payment: {
      stripeSessionId: { type: String, required: true },
      amount: { type: Number, required: true },
      currency: { type: String, default: 'gbp' },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
      paidAt: { type: Date },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

// Generate enrollment number before saving
CourseEnrollmentSchema.pre('save', function (next) {
  if (!this.enrollmentNumber) {
    this.enrollmentNumber = `ENR-${Date.now().toString(36).toUpperCase()}`
  }
  next()
})

export default mongoose.models.CourseEnrollment || mongoose.model<ICourseEnrollment>('CourseEnrollment', CourseEnrollmentSchema)
