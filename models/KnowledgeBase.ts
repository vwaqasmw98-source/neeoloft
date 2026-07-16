import mongoose, { Schema, models } from 'mongoose';

const KnowledgeBaseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    source: { type: String, enum: ['text', 'url', 'pdf', 'faq', 'manual'], default: 'text' },
    content: { type: String, required: true },
    chunks: { type: [String], default: [] },
    tags: { type: [String], default: [], index: true },
    active: { type: Boolean, default: true, index: true },
    workspaceId: { type: String, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

KnowledgeBaseSchema.index({ active: 1, workspaceId: 1, updatedAt: -1 });

const KnowledgeBase =
  models.KnowledgeBase || mongoose.model('KnowledgeBase', KnowledgeBaseSchema);
export default KnowledgeBase;
