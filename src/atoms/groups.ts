"use client";

import { atom } from "jotai";
import { createGroup } from "@/app/actions";
import { Group } from "@/types";

export const groupsAtom = atom<Group[]>([]);

export const createGroupAtom = atom(
    null,
    async (
        get,
        set,
        { name, description }: { name: string; description?: string }
    ) => {
        try {
            const newGroup = await createGroup(name, description);
            set(groupsAtom, (prev) => [...prev, newGroup]);
        } catch (error) {
            console.error("Error creating group:", error);
            throw error;
        }
    }
);
