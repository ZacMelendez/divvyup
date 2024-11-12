"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarFooter,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { PlusCircle, Download, Upload, X } from "lucide-react";
import Cookies from "js-cookie";
import { FormProvider, useForm } from "react-hook-form";
import { ExpenseDialog } from "./expense-dialog";

type Split = {
    [key: string]: number;
};

export type Expense = {
    id: number;
    description: string;
    amount: string;
    paidBy: string;
    split: Split;
    splitWith: string[];
    customSplit: boolean;
};

export type Group = {
    id: number;
    name: string;
    expenses: Expense[];
    members: string[];
};

type Balance = {
    [key: string]: { [key: string]: number };
};

export default function Main() {
    const methods = useForm<Expense>({
        defaultValues: {
            id: -1,
            description: "",
            amount: "0",
            paidBy: "",
            split: {},
            splitWith: [],
            customSplit: false,
        },
    });

    const [groups, setGroups] = useState<Group[]>([]);
    const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);
    const [newGroupName, setNewGroupName] = useState("");
    const [newMember, setNewMember] = useState("");
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [isEditMembersOpen, setIsEditMembersOpen] = useState(false);
    const [isEditExpensesOpen, setIsEditExpensesOpen] = useState(false);
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedGroups = Cookies.get("groups");
        if (savedGroups && savedGroups !== "[]") {
            const parsedGroups = JSON.parse(savedGroups);
            setGroups(parsedGroups);
            if (parsedGroups.length > 0) {
                setCurrentGroupId(parsedGroups[0].id);
            }
        }
    }, []);

    useEffect(() => {
        Cookies.set("groups", JSON.stringify(groups), { expires: 365 });
    }, [groups]);

    const currentGroup =
        groups.find((group) => group.id === currentGroupId) || null;

    const addGroup = () => {
        if (newGroupName) {
            const newGroup: Group = {
                id: Date.now(),
                name: newGroupName,
                expenses: [],
                members: [],
            };
            setGroups([...groups, newGroup]);
            setCurrentGroupId(newGroup.id);
            setNewGroupName("");
            setIsAddGroupModalOpen(false);
        }
    };

    const addExpense = (data: Expense) => {
        if (!currentGroup) return;
        let split: Split = {};
        if (data.customSplit) {
            const updated: Record<string, number> = {};
            for (const key in data.split) {
                if (typeof data.split[key] === "string") {
                    updated[key] = parseFloat(data.split[key]);
                } else {
                    updated[key] = data.split[key];
                }
            }
            split = updated;
        } else {
            const splitAmount =
                parseFloat(data.amount) / (data?.splitWith?.length + 1);
            split = { [data.paidBy]: splitAmount };
            data?.splitWith?.forEach((member) => {
                split[member] = splitAmount;
            });
        }

        console.log({ split });

        const newExpense: Expense = {
            ...data,
            id: Date.now(),
            split,
        };
        const updatedGroup = {
            ...currentGroup,
            expenses: [...(currentGroup?.expenses || []), newExpense],
        };
        setGroups(
            groups.map((group) =>
                group.id === currentGroup?.id || -1 ? updatedGroup : group
            )
        );
        methods.reset();
    };

    const addMember = () => {
        if (
            currentGroup &&
            newMember &&
            !currentGroup.members.includes(newMember)
        ) {
            const updatedGroup = {
                ...currentGroup,
                members: [...currentGroup.members, newMember],
            };
            setGroups(
                groups.map((group) =>
                    group.id === currentGroup.id ? updatedGroup : group
                )
            );
            setNewMember("");
        }
    };

    const calculateBalances = (): Balance => {
        if (!currentGroup) return {};

        const balances: Balance = {};
        currentGroup.members.forEach((member) => {
            balances[member] = {};
            currentGroup.members.forEach((otherMember) => {
                if (member !== otherMember) {
                    balances[member][otherMember] = 0;
                }
            });
        });

        currentGroup.expenses.forEach((expense) => {
            Object.entries(expense.split).forEach(([person, amount]) => {
                if (person !== expense.paidBy) {
                    balances[person][expense.paidBy] += amount;
                    balances[expense.paidBy][person] -= amount;
                }
            });
        });

        return balances;
    };

    const removeMember = (memberToRemove: string) => {
        if (currentGroup) {
            const updatedGroup = {
                ...currentGroup,
                members: currentGroup.members.filter(
                    (member) => member !== memberToRemove
                ),
                expenses: currentGroup.expenses.filter(
                    (expense) =>
                        expense.paidBy !== memberToRemove &&
                        !Object.keys(expense.split).includes(memberToRemove)
                ),
            };
            setGroups(
                groups.map((group) =>
                    group.id === currentGroup.id ? updatedGroup : group
                )
            );
        }
    };

    const removeExpense = (id: number) => {
        if (currentGroup) {
            const updatedGroup = {
                ...currentGroup,
                expenses: currentGroup.expenses.filter(
                    (expense) => expense.id !== id
                ),
            };
            setGroups(
                groups.map((group) =>
                    group.id === currentGroup.id ? updatedGroup : group
                )
            );
        }
    };

    const startEditingExpense = (expense: Expense) => {
        setEditingExpense(expense);
        setIsEditExpensesOpen(true);
    };

    const saveEditedExpense = (data: Expense) => {
        if (currentGroup && editingExpense) {
            let split: Split = {};
            if (data.customSplit) {
                const updated: Record<string, number> = {};
                for (const key in split) {
                    if (typeof split[key] === "string") {
                        updated[key] = parseFloat(split[key]);
                    } else {
                        updated[key] = split[key];
                    }
                }
                split = updated;
            } else {
                const splitAmount =
                    parseFloat(data.amount) / (data.splitWith?.length || 0 + 1);
                split = { [data.paidBy]: splitAmount };
                data?.splitWith?.forEach((member) => {
                    split[member] = splitAmount;
                });
            }

            console.log({ split });

            const updatedExpense: Expense = {
                ...data,
                split,
            };
            const updatedGroup = {
                ...currentGroup,
                expenses: currentGroup.expenses.map((expense) =>
                    expense.id === editingExpense.id ? updatedExpense : expense
                ),
            };
            setGroups(
                groups.map((group) =>
                    group.id === currentGroup.id ? updatedGroup : group
                )
            );
            setIsEditExpensesOpen(false);
            methods.reset();
        }
    };

    const downloadData = () => {
        const dataStr = JSON.stringify(groups, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "splitwise-clone-data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const uploadData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const uploadedGroups = JSON.parse(
                        e.target?.result as string
                    );
                    setGroups(uploadedGroups);
                    if (uploadedGroups.length > 0) {
                        setCurrentGroupId(uploadedGroups[0].id);
                    }
                } catch (error) {
                    console.error("Error parsing JSON file:", error);
                    alert(
                        "Error uploading file. Please make sure it's a valid JSON file."
                    );
                }
            };
            reader.readAsText(file);
        }
    };

    const balances = calculateBalances();

    const handleSubmit = (data: Expense) => {
        if (editingExpense) {
            saveEditedExpense(data);
        } else {
            addExpense(data);
        }
    };

    return (
        <SidebarProvider>
            <div className="fixed top-0 w-screen lg:hidden border-b h-14 box-border flex flex-row justify-between items-center px-8">
                <h2 className="text-xl font-bold">DivvyUp</h2>
                <SidebarTrigger className="ml-auto" />
            </div>
            <div className="flex h-[calc(100vh-56px)] mt-16 lg:mt-0 lg:h-screen w-screen">
                <Sidebar className="relative">
                    <SidebarHeader>
                        <h2 className="text-xl font-bold p-4 hidden lg:block">
                            DivvyUp
                        </h2>
                        <div className="ml-auto">
                            <SidebarTrigger />
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            {groups.map((group) => (
                                <SidebarMenuItem
                                    key={group.id}
                                    className="px-3"
                                >
                                    <SidebarMenuButton
                                        onClick={() =>
                                            setCurrentGroupId(group.id)
                                        }
                                        isActive={currentGroupId === group.id}
                                    >
                                        {group.name}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem className="px-3">
                                <SidebarMenuButton
                                    onClick={() => setIsAddGroupModalOpen(true)}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add New Group
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        <SidebarFooter className="mt-auto">
                            <div className="flex flex-col justify-end gap-3 p-4">
                                <Button onClick={downloadData}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Data
                                </Button>
                                <Button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Data
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={uploadData}
                                    accept=".json"
                                    className="hidden"
                                    aria-label="Upload JSON file"
                                />
                            </div>
                        </SidebarFooter>
                    </SidebarContent>
                </Sidebar>
                <div className="flex-1 overflow-auto h-full p-4 box-border">
                    <div className="container mx-auto p-4 max-w-7xl h-full flex flex-col">
                        <div className="flex flex-row items-center justify-between mb-6 w-full">
                            <h1 className="text-3xl font-bold">
                                {currentGroup?.name || "Select a Group"}
                            </h1>
                            {currentGroup?.name && (
                                <div className="flex flex-row gap-2">
                                    <FormProvider {...methods}>
                                        <form
                                            onSubmit={methods.handleSubmit(
                                                handleSubmit
                                            )}
                                        >
                                            <ExpenseDialog
                                                deleteExpense={removeExpense}
                                                editing={!!editingExpense}
                                                disabled={
                                                    currentGroup?.members
                                                        ?.length < 2
                                                }
                                                currentGroup={currentGroup}
                                                isEditExpensesOpen={
                                                    isEditExpensesOpen
                                                }
                                                handleSubmit={handleSubmit}
                                                setEditingExpense={
                                                    setEditingExpense
                                                }
                                                setIsEditExpensesOpen={
                                                    setIsEditExpensesOpen
                                                }
                                            />
                                        </form>
                                    </FormProvider>
                                    <Dialog
                                        open={isEditMembersOpen}
                                        onOpenChange={setIsEditMembersOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button type="button">
                                                Manage Members
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Manage Members
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={newMember}
                                                    onChange={(e) =>
                                                        setNewMember(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Member's name"
                                                />
                                                <Button onClick={addMember}>
                                                    Add Member
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                                {currentGroup.members.map(
                                                    (member) => (
                                                        <div
                                                            key={member}
                                                            className="flex items-center justify-between py-1 pl-4 pr-1 border rounded-lg"
                                                        >
                                                            <span>
                                                                {member}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    removeMember(
                                                                        member
                                                                    )
                                                                }
                                                                className="text-destructive"
                                                            >
                                                                <X />
                                                            </Button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}
                        </div>
                        {currentGroup && currentGroup?.members.length > 1 ? (
                            currentGroup?.expenses?.length > 0 ? (
                                <div className="flex flex-col-reverse gap-3 sm:flex-row flex-1 w-full sm:overflow-hidden">
                                    <div className="sm:flex-1">
                                        <h2 className="font-semibold">
                                            Expenses
                                        </h2>
                                        <div className="pr-4 pt-2 pb-4 flex flex-col lg:grid lg:grid-cols-3 gap-3 overflow-y-scroll h-full">
                                            {currentGroup.expenses.map(
                                                (expense) => (
                                                    <div
                                                        key={expense.id}
                                                        className="mb-2 p-2 bg-muted rounded-lg flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <p>
                                                                <strong>
                                                                    {
                                                                        expense.description
                                                                    }
                                                                </strong>{" "}
                                                                - $
                                                                {expense.amount}
                                                            </p>
                                                            <p>
                                                                Paid by:{" "}
                                                                {expense.paidBy}
                                                            </p>
                                                            <p>
                                                                Split:{" "}
                                                                {Object.entries(
                                                                    expense.split
                                                                )
                                                                    .map(
                                                                        ([
                                                                            member,
                                                                            amount,
                                                                        ]) =>
                                                                            `${member}: $${amount.toFixed(
                                                                                2
                                                                            )}`
                                                                    )
                                                                    .join(", ")}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                methods.reset(
                                                                    expense
                                                                );
                                                                startEditingExpense(
                                                                    expense
                                                                );
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <Card className="min-w-[250px] h-fit">
                                        <CardHeader>
                                            <CardTitle>Balances</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {Object.entries(balances).map(
                                                ([person, owes]) => (
                                                    <div
                                                        key={person}
                                                        className="mb-2"
                                                    >
                                                        <h3 className="font-semibold">
                                                            {person}
                                                        </h3>
                                                        {Object.entries(
                                                            owes
                                                        ).map(
                                                            ([
                                                                otherPerson,
                                                                amount,
                                                            ]) =>
                                                                amount !==
                                                                    0 && (
                                                                    <p
                                                                        key={
                                                                            otherPerson
                                                                        }
                                                                        className={
                                                                            amount >
                                                                            0
                                                                                ? "text-red-500"
                                                                                : "text-green-500"
                                                                        }
                                                                    >
                                                                        {amount >
                                                                        0
                                                                            ? "Owes"
                                                                            : "Is owed"}{" "}
                                                                        $
                                                                        {Math.abs(
                                                                            amount
                                                                        ).toFixed(
                                                                            2
                                                                        )}{" "}
                                                                        {amount >
                                                                        0
                                                                            ? "to"
                                                                            : "by"}{" "}
                                                                        {
                                                                            otherPerson
                                                                        }
                                                                    </p>
                                                                )
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <div className="w-full items-center justify-center flex flex-col gap-3 flex-1">
                                    <h3 className="text-xl font-bold">
                                        Add some expenses to the group to get
                                        started
                                    </h3>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setIsEditExpensesOpen(true);
                                        }}
                                    >
                                        Add Expenses
                                    </Button>
                                </div>
                            )
                        ) : (
                            <div className="w-full items-center justify-center flex flex-col gap-3 flex-1">
                                <h3 className="text-xl font-bold">
                                    Add some members to the group to get started
                                </h3>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsEditMembersOpen(true);
                                    }}
                                >
                                    Manage Members
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog
                open={isAddGroupModalOpen}
                onOpenChange={setIsAddGroupModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Group</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-group-name">Group Name</Label>
                            <Input
                                id="new-group-name"
                                value={newGroupName}
                                onChange={(e) =>
                                    setNewGroupName(e.target.value)
                                }
                                placeholder="Enter group name"
                            />
                        </div>
                    </div>
                    <Button onClick={addGroup}>Add Group</Button>
                </DialogContent>
            </Dialog>
        </SidebarProvider>
    );
}
