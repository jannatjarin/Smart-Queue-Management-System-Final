import Link from "next/link";

export default function NotFound() {

    return (
        <div className="min-h-[70vh] flex items-center justify-center">

            <div className="text-center">

                <h1 className="text-5xl font-bold">
                    404
                </h1>

                <h2 className="text-xl font-semibold mt-3">
                    Page Not Found
                </h2>

                <p className="mt-2">
                    Sorry, your requested page could not be found.
                </p>

                <Link
                    href="/"
                    className="btn btn-primary mt-6"
                >
                    Go Home
                </Link>

            </div>

        </div>
    );
}