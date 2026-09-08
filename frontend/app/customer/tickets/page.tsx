"use client";

import { useState } from "react";

interface Ticket {
    id: number,
    ticketNumber: string,
    status: string,
    priority: string
}

export default function CustomerTicketsPage() {

    const [tickets] =
        useState<Ticket[]>([]);

    return (
        <div className="max-w-6xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                My Tickets
            </h1>

            <p className="mb-6">
                View your queue tickets
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