import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth.config";
import SignInButton from "@/components/SignInButton";

export default async function SignIn() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold">
                        Sign in to your account
                    </h2>
                </div>
                <div className="mt-8 space-y-6">
                    <SignInButton />
                </div>
            </div>
        </div>
    );
}
