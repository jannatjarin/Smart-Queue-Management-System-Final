"use client";

import { useState } from "react";

interface Queue {
    id: number,
    name: string,
    location: string,
    status: string,
    currentTicketNumber: number
}

export default function StaffQueuePage() {

    const [queues] =
        useState<Queue[]>([]);

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Queue Management
            </h1>

            <p className="mb-6">
                Manage queue operations
            </p>

            {
                queues.length == 0 &&

                <p>
                    No queues found
                </p>
            }

        </div>
    )
}