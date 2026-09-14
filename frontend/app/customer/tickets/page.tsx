"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import api from "@/lib/axios";
import StatusBadge from "@/components/ui/StatusBadge";

interface Ticket {
    id: number;
    ticketNumber: string;
    status: string;
    priority: string;
    issuedAt: string;
    calledAt: string | null;
    completedAt: string | null;
    estimatedWaitMinutes: number | null;

    service: {
        id: number;
        name: string;
    };

    queue: {
        id: number;
        name: string;
    };

    counter: {
        id: number;
        name: string;
    } | null;
}

export default function CustomerTicketsPage() {
    const [tickets, setTickets] =
        useState<Ticket[]>([]);

    const [err, setErr] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [selectedTicket, setSelectedTicket] =
        useState<Ticket | null>(null);

    const [refresh, setRefresh] =
        useState(0);

    const [responseMsg, setResponseMsg] =
        useState("");

    useEffect(() => {
        const getTickets = async () => {
            try {
                const response =
                    await api.get<Ticket[]>(
                        "/tickets/mytickets"
                    );

                setTickets(response.data);
                setErr("");
            } catch (error) {
                if (
                    axios.isAxiosError(error) &&
                    error.response?.data?.message
                ) {
                    setErr(
                        error.response.data.message
                    );
                } else {
                    setErr(
                        "Could not load tickets"
                    );
                }
            }
        };

        getTickets();
    }, [refresh]);

    const filteredTickets =
        status
            ? tickets.filter(
                (ticket) =>
                    ticket.status ==
                    status
            )
            : tickets;

    const cancelTicket = async (
        id: number
    ) => {
        setErr("");
        setResponseMsg("");

        try {
            await api.patch(
                `/tickets/${id}/cancel`,
                {}
            );

            setResponseMsg(
                "Ticket cancelled successfully"
            );

            setSelectedTicket(null);

            setRefresh(
                (value) =>
                    value + 1
            );
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.data?.message
            ) {
                setErr(
                    error.response.data.message
                );
            } else {
                setErr(
                    "Could not cancel ticket"
                );
            }
        }
    };

    const showEstimatedWait = (
        ticket: Ticket
    ) => {
        if (
            ticket.status !=
            "waiting"
        ) {
            return "-";
        }

        if (
            ticket
                .estimatedWaitMinutes ===
            null
        ) {
            return "Not available";
        }

        return `${ticket.estimatedWaitMinutes} min`;
    };

    const toneForStatus = (
        ticketStatus: string
    ) => {
        if (
            ticketStatus ==
            "waiting"
        ) {
            return "border-[#dfc969] bg-[#f8e8a6]";
        }

        if (
            ticketStatus ==
            "called"
        ) {
            return "border-[#b8ceda] bg-[#deedf5]";
        }

        if (
            ticketStatus ==
            "completed"
        ) {
            return "border-[#b9d0b6] bg-[#dfeedd]";
        }

        if (
            ticketStatus ==
            "cancelled"
        ) {
            return "border-[#e0b7ba] bg-[#f4d8da]";
        }

        return "border-[#d7c8b6] bg-[#fff8ea]";
    };

    return (
        <div className="mx-auto max-w-6xl py-8 sm:py-10">
            <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                        Your queue history
                    </p>

                    <h1 className="mt-1 text-4xl font-bold text-[#332c26]">
                        My tickets
                    </h1>

                    <p className="mt-2 text-sm text-[#746960]">
                        Track current and previous tickets.
                    </p>
                </div>

                <Link
                    href="/customer/queues"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#5d7d5f] px-5 text-sm font-bold text-white transition hover:bg-[#4e6c50]"
                >
                    Get a ticket
                </Link>
            </header>

            {responseMsg && (
                <div className="mb-5 rounded-[18px] border border-[#b6ceb2] bg-[#dcebd8] px-4 py-3 text-sm font-bold text-[#416343]">
                    {responseMsg}
                </div>
            )}

            {err && (
                <div className="mb-5 rounded-[18px] border border-[#dfb4b7] bg-[#f4d5d7] px-4 py-3 text-sm font-bold text-[#82464b]">
                    {err}
                </div>
            )}

            <section className="mb-6 max-w-sm rounded-[22px] border border-[#d5c4b0] bg-[#fffaf0] p-4">
                <label
                    htmlFor="statusFilter"
                    className="mb-2 block text-sm font-bold text-[#574d44]"
                >
                    Status
                </label>

                <select
                    id="statusFilter"
                    className="select w-full border-[#cabaa7] bg-[#fffdf8] text-[#443b34]"
                    value={status}
                    onChange={(e) =>
                        setStatus(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All tickets
                    </option>

                    <option value="waiting">
                        Waiting
                    </option>

                    <option value="called">
                        Called
                    </option>

                    <option value="completed">
                        Completed
                    </option>

                    <option value="cancelled">
                        Cancelled
                    </option>
                </select>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
                {filteredTickets.map(
                    (ticket) => (
                        <article
                            key={ticket.id}
                            className={`rounded-[24px] border p-5 ${toneForStatus(
                                ticket.status
                            )}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-[#766c63]">
                                        Ticket
                                    </p>

                                    <h2 className="mt-1 text-3xl font-black text-[#40372f]">
                                        {
                                            ticket
                                                .ticketNumber
                                        }
                                    </h2>
                                </div>

                                <StatusBadge
                                    status={
                                        ticket.status
                                    }
                                />
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-[#7d7269]">
                                        Service
                                    </p>

                                    <p className="mt-1 font-bold text-[#433a33]">
                                        {
                                            ticket
                                                .service
                                                ?.name
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[#7d7269]">
                                        Queue
                                    </p>

                                    <p className="mt-1 font-bold text-[#433a33]">
                                        {
                                            ticket
                                                .queue
                                                ?.name
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[#7d7269]">
                                        Counter
                                    </p>

                                    <p className="mt-1 font-bold text-[#433a33]">
                                        {
                                            ticket
                                                .counter
                                                ?.name ||
                                            "Not assigned"
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[#7d7269]">
                                        Wait
                                    </p>

                                    <p className="mt-1 font-bold text-[#433a33]">
                                        {
                                            showEstimatedWait(
                                                ticket
                                            )
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex gap-2">
                                <button
                                    type="button"
                                    className="min-h-11 flex-1 rounded-full border border-[#bba996] bg-[#fffaf0] px-4 text-sm font-bold text-[#63564b] transition hover:border-[#8f3d27] hover:text-[#8f3d27]"
                                    onClick={() =>
                                        setSelectedTicket(
                                            ticket
                                        )
                                    }
                                >
                                    Details
                                </button>

                                {ticket.status ==
                                    "waiting" && (
                                    <button
                                        type="button"
                                        className="min-h-11 flex-1 rounded-full border border-[#c98287] bg-[#b85c62] px-4 text-sm font-bold text-white transition hover:bg-[#a64d53]"
                                        onClick={() =>
                                            cancelTicket(
                                                ticket.id
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </article>
                    )
                )}
            </div>

            {filteredTickets.length ==
                0 &&
                !err && (
                    <div className="rounded-[24px] border border-dashed border-[#cdbba7] bg-[#fffaf0] p-8 text-center">
                        <p className="font-bold text-[#4b423a]">
                            No tickets found.
                        </p>
                    </div>
                )}

            {selectedTicket && (
                <section className="mt-7 rounded-[26px] border border-[#d5c4b0] bg-[#fffaf0] p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-[#7d7269]">
                                Ticket details
                            </p>

                            <h2 className="mt-1 text-3xl font-bold text-[#40372f]">
                                {
                                    selectedTicket
                                        .ticketNumber
                                }
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="rounded-full border border-[#bba996] bg-white px-4 py-2 text-sm font-bold text-[#63564b] transition hover:border-[#8f3d27] hover:text-[#8f3d27]"
                            onClick={() =>
                                setSelectedTicket(
                                    null
                                )
                            }
                        >
                            Close
                        </button>
                    </div>

                    <div className="mt-6 grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="text-[#81766d]">
                                Status
                            </p>

                            <div className="mt-1">
                                <StatusBadge
                                    status={
                                        selectedTicket
                                            .status
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <p className="text-[#81766d]">
                                Priority
                            </p>

                            <p className="mt-1 font-bold capitalize">
                                {
                                    selectedTicket
                                        .priority
                                }
                            </p>
                        </div>

                        <div>
                            <p className="text-[#81766d]">
                                Service
                            </p>

                            <p className="mt-1 font-bold">
                                {
                                    selectedTicket
                                        .service
                                        .name
                                }
                            </p>
                        </div>

                        <div>
                            <p className="text-[#81766d]">
                                Queue
                            </p>

                            <p className="mt-1 font-bold">
                                {
                                    selectedTicket
                                        .queue
                                        .name
                                }
                            </p>
                        </div>

                        <div>
                            <p className="text-[#81766d]">
                                Issued
                            </p>

                            <p className="mt-1 font-bold">
                                {new Date(
                                    selectedTicket
                                        .issuedAt
                                ).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-[#81766d]">
                                Called
                            </p>

                            <p className="mt-1 font-bold">
                                {selectedTicket.calledAt
                                    ? new Date(
                                        selectedTicket.calledAt
                                    ).toLocaleString()
                                    : "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-[#81766d]">
                                Completed
                            </p>

                            <p className="mt-1 font-bold">
                                {selectedTicket
                                    .completedAt
                                    ? new Date(
                                        selectedTicket.completedAt
                                    ).toLocaleString()
                                    : "-"}
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}