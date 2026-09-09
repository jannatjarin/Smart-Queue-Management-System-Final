"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Queue {
    id: number,
    name: string,
    location: string,
    status: string,
    currentTicketNumber: number,

    service: {
        id: number,
        name: string
    }
}
interface Service {
    id: number,
    name: string
}

export default function StaffQueuePage() {

    const [queues, setQueues] =
        useState<Queue[]>([]);

    const [err, setErr] =
        useState("");

        useEffect(() => {

            const getQueues = async () => {

                try {

                    const response =
                        await axios.get<Queue[]>(
                            "http://localhost:3000/queues"
                        );

                    setQueues(
                        response.data
                    );

                    setErr("");

                }

                catch (error) {

                    if (
                        axios.isAxiosError(error) &&
                        error.response?.data?.message
                    ) {

                        setErr(
                            error.response.data.message
                        );

                    }

                    else {

                        setErr(
                            "Could not load queues"
                        );

                    }

                }

            }

            getQueues();

        }, []);

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Queue Management
            </h1>

            <p className="mb-6">
                Manage queue operations
            </p>

            {
                err &&

                <div className="alert alert-error mb-4">

                    <span>
                        {err}
                    </span>

                </div>
            }

            {
                queues.length == 0 &&
                !err &&

                <p>
                    No queues found
                </p>
            }

            <div className="grid md:grid-cols-2 gap-5">

                {
                    queues &&
                    queues.map(
                        (queue: Queue) => (

                            <div
                                key={queue.id}
                                className="card bg-base-100 shadow border"
                            >

                                <div className="card-body">

                                    <h2 className="card-title">
                                        {queue.name}
                                    </h2>

                                    <p>
                                        Service:{" "}
                                        {queue.service?.name}
                                    </p>

                                    <p>
                                        Location:{" "}
                                        {queue.location}
                                    </p>

                                    <p>
                                        Status:{" "}
                                        {queue.status}
                                    </p>

                                    <p>
                                        Current Ticket:{" "}
                                        {queue.currentTicketNumber}
                                    </p>

                                </div>

                            </div>

                        )
                    )
                }

            </div>

        </div>
    )
}