"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Users, LogOut, Plus } from "lucide-react";
import { useAtomValue } from "jotai";
import { groupsAtom } from "@/atoms";

function GroupsLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const groups = useAtomValue(groupsAtom);

    const getBreadcrumbs = () => {
        const paths = pathname.split("/").filter(Boolean);
        return paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join("/")}`;
            const isLast = index === paths.length - 1;
            const label = path.charAt(0).toUpperCase() + path.slice(1);

            return (
                <div className="flex items-center gap-2" key={path}>
                    <BreadcrumbItem>
                        {isLast ? (
                            <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink asChild>
                                <Link href={href}>{label}</Link>
                            </BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                </div>
            );
        });
    };

    return (
        <div className="flex w-full h-screen">
            <Sidebar>
                <SidebarHeader>
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2"
                    >
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

            <div className="flex-1 overflow-auto">
                <div className="sticky top-0 z-10 border-b">
                    <div className="container mx-auto px-4 py-4">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="/">Home</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                {getBreadcrumbs()}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <main className="container mx-auto px-4 py-6">{children}</main>
            </div>
        </div>
    );
}

export { GroupsLayout };
