"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/i18n";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        // Remove the current locale from the pathname
        const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

        // Navigate to the same page with the new locale
        const newPath = newLocale === "en" ? pathnameWithoutLocale : `/${newLocale}${pathnameWithoutLocale}`;

        router.push(newPath);
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
                    aria-label={`Switch to ${loc === "en" ? "English" : "French"}`}
                >
                    {loc.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
