"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        if (newLocale === locale) return;

        // Strip current locale prefix if present (default locale "en" has no prefix with as-needed)
        const stripped = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

        // Build new path: default locale "en" has no prefix, others get /<locale> prefix
        const newPath = newLocale === "en" ? stripped : `/${newLocale}${stripped === "/" ? "" : stripped}`;

        // Hard navigation so next-intl middleware re-resolves the locale and messages
        window.location.assign(newPath + window.location.hash);
    };

    return (
        <div className="flex gap-2 items-center">
            {locales.map((loc) => (
                <button
                    key={loc}
                    onClick={() => switchLocale(loc)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        locale === loc ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    aria-label={`Switch to ${loc === "fr" ? "French" : "English"}`}
                >
                    {loc.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
