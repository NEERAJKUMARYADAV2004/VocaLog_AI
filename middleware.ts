import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });

        const session = response.ok ? await response.json() : null;

        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } catch (error) {
        console.error("Middleware session fetch error:", error);
        
        // Fallback to basic cookie check if fetch fails
        const sessionCookie =
            request.cookies.get("better-auth.session_token") ||
            request.cookies.get("__Secure-better-auth.session_token");

        if (!sessionCookie) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Match all routes except for the ones starting with:
    // - login
    // - signup
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico, sitemap.xml, robots.txt (metadata files)
    matcher: ["/((?!login|signup|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
