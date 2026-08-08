import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import Lead from '@/models/Lead';

export const runtime = 'nodejs';

function basicAuthOk(req: Request) {
  const u = process.env.ADMIN_USERNAME;
  const p = process.env.ADMIN_PASSWORD;
  if (!u || !p) return true; // no env => allow (still requires session)
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Basic ')) return false;
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString();
    const [cu, cp] = decoded.split(':');
    return cu === u && cp === p;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  // Allow either NextAuth session or legacy basic auth
  const session = await getServerSession(authOptions);
  const authed = session || basicAuthOk(req);
  if (!authed) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Neeoloft"' },
    });
  }
  if (!isDBEnabled()) {
    return new NextResponse('No database', { status: 503 });
  }

  try {
    await connectDB();
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();
    const headers = [
      'name',
      'email',
      'phone',
      'service',
      'score',
      'source',
      'budget',
      'timeline',
      'message',
      'createdAt',
    ];
    const escape = (v: unknown) => {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = [headers.join(',')];
    for (const l of leads) {
      rows.push(
        headers
          .map((h) => escape((l as Record<string, unknown>)[h]))
          .join(',')
      );
    }
    const csv = rows.join('\n');
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="neeoloft-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
