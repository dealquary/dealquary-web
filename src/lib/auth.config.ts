import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Adapter } from "next-auth/adapters";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  // ✅ Helps reveal the real production error
  debug: true,

  // ✅ Much better logs in Vercel (shows actual root cause)
  logger: {
    error(code, metadata) {
      console.error("[auth][error]", code, metadata);
    },
    warn(code) {
      console.warn("[auth][warn]", code);
    },
    debug(code, metadata) {
      console.log("[auth][debug]", code, metadata);
    },
  },

  // ✅ Important when running behind Vercel/proxies (especially v5 beta)
  // If TS complains because of your installed types, remove this line and set env AUTH_TRUST_HOST=true instead.
  // @ts-expect-error - trustHost exists in Auth.js/NextAuth v5
  trustHost: true,

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // Your app expects these fields on the client
        // @ts-expect-error - extend session user type if you want strict typing
        session.user.id = user.id;
        // @ts-expect-error - extend session user type if you want strict typing
        session.user.isPro = user.isPro ?? false;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "database",
  },
};
