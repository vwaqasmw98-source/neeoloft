import { NextResponse } from 'next/server';
import { connectDB, isDBEnabled } from '@/lib/mongodb';
import User from '@/models/User';
import Lead from '@/models/Lead';
import Booking from '@/models/Booking';
import Subscription from '@/models/Subscription';
import Testimonial from '@/models/Testimonial';
import ActivityLog from '@/models/ActivityLog';
import { requireAdmin } from '@/lib/apiGuards';

export const runtime = 'nodejs';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  if (!isDBEnabled()) {
    return NextResponse.json({
      totals: { users: 0, leads: 0, newLeads: 0, bookings: 0, subscriptions: 0, testimonials: 0, revenue: 0 },
      recentLeads: [],
      recentOrders: [],
      recentUsers: [],
      recentActivities: [],
    });
  }

  try {
    await connectDB();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [users, leads, newLeads, bookings, subscriptions, testimonials, activeSubs, monthlySubs] =
      await Promise.all([
        User.countDocuments({}),
        Lead.countDocuments({}),
        Lead.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        Booking.countDocuments({}),
        Subscription.countDocuments({}),
        Testimonial.countDocuments({ active: true }),
        Subscription.countDocuments({ status: { $in: ['active', 'trialing'] } }),
        Subscription.aggregate([
          { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $in: ['active', 'trialing'] } } },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
        ]),
      ]);

    // Estimate revenue: monthly subs $49/$149/$499, yearly 10x monthly.
    const PLAN_AMOUNT: Record<string, { monthly: number; yearly: number }> = {
      starter: { monthly: 49, yearly: 490 },
      growth: { monthly: 149, yearly: 1490 },
      agency: { monthly: 499, yearly: 4990 },
    };

    const revenueAgg = await Subscription.aggregate([
      { $match: { status: { $in: ['active', 'trialing'] } } },
      {
        $group: {
          _id: { plan: '$plan', cycle: '$cycle' },
          count: { $sum: 1 },
        },
      },
    ]);

    let revenue = 0;
    for (const r of revenueAgg) {
      const amt = PLAN_AMOUNT[r._id.plan];
      if (!amt) continue;
      const value = r._id.cycle === 'yearly' ? amt.yearly : amt.monthly;
      revenue += value * r.count;
    }

    const [recentLeads, recentOrders, recentUsers, recentActivities] = await Promise.all([
      Lead.find({}).sort({ createdAt: -1 }).limit(8).lean(),
      Subscription.find({}).sort({ createdAt: -1 }).limit(8).lean(),
      User.find({}).sort({ createdAt: -1 }).limit(8).lean(),
      ActivityLog.find({}).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return NextResponse.json({
      totals: {
        users,
        leads,
        newLeads,
        bookings,
        subscriptions,
        activeSubscriptions: activeSubs,
        testimonials,
        revenue,
      },
      recentLeads: recentLeads.map((l) => ({
        _id: String(l._id),
        name: l.name,
        email: l.email,
        service: l.service,
        score: l.score,
        source: l.source,
        createdAt: l.createdAt,
      })),
      recentOrders: recentOrders.map((s) => ({
        _id: String(s._id),
        userId: String(s.userId),
        plan: s.plan,
        cycle: s.cycle,
        status: s.status,
        amount: PLAN_AMOUNT[s.plan]
          ? s.cycle === 'yearly'
            ? PLAN_AMOUNT[s.plan].yearly
            : PLAN_AMOUNT[s.plan].monthly
          : 0,
        createdAt: s.createdAt,
      })),
      recentUsers: recentUsers.map((u) => ({
        _id: String(u._id),
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
      })),
      recentActivities: recentActivities.map((a) => ({
        _id: String(a._id),
        actor: a.actor,
        action: a.action,
        description: a.description,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
