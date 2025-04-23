"use client";

import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Home() {
    const { status } = useSession();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        <span className="block">Split Expenses</span>
                        <span className="block text-indigo-400">With Ease</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        A modern expense splitting application that makes it
                        easy to track and split expenses with friends and
                        family.
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                            <div className="text-indigo-400">
                                <svg
                                    className="h-12 w-12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-xl font-medium text-white">
                                Group Management
                            </h3>
                            <p className="mt-2 text-gray-300">
                                Create and manage groups with friends and
                                family. Add members easily and keep track of
                                shared expenses.
                            </p>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                            <div className="text-indigo-400">
                                <svg
                                    className="h-12 w-12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-xl font-medium text-white">
                                Flexible Splitting
                            </h3>
                            <p className="mt-2 text-gray-300">
                                Split expenses equally, by percentage, or by
                                custom amounts. Choose the method that works
                                best for your group.
                            </p>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                            <div className="text-indigo-400">
                                <svg
                                    className="h-12 w-12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-xl font-medium text-white">
                                Payment Tracking
                            </h3>
                            <p className="mt-2 text-gray-300">
                                Keep track of who has paid and who hasn't. Mark
                                expenses as paid and maintain a clear record of
                                all transactions.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    {status === "authenticated" ? (
                        <Link href="/groups">
                            <Button size="lg" variant="default">
                                Go to Groups
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/auth/signin">
                            <Button size="lg" variant="default">
                                Get Started
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
