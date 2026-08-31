import { PrismaAdapter } from "@next-auth/prisma-adapter";
import * as argon2 from "argon2";
import { sign } from "jsonwebtoken";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

const customPrismaAdapter = PrismaAdapter(prisma);

export const authOptions: NextAuthOptions = {
  adapter: {
    ...customPrismaAdapter,
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

        // 1. Cari user di database menggunakan Prisma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            role: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Email tidak ditemukan atau belum terdaftar");
        }

        // 2. Validasi kecocokan password dengan Argon2
        const isValid = await argon2.verify(
          user.password,
          credentials.password,
        );

        if (!isValid) {
          throw new Error("Password salah");
        }

        const roleName = user.role?.name || "CUSTOMER";

        // 3. Kembalikan data user jika berhasil (Sesi NextAuth)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: roleName,
          roleId: user.roleId,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
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
