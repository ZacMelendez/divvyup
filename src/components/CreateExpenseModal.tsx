"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types";

interface CreateExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExpenseCreated: (
        description: string,
        amount: number,
        splitType: "equal" | "percentage" | "amount",
        selectedMembers: string[],
        percentages?: Record<string, string>,
        amounts?: Record<string, string>
    ) => Promise<void>;
    groupId: string;
    members: User[];
}

export default function CreateExpenseModal({
    isOpen,
    onClose,
    onExpenseCreated,
    groupId,
    members,
}: CreateExpenseModalProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [splitType, setSplitType] = useState<
        "equal" | "percentage" | "amount"
    >("equal");
    const [selectedMembers, setSelectedMembers] = useState<string[]>(
        members?.map((member) => member._id)
    );
    const [percentages, setPercentages] = useState<Record<string, string>>({});
    const [amounts, setAmounts] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleMemberToggle = (memberId: string) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handlePercentageChange = (memberId: string, value: string) => {
        setPercentages((prev) => ({
            ...prev,
            [memberId]: value,
        }));
    };

    const handleAmountChange = (memberId: string, value: string) => {
        setAmounts((prev) => ({
            ...prev,
            [memberId]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onExpenseCreated(
                description,
                parseFloat(amount),
                splitType,
                selectedMembers,
                splitType === "percentage" ? percentages : undefined,
                splitType === "amount" ? amounts : undefined
            );
            onClose();
            // Reset form
            setDescription("");
            setAmount("");
            setSplitType("equal");
            setSelectedMembers(members?.map((member) => member._id));
            setPercentages({});
            setAmounts({});
        } catch (error) {
            console.error("Error creating expense:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="splitType">Split Type</Label>
                        <Select
                            value={splitType}
                            onValueChange={(
                                value: "equal" | "percentage" | "amount"
                            ) => setSplitType(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select split type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="equal">
                                    Equal Split
                                </SelectItem>
                                <SelectItem value="percentage">
                                    Percentage Split
                                </SelectItem>
                                <SelectItem value="amount">
                                    Amount Split
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Members</Label>
                        <div className="space-y-2">
                            {members?.map((member) => (
                                <div
                                    key={member._id}
                                    className="flex items-center space-x-4"
                                >
                                    <Checkbox
                                        checked={selectedMembers.includes(
                                            member._id
                                        )}
                                        onCheckedChange={() =>
                                            handleMemberToggle(member._id)
                                        }
                                    />
                                    <span className="text-sm">
                                        {member.name}
                                    </span>
                                    {selectedMembers.includes(member._id) && (
                                        <>
                                            {splitType === "percentage" && (
                                                <Input
                                                    type="number"
                                                    value={
                                                        percentages[
                                                            member._id
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        handlePercentageChange(
                                                            member._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    min="0"
                                                    max="100"
                                                    className="w-20"
                                                    placeholder="%"
                                                />
                                            )}
                                            {splitType === "amount" && (
                                                <Input
                                                    type="number"
                                                    value={
                                                        amounts[member._id] ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleAmountChange(
                                                            member._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    step="0.01"
                                                    min="0"
                                                    className="w-24"
                                                    placeholder="$"
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Expense"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
