import { redirect } from "next/navigation";
import Container from "@/components/Container";

export default function ConfirmEmailPage({ searchParams }: { searchParams: { app?: string; token?: string } }) {
    const app = searchParams.app;
    const token = searchParams.token;

    // Use a Set for O(1) lookup
    const validApps = new Set(["tarotmeter", "memorchess"]);
    const isValidApp = app && validApps.has(app);

    // If we have a valid app and token, redirect to the app's confirm-email page
    if (isValidApp && token) {
        redirect(`/${app}#confirm-email/${token}`);
    }

    // If we reach here, something went wrong - this shouldn't happen
    return (
        <Container>
            <div className="flex min-h-[60vh] items-center justify-center py-20">
                <div className="text-center">
                    {/* Error Icon */}
                    <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <svg
                            className="h-12 w-12 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    {/* Error Message */}
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">Invalid Request</h1>
                    <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                        This page should not be accessed directly. If you arrived here from an email confirmation link, please
                        contact support.
                    </p>
                </div>
            </div>
        </Container>
    );
}
