"use client";

import {
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    usePathname,
    useRouter,
} from "next/navigation";

import api from "@/lib/axios";

interface UserData {
    role: string;
}

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [role, setRole] =
        useState<string | null>(null);

    const [checkingUser, setCheckingUser] =
        useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token =
                localStorage.getItem(
                    "access_token"
                );

            if (!token) {
                setRole(null);
                setCheckingUser(false);
                return;
            }

            try {
                const response =
                    await api.get<UserData>(
                        "/users/me"
                    );

                setRole(
                    response.data.role
                );
            } catch {
                setRole(null);
            } finally {
                setCheckingUser(false);
            }
        };

        checkUser();
    }, [pathname]);

    const getDashboardLink = () => {
        if (
            role ==
            "admin"
        ) {
            return "/admin/dashboard";
        }

        if (
            role ==
            "staff"
        ) {
            return "/staff/dashboard";
        }

        return "/customer/dashboard";
    };

    const logout = () => {
        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "refresh_token"
        );

        setRole(null);

        router.push(
            "/login"
        );
    };

    const navClass = (
        href: string
    ) =>
        pathname === href
            ? "rounded-full bg-[#f0dfc9] px-4 py-2 text-sm font-bold text-[#8f3d27]"
            : "rounded-full px-4 py-2 text-sm font-semibold text-[#655b52] transition hover:bg-[#f4eadc] hover:text-[#8f3d27]";

    return (
        <header className="sticky top-0 z-40 border-b border-[#ddcebb] bg-[#fffaf0]/95 backdrop-blur">
            <div className="mx-auto flex min-h-[72px] max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
                <Link
                    href="/"
                    className="flex items-center gap-3"
                >
                    <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#8f3d27] text-lg font-black text-[#fffaf0]">
                        Q
                    </span>

                    <span className="leading-tight">
                        <span className="block text-[17px] font-black tracking-tight text-[#3d342d]">
                            SQMS
                        </span>

                        <span className="hidden text-xs font-medium text-[#81756a] sm:block">
                            Smart Queue Management
                        </span>
                    </span>
                </Link>

                <nav
                    className="flex flex-wrap items-center justify-end gap-1"
                    aria-label="Main navigation"
                >
                    <Link
                        href="/"
                        className={
                            navClass("/")
                        }
                    >
                        Home
                    </Link>

                    <Link
                        href="/services"
                        className={
                            navClass(
                                "/services"
                            )
                        }
                    >
                        Services
                    </Link>

                    {!checkingUser &&
                        !role && (
                            <>
                                <Link
                                    href="/login"
                                    className={
                                        navClass(
                                            "/login"
                                        )
                                    }
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    className="ml-1 rounded-full bg-[#5d7d5f] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4e6c50]"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                    {!checkingUser &&
                        role && (
                            <>
                                <Link
                                    href={
                                        getDashboardLink()
                                    }
                                    className={
                                        navClass(
                                            getDashboardLink()
                                        )
                                    }
                                >
                                    Dashboard
                                </Link>

                                <button
                                    type="button"
                                    onClick={
                                        logout
                                    }
                                    className="ml-1 rounded-full border border-[#9b1c31] bg-[#9b1c31] px-4 py-2 text-sm font-bold text-white transition hover:border-[#7f1728] hover:bg-[#7f1728]"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                </nav>
            </div>
        </header>
    );
}