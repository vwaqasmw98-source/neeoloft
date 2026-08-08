/**
 * Knowledge base chunking + retrieval.
 * Simple keyword-overlap scoring — fast, free, no embeddings API needed.
 * Swap to vector search (OpenAI/Groq embeddings + Mongo $vectorSearch) when
 * you have > 1000 chunks or need semantic recall.
 */

import { connectDB } from './mongodb';
import KnowledgeBase from '@/models/KnowledgeBase';

export type KBChunk = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  source: string;
  score?: number;
};

const CHUNK_SIZE = 700; // ~ characters per chunk
const CHUNK_OVERLAP = 100;
const TOP_K = 4;

/**
 * Split text into overlapping chunks for retrieval.
 */
export function chunkText(text: string, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= size) return [cleaned];
  const chunks: string[] = [];
  let i = 0;
  while (i < cleaned.length) {
    const end = Math.min(i + size, cleaned.length);
    let slice = cleaned.slice(i, end);
    // Try to break on sentence boundary
    if (end < cleaned.length) {
      const lastDot = slice.lastIndexOf('. ');
      if (lastDot > size * 0.6) slice = slice.slice(0, lastDot + 1);
    }
    chunks.push(slice.trim());
    if (end === cleaned.length) break;
    i += size - overlap;
  }
  return chunks.filter(Boolean);
}

/**
 * Score a chunk against a query using keyword overlap + recency bonus.
 */
function scoreChunk(chunk: string, query: string, tags: string[] = []): number {
  const q = query.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  if (!q.length) return 0;
  const c = chunk.toLowerCase();
  let score = 0;
  for (const term of q) {
    const matches = (c.match(new RegExp(`\\b${term}\\b`, 'g')) || []).length;
    score += matches * (term.length > 5 ? 2 : 1);
  }
  // Tag boost
  for (const t of tags) {
    if (q.some((term) => t.toLowerCase().includes(term))) score += 2;
  }
  return score;
}

/**
 * Fetch top-K relevant chunks for a query from the active KB.
 */
export async function retrieveContext(
  query: string,
  workspaceId?: string,
  k = TOP_K
): Promise<KBChunk[]> {
  if (!process.env.MONGODB_URI) return [];
  await connectDB();
  const filter: Record<string, unknown> = { active: true };
  if (workspaceId) filter.workspaceId = workspaceId;

  const docs = await KnowledgeBase.find(filter).lean();
  const all: KBChunk[] = [];
  for (const d of docs) {
    const chunks = Array.isArray(d.chunks) && d.chunks.length ? d.chunks : chunkText(d.content || '');
    chunks.forEach((c: string, idx: number) => {
      all.push({
        id: `${d._id}:${idx}`,
        title: d.title,
        content: c,
        tags: d.tags || [],
        source: d.source || 'manual',
        score: scoreChunk(c, query, d.tags || []),
      });
    });
  }
  return all
    .filter((c) => (c.score || 0) > 0)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, k);
}

/**
 * Fetch a URL and strip HTML to plain text.
 */
export async function fetchUrlText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Neeoloft KB Fetcher)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const html = await res.text();
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
