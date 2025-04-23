"use client";

import { Link } from "next-view-transitions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Group {
    _id: string;
    name: string;
    description?: string;
    members: any[];
    expenses: any[];
}

export default function GroupCard({ group }: { group: Group }) {
    return (
        <Link href={`/groups/${group._id}`}>
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors duration-200">
                <CardHeader>
                    <CardTitle className="text-white">{group.name}</CardTitle>
                    {group.description && (
                        <CardDescription className="text-gray-300">
                            {group.description}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-sm text-gray-300">
                                {group.members.length} members
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-300">
                                {group.expenses.length} expenses
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
