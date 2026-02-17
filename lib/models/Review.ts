import mongoose, { Document, Schema } from "mongoose"

export interface IReview extends Document {
  name: string
  location: string
  image: string
  rating: number
  text: string
  service: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    service: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)
