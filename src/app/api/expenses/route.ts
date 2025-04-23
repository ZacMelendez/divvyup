import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Group from "@/models/Group";
import { authOptions } from "@/auth.config";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const {
            description,
            amount,
            groupId,
            splitType,
            selectedMembers,
            percentages,
            amounts,
        } = await request.json();

        if (
            !description ||
            !amount ||
            !groupId ||
            !splitType ||
            !selectedMembers
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectDB();

        const group = await Group.findById(groupId);
        if (!group) {
            return NextResponse.json(
                { error: "Group not found" },
                { status: 404 }
            );
        }

        if (!group.members.includes(session.user.id)) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const splits = selectedMembers?.map((memberId: string) => {
            let splitAmount = 0;
            let percentage;

            if (splitType === "equal") {
                splitAmount = amount / selectedMembers.length;
            } else if (splitType === "percentage") {
                percentage = parseFloat(percentages[memberId]);
                splitAmount = (amount * percentage) / 100;
            } else if (splitType === "amount") {
                splitAmount = parseFloat(amounts[memberId]);
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

        return NextResponse.json(expense);
    } catch (error) {
        console.error("Error creating expense:", error);
        return NextResponse.json(
            { error: "Failed to create expense" },
            { status: 500 }
        );
    }
}
