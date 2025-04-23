"use client";

import { Link } from "next-view-transitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAtomValue } from "jotai";
import { groupsAtom } from "@/atoms/groups";
import CreateGroupModal from "@/components/CreateGroupModal";

export default function GroupsPage() {
    const groups = useAtomValue(groupsAtom);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Groups</h1>
                <CreateGroupModal />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups?.map((group) => (
                    <Link key={group._id} href={`/groups/${group._id}`}>
                        <Card className="hover:bg-accent/50 transition-colors">
                            <CardHeader>
                                <CardTitle>{group.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {group.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {group.description}
                                    </p>
                                )}
                                <div className="mt-4 flex justify-between text-sm">
                                    <span>
                                        {group.members?.length || 0} members
                                    </span>
                                    <span>
                                        {group.expenses?.length || 0} expenses
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
