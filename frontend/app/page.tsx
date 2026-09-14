import Link from "next/link";

export const dynamic =
    "force-static";

export default function Home() {
    return (
        <main className="mx-auto max-w-7xl py-10 sm:py-14">
            <section className="overflow-hidden rounded-[30px] border border-[#d6c5b1] bg-[#fffaf0]">
                <div className="h-3 bg-[#8f3d27]" />

                <div className="grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8f3d27]">
                            Smart Queue Management
                        </p>

                        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-[#332c26] sm:text-5xl lg:text-6xl">
                            Spend less time waiting.
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-[#70665d] sm:text-lg">
                            Get a ticket, follow your queue and know when it is your turn.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                href="/register"
                                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#5d7d5f] px-6 text-sm font-bold text-white transition hover:bg-[#4e6c50]"
                            >
                                Create account
                            </Link>

                            <Link
                                href="/login"
                                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b9a895] bg-[#fffaf0] px-6 text-sm font-bold text-[#66574d] transition hover:border-[#8f3d27] hover:text-[#8f3d27]"
                            >
                                Login
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-[26px] border border-[#decf8a] bg-[#f8e9ad] p-6 sm:p-7">
                        <p className="text-sm font-bold text-[#6e5b22]">
                            Using SQMS is simple
                        </p>

                        <div className="mt-5 space-y-5">
                            <div className="flex gap-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8f3d27] text-sm font-black text-white">
                                    1
                                </div>

                                <div>
                                    <p className="font-bold text-[#4c4027]">
                                        Choose a service
                                    </p>

                                    <p className="mt-1 text-sm text-[#77683b]">
                                        Find the service you need.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8f3d27] text-sm font-black text-white">
                                    2
                                </div>

                                <div>
                                    <p className="font-bold text-[#4c4027]">
                                        Get your ticket
                                    </p>

                                    <p className="mt-1 text-sm text-[#77683b]">
                                        Join an available queue.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8f3d27] text-sm font-black text-white">
                                    3
                                </div>

                                <div>
                                    <p className="font-bold text-[#4c4027]">
                                        Follow your turn
                                    </p>

                                    <p className="mt-1 text-sm text-[#77683b]">
                                        Check your ticket until you are called.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid border-t border-[#ddcfbd] sm:grid-cols-3">
                    <div className="bg-[#deedf5] px-6 py-5">
                        <p className="font-bold text-[#405f70]">
                            Clear
                        </p>

                        <p className="mt-1 text-sm text-[#687d89]">
                            Know your queue status.
                        </p>
                    </div>

                    <div className="border-y border-[#ddcfbd] bg-[#e0edde] px-6 py-5 sm:border-x sm:border-y-0">
                        <p className="font-bold text-[#426245]">
                            Convenient
                        </p>

                        <p className="mt-1 text-sm text-[#697b69]">
                            Manage your ticket online.
                        </p>
                    </div>

                    <div className="bg-[#f4ded1] px-6 py-5">
                        <p className="font-bold text-[#744d3c]">
                            Easy to use
                        </p>

                        <p className="mt-1 text-sm text-[#85695b]">
                            Simple for everyone.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mt-8 flex flex-col gap-5 rounded-[26px] border border-[#d5c4b0] bg-[#fffaf0] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#332c26]">
                        Looking for a service?
                    </h2>

                    <p className="mt-1 text-sm text-[#746960]">
                        Browse the services currently available.
                    </p>
                </div>

                <Link
                    href="/services"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#8f3d27] px-5 text-sm font-bold text-[#8f3d27] transition hover:bg-[#8f3d27] hover:text-white"
                >
                    View services
                </Link>
            </section>
        </main>
    );
}