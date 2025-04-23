import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { ViewTransitions } from "next-view-transitions";
import { Group } from "@/types";
import { getGroups } from "./actions";
import { HydrationBoundary } from "jotai-ssr";
import { groupsAtom } from "@/atoms/groups";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "SplitWise Clone",
    description: "Split expenses with friends and family",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let groups: Group[] = [];

    try {
        groups = JSON.parse(await getGroups());
    } catch {
        groups = [];
    }
    return (
        <ViewTransitions>
            <HydrationBoundary hydrateAtoms={[[groupsAtom, groups]]}>
                <html lang="en">
                    <body className={inter.className}>
                        <SessionProvider>{children}</SessionProvider>
                    </body>
                </html>
            </HydrationBoundary>
        </ViewTransitions>
    );
}
