import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Simple admin check - in production use bcrypt + DB lookup
                if (
                    credentials?.email === "admin@loversdietcenter.ae" &&
                    credentials?.password === "LDC2024Admin!"
                ) {
                    return {
                        id: "1",
                        email: "admin@loversdietcenter.ae",
                        name: "Admin",
                    };
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/admin/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "super-secret-key-change-in-production",
};
