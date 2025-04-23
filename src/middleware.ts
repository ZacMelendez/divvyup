import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { publicRoutes } from "./routes";

export function middleware(request: NextRequest) {
    const headers = new Headers(request.headers);
    headers.set("x-current-path", request.nextUrl.pathname);

    const token = request.cookies.get("next-auth.session-token");
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

    if (!token && !isPublicRoute) {
        // Redirect to login if not authenticated
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return NextResponse.next({ headers });
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
