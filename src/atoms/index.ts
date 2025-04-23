"use client";

import { atom } from "jotai";

// Group atoms
export const groupsAtom = atom<any[]>([]);
export const selectedGroupAtom = atom<any | null>(null);

// Expense atoms
export const expensesAtom = atom<any[]>([]);
export const selectedExpenseAtom = atom<any | null>(null);

// Modal atoms
export const createGroupModalOpenAtom = atom(false);
export const createExpenseModalOpenAtom = atom(false);
export const addMemberModalOpenAtom = atom(false);

// Form state atoms
export const createGroupFormAtom = atom({
    name: "",
    description: "",
});

export const createExpenseFormAtom = atom({
    description: "",
    amount: "",
    splitType: "equal" as "equal" | "percentage" | "amount",
    selectedMembers: [] as string[],
    percentages: {} as Record<string, string>,
    amounts: {} as Record<string, string>,
});

export const addMemberFormAtom = atom({
    email: "",
});
