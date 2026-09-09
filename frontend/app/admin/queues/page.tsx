"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Service {
    id: number,
    name: string
}

interface Queue {
    id: number,
    name: string,
    location: string,
    status: string,
    currentTicketNumber: number,
    service: Service
}

export default function AdminQueuesPage() {

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
                Manage system queues
            </p>

            {
                err &&

                <div className="alert alert-error mb-4">

                    <span>
                        {err}
                    </span>

                </div>
            }

            <div className="overflow-x-auto">

                <table className="table table-zebra">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Service</th>
                            <th>Location</th>
                            <th>Current Ticket</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {
                            queues &&
                            queues.map(
                                (queue: Queue) => (

                                    <tr key={queue.id}>

                                        <td>
                                            {queue.id}
                                        </td>

                                        <td>
                                            {queue.name}
                                        </td>

                                        <td>
                                            {queue.service?.name}
                                        </td>

                                        <td>
                                            {queue.location}
                                        </td>

                                        <td>
                                            {queue.currentTicketNumber}
                                        </td>

                                        <td>
                                            {queue.status}
                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>
    )
}