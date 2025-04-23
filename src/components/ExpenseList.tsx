"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Expense {
    _id: string;
    description: string;
    amount: number;
    date: string;
    paidBy: {
        _id: string;
        name: string;
    };
    splitType: "equal" | "percentage" | "amount";
    splits: {
        user: {
            _id: string;
            name: string;
        };
        amount: number;
        percentage?: number;
        isPaid: boolean;
    }[];
}

interface ExpenseListProps {
    groupId: string;
    expenses: Expense[];
}

export default function ExpenseList({ groupId, expenses }: ExpenseListProps) {
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(
        null
    );

    const handleMarkAsPaid = async (expenseId: string, userId: string) => {
        try {
            const response = await fetch(
                `/api/expenses/${expenseId}/mark-paid`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to mark expense as paid");
            }

            // Refresh the expense list
            window.location.reload();
        } catch (error) {
            console.error("Error marking expense as paid:", error);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {expenses?.map((expense) => (
                        <div
                            key={expense._id}
                            className="border-b border-gray-700 pb-4 last:border-0 last:pb-0"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    {expense.description && (
                                        <p className="text-sm font-medium text-indigo-400 truncate">
                                            {expense.description}
                                        </p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-300">
                                        Paid by {expense.paidBy.name} on{" "}
                                        {format(
                                            new Date(expense.date),
                                            "MMM d, yyyy"
                                        )}
                                    </p>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    <p className="text-sm font-medium text-white">
                                        ${expense.amount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="text-sm text-gray-300">
                                    <div className="grid grid-cols-2 gap-2">
                                        {expense.splits?.map((split) => (
                                            <div
                                                key={split.user._id}
                                                className="flex items-center justify-between"
                                            >
                                                <span>{split.user.name}</span>
                                                <div className="flex items-center space-x-2">
                                                    <span>
                                                        {expense.splitType ===
                                                        "equal"
                                                            ? `$${split.amount.toFixed(
                                                                  2
                                                              )}`
                                                            : expense.splitType ===
                                                              "percentage"
                                                            ? `${split.percentage}%`
                                                            : `$${split.amount.toFixed(
                                                                  2
                                                              )}`}
                                                    </span>
                                                    {!split.isPaid && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleMarkAsPaid(
                                                                    expense._id,
                                                                    split.user
                                                                        ._id
                                                                )
                                                            }
                                                            className="bg-green-900/20 text-green-400 hover:bg-green-900/30"
                                                        >
                                                            Mark as Paid
                                                        </Button>
                                                    )}
                                                    {split.isPaid && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-gray-700 text-gray-300"
                                                        >
                                                            Paid
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
