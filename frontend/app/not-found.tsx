import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-[65vh] items-center justify-center py-10">
            <section className="w-full max-w-lg rounded-[28px] border border-[#d6c5b1] bg-[#fffaf0] p-8 text-center">
                <p className="text-7xl font-black text-[#8f3d27]">
                    404
                </p>

                <h1 className="mt-3 text-3xl font-bold text-[#332c26]">
                    Page not found
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#746960]">
                    The page you are looking for does not exist or may have moved.
                </p>

                <Link
                    href="/"
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#5d7d5f] px-6 text-sm font-bold text-white transition hover:bg-[#4e6c50]"
                >
                    Go home
                </Link>
            </section>
        </main>
    );
}