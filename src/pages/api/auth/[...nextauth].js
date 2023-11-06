import { db } from "@/utils/prismaClient";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 30,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.username = token.username;

      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const foundUser = await db.user.findUnique({ where: { email } });
        if (!foundUser) {
          return false;
        }

        if (!(await bcrypt.compare(password, foundUser.password))) {
          return false;
        }

        const { username, id } = foundUser;

        return { name: username, email, id };
      },
    }),
  ],
};

export default NextAuth(authOptions);
