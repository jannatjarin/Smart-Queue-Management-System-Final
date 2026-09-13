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

    const router =
        useRouter();

    const pathname =
        usePathname();


    const [
        role,
        setRole
    ] =
        useState<string | null>(
            null
        );


    const [
        checkingUser,
        setCheckingUser
    ] =
        useState(true);


    useEffect(
        () => {

            const checkUser =
                async () => {

                    const token =
                        localStorage.getItem(
                            "access_token"
                        );


                    if (!token) {

                        setRole(
                            null
                        );

                        setCheckingUser(
                            false
                        );

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

                    }

                    catch {

                        setRole(
                            null
                        );

                    }

                    finally {

                        setCheckingUser(
                            false
                        );

                    }

                };


            checkUser();

        },
        [pathname]
    );


    const getDashboardLink =
        () => {

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


    const logout =
        () => {

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "refresh_token"
            );

            setRole(
                null
            );

            router.push(
                "/login"
            );

        };


    const navLinkClass = (
        href: string
    ) =>
        pathname === href
            ? "rounded-full bg-[#eee8ff] px-4 py-2 text-sm font-bold text-[#5b518a]"
            : "rounded-full px-4 py-2 text-sm font-semibold text-[#656176] transition hover:bg-white/75 hover:text-[#4f4960]";


    return (
        <header
            className="
                sticky top-0 z-40
                border-b
                border-[#e9e2ef]/90
                bg-[#fffafd]/80
                backdrop-blur-xl
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    min-h-[76px]
                    max-w-7xl
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                    px-5
                    py-3
                "
            >

                <Link
                    href="/"
                    className="
                        group
                        flex
                        items-center
                        gap-3
                    "
                >

                    <span
                        className="
                            relative
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-[18px]
                            border
                            border-white/80
                            bg-[linear-gradient(135deg,#ddd4ff_0%,#f9dce8_48%,#dff3e9_100%)]
                            shadow-[0_8px_24px_rgba(94,78,119,0.14)]
                        "
                    >

                        <span
                            className="
                                absolute
                                -left-2
                                -top-2
                                h-7
                                w-7
                                rounded-full
                                bg-white/45
                            "
                        />

                        <span
                            className="
                                absolute
                                -bottom-3
                                -right-2
                                h-8
                                w-8
                                rounded-full
                                bg-[#fff1c9]/70
                            "
                        />

                        <span
                            className="
                                relative
                                text-lg
                                font-black
                                text-[#554c79]
                            "
                        >
                            Q
                        </span>

                    </span>


                    <span className="leading-tight">

                        <span
                            className="
                                block
                                text-[17px]
                                font-extrabold
                                tracking-[-0.03em]
                                text-[#353247]
                            "
                        >
                            SQMS
                        </span>

                        <span
                            className="
                                hidden
                                text-xs
                                font-medium
                                text-[#858093]
                                sm:block
                            "
                        >
                            Smart Queue Management
                        </span>

                    </span>

                </Link>


                <nav
                    className="
                        flex
                        flex-wrap
                        items-center
                        justify-end
                        gap-1.5
                    "
                    aria-label="Main navigation"
                >

                    <Link
                        href="/"
                        className={
                            navLinkClass(
                                "/"
                            )
                        }
                    >
                        Home
                    </Link>


                    <Link
                        href="/services"
                        className={
                            navLinkClass(
                                "/services"
                            )
                        }
                    >
                        Services
                    </Link>


                    {
                        !checkingUser &&
                        !role &&
                        <>

                            <Link
                                href="/login"
                                className={
                                    navLinkClass(
                                        "/login"
                                    )
                                }
                            >
                                Login
                            </Link>


                            <Link
                                href="/register"
                                className="
                                    ml-1
                                    rounded-full
                                    bg-[#756aa5]
                                    px-[18px]
                                    py-2.5
                                    text-sm
                                    font-bold
                                    text-white
                                    shadow-[0_8px_22px_rgba(117,106,165,0.22)]
                                    transition
                                    hover:-translate-y-0.5
                                    hover:bg-[#655a96]
                                "
                            >
                                Register
                            </Link>

                        </>
                    }


                    {
                        !checkingUser &&
                        role &&
                        <>

                            <Link
                                href={
                                    getDashboardLink()
                                }
                                className={
                                    navLinkClass(
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
                                className="
                                    ml-1
                                    rounded-full
                                    border
                                    border-[#ded6e8]
                                    bg-white/80
                                    px-4
                                    py-2
                                    text-sm
                                    font-bold
                                    text-[#625d70]
                                    transition
                                    hover:border-[#c7bbd8]
                                    hover:bg-[#f7f2ff]
                                    hover:text-[#5b518a]
                                "
                            >
                                Logout
                            </button>

                        </>
                    }

                </nav>

            </div>

        </header>
    );

}