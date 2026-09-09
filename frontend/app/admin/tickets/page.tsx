"use client";

import { useState } from "react";

interface Ticket {
    id: number,
    ticketNumber: string,
    status: string,
    priority: string
}

export default function AdminTicketsPage() {

    const [tickets] =
        useState<Ticket[]>([]);

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Ticket Management
            </h1>

            <p className="mb-6">
                View and manage system tickets
            </p>

            {
                tickets.length == 0 &&

                <p>
                    No tickets found
                </p>
            }

        </div>
    )
}