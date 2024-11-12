"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Expense, Group } from "./main";
import { MultiSelect } from "./ui/multi-select";

export const ExpenseDialog = ({
    isEditExpensesOpen,
    setIsEditExpensesOpen,
    currentGroup,
    handleSubmit,
    deleteExpense,
    setEditingExpense,
    disabled,
    editing,
}: {
    isEditExpensesOpen: boolean;
    setIsEditExpensesOpen: Dispatch<SetStateAction<boolean>>;
    currentGroup: Group | null;
    handleSubmit: (data: Expense) => void;
    deleteExpense: (id: number) => void;
    setEditingExpense: Dispatch<SetStateAction<Expense | null>>;
    disabled: boolean;
    editing: boolean;
}) => {
    const methods = useFormContext<Expense>();

    const paidBy = methods.watch("paidBy");
    const splitWith = methods.watch("splitWith");
    const isCustomSplit = methods.watch("customSplit");

    return (
        <div className="flex flex-row gap-2">
            <Dialog
                open={isEditExpensesOpen}
                onOpenChange={(state) => {
                    if (state === false && editing) {
                        console.log("here");
                        methods.reset();
                    }
                    setIsEditExpensesOpen(state);
                }}
            >
                <DialogTrigger asChild>
                    <Button type="button" disabled={disabled}>
                        Add Expense
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className="flex flex-row justify-between">
                        <DialogTitle>
                            {editing ? "Update" : "Add"} Expense
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div>
                            <FormField
                                control={methods.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Expense description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={methods.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Expense amount"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={methods.control}
                                name="paidBy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Paid By</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select who paid" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {currentGroup?.members.map(
                                                    (member) => (
                                                        <SelectItem
                                                            key={member}
                                                            value={member}
                                                        >
                                                            {member}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={methods.control}
                                name="splitWith"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Split With</FormLabel>
                                        <MultiSelect
                                            defaultValue={field.value}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            options={
                                                currentGroup?.members
                                                    .filter(
                                                        (member) =>
                                                            member !== paidBy
                                                    )
                                                    .map((member) => ({
                                                        label: member,
                                                        value: member,
                                                    })) || []
                                            }
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <FormField
                                control={methods.control}
                                name="customSplit"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row-reverse gap-2 items-center justify-center">
                                        <FormLabel>Custom Split</FormLabel>
                                        <FormControl>
                                            <Switch
                                                id={field.name}
                                                className="!mt-0"
                                                name={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {isCustomSplit && (
                            <div className="pl-4 flex flex-col gap-1">
                                {[paidBy, ...splitWith].map((member) => (
                                    <div
                                        key={member}
                                        className="flex items-center"
                                    >
                                        <FormField
                                            control={methods.control}
                                            name={`split.${member}`}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-center gap-2 w-full">
                                                    <FormLabel className="font-semibold w-16 truncate">
                                                        {member}
                                                    </FormLabel>
                                                    <FormControl className="flex-1">
                                                        <Input
                                                            className="!mt-0"
                                                            type="number"
                                                            placeholder="Amount"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex flex-row">
                        <Button
                            type="button"
                            className="flex-1"
                            onClick={() => handleSubmit(methods.getValues())}
                        >
                            {editing ? "Update" : "Add"} Expense
                        </Button>
                        {editing && (
                            <Button
                                type="button"
                                className="px-8"
                                variant={"destructive"}
                                onClick={() => {
                                    deleteExpense(methods.getValues().id);
                                    methods.reset();
                                    setEditingExpense(null);
                                    setIsEditExpensesOpen(false);
                                }}
                            >
                                Delete
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
