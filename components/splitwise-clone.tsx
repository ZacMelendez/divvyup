// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { X } from "lucide-react";
// import Cookies from "js-cookie";

// type Expense = {
//     id: number;
//     description: string;
//     amount: number;
//     paidBy: string;
//     splitWith: string[];
// };

// type Balance = {
//     [key: string]: { [key: string]: number };
// };

// export default function SplitwiseClone() {
//     const [expenses, setExpenses] = useState<Expense[]>([]);
//     const [description, setDescription] = useState("");
//     const [amount, setAmount] = useState("");
//     const [paidBy, setPaidBy] = useState("");
//     const [splitWith, setSplitWith] = useState<string[]>([]);
//     const [newFriend, setNewFriend] = useState("");
//     const [friends, setFriends] = useState<string[]>([]);

//     useEffect(() => {
//         const savedFriends = Cookies.get("friends");
//         const savedExpenses = Cookies.get("expenses");

//         console.log({ savedExpenses, savedFriends });

//         if (savedFriends && savedFriends !== "[]") {
//             setFriends(JSON.parse(savedFriends));
//         }

//         if (savedExpenses && savedExpenses !== "[]") {
//             setExpenses(JSON.parse(savedExpenses));
//         }
//     }, []);

//     useEffect(() => {
//         Cookies.set("friends", JSON.stringify(friends), { expires: 365 });
//     }, [friends]);

//     useEffect(() => {
//         Cookies.set("expenses", JSON.stringify(expenses), { expires: 365 });
//     }, [expenses]);

//     const addExpense = () => {
//         if (description && amount && paidBy && splitWith.length > 0) {
//             const newExpense: Expense = {
//                 id: Date.now(),
//                 description,
//                 amount: parseFloat(amount),
//                 paidBy,
//                 splitWith: [paidBy, ...splitWith],
//             };
//             setExpenses([...expenses, newExpense]);
//             setDescription("");
//             setAmount("");
//             setPaidBy("");
//             setSplitWith([]);
//         }
//     };

//     const addFriend = () => {
//         if (newFriend && !friends.includes(newFriend)) {
//             setFriends([...friends, newFriend]);
//             setNewFriend("");
//         }
//     };

//     const calculateBalances = (): Balance => {
//         const balances: Balance = {};
//         friends.forEach((friend) => {
//             balances[friend] = {};
//             friends.forEach((otherFriend) => {
//                 if (friend !== otherFriend) {
//                     balances[friend][otherFriend] = 0;
//                 }
//             });
//         });

//         expenses.forEach((expense) => {
//             const splitAmount = expense.amount / expense.splitWith.length;
//             expense.splitWith.forEach((person) => {
//                 if (person !== expense.paidBy) {
//                     balances[person][expense.paidBy] += splitAmount;
//                     balances[expense.paidBy][person] -= splitAmount;
//                 }
//             });
//         });

//         return balances;
//     };

//     const removeFriend = (friendToRemove: string) => {
//         setFriends(friends.filter((friend) => friend !== friendToRemove));
//         setExpenses(
//             expenses.filter(
//                 (expense) =>
//                     expense.paidBy !== friendToRemove &&
//                     !expense.splitWith.includes(friendToRemove)
//             )
//         );
//     };

//     const balances = calculateBalances();

