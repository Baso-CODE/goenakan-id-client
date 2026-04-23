import { PrismaAdapter } from "@next-auth/prisma-adapter";
import * as argon2 from "argon2";
import { sign } from "jsonwebtoken";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  // ✨ 1. Daftarkan Prisma Adapter di sini
  adapter: PrismaAdapter(prisma),

  providers: [
    // ✨ 2. Tambahkan Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        // Mapping role default untuk user yang daftar via Google
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "CUSTOMER", // User Google otomatis jadi Customer
        };
      },
    }),

    // 3. Credentials Provider (Untuk login Email/Password)
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
        });

        if (!user || !user.password) {
          throw new Error(
            "Email tidak ditemukan atau terdaftar menggunakan Google",
          );
        }

        const isPasswordValid = await argon2.verify(
          user.password,
          credentials.password,
        );

        if (!isPasswordValid) {
          throw new Error("Password salah");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Saat login pertama kali, objek 'user' akan tersedia
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // Buat Access Token untuk API Express
        token.accessToken = sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
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
