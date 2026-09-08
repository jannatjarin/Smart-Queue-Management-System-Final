import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">

            <div className="text-center max-w-2xl">

                <h1 className="text-4xl font-bold mb-4">
                    Smart Queue Management System
                </h1>

                <p className="text-lg mb-8">
                    Manage services, queues and tickets easily without
                    waiting unnecessarily.
                </p>

                <div className="flex justify-center gap-4">

                    <Link
                        href="/login"
                        className="btn btn-primary"
                    >
                        Login
                    </Link>

                    <Link
                        href="/register"
                        className="btn btn-outline"
                    >
                        Register
                    </Link>

                    <Link
                        href="/services"
                        className="btn btn-ghost"
                    >
                        View Services
                    </Link>

                </div>

            </div>

        </div>
    );
}