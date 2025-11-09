import type { Metadata } from "next";
import { Source_Sans_3, Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteDetails } from "@/data/siteDetails";
import { locales, Locale } from "@/i18n";

import "../globals.css";

const manrope = Manrope({ subsets: ["latin"] });
const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    openGraph: {
        title: siteDetails.metadata.title,
        description: siteDetails.metadata.description,
        url: siteDetails.siteUrl,
        type: "website",
    },
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Ensure that the incoming `locale` is valid
    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={`${manrope.className} ${sourceSans.className} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
