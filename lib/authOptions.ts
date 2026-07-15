import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { sign } from "jsonwebtoken";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "CUSTOMER",
        };
      },
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

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          // ❌ Handle error dari backend (termasuk rate limit 429)
          if (!response.ok) {
            const error = await response.json().catch(() => ({}));

            // Rate Limit Error (429)
            if (response.status === 429) {
              throw new Error(
                "Terlalu banyak percobaan login, coba lagi dalam 15 menit",
              );
            }

            // Unauthorized (401)
            if (response.status === 401) {
              throw new Error(error.message || "Email atau password salah");
            }

            // Server Error (500)
            if (response.status === 500) {
              throw new Error("Server error, silahkan coba lagi nanti");
            }

            throw new Error(error.message || "Login gagal");
          }

          const user = await response.json();

          // ✅ Return user data ke Next Auth
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            roleId: user.roleId,
          };
        } catch (error) {
          // ✅ Throw error ke signIn callback
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Terjadi kesalahan saat login");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const customerRole = await prisma.role.findUnique({
          where: { name: "CUSTOMER" },
        });

        if (customerRole) {
          await prisma.user.update({
            where: { email: user.email },
            data: { roleId: customerRole.id },
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const customUser = user as User;

        token.id = customUser.id;
        token.role = customUser.role || "CUSTOMER";
        token.roleId = customUser.roleId;
        token.accessToken = sign(
          {
            id: customUser.id,
            email: customUser.email,
            role: customUser.role || "CUSTOMER",
          },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "1d" },
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
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
