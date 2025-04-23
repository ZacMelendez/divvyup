import { AuthOptions } from "next-auth";
import { clientPromise } from "./lib/mongodb";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Session, User } from "next-auth";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        async session({ session, user }: { session: Session; user: User }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
};
