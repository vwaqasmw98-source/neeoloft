import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from './mongodb';
import User from '@/models/User';

type AuthedUser = {
  _id: unknown;
  email: string;
  name: string;
  passwordHash: string;
  role?: string;
  workspaceId?: string;
  phone?: string;
  image?: string;
};

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        await connectDB();
        const user = (await User.findOne({ email: credentials.email.toLowerCase() }).lean()) as
          | AuthedUser
          | null;
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role || 'member',
          workspaceId: String(user.workspaceId || user._id),
          phone: user.phone,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // First sign-in: persist identity + custom fields on the JWT.
        if ((user as { id?: string }).id) {
          token.sub = (user as { id: string }).id;
        }
        token.role = (user as { role?: string }).role;
        token.workspaceId = (user as { workspaceId?: string }).workspaceId;
        token.phone = (user as { phone?: string }).phone;
        token.image = (user as { image?: string }).image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Expose the user id on the session so server routes can look up the user.
        if (token.sub) session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.workspaceId = token.workspaceId as string;
        session.user.phone = token.phone as string | undefined;
        session.user.image = (token.image as string | null | undefined) ?? session.user.image ?? null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
