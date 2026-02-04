import mongoose, { Schema, Document } from 'mongoose'

export interface IBooking extends Document {
  /** @deprecated Use services array. Kept for backward compatibility. */
  service?: {
    id: string
    name: string
    category: string
    duration: number
    price: number
  }
  services: {
    id: string
    name: string
    category: string
    duration: number
    price: number
  }[]
  stylist: {
    id: string
    name: string
    image: string
    specialty: string
  } | null
  dateTime: {
    date: Date
    time: string
  }
  client: {
    firstName: string
    lastName: string
    email: string
    phone: string
    notes?: string
  }
  payment: {
    stripeSessionId: string
    amount: number
    currency: string
    status: 'pending' | 'completed' | 'failed'
    paidAt?: Date
  }
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  confirmationNumber: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    service: {
      id: { type: String },
      name: { type: String },
      category: { type: String },
      duration: { type: Number },
      price: { type: Number },
    },
    services: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      category: { type: String, required: true },
      duration: { type: Number, required: true },
      price: { type: Number, required: true },
    }],
    stylist: {
      id: { type: String },
      name: { type: String },
      image: { type: String },
      specialty: { type: String },
    },
    dateTime: {
      date: { type: Date, required: true },
      time: { type: String, required: true },
    },
    client: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      notes: { type: String },
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
    confirmationNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

// Generate confirmation number before saving
BookingSchema.pre('save', function (next) {
  if (!this.confirmationNumber) {
    this.confirmationNumber = `LB-${Date.now().toString(36).toUpperCase()}`
  }
  next()
})

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)
