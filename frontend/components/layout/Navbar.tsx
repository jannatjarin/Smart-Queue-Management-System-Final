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

    const [role, setRole] =
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


    const getDashboardLink = () => {

        if (role == "admin") {

            return "/admin/dashboard";

        }

        if (role == "staff") {

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

        setRole(
            null
        );

        router.push(
            "/login"
        );

    };


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


                {
                    !checkingUser &&
                    !role &&
                    <>

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

                    </>
                }


                {
                    !checkingUser &&
                    role &&
                    <>

                        <Link
                            href={getDashboardLink()}
                            className="btn btn-ghost"
                        >
                            Dashboard
                        </Link>


                        <button
                            onClick={logout}
                            className="btn btn-outline"
                        >
                            Logout
                        </button>

                    </>
                }

            </div>

        </div>
    );

}