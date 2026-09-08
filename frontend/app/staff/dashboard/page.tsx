"use client";

import { useState } from "react";

interface Staff {
    id: number,
    fullName: string,
    email: string,
    phone?: string,
    role: string
}

export default function StaffDashboard() {

    const [staff] =
        useState<Staff | null>(
            null
        );

    return (
        <div className="max-w-6xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Staff Dashboard
            </h1>

            <p className="mb-6">
                Smart Queue Management System
            </p>

            {
                staff &&

                <p>
                    Welcome, {staff.fullName}
                </p>
            }

        </div>
    )
}