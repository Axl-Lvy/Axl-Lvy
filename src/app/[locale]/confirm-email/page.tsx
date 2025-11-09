import { useTranslations } from "next-intl";
import Link from "next/link";
import Container from "@/components/Container";

export default function ConfirmEmailPage({ searchParams }: { searchParams: { app?: string } }) {
    const t = useTranslations("confirmEmail");
    const app = searchParams.app;

    // Use a Set for O(1) lookup
    const validApps = new Set(["tarotmeter", "memorchess"]);
    const isValidApp = app && validApps.has(app);
    const appLink = isValidApp ? `/${app}` : null;

    return (
        <Container>
            <div className="flex min-h-[60vh] items-center justify-center py-20">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <svg
                            className="h-12 w-12 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Heading */}
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">{t("heading")}</h1>

                    {/* Message */}
                    <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">{t("message")}</p>

                    {/* Buttons */}
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        {appLink ? (
                            <>
                                <Link
                                    href={appLink}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                                >
                                    {t("returnToApp")}
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                                >
                                    {t("backHome")}
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/"
                                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                            >
                                {t("backHome")}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
}
