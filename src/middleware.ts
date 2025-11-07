import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // If accessing /tarotmeter/index.html, redirect to /tarotmeter
    if (pathname === "/tarotmeter/index.html") {
        const url = request.nextUrl.clone();
        url.pathname = "/tarotmeter";
        // Preserve hash if present (though it won't be in server-side requests)
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/tarotmeter/:path*",
};
