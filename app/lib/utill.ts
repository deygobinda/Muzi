import { userClient } from "./db";
import GoogleProvider from "next-auth/providers/google";



export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
      })
    ],
    secret : process.env.NEXTAUTH_AUTH_SECRET ?? "secret",
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
  }