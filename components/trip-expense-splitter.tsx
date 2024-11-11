"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from "js-cookie";

type Expense = {
    description: string;
    amount: number;
    paidBy: string;
    splitType: "equal" | "custom";
    customSplit: number | null;
};

type Participant = string;

export function TripExpenseSplitterComponent() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [newParticipant, setNewParticipant] = useState("");
    const [newExpense, setNewExpense] = useState<Expense>({
        description: "",
        amount: 0,
        paidBy: "",
        splitType: "equal",
        customSplit: null,
    });

    useEffect(() => {
        const savedParticipants = Cookies.get("participants");
        const savedExpenses = Cookies.get("expenses");

        if (savedParticipants) {
            setParticipants(JSON.parse(savedParticipants));
        }
        if (savedExpenses) {
            setExpenses(JSON.parse(savedExpenses));
        }
    }, []);

    useEffect(() => {
        Cookies.set("participants", JSON.stringify(participants), {
            expires: 7,
        });
        Cookies.set("expenses", JSON.stringify(expenses), { expires: 7 });
    }, [participants, expenses]);

    const addParticipant = (e: React.FormEvent) => {
        e.preventDefault();
        if (newParticipant.trim()) {
            setParticipants([...participants, newParticipant.trim()]);
            setNewParticipant("");
        }
    };

    const addExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (newExpense.description.trim() && newExpense.amount > 0) {
            setExpenses([...expenses, newExpense]);
            setNewExpense({
                description: "",
                amount: 0,
                paidBy: "",
                splitType: "equal",
                customSplit: null,
            });
        }
    };

    const calculateSplitAmounts = () => {
        const splitAmounts: { [participant: string]: number } = {};
        participants.forEach((participant) => {
            splitAmounts[participant] = 0;
        });

        expenses.forEach((expense) => {
            if (expense.splitType === "equal") {
                const splitAmount = expense.amount / participants.length;
                participants.forEach((participant) => {
                    splitAmounts[participant] += splitAmount;
                });
            } else if (
                expense.splitType === "custom" &&
                expense.customSplit !== null
            ) {
                const remainingAmount = expense.amount - expense.customSplit;
                const splitAmount = remainingAmount / (participants.length - 1);
                participants.forEach((participant) => {
                    splitAmounts[participant] += splitAmount;
                });
                splitAmounts[participants[0]] +=
                    expense.customSplit - splitAmount;
            }
        });

        return splitAmounts;
    };

    const splitAmounts = calculateSplitAmounts();

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Trip Expense Splitter</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={addParticipant} className="space-y-4">
                        <div>
                            <Label htmlFor="participant">Add Participant</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="participant"
                                    value={newParticipant}
                                    onChange={(e) =>
                                        setNewParticipant(e.target.value)
                                    }
                                    placeholder="Participant name"
                                />
                                <Button type="submit">Add</Button>
                            </div>
                        </div>
                    </form>

                    <form onSubmit={addExpense} className="space-y-4 mt-6">
                        <div>
                            <Label htmlFor="expenseDescription">
                                Expense Description
                            </Label>
                            <Input
                                id="expenseDescription"
                                value={newExpense.description}
                                onChange={(e) =>
                                    setNewExpense({
                                        ...newExpense,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Expense description"
                            />
                        </div>
                        <div>
                            <Label htmlFor="expenseAmount">Amount</Label>
                            <Input
                                id="expenseAmount"
                                type="number"
                                value={newExpense.amount || ""}
                                onChange={(e) =>
                                    setNewExpense({
                                        ...newExpense,
                                        amount: parseFloat(e.target.value) || 0,
                                    })
                                }
                                placeholder="Amount"
                            />
                        </div>
                        <div>
                            <Label htmlFor="splitType">Split Type</Label>
                            <select
                                id="splitType"
                                value={newExpense.splitType}
                                onChange={(e) =>
                                    setNewExpense({
                                        ...newExpense,
                                        splitType: e.target.value as
                                            | "equal"
                                            | "custom",
                                    })
                                }
                                className="w-full p-2 border rounded"
                            >
                                <option value="equal">Equal</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="splitType">Paid By</Label>
                            <select
                                id="paidBy"
                                value={participants[0]}
                                onChange={(e) =>
                                    setNewExpense({
                                        ...newExpense,
                                        paidBy: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                            >
                                {participants.map((i, index) => (
                                    <option key={`${i} - ${index}`} value={i}>
                                        {i}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {newExpense.splitType === "custom" && (
                            <div>
                                <Label htmlFor="customSplit">
                                    Custom Split Amount
                                </Label>
                                <Input
                                    id="customSplit"
                                    type="number"
                                    value={newExpense.customSplit || ""}
                                    onChange={(e) =>
                                        setNewExpense({
                                            ...newExpense,
                                            customSplit:
                                                parseFloat(e.target.value) ||
                                                null,
                                        })
                                    }
                                    placeholder="Custom split amount"
                                />
                            </div>
                        )}
                        <Button type="submit">Add Expense</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5">
                        {expenses.map((expense, index) => (
                            <li key={index}>
                                {expense.description}: $
                                {expense.amount.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 font-bold">
                        Total: $
                        {expenses
                            .reduce((sum, expense) => sum + expense.amount, 0)
                            .toFixed(2)}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Participants</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5">
                        {participants.map((participant, index) => (
                            <li key={index}>{participant}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Split Amounts</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5">
                        {Object.entries(splitAmounts).map(
                            ([participant, amount]) => (
                                <li key={participant}>
                                    {participant}: ${amount.toFixed(2)}
                                </li>
                            )
                        )}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
