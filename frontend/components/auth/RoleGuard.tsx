"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface TokenData {
    id: number,
    email: string,
    role: string
}

interface RoleGuardProps {
    children: React.ReactNode,
    allowedRole: string
}

export default function RoleGuard(
    { children, allowedRole }: RoleGuardProps
) {

    const router = useRouter();

    const [allowed, setAllowed] =
        useState(false);

    useEffect(() => {

        const checkRole = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            if (!token) {

                router.push(
                    "/login"
                );

                return;
            }

            try {

                const user =
                    jwtDecode<TokenData>(
                        token
                    );

                if (
                    user.role ==
                    allowedRole
                ) {

                    await Promise.resolve();

                    setAllowed(true);

                }

                else if (
                    user.role == "admin"
                ) {

                    router.push(
                        "/admin/dashboard"
                    );

                }

                else if (
                    user.role == "staff"
                ) {

                    router.push(
                        "/staff/dashboard"
                    );

                }

                else if (
                    user.role == "customer"
                ) {

                    router.push(
                        "/customer/dashboard"
                    );

                }

                else {

                    router.push(
                        "/login"
                    );

                }

            }

            catch {

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

        };

        checkRole();

    }, [allowedRole, router]);

    if (!allowed) {

        return (
            <div className="flex items-center justify-center p-8">

                <span className="loading loading-spinner"></span>

                <span className="ml-3">
                    Checking access...
                </span>

            </div>
        );

    }

    return (
        <>
            {children}
        </>
    );
}