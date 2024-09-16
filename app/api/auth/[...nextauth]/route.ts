import { userClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  callbacks: {
    async signIn(params) {
      if (!params.user.email) {
        return false;
      }

      try {
        const existingUser = await userClient.findUnique({
          where: {
            email: params.user.email,
          },
        });

        if (!existingUser) {
          await userClient.create({
            data: {
              email: params.user.email,
              provider: "Google",
            },
          });
        }
        return true;
      } catch (error) {
        console.error("Error during signIn:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
