import mongoose, { Schema, models } from 'mongoose';

const ActivityLogSchema = new Schema(
  {
    actor: { type: String, trim: true }, // user name/email or 'system'
    actorId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true, trim: true }, // e.g. 'user.created', 'order.paid'
    target: { type: String, trim: true }, // e.g. 'lead:507f1f77...'
    description: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    workspaceId: { type: String, index: true },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog = models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
export default ActivityLog;
