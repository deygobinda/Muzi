import { authOptions } from "@/app/lib/utill";
import NextAuth from "next-auth";



const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
