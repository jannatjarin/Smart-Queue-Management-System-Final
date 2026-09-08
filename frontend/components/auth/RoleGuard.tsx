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

    const [userRole, setUserRole] =
        useState<string | null>(null);

    useEffect(() => {

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

            setUserRole(
                user.role
            );

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

    }, [router]);

    useEffect(() => {

        if (!userRole) {
            return;
        }

        if (
            userRole == allowedRole
        ) {

            return;

        }

        if (
            userRole == "admin"
        ) {

            router.push(
                "/admin/dashboard"
            );

        }

        else if (
            userRole == "staff"
        ) {

            router.push(
                "/staff/dashboard"
            );

        }

        else if (
            userRole == "customer"
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

    }, [
        userRole,
        allowedRole,
        router
    ]);

    if (
        userRole != allowedRole
    ) {

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