import mongoose, { Schema, models } from 'mongoose';

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['order', 'billing', 'system', 'security', 'message'],
      default: 'system',
    },
    title: { type: String, required: true, trim: true },
    body: { type: String, trim: true },
    link: { type: String, trim: true }, // optional in-app link, e.g. /dashboard/orders
    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification = models.Notification || mongoose.model('Notification', NotificationSchema);
export default Notification;
