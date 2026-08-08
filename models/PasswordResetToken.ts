import mongoose, { Schema, models, Types } from 'mongoose';

const PasswordResetTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Mongo TTL index — expired tokens are removed automatically.
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type PasswordResetTokenDoc = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
};

const PasswordResetToken =
  (models.PasswordResetToken as mongoose.Model<PasswordResetTokenDoc>) ||
  mongoose.model<PasswordResetTokenDoc>('PasswordResetToken', PasswordResetTokenSchema);

export default PasswordResetToken;
