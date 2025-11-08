/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/tarotmeter/:path*",
                headers: [
                    {
                        key: "Cross-Origin-Opener-Policy",
                        value: "same-origin",
                    },
                    {
                        key: "Cross-Origin-Embedder-Policy",
                        value: "require-corp",
                    },
                ],
            },
            {
                source: "/memorchess/:path*",
                headers: [
                    {
                        key: "Cross-Origin-Opener-Policy",
                        value: "same-origin",
                    },
                    {
                        key: "Cross-Origin-Embedder-Policy",
                        value: "require-corp",
                    },
                ],
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: "/tarotmeter",
                destination: "/tarotmeter/index.html",
            },
            {
                source: "/tarotmeter/",
                destination: "/tarotmeter/index.html",
            },
            {
                source: "/memorchess",
                destination: "/memorchess/index.html",
            },
            {
                source: "/memorchess/",
                destination: "/memorchess/index.html",
            },
        ];
    },
    trailingSlash: false,
};

export default nextConfig;
