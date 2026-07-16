import mongoose, { Schema, models } from 'mongoose';

const LeadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    service: { type: String, trim: true },
    requirement: { type: String, trim: true },
    budget: { type: Number },
    timeline: { type: String, trim: true },
    message: { type: String },
    source: { type: String, default: 'chatbot' }, // chatbot | contact_form | vapi | booking | manual
    score: { type: String, enum: ['hot', 'warm', 'cold'], default: 'cold' },
    scoreReasons: { type: [String], default: [] },
    metadata: { type: Schema.Types.Mixed, default: {} },
    workspaceId: { type: String, index: true },
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ email: 1 });

const Lead = models.Lead || mongoose.model('Lead', LeadSchema);
export default Lead;
