import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import KnowledgeBase from '@/models/KnowledgeBase';
import { chunkText, fetchUrlText } from '@/lib/kb';

export const runtime = 'nodejs';

const Body = z.object({
  title: z.string().min(1).max(200),
  source: z.enum(['text', 'url', 'pdf', 'faq', 'manual']).default('text'),
  content: z.string().optional(),
  url: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  active: z.boolean().default(true),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isDBEnabled()) return NextResponse.json({ items: [] });
  await connectDB();
  const items = await KnowledgeBase.find({}).sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  let content = parsed.content || '';
  if (parsed.source === 'url') {
    if (!parsed.url) {
      return NextResponse.json({ error: 'url required for source=url' }, { status: 400 });
    }
    try {
      content = await fetchUrlText(parsed.url);
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 });
    }
  }
  if (!content.trim()) {
    return NextResponse.json({ error: 'Empty content' }, { status: 400 });
  }
  const chunks = chunkText(content);

  if (!isDBEnabled()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }
  await connectDB();
  const doc = await KnowledgeBase.create({
    title: parsed.title,
    source: parsed.source,
    content,
    chunks,
    tags: parsed.tags,
    active: parsed.active,
  });
  return NextResponse.json({ ok: true, id: doc._id, chunks: chunks.length });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  if (!isDBEnabled()) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  await connectDB();
  await KnowledgeBase.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
