import mongoose, { Document, Schema } from "mongoose"

export interface ISettings extends Document {
  key: string
  adminEmail: string
  adminPasswordHash: string
  socialLinks: {
    instagram?: string
    facebook?: string
    tiktok?: string
  }
  createdAt: Date
  updatedAt: Date
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    adminEmail: { type: String, default: "admin@luxebeauty.com" },
    adminPasswordHash: { type: String, default: "" },
    socialLinks: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      tiktok: { type: String, default: "" },
    },
  },
  { timestamps: true },
)

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema)
