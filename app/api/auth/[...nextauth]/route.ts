import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma  from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email!;
        let dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email,
              fullName: user.name || "",
              username: email.split("@")[0],
              password: "",
              securityId: crypto.randomUUID(),
              usertype: "STUDENT",
            },
          });
        }

        (user as any).id = dbUser.id;
        (user as any).usertype = dbUser.usertype;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.usertype = (user as any).usertype;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).usertype = token.usertype;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
