import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const expense = await Expense.findById(params.id);
        if (!expense) {
            return NextResponse.json(
                { error: "Expense not found" },
                { status: 404 }
            );
        }

        const split = expense.splits.find(
            (split: any) => split.user.toString() === userId
        );

        if (!split) {
            return NextResponse.json(
                { error: "User not found in expense splits" },
                { status: 404 }
            );
        }

        split.isPaid = true;
        await expense.save();

        return NextResponse.json(expense);
    } catch (error) {
        console.error("Error marking expense as paid:", error);
        return NextResponse.json(
            { error: "Failed to mark expense as paid" },
            { status: 500 }
        );
    }
}
