import { getGroup } from "@/app/actions";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Group } from "@/types";
import React from "react";
import type { ReactElement } from "react";

export default async function BreadcrumbSlot({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    let group: Group | null = null;
    const pathParams = await params;

    try {
        group = JSON.parse(await getGroup(pathParams.id));
    } catch (error) {
        console.error(error);
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/groups">Groups</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{group?.name}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
