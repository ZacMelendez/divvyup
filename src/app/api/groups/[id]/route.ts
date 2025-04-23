import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const pathParams = await params;

        const group = await Group.findById(pathParams.id)
            .populate("members", "name email image")
            .populate("expenses");

        if (!group) {
            return NextResponse.json(
                { error: "Group not found" },
                { status: 404 }
            );
        }

        if (
            !group.members.some(
                (member: any) => member._id.toString() === session.user.id
            )
        ) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(group);
    } catch (error) {
        console.error("Error fetching group:", error);
        return NextResponse.json(
            { error: "Failed to fetch group" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const pathParams = await params;

        const group = await Group.findById(pathParams.id);
        if (!group) {
            return NextResponse.json(
                { error: "Group not found" },
                { status: 404 }
            );
        }

        if (group.createdBy.toString() !== session.user.id) {
            return NextResponse.json(
                { error: "Only group creator can add members" },
                { status: 403 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        if (group.members.includes(user._id)) {
            return NextResponse.json(
                { error: "User is already a member" },
                { status: 400 }
            );
        }

        group.members.push(user._id);
        await group.save();

        user.groups.push(group._id);
        await user.save();

        return NextResponse.json(group);
    } catch (error) {
        console.error("Error adding member:", error);
        return NextResponse.json(
            { error: "Failed to add member" },
            { status: 500 }
        );
    }
}
