"use client";

import { groupsAtom } from "@/atoms";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAtomValue } from "jotai";
import { Home, LogOut, Plus, Users } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Link } from "next-view-transitions";
import { Button } from "./ui/button";

export function AppSidebar() {
    const groups = useAtomValue(groupsAtom);
    const { data: session } = useSession();

    return (
        <Sidebar>
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2 px-4 py-2">
                    <Home className="h-6 w-6" />
                    <span className="text-lg font-semibold">
                        Expense Splitter
                    </span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link
                                href="/groups"
                                className="flex items-center gap-2"
                            >
                                <Users className="h-5 w-5" />
                                <span>All Groups</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link
                                href="/groups/create"
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Create Group</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {groups.length > 0 && (
                        <>
                            <div className="px-4 py-2">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Your Groups
                                </h3>
                            </div>
                            {groups.map((group) => (
                                <SidebarMenuItem key={group._id}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={`/groups/${group._id}`}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="truncate">
                                                {group.name}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </>
                    )}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center gap-2 p-4">
                    <span className="text-sm text-gray-600">
                        {session?.user?.name}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => signOut()}
                        className="ml-auto"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
