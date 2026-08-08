import mongoose, { Schema, models } from 'mongoose';

const SubscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    workspaceId: { type: String, index: true },
    stripeCustomerId: { type: String, index: true },
    stripeSubscriptionId: { type: String, unique: true, sparse: true, index: true },
    stripePriceId: { type: String },
    plan: { type: String, enum: ['starter', 'growth', 'agency'], required: true },
    cycle: { type: String, enum: ['monthly', 'yearly'], required: true },
    status: {
      type: String,
      enum: ['active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid'],
      default: 'incomplete',
      index: true,
    },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    canceledAt: { type: Date },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ userId: 1, status: 1 });

const Subscription =
  models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
export default Subscription;
