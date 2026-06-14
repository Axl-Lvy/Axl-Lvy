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
        pathname.startsWith("/rain") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes("/images/") ||
        pathname.startsWith("/sounds/")
    ) {
        // Redirect /<app>/index.html to /<app>
        if (pathname === "/tarotmeter/index.html") {
            const url = request.nextUrl.clone();
            url.pathname = "/tarotmeter";
            return NextResponse.redirect(url, 301);
        }
        if (pathname === "/memorchess/index.html") {
            const url = request.nextUrl.clone();
            url.pathname = "/memorchess";
            return NextResponse.redirect(url, 301);
        }
        if (pathname === "/rain/index.html") {
            const url = request.nextUrl.clone();
            url.pathname = "/rain";
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
        "/rain/:path*",
        "/((?!_next|api|tarotmeter|memorchess|rain|images|sounds).*)",
    ],
};
