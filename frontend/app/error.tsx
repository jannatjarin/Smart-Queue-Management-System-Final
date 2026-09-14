"use client";

export default function Error({
    reset,
}: {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}) {
    return (
        <main className="flex min-h-[65vh] items-center justify-center py-10">
            <section className="w-full max-w-md rounded-[28px] border border-[#dfb4b7] bg-[#f4d5d7] p-7 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a5358]">
                    Error
                </p>

                <h1 className="mt-2 text-3xl font-bold text-[#6f3e42]">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#875b5e]">
                    We could not complete that request.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        reset()
                    }
                    className="mt-6 min-h-11 rounded-full bg-[#5d7d5f] px-6 text-sm font-bold text-white transition hover:bg-[#4e6c50]"
                >
                    Try again
                </button>
            </section>
        </main>
    );
}