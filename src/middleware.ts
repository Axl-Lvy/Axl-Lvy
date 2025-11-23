import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales } from "./i18n";

const intlMiddleware = createMiddleware({
    locales: locales,
    defaultLocale: "en",
    localePrefix: "as-needed",
});

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip locale handling for static files and special paths
    if (
        pathname.startsWith("/tarotmeter") ||
        pathname.startsWith("/memorchess") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes("/images/") ||
        pathname.startsWith("/sounds/")
    ) {
        // If accessing /tarotmeter/index.html, redirect to /tarotmeter
        if (pathname === "/tarotmeter/index.html") {
            const url = request.nextUrl.clone();
            url.pathname = "/tarotmeter";
            return NextResponse.redirect(url, 301);
        }
        return NextResponse.next();
    }

    // Handle internationalization for other routes
    return intlMiddleware(request);
}

export const config = {
    matcher: [
        "/",
        "/(fr|en)/:path*",
        "/tarotmeter/:path*",
        "/memorchess/:path*",
        "/((?!_next|api|tarotmeter|memorchess|images|sounds).*)",
    ],
};
