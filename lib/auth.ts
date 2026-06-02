import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma"; // Using the named import { prisma }

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://voca-log-ai.vercel.app",
        process.env.NEXT_PUBLIC_APP_URL as string,
    ].filter(Boolean),
});