import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  image?: string
}

export interface IOrder extends Document {
  items: IOrderItem[]
  customer: {
    name?: string
    email: string
    phone?: string
  }
  payment: {
    stripeSessionId: string
    amount: number
    currency: string
    status: 'pending' | 'completed' | 'failed'
    paidAt?: Date
  }
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  orderNumber: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String },
      },
    ],
    customer: {
      name: { type: String },
      email: { type: String, required: true },
      phone: { type: String },
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
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

// Generate order number before saving
OrderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`
  }
  next()
})

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
