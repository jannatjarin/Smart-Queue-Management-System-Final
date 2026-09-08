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

export default function CustomerTicketsPage() {

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
                    "http://localhost:3000/tickets/mytickets",
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
        <div className="max-w-6xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                My Tickets
            </h1>

            <p className="mb-6">
                View your queue tickets
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
    tickets.length == 0 &&
    !err &&

    <p>
        No tickets found
    </p>
}

<div className="grid md:grid-cols-2 gap-5">

    {
        tickets &&
        tickets.map(
            (ticket: Ticket) => (

                <div
                    key={ticket.id}
                    className="card bg-base-100 shadow border"
                >

                    <div className="card-body">

                        <h2 className="card-title">
                            {ticket.ticketNumber}
                        </h2>

                        <p>
                            Service:{" "}
                            {ticket.service?.name}
                        </p>

                        <p>
                            Queue:{" "}
                            {ticket.queue?.name}
                        </p>

                        <p>
                            Priority:{" "}
                            {ticket.priority}
                        </p>

                        <p>
                            Status:{" "}
                            {ticket.status}
                        </p>

                        <p>
                            Counter:{" "}
                            {
                                ticket.counter?.name ||
                                "Not Assigned"
                            }
                        </p>

                        <p>
                            Issued:{" "}
                            {
                                new Date(
                                    ticket.issuedAt
                                ).toLocaleString()
                            }
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