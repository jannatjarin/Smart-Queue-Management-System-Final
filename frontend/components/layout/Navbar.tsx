"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {

    const router = useRouter();

    const logout = () => {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "refresh_token"
        );

        router.push(
            "/login"
        );

    }

    return (
        <div className="navbar bg-base-100 shadow-sm px-8">

            <div className="flex-1">

                <Link
                    href="/"
                    className="text-xl font-bold"
                >
                    SQMS
                </Link>

            </div>

            <div className="flex gap-2">

                <Link
                    href="/"
                    className="btn btn-ghost"
                >
                    Home
                </Link>

                <Link
                    href="/services"
                    className="btn btn-ghost"
                >
                    Services
                </Link>

                <Link
                    href="/login"
                    className="btn btn-ghost"
                >
                    Login
                </Link>

                <Link
                    href="/register"
                    className="btn btn-primary"
                >
                    Register
                </Link>

                <button
                    onClick={logout}
                    className="btn btn-outline"
                >
                    Logout
                </button>

            </div>

        </div>
    );
}