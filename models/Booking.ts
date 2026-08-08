import mongoose, { Schema, models } from 'mongoose';

const BookingSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    scheduledAt: { type: Date, required: true, index: true },
    durationMinutes: { type: Number, default: 30 },
    topic: { type: String, trim: true },
    service: { type: String, trim: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
      default: 'pending',
      index: true,
    },
    source: { type: String, default: 'manual' }, // manual | cal.com | chatbot | voice
    externalId: { type: String, index: true }, // Cal.com booking UID
    workspaceId: { type: String, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

BookingSchema.index({ email: 1, scheduledAt: -1 });

const Booking = models.Booking || mongoose.model('Booking', BookingSchema);
export default Booking;
