import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      roleId?: string | null;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    roleId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    roleId?: string | null;
    accessToken: string;
  }
}
