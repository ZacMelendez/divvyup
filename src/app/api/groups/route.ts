import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";
import { authOptions } from "@/auth.config";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const groups = await Group.find({
            members: session.user.id,
        }).populate("members", "name email image");

        return NextResponse.json(groups);
    } catch (error) {
        console.error("Error fetching groups:", error);
        return NextResponse.json(
            { error: "Failed to fetch groups" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name, description } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: "Group name is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
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

        return NextResponse.json(group);
    } catch (error) {
        console.error("Error creating group:", error);
        return NextResponse.json(
            { error: "Failed to create group" },
            { status: 500 }
        );
    }
}
