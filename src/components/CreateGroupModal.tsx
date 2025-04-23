"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGroupAtom } from "@/atoms/groups";
import { Plus } from "lucide-react";

export default function CreateGroupModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [, createGroup] = useAtom(createGroupAtom);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createGroup({ name, description });
            setIsOpen(false);
            setName("");
            setDescription("");
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Group</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Group Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description (Optional)
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Create Group</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
