import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Define authentication routes (Root is explicitly the Auth page per requirements)
    const isAuthRoute = pathname === "/" || pathname === "/login" || pathname === "/signup";
    
    try {
        // Attempt strict session validation via the API endpoint
        const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });

        // Gracefully handle potential JSON parse errors or non-ok responses
        let session = null;
        if (response.ok) {
            try {
                session = await response.json();
            } catch (e) {
                session = null;
            }
        }
        
        const isAuthenticated = !!session;

        // Architecture Requirement 1: Prevent Infinite Redirect Loops
        // If authenticated and on an auth route, redirect to /dashboard
        if (isAuthRoute && isAuthenticated) {
            // Check to ensure we aren't already going to /dashboard to prevent loop
            if ((pathname as string) !== "/dashboard") {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        }

        // If unauthenticated and NOT on an auth route, redirect to /
        if (!isAuthRoute && !isAuthenticated) {
            return NextResponse.redirect(new URL("/", request.url));
        }

    } catch (error) {
        // Architecture Requirement 4: State Consistency (Drop to unauthenticated flow without throwing edge errors)
        console.error("Middleware session fetch error:", error);
        
        // Architecture Requirement 3: Session Token Handling (Check local & secure cookies)
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

// Architecture Requirement 2: Optimize Edge Matcher Performance
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - public files (favicon.ico, site.webmanifest, and common image formats like .png, .svg)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
