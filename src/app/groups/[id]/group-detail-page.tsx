"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ExpenseList from "@/components/ExpenseList";
import CreateExpenseModal from "@/components/CreateExpenseModal";
import AddMemberModal from "@/components/AddMemberModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, UserPlus } from "lucide-react";
import { addMember, createExpense } from "@/app/actions";
import { Group } from "@/types";

export default function GroupDetailPage({
    group: initialGroup,
}: {
    group: Group;
}) {
    const { status } = useSession();
    const router = useRouter();
    const [group, setGroup] = useState(initialGroup);
    const [isCreateExpenseModalOpen, setIsCreateExpenseModalOpen] =
        useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

    if (status === "unauthenticated") {
        router.push("/auth/signin");
        return null;
    }

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    const handleAddMember = async (email: string) => {
        try {
            const updatedGroupData = await addMember(group._id, email);
            setGroup(updatedGroupData);
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    const handleCreateExpense = async (
        description: string,
        amount: number,
        splitType: "equal" | "percentage" | "amount",
        selectedMembers: string[],
        percentages?: Record<string, string>,
        amounts?: Record<string, string>
    ) => {
        try {
            const newExpense = await createExpense(
                description,
                amount,
                group._id,
                splitType,
                selectedMembers,
                percentages,
                amounts
            );
            setGroup((prev) => ({
                ...prev,
                expenses: [...prev.expenses, newExpense],
            }));
        } catch (error) {
            console.error("Error creating expense:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{group.name}</h1>
                    {group.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {group.description}
                        </p>
                    )}
                </div>
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsAddMemberModalOpen(true)}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Member
                    </Button>
                    <Button onClick={() => setIsCreateExpenseModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Expense
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Members</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {group.members?.map((member) => (
                            <Badge
                                key={member._id}
                                variant="secondary"
                                className="text-sm"
                            >
                                {member.name}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <ExpenseList groupId={group._id} expenses={group.expenses} />

            <CreateExpenseModal
                isOpen={isCreateExpenseModalOpen}
                onClose={() => setIsCreateExpenseModalOpen(false)}
                onExpenseCreated={handleCreateExpense}
                members={group.members}
            />

            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
                onMemberAdded={handleAddMember}
                currentMembers={group.members}
            />
        </div>
    );
}
