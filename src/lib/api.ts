import { Group } from "@/types";

export async function getGroups(): Promise<Group[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch groups");
    }
    return response.json();
}
