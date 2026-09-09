"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Ticket {
    id: number,
    ticketNumber: string,
    status: string,
    priority: string,
    issuedAt: string,
    calledAt: string | null,
    completedAt: string | null,

    user: {
        id: number,
        fullName: string,
        email: string
    },

    service: {
        id: number,
        name: string
    },

    queue: {
        id: number,
        name: string
    },

    counter: {
        id: number,
        name: string
    } | null
}

export default function AdminTicketsPage() {

    const [tickets, setTickets] =
        useState<Ticket[]>([]);

    const [err, setErr] =
        useState("");

    useEffect(() => {

        const getTickets = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                const response =
                    await axios.get<Ticket[]>(
                        "http://localhost:3000/tickets",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setTickets(
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
                        "Could not load tickets"
                    );

                }

            }

        }

        getTickets();

    }, []);

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Ticket Management
            </h1>

            <p className="mb-6">
                View and manage system tickets
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
                            <th>Ticket</th>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Queue</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Counter</th>
                            <th>Issued</th>
                        </tr>

                    </thead>

                    <tbody>

                        {
                            tickets &&
                            tickets.map(
                                (ticket: Ticket) => (

                                    <tr key={ticket.id}>

                                        <td>
                                            {ticket.ticketNumber}
                                        </td>

                                        <td>

                                            <p>
                                                {ticket.user?.fullName}
                                            </p>

                                            <p className="text-sm opacity-70">
                                                {ticket.user?.email}
                                            </p>

                                        </td>

                                        <td>
                                            {ticket.service?.name}
                                        </td>

                                        <td>
                                            {ticket.queue?.name}
                                        </td>

                                        <td>
                                            {ticket.priority}
                                        </td>

                                        <td>
                                            {ticket.status}
                                        </td>

                                        <td>

                                            {
                                                ticket.counter?.name ||
                                                "Not Assigned"
                                            }

                                        </td>

                                        <td>

                                            {
                                                new Date(
                                                    ticket.issuedAt
                                                ).toLocaleString()
                                            }

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