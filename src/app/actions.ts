"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";
import Expense from "@/models/Expense";

export async function getGroups() {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Unauthorized");
    }

    await connectDB();

    const groups = await Group.find({
        members: session.user.id,
    }).populate("members", "name email image");

    return JSON.stringify(groups);
}

export async function getGroup(id: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Unauthorized");
    }

    await connectDB();

    const group = await Group.findById(id)
        .populate("members", "name email image")
        .populate("expenses");

    if (!group) {
        throw new Error("Group not found");
    }

    if (
        !group.members.some(
            (member: any) => member._id.toString() === session.user.id
        )
    ) {
        throw new Error("Unauthorized");
    }

    return JSON.stringify(group);
}

export async function createGroup(name: string, description?: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Unauthorized");
    }

    if (!name) {
        throw new Error("Group name is required");
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
        throw new Error("User not found");
    }

    const group = new Group({
        name,
        description,
        members: [user._id],
        createdBy: user._id,
    });

    await group.save();

    user.groups.push(group._id);
    await user.save();

    return group;
}

export async function addMember(groupId: string, email: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Unauthorized");
    }

    if (!email) {
        throw new Error("Email is required");
    }

    await connectDB();

    const group = await Group.findById(groupId);
    if (!group) {
        throw new Error("Group not found");
    }

    if (group.createdBy.toString() !== session.user.id) {
        throw new Error("Only group creator can add members");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    if (group.members.includes(user._id)) {
        throw new Error("User is already a member");
    }

    group.members.push(user._id);
    await group.save();

    user.groups.push(group._id);
    await user.save();

    return group;
}

export async function createExpense(
    description: string,
    amount: number,
    groupId: string,
    splitType: "equal" | "percentage" | "amount",
    selectedMembers: string[],
    percentages?: Record<string, string>,
    amounts?: Record<string, string>
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Unauthorized");
    }

    if (!description || !amount || !groupId || !splitType || !selectedMembers) {
        throw new Error("Missing required fields");
    }

    await connectDB();

    const group = await Group.findById(groupId);
    if (!group) {
        throw new Error("Group not found");
    }

    if (!group.members.includes(session.user.id)) {
        throw new Error("Unauthorized");
    }

    const splits = selectedMembers.map((memberId) => {
        let splitAmount = 0;
        let percentage;

        if (splitType === "equal") {
            splitAmount = amount / selectedMembers.length;
        } else if (splitType === "percentage") {
            percentage = parseFloat(percentages?.[memberId] || "0");
            splitAmount = (amount * percentage) / 100;
        } else if (splitType === "amount") {
            splitAmount = parseFloat(amounts?.[memberId] || "0");
        }

        return {
            user: memberId,
            amount: splitAmount,
            ...(percentage && { percentage }),
            isPaid: memberId === session.user.id,
        };
    });

    const expense = new Expense({
        description,
        amount,
        date: new Date(),
        paidBy: session.user.id,
        group: groupId,
        splitType,
        splits,
    });

    await expense.save();

    group.expenses.push(expense._id);
    await group.save();

    return expense;
}

export async function markExpenseAsPaid(expenseId: string, userId: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Unauthorized");
    }

    if (!userId) {
        throw new Error("User ID is required");
    }

    await connectDB();

    const expense = await Expense.findById(expenseId);
    if (!expense) {
        throw new Error("Expense not found");
    }

    const split = expense.splits.find(
        (split: any) => split.user.toString() === userId
    );

    if (!split) {
        throw new Error("User not found in expense splits");
    }

    split.isPaid = true;
    await expense.save();

    return expense;
}
