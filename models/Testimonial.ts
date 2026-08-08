import mongoose, { Schema, models } from 'mongoose';

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true }, // e.g. "CEO, Acme Co."
    company: { type: String, trim: true },
    avatar: { type: String, trim: true }, // optional URL
    content: { type: String, required: true, maxlength: 2000 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    active: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false },
    workspaceId: { type: String, index: true },
  },
  { timestamps: true }
);

TestimonialSchema.index({ createdAt: -1 });

const Testimonial = models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
export default Testimonial;