//     return (
//         <div className="container mx-auto p-4 max-w-7xl">
//             <div className="grid gap-6 md:grid-cols-2">
//                 <Card className="mb-6">
//                     <CardHeader>
//                         <CardTitle>Add New Expense</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid gap-4">
//                             <div>
//                                 <Label htmlFor="description">Description</Label>
//                                 <Input
//                                     id="description"
//                                     value={description}
//                                     autoComplete="off"
//                                     onChange={(e) =>
//                                         setDescription(e.target.value)
//                                     }
//                                     placeholder="Expense description"
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="amount">Amount</Label>
//                                 <Input
//                                     id="amount"
//                                     autoComplete="off"
//                                     type="number"
//                                     value={amount}
//                                     onChange={(e) => setAmount(e.target.value)}
//                                     placeholder="Expense amount"
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="paidBy">Paid By</Label>
//                                 <Select
//                                     onValueChange={setPaidBy}
//                                     value={paidBy}
//                                     disabled={friends.length === 0}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select who paid" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {friends.map((friend) => (
//                                             <SelectItem
//                                                 key={friend}
//                                                 value={friend}
//                                             >
//                                                 {friend}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div>
//                                 <Label htmlFor="splitWith">Split With</Label>
//                                 <Select
//                                     onValueChange={(value) =>
//                                         setSplitWith((prev) => [...prev, value])
//                                     }
//                                     value={undefined}
//                                     disabled={friends.length === 0}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select friends to split with" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {friends
//                                             .filter(
//                                                 (friend) =>
//                                                     friend !== paidBy &&
//                                                     !splitWith.includes(friend)
//                                             )
//                                             .map((friend) => (
//                                                 <SelectItem
//                                                     key={friend}
//                                                     value={friend}
//                                                 >
//                                                     {friend}
//                                                 </SelectItem>
//                                             ))}
//                                     </SelectContent>
//                                 </Select>
//                                 <div className="mt-2 flex flex-wrap gap-2">
//                                     {splitWith.map((friend) => (
//                                         <span
//                                             key={friend}
//                                             className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex flex-row  items-center justify-center"
//                                         >
//                                             {friend}
//                                             <button
//                                                 onClick={() =>
//                                                     setSplitWith(
//                                                         splitWith.filter(
//                                                             (f) => f !== friend
//                                                         )
//                                                     )
//                                                 }
//                                                 className="ml-2 text-primary-foreground hover:text-red-500"
//                                             >
//                                                 <X className="h-3 w-3" />
//                                             </button>
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                             <Button onClick={addExpense}>Add Expense</Button>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card className="mb-6">
//                     <CardHeader>
//                         <CardTitle>Add New Friend</CardTitle>
//                     </CardHeader>
//                     <CardContent className="flex flex-col gap-2">
//                         <div className="flex gap-2">
//                             <Input
//                                 value={newFriend}
//                                 onChange={(e) => setNewFriend(e.target.value)}
//                                 placeholder="Friend's name"
//                             />
//                             <Button onClick={addFriend}>Add Friend</Button>
//                         </div>
//                         <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
//                             {friends.map((friend) => (
//                                 <div
//                                     key={friend}
//                                     className="flex items-center justify-between py-1 pl-4 pr-1 border rounded-lg"
//                                 >
//                                     <span>{friend}</span>
//                                     <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         onClick={() => removeFriend(friend)}
//                                         className="text-destructive"
//                                     >
//                                         <X />
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card className="mb-6">
//                     <CardHeader>
//                         <CardTitle>Expenses</CardTitle>
//                     </CardHeader>
//                     <CardContent className="grid grid-cols-3 gap-2">
//                         {expenses.map((expense) => (
//                             <div
//                                 key={expense.id}
//                                 className="mb-2 p-2 bg-muted rounded-lg"
//                             >
//                                 <p>
//                                     <strong>{expense.description}</strong> - $
//                                     {expense.amount.toFixed(2)}
//                                 </p>
//                                 <p>Paid by: {expense.paidBy}</p>
//                             </div>
//                         ))}
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Balances</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         {Object.entries(balances).map(([person, owes]) => (
//                             <div key={person} className="mb-2">
//                                 <h3 className="font-semibold">{person}</h3>
//                                 {Object.entries(owes).map(
//                                     ([otherPerson, amount]) =>
//                                         amount !== 0 && (
//                                             <p
//                                                 key={otherPerson}
//                                                 className={
//                                                     amount > 0
//                                                         ? "text-red-500"
//                                                         : "text-green-500"
//                                                 }
//                                             >
//                                                 {amount > 0
//                                                     ? "Owes"
//                                                     : "Is owed"}{" "}
//                                                 ${Math.abs(amount).toFixed(2)}{" "}
//                                                 {amount > 0 ? "to" : "by"}{" "}
//                                                 {otherPerson}
//                                             </p>
//                                         )
//                                 )}
//                             </div>
//                         ))}
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { PlusCircle, Download, Upload, X } from "lucide-react";
import Cookies from "js-cookie";

type Split = {
    [key: string]: number;
};

type Expense = {
    id: number;
    description: string;
    amount: number;
    paidBy: string;
    split: Split;
};

type Group = {
    id: number;
    name: string;
    expenses: Expense[];
    friends: string[];
};

type Balance = {
    [key: string]: { [key: string]: number };
};

export default function SplitwiseClone() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);
    const [newGroupName, setNewGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [paidBy, setPaidBy] = useState("");
    const [splitWith, setSplitWith] = useState<string[]>([]);
    const [customSplit, setCustomSplit] = useState<Split>({});
    const [isCustomSplit, setIsCustomSplit] = useState(false);
    const [newFriend, setNewFriend] = useState("");
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
                friends: [],
            };
            setGroups([...groups, newGroup]);
            setCurrentGroupId(newGroup.id);
            setNewGroupName("");
            setIsAddGroupModalOpen(false);
        }
    };

    const addExpense = () => {
        if (
            currentGroup &&
            description &&
            amount &&
            paidBy &&
            (splitWith.length > 0 || Object.keys(customSplit).length > 0)
        ) {
            let split: Split = {};
            if (isCustomSplit) {
                split = customSplit;
            } else {
                const splitAmount = parseFloat(amount) / (splitWith.length + 1);
                split = { [paidBy]: splitAmount };
                splitWith.forEach((friend) => {
                    split[friend] = splitAmount;
                });
            }

            const newExpense: Expense = {
                id: Date.now(),
                description,
                amount: parseFloat(amount),
                paidBy,
                split,
            };
            const updatedGroup = {
                ...currentGroup,
                expenses: [...currentGroup.expenses, newExpense],
            };
            setGroups(
                groups.map((group) =>
                    group.id === currentGroup.id ? updatedGroup : group
                )
            );
            resetForm();
        }
    };

    const resetForm = () => {
        setDescription("");
        setAmount("");
        setPaidBy("");
        setSplitWith([]);
        setCustomSplit({});
        setIsCustomSplit(false);
    };

    const addFriend = () => {
        if (
            currentGroup &&
            newFriend &&
            !currentGroup.friends.includes(newFriend)
        ) {
            const updatedGroup = {
                ...currentGroup,
                friends: [...currentGroup.friends, newFriend],
            };
            setGroups(
                groups.map((group) =>
                    group.id === currentGroup.id ? updatedGroup : group
                )
            );
            setNewFriend("");
        }
    };

    const calculateBalances = (): Balance => {
        if (!currentGroup) return {};

        const balances: Balance = {};
        currentGroup.friends.forEach((friend) => {
            balances[friend] = {};
            currentGroup.friends.forEach((otherFriend) => {
                if (friend !== otherFriend) {
                    balances[friend][otherFriend] = 0;
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

    const removeFriend = (friendToRemove: string) => {
        if (currentGroup) {
            const updatedGroup = {
                ...currentGroup,
                friends: currentGroup.friends.filter(
                    (friend) => friend !== friendToRemove
                ),
                expenses: currentGroup.expenses.filter(
                    (expense) =>
                        expense.paidBy !== friendToRemove &&
                        !Object.keys(expense.split).includes(friendToRemove)
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
        setDescription(expense.description);
        setAmount(expense.amount.toString());
        setPaidBy(expense.paidBy);
        setSplitWith(
            Object.keys(expense.split).filter(
                (friend) => friend !== expense.paidBy
            )
        );
        setCustomSplit(expense.split);
        setIsCustomSplit(
            Object.values(expense.split).some(
                (amount) =>
                    amount !==
                    expense.amount / Object.keys(expense.split).length
            )
        );
        setIsEditModalOpen(true);
    };

    const saveEditedExpense = () => {
        if (
            currentGroup &&
            editingExpense &&
            description &&
            amount &&
            paidBy &&
            (splitWith.length > 0 || Object.keys(customSplit).length > 0)
        ) {
            let split: Split = {};
            if (isCustomSplit) {
                split = customSplit;
            } else {
                const splitAmount = parseFloat(amount) / (splitWith.length + 1);
                split = { [paidBy]: splitAmount };
                splitWith.forEach((friend) => {
                    split[friend] = splitAmount;
                });
            }

            const updatedExpense: Expense = {
                ...editingExpense,
                description,
                amount: parseFloat(amount),
                paidBy,
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
            setIsEditModalOpen(false);
            resetForm();
        }
    };

    const updateCustomSplit = (friend: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setCustomSplit((prev) => ({ ...prev, [friend]: numValue }));
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

    return (
        <SidebarProvider>
            <div className="flex h-screen">
                <Sidebar>
                    <SidebarHeader>
                        <h2 className="text-xl font-bold p-4">
                            Splitwise Clone
                        </h2>
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
                <div className="flex-1 overflow-auto">
                    <div className="container mx-auto p-4 max-w-7xl">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold">
                                {currentGroup?.name || "Select a Group"}
                            </h1>
                        </div>
                        {currentGroup && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle>Add New Expense</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4">
                                            <div>
                                                <Label htmlFor="description">
                                                    Description
                                                </Label>
                                                <Input
                                                    id="description"
                                                    value={description}
                                                    onChange={(e) =>
                                                        setDescription(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Expense description"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="amount">
                                                    Amount
                                                </Label>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) =>
                                                        setAmount(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Expense amount"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="paidBy">
                                                    Paid By
                                                </Label>
                                                <Select
                                                    onValueChange={setPaidBy}
                                                    value={paidBy}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select who paid" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currentGroup.friends.map(
                                                            (friend) => (
                                                                <SelectItem
                                                                    key={friend}
                                                                    value={
                                                                        friend
                                                                    }
                                                                >
                                                                    {friend}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="splitWith">
                                                    Split With
                                                </Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        setSplitWith((prev) => [
                                                            ...prev,
                                                            value,
                                                        ])
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select friends to split with" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currentGroup.friends
                                                            .filter(
                                                                (friend) =>
                                                                    friend !==
                                                                        paidBy &&
                                                                    !splitWith.includes(
                                                                        friend
                                                                    )
                                                            )
                                                            .map((friend) => (
                                                                <SelectItem
                                                                    key={friend}
                                                                    value={
                                                                        friend
                                                                    }
                                                                >
                                                                    {friend}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {splitWith.map((friend) => (
                                                        <span
                                                            key={friend}
                                                            className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm"
                                                        >
                                                            {friend}
                                                            <button
                                                                onClick={() =>
                                                                    setSplitWith(
                                                                        splitWith.filter(
                                                                            (
                                                                                f
                                                                            ) =>
                                                                                f !==
                                                                                friend
                                                                        )
                                                                    )
                                                                }
                                                                className="ml-2 text-primary-foreground hover:text-red-500"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="custom-split"
                                                    checked={isCustomSplit}
                                                    onCheckedChange={
                                                        setIsCustomSplit
                                                    }
                                                />
                                                <Label htmlFor="custom-split">
                                                    Custom Split
                                                </Label>
                                            </div>
                                            {isCustomSplit && (
                                                <div className="grid gap-2">
                                                    {[paidBy, ...splitWith].map(
                                                        (friend) => (
                                                            <div
                                                                key={friend}
                                                                className="flex items-center space-x-2"
                                                            >
                                                                <Label
                                                                    htmlFor={`split-${friend}`}
                                                                >
                                                                    {friend}
                                                                </Label>
                                                                <Input
                                                                    id={`split-${friend}`}
                                                                    type="number"
                                                                    value={
                                                                        customSplit[
                                                                            friend
                                                                        ] || ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateCustomSplit(
                                                                            friend,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Amount"
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                            <Button onClick={addExpense}>
                                                Add Expense
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle>Add New Friend</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newFriend}
                                                onChange={(e) =>
                                                    setNewFriend(e.target.value)
                                                }
                                                placeholder="Friend's name"
                                            />
                                            <Button onClick={addFriend}>
                                                Add Friend
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                            {currentGroup.friends.map(
                                                (friend) => (
                                                    <div
                                                        key={friend}
                                                        className="flex items-center justify-between py-1 pl-4 pr-1 border rounded-lg"
                                                    >
                                                        <span>{friend}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                removeFriend(
                                                                    friend
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
                                    </CardContent>
                                </Card>

                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle>Expenses</CardTitle>
                                    </CardHeader>
                                    <CardContent>
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
                                                            {expense.amount.toFixed(
                                                                2
                                                            )}
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
                                                                        friend,
                                                                        amount,
                                                                    ]) =>
                                                                        `${friend}: $${amount.toFixed(
                                                                            2
                                                                        )}`
                                                                )
                                                                .join(", ")}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            startEditingExpense(
                                                                expense
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
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
                                                    {Object.entries(owes).map(
                                                        ([
                                                            otherPerson,
                                                            amount,
                                                        ]) =>
                                                            amount !== 0 && (
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
                                                                    {amount > 0
                                                                        ? "Owes"
                                                                        : "Is owed"}{" "}
                                                                    $
                                                                    {Math.abs(
                                                                        amount
                                                                    ).toFixed(
                                                                        2
                                                                    )}{" "}
                                                                    {amount > 0
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
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">
                                Description
                            </Label>
                            <Input
                                id="edit-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-amount">Amount</Label>
                            <Input
                                id="edit-amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-paidBy">Paid By</Label>
                            <Select onValueChange={setPaidBy} value={paidBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select who paid" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentGroup?.friends.map((friend) => (
                                        <SelectItem key={friend} value={friend}>
                                            {friend}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-splitWith">Split With</Label>
                            <Select
                                onValueChange={(value) =>
                                    setSplitWith((prev) => [...prev, value])
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select friends to split with" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentGroup?.friends
                                        .filter(
                                            (friend) =>
                                                friend !== paidBy &&
                                                !splitWith.includes(friend)
                                        )
                                        .map((friend) => (
                                            <SelectItem
                                                key={friend}
                                                value={friend}
                                            >
                                                {friend}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {splitWith.map((friend) => (
                                    <span
                                        key={friend}
                                        className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm"
                                    >
                                        {friend}
                                        <button
                                            onClick={() =>
                                                setSplitWith(
                                                    splitWith.filter(
                                                        (f) => f !== friend
                                                    )
                                                )
                                            }
                                            className="ml-2 text-primary-foreground hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="edit-custom-split"
                                checked={isCustomSplit}
                                onCheckedChange={setIsCustomSplit}
                            />
                            <Label htmlFor="edit-custom-split">
                                Custom Split
                            </Label>
                        </div>
                        {isCustomSplit && (
                            <div className="grid gap-2">
                                {[paidBy, ...splitWith].map((friend) => (
                                    <div
                                        key={friend}
                                        className="flex items-center space-x-2"
                                    >
                                        <Label htmlFor={`edit-split-${friend}`}>
                                            {friend}
                                        </Label>
                                        <Input
                                            id={`edit-split-${friend}`}
                                            type="number"
                                            value={customSplit[friend] || ""}
                                            onChange={(e) =>
                                                updateCustomSplit(
                                                    friend,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Amount"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <Button onClick={saveEditedExpense}>Save Changes</Button>
                </DialogContent>
            </Dialog>

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
