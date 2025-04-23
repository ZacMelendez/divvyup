"use client";

import { useAtom } from "jotai";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { createGroupModalOpenAtom } from "@/atoms";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [, setCreateGroupModalOpen] = useAtom(createGroupModalOpenAtom);

    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="text-xl font-bold text-white"
                            >
                                Expense Splitter
                            </Link>
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    href="/groups"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive("/groups")
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                >
                                    Groups
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {session ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-300">
                                        {session.user?.name}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => signOut()}
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/auth/signin">
                                    <Button variant="outline">Sign In</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
