import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAuthRoute = pathname === "/" || pathname === "/login" || pathname === "/signup";

    try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });

        let session = null;
        if (response.ok) {
            try {
                session = await response.json();
            } catch (e) {
                session = null;
            }
        }

        const isAuthenticated = !!session;

        if (isAuthRoute && isAuthenticated) {
<<<<<<< HEAD:proxy.ts
=======
            // Check to ensure we aren't already going to /dashboard to prevent loop
>>>>>>> 4f6caf17d35ed31018a86e870929a93ebc1ef6cf:middleware.ts
            if ((pathname as string) !== "/dashboard") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        }

        if (!isAuthRoute && !isAuthenticated) {
            return NextResponse.redirect(new URL("/", request.url));
        }

    } catch (error) {
        console.error("Middleware session fetch error:", error);

        const sessionCookie =
            request.cookies.get("better-auth.session_token") ||
            request.cookies.get("__Secure-better-auth.session_token") ||
            request.cookies.get("next-auth.session-token");

        const isAuthenticated = !!sessionCookie;

        if (isAuthRoute && isAuthenticated) {
            if (pathname !== "/dashboard") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        }

        if (!isAuthRoute && !isAuthenticated) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
