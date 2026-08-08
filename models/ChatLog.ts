import mongoose, { Schema, models } from 'mongoose';

const MessageSchema = new Schema(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatLogSchema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    workspaceId: { type: String, index: true },
    messages: { type: [MessageSchema], default: [] },
    leadCaptured: { type: Boolean, default: false },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

ChatLogSchema.index({ updatedAt: -1 });

const ChatLog = models.ChatLog || mongoose.model('ChatLog', ChatLogSchema);
export default ChatLog;
