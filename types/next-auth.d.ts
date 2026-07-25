import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      workspaceId?: string;
      phone?: string;
    };
  }
  interface User {
    id: string;
    role?: string;
    workspaceId?: string;
    phone?: string;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    workspaceId?: string;
    phone?: string;
    image?: string;
  }
}
