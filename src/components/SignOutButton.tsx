"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
    return (
        <Button
            variant="ghost"
            className="text-gray-300 hover:text-white"
            onClick={() => signOut()}
        >
            Sign out
        </Button>
    );
}
