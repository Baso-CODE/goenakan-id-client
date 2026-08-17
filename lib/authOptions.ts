import { apiUrl } from "@/app/utils/ApiUrl";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { sign } from "jsonwebtoken";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters"; // ✨ TAMBAHAN: Import tipe data bawaan NextAuth
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

const customPrismaAdapter = PrismaAdapter(prisma);

export const authOptions: NextAuthOptions = {
  adapter: {
    ...customPrismaAdapter,
    // ✨ PERBAIKAN 1: Berikan tipe 'Omit<AdapterUser, "id">' pada parameter 'data'
    createUser: async (data: Omit<AdapterUser, "id">) => {
      const customerRole = await prisma.role.findUnique({
        where: { name: "CUSTOMER" },
      });

      if (!customerRole) {
        throw new Error("Role CUSTOMER tidak ditemukan di database!");
      }

      // Simpan user baru ke database
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          image: data.image,
          emailVerified: data.emailVerified,
          roleId: customerRole.id,
        },
      });

      // ✨ Kembalikan data dalam format AdapterUser agar NextAuth dan TypeScript puas
      return {
        ...newUser,
        role: "CUSTOMER",
      } as AdapterUser;
    },
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile: Record<string, any>) {
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
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            if (response.status === 429)
              throw new Error(
                "Terlalu banyak percobaan login, coba lagi dalam 15 menit",
              );
            if (response.status === 401)
              throw new Error(error.message || "Email atau password salah");
            if (response.status === 500)
              throw new Error("Server error, silahkan coba lagi nanti");
            throw new Error(error.message || "Login gagal");
          }

          const user = await response.json();

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            roleId: user.roleId,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Terjadi kesalahan saat login");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // ✨ PERBAIKAN 3: Ganti 'as any' menjadi 'as User' (Sesuai deklarasi di next-auth.d.ts)
        const customUser = user as User;

        token.id = customUser.id;
        token.roleId = customUser.roleId;

        let roleName = customUser.role;
        if (!roleName && customUser.roleId) {
          const roleData = await prisma.role.findUnique({
            where: { id: customUser.roleId },
            select: { name: true },
          });
          roleName = roleData?.name || "CUSTOMER";
        }

        token.role = roleName || "CUSTOMER";

        token.accessToken = sign(
          {
            id: customUser.id,
            email: customUser.email,
            role: token.role,
          },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "1d" },
        );
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.roleId = token.roleId as string | undefined;
        session.user.accessToken = token.accessToken as string;
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
