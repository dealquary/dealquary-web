export const runtime = "nodejs";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const authConfig = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isPro = user.isPro || false;
      }
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user }: any) {
      // Record terms acceptance timestamp for new users
      if (user && user.id) {
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { termsAcceptedAt: true },
        });

        // Only set termsAcceptedAt if it's not already set (first sign-in)
        if (existingUser && !existingUser.termsAcceptedAt) {
          await prisma.user.update({
            where: { id: user.id },
            data: { termsAcceptedAt: new Date() },
          });
        }
      }
      return true;
    },
  },
  session: {
    strategy: "database",
  },
});

export const GET = authConfig.handlers.GET;
export const POST = authConfig.handlers.POST;
