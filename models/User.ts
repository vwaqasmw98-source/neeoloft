import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    workspaceId: { type: String, index: true },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    image: { type: String, trim: true },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model('User', UserSchema);
export default User;
