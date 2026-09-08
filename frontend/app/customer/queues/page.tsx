"use client"

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

export default function QueuesPage() {

    const [queues, setQueues] =
        useState<Queue[]>([]);

    const [err, setErr] =
        useState("");

    useEffect(() => {

        const getQueues = async () => {

            try {

                const response =
                    await axios.get(
                        "http://localhost:3000/queues"
                    );

                setQueues(
                    response.data
                );

            }

            catch (error: any) {

                if (error.response?.data?.message) {

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
        <div className="max-w-6xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Available Queues
            </h1>

            <p className="mb-6">
                View currently available service queues.
            </p>

            {
                err &&
                <div className="alert alert-error mb-4">
                    {err}
                </div>
            }

            <div className="overflow-x-auto">

                <table className="table table-zebra">

                    <thead>

                        <tr>
                            <th>Queue</th>
                            <th>Service</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Current Ticket</th>
                        </tr>

                    </thead>

                    <tbody>

                        {
                            queues &&
                            queues.map(
                                (queue: Queue) => (

                                    <tr key={queue.id}>

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

                                            <span className="badge badge-outline">
                                                {queue.status}
                                            </span>

                                        </td>

                                        <td>
                                            {queue.currentTicketNumber}
                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>

            </div>

            {
                queues.length === 0 &&
                !err &&

                <p className="mt-4">
                    No queues available.
                </p>
            }

        </div>
    )
}