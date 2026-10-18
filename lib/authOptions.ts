import { PrismaAdapter } from "@next-auth/prisma-adapter";
import * as argon2 from "argon2";
import { sign } from "jsonwebtoken";
import type { NextAuthOptions } from "next-auth";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

const baseAdapter = PrismaAdapter(prisma);

const adapter: Adapter = {
  ...baseAdapter,
  async createUser(data: Omit<AdapterUser, "id">): Promise<AdapterUser> {
    const role = await prisma.role.findUnique({
      where: { name: "CUSTOMER" },
      select: { id: true },
    });

    if (!role) {
      throw new Error("Role CUSTOMER tidak ditemukan");
    }

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        image: data.image,
        emailVerified: data.emailVerified,
        roleId: role.id,
      },
    });
  },
};

export const authOptions: NextAuthOptions = {
  adapter,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { role: true },
        });

        if (!user?.password) {
          throw new Error("Email atau password tidak valid");
        }

        const isValid = await argon2.verify(
          user.password,
          credentials.password,
        );

        if (!isValid) {
          throw new Error("Email atau password tidak valid");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role.name,
          roleId: user.roleId,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            roleId: true,
            role: {
              select: { name: true },
            },
          },
        });

        if (!dbUser) {
          throw new Error("User autentikasi tidak ditemukan");
        }

        token.id = dbUser.id;
        token.roleId = dbUser.roleId;
        token.role = dbUser.role.name;

        token.accessToken = sign(
          {
            id: dbUser.id,
            email: dbUser.email,
            role: dbUser.role.name,
            roleId: dbUser.roleId,
          },
          process.env.NEXTAUTH_SECRET!,
          {
            expiresIn: "1d",
          },
        );
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.roleId = token.roleId;
        session.user.accessToken = token.accessToken;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
