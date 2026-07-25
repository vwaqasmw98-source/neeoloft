import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import ActivityLog from '@/models/ActivityLog';
import { requireAdmin } from '@/lib/apiGuards';

export const runtime = 'nodejs';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!isDBEnabled()) return NextResponse.json({ testimonials: [] });
  try {
    await connectDB();
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json({
      testimonials: testimonials.map((t) => ({
        _id: String(t._id),
        name: t.name,
        role: t.role,
        company: t.company,
        avatar: t.avatar,
        content: t.content,
        rating: t.rating,
        active: t.active,
        featured: t.featured,
        createdAt: t.createdAt,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

const Body = z.object({
  _id: z.string().optional(),
  name: z.string().min(1).max(120),
  role: z.string().max(120).optional().nullable(),
  company: z.string().max(120).optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  content: z.string().min(1).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export async function POST(req: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
  if (!isDBEnabled()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  try {
    await connectDB();
    const doc = await Testimonial.create({
      name: parsed.name,
      role: parsed.role || undefined,
      company: parsed.company || undefined,
      avatar: parsed.avatar || undefined,
      content: parsed.content,
      rating: parsed.rating,
      active: parsed.active,
      featured: parsed.featured,
    });
    await ActivityLog.create({
      actor: session?.user?.email,
      actorId: session?.user?.id,
      action: 'testimonial.created',
      target: `testimonial:${doc._id}`,
      description: `Added testimonial by ${parsed.name}`,
    });
    return NextResponse.json({ ok: true, id: String(doc._id) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
  if (!parsed._id) {
    return NextResponse.json({ error: 'Missing _id' }, { status: 400 });
  }
  if (!isDBEnabled()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  try {
    await connectDB();
    const doc = await Testimonial.findByIdAndUpdate(
      parsed._id,
      {
        name: parsed.name,
        role: parsed.role || undefined,
        company: parsed.company || undefined,
        avatar: parsed.avatar || undefined,
        content: parsed.content,
        rating: parsed.rating,
        active: parsed.active,
        featured: parsed.featured,
      },
      { new: true },
    );
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await ActivityLog.create({
      actor: session?.user?.email,
      actorId: session?.user?.id,
      action: 'testimonial.updated',
      target: `testimonial:${parsed._id}`,
      description: `Updated testimonial by ${parsed.name}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

const DeleteBody = z.object({ id: z.string().min(1) });

export async function DELETE(req: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  let parsed;
  try {
    parsed = DeleteBody.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
  if (!isDBEnabled()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  try {
    await connectDB();
    const doc = await Testimonial.findByIdAndDelete(parsed.id);
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await ActivityLog.create({
      actor: session?.user?.email,
      actorId: session?.user?.id,
      action: 'testimonial.deleted',
      target: `testimonial:${parsed.id}`,
      description: `Deleted testimonial by ${doc.name}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
