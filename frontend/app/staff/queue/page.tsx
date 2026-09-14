"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import api from "@/lib/axios";
import StatusBadge from "@/components/ui/StatusBadge";

interface Service {
    id: number;
    name: string;
}

interface Counter {
    id: number;
    name: string;
    status: string;
    services: Service[];
}

interface Queue {
    id: number;
    name: string;
    location: string;
    status: string;
    currentTicketNumber: number;
    service: Service;
}

interface Ticket {
    id: number;
    ticketNumber: string;
    status: string;
    priority: string;
    issuedAt: string;

    user: {
        id: number;
        fullName: string;
    };

    queue: {
        id: number;
        name: string;
    };

    service: Service;

    counter: {
        id: number;
        name: string;
    } | null;
}

export default function StaffQueuePage() {
    const [counter, setCounter] =
        useState<Counter | null>(null);

    const [queues, setQueues] =
        useState<Queue[]>([]);

    const [tickets, setTickets] =
        useState<Ticket[]>([]);

    const [
        selectedQueueId,
        setSelectedQueueId
    ] = useState("");

    const [refresh, setRefresh] =
        useState(0);

    const [responseMsg, setResponseMsg] =
        useState("");

    const [err, setErr] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);

            try {
                const countersResponse =
                    await api.get<Counter[]>(
                        "/counters"
                    );

                const assignedCounter =
                    countersResponse.data.length >
                    0
                        ? countersResponse
                            .data[0]
                        : null;

                setCounter(
                    assignedCounter
                );

                if (!assignedCounter) {
                    setQueues([]);
                    setTickets([]);
                    setSelectedQueueId("");
                    setErr("");

                    return;
                }

                const queuesResponse =
                    await api.get<Queue[]>(
                        "/queues"
                    );

                const ticketsResponse =
                    await api.get<Ticket[]>(
                        "/tickets?sort=ASC"
                    );

                const serviceIds =
                    assignedCounter.services.map(
                        (service) =>
                            service.id
                    );

                const supportedQueues =
                    queuesResponse.data.filter(
                        (queue) =>
                            serviceIds.includes(
                                queue.service.id
                            )
                    );

                setQueues(
                    supportedQueues
                );

                setTickets(
                    ticketsResponse.data
                );

                setSelectedQueueId(
                    (currentValue) => {
                        if (
                            currentValue &&
                            supportedQueues.some(
                                (queue) =>
                                    queue.id ===
                                    Number(
                                        currentValue
                                    )
                            )
                        ) {
                            return currentValue;
                        }

                        return "";
                    }
                );

                setErr("");
            } catch (error) {
                if (
                    axios.isAxiosError(error) &&
                    error.response?.data?.message
                ) {
                    const message =
                        error.response.data.message;

                    setErr(
                        Array.isArray(message)
                            ? message.join(", ")
                            : message
                    );
                } else {
                    setErr(
                        "Could not load queue information"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [refresh]);

    const selectedQueue =
        queues.find(
            (queue) =>
                queue.id ===
                Number(
                    selectedQueueId
                )
        );

    const queueTickets =
        selectedQueueId
            ? tickets.filter(
                (ticket) =>
                    ticket.queue?.id ===
                    Number(
                        selectedQueueId
                    )
            )
            : [];

    const waitingTickets =
        queueTickets.filter(
            (ticket) =>
                ticket.status ===
                "waiting"
        );

    const calledTicket =
        counter
            ? tickets.find(
                (ticket) =>
                    ticket.status ===
                        "called" &&
                    ticket.counter?.id ===
                        counter.id
            )
            : undefined;

    const callNext = async () => {
        if (!selectedQueueId) {
            setErr(
                "Please select a queue"
            );

            return;
        }

        setResponseMsg("");
        setErr("");
        setActionLoading(true);

        try {
            await api.patch(
                `/tickets/queue/${selectedQueueId}/next`,
                {}
            );

            setResponseMsg(
                "Next ticket called successfully"
            );

            setRefresh(
                (value) => value + 1
            );
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.data?.message
            ) {
                const message =
                    error.response.data.message;

                setErr(
                    Array.isArray(message)
                        ? message.join(", ")
                        : message
                );
            } else {
                setErr(
                    "Could not call next ticket"
                );
            }
        } finally {
            setActionLoading(false);
        }
    };

    const completeTicket = async (
        id: number
    ) => {
        setResponseMsg("");
        setErr("");
        setActionLoading(true);

        try {
            await api.patch(
                `/tickets/${id}/complete`,
                {}
            );

            setResponseMsg(
                "Ticket completed successfully"
            );

            setRefresh(
                (value) => value + 1
            );
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.data?.message
            ) {
                const message =
                    error.response.data.message;

                setErr(
                    Array.isArray(message)
                        ? message.join(", ")
                        : message
                );
            } else {
                setErr(
                    "Could not complete ticket"
                );
            }
        } finally {
            setActionLoading(false);
        }
    };

    const updateQueueStatus = async (
        queueId: number,
        status: string
    ) => {
        setResponseMsg("");
        setErr("");

        try {
            await api.patch(
                `/queues/${queueId}/status`,
                {
                    status,
                }
            );

            setResponseMsg(
                "Queue status updated successfully"
            );

            setRefresh(
                (value) => value + 1
            );
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.data?.message
            ) {
                const message =
                    error.response.data.message;

                setErr(
                    Array.isArray(message)
                        ? message.join(", ")
                        : message
                );
            } else {
                setErr(
                    "Could not update queue status"
                );
            }
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[55vh] items-center justify-center">
                <span className="loading loading-spinner loading-md text-[#8f3d27]" />

                <span className="ml-3 font-semibold text-[#665d54]">
                    Loading queue desk...
                </span>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-7xl py-8 sm:py-10">
            <header className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                    Customer service
                </p>

                <h1 className="mt-1 text-4xl font-bold text-[#332c26]">
                    Queue desk
                </h1>

                <p className="mt-2 text-sm text-[#746960]">
                    Select a queue, call the next customer and complete tickets.
                </p>
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

            {!counter ? (
                <div className="rounded-[24px] border border-[#dfca70] bg-[#f7e49a] p-6">
                    <p className="font-bold text-[#69571d]">
                        No counter assigned
                    </p>

                    <p className="mt-1 text-sm text-[#796a37]">
                        Ask an Admin to assign you to a counter before using the queue desk.
                    </p>
                </div>
            ) : (
                <>
                    <section className="mb-6 rounded-[24px] border border-[#d6c5b1] bg-[#fffaf0] p-5 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-sm text-[#81766d]">
                                    Working at
                                </p>

                                <div className="mt-1 flex flex-wrap items-center gap-3">
                                    <h2 className="text-2xl font-bold text-[#40372f]">
                                        {counter.name}
                                    </h2>

                                    <StatusBadge
                                        status={
                                            counter.status
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {counter.services.map(
                                    (service) => (
                                        <span
                                            key={
                                                service.id
                                            }
                                            className="rounded-full border border-[#d7c38c] bg-[#f7e8b4] px-3 py-1.5 text-xs font-bold text-[#705e2d]"
                                        >
                                            {
                                                service.name
                                            }
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="mb-6 rounded-[24px] border border-[#d6c5b1] bg-[#fffaf0] p-5">
                        <label
                            htmlFor="queueSelect"
                            className="mb-2 block text-sm font-bold text-[#574d44]"
                        >
                            Select queue
                        </label>

                        <select
                            id="queueSelect"
                            className="select w-full max-w-xl border-[#cbbba8] bg-[#fffdf8] text-[#443b34]"
                            value={
                                selectedQueueId
                            }
                            onChange={(e) =>
                                setSelectedQueueId(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Choose a queue
                            </option>

                            {queues.map(
                                (queue) => (
                                    <option
                                        key={
                                            queue.id
                                        }
                                        value={
                                            queue.id
                                        }
                                    >
                                        {queue.name} -{" "}
                                        {
                                            queue
                                                .service
                                                .name
                                        }
                                    </option>
                                )
                            )}
                        </select>

                        {queues.length ===
                            0 && (
                            <p className="mt-3 text-sm text-[#786e65]">
                                No queues are available for your assigned services.
                            </p>
                        )}
                    </section>

                    {calledTicket && (
                        <section className="mb-6 rounded-[26px] border border-[#abc7d5] bg-[#deedf5] p-5 sm:p-6">
                            <p className="text-sm font-bold text-[#506f7f]">
                                Serving now
                            </p>

                            <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <p className="text-4xl font-black text-[#345768]">
                                            {
                                                calledTicket.ticketNumber
                                            }
                                        </p>

                                        <StatusBadge status="called" />
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[#5d7480]">
                                        <p>
                                            Customer:{" "}
                                            <span className="font-bold">
                                                {
                                                    calledTicket
                                                        .user
                                                        .fullName
                                                }
                                            </span>
                                        </p>

                                        <p>
                                            Queue:{" "}
                                            <span className="font-bold">
                                                {
                                                    calledTicket
                                                        .queue
                                                        .name
                                                }
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={
                                        actionLoading
                                    }
                                    onClick={() =>
                                        completeTicket(
                                            calledTicket.id
                                        )
                                    }
                                    className="min-h-12 rounded-full bg-[#5d7d5f] px-6 text-sm font-bold text-white transition hover:bg-[#4e6c50] disabled:cursor-not-allowed disabled:bg-[#aaa39a]"
                                >
                                    {actionLoading
                                        ? "Processing..."
                                        : `Complete ${calledTicket.ticketNumber}`}
                                </button>
                            </div>
                        </section>
                    )}

                    {selectedQueue && (
                        <>
                            <section className="mb-7 rounded-[26px] border border-[#dfcd7c] bg-[#f8e9ad] p-5 sm:p-6">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-2xl font-bold text-[#4e4226]">
                                                {
                                                    selectedQueue.name
                                                }
                                            </h2>

                                            <StatusBadge
                                                status={
                                                    selectedQueue.status
                                                }
                                            />
                                        </div>

                                        <div className="mt-5 grid gap-5 text-sm sm:grid-cols-3">
                                            <div>
                                                <p className="text-[#806e3c]">
                                                    Service
                                                </p>

                                                <p className="mt-1 font-bold text-[#584a24]">
                                                    {
                                                        selectedQueue
                                                            .service
                                                            .name
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[#806e3c]">
                                                    Location
                                                </p>

                                                <p className="mt-1 font-bold text-[#584a24]">
                                                    {
                                                        selectedQueue.location
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[#806e3c]">
                                                    Waiting
                                                </p>

                                                <p className="mt-1 text-2xl font-black text-[#584a24]">
                                                    {
                                                        waitingTickets.length
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            disabled={
                                                selectedQueue.status ===
                                                "open"
                                            }
                                            onClick={() =>
                                                updateQueueStatus(
                                                    selectedQueue.id,
                                                    "open"
                                                )
                                            }
                                            className="min-h-11 rounded-full bg-[#5d7d5f] px-5 text-sm font-bold text-white transition hover:bg-[#4e6c50] disabled:cursor-default disabled:opacity-40"
                                        >
                                            Open queue
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                selectedQueue.status ===
                                                "closed"
                                            }
                                            onClick={() =>
                                                updateQueueStatus(
                                                    selectedQueue.id,
                                                    "closed"
                                                )
                                            }
                                            className="min-h-11 rounded-full bg-[#b85c62] px-5 text-sm font-bold text-white transition hover:bg-[#a64d53] disabled:cursor-default disabled:opacity-40"
                                        >
                                            Close queue
                                        </button>
                                    </div>
                                </div>

                                {counter.status !==
                                    "open" && (
                                    <div className="mt-5 rounded-[16px] border border-[#d1b64c] bg-[#f2da78] px-4 py-3 text-sm font-bold text-[#66531a]">
                                        Open your counter before calling the next ticket.
                                    </div>
                                )}

                                {selectedQueue.status !==
                                    "open" && (
                                    <div className="mt-3 rounded-[16px] border border-[#d1b64c] bg-[#f2da78] px-4 py-3 text-sm font-bold text-[#66531a]">
                                        Open this queue before calling the next ticket.
                                    </div>
                                )}

                                {calledTicket && (
                                    <div className="mt-3 rounded-[16px] border border-[#a8c5d4] bg-[#deedf5] px-4 py-3 text-sm font-bold text-[#426273]">
                                        Complete{" "}
                                        {
                                            calledTicket.ticketNumber
                                        }{" "}
                                        before calling another ticket.
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={callNext}
                                    disabled={
                                        actionLoading ||
                                        counter.status !==
                                            "open" ||
                                        selectedQueue.status !==
                                            "open" ||
                                        waitingTickets.length ===
                                            0 ||
                                        !!calledTicket
                                    }
                                    className="mt-5 min-h-12 rounded-full bg-[#5d7d5f] px-7 text-sm font-bold text-white transition hover:bg-[#4e6c50] disabled:cursor-not-allowed disabled:bg-[#aaa39a]"
                                >
                                    {actionLoading
                                        ? "Processing..."
                                        : "Call next ticket"}
                                </button>
                            </section>

                            <section>
                                <div className="mb-4 flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                                            Selected queue
                                        </p>

                                        <h2 className="mt-1 text-2xl font-bold text-[#332c26]">
                                            Ticket list
                                        </h2>
                                    </div>

                                    <p className="text-sm font-bold text-[#746960]">
                                        {
                                            queueTickets.length
                                        }{" "}
                                        total
                                    </p>
                                </div>

                                <div className="overflow-hidden rounded-[24px] border border-[#d5c4b0] bg-[#fffaf0]">
                                    <div className="overflow-x-auto">
                                        <table className="table">
                                            <thead className="bg-[#f0dfc9] text-[#5e5045]">
                                                <tr>
                                                    <th>
                                                        Ticket
                                                    </th>

                                                    <th>
                                                        Customer
                                                    </th>

                                                    <th>
                                                        Priority
                                                    </th>

                                                    <th>
                                                        Status
                                                    </th>

                                                    <th>
                                                        Counter
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {queueTickets.map(
                                                    (ticket) => (
                                                        <tr
                                                            key={
                                                                ticket.id
                                                            }
                                                            className="border-[#e8dccb]"
                                                        >
                                                            <td className="font-black text-[#443b34]">
                                                                {
                                                                    ticket.ticketNumber
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    ticket
                                                                        .user
                                                                        ?.fullName
                                                                }
                                                            </td>

                                                            <td>
                                                                <span
                                                                    className={
                                                                        ticket.priority ===
                                                                        "urgent"
                                                                            ? "rounded-full border border-[#d6bc57] bg-[#f7e49a] px-3 py-1 text-xs font-bold capitalize text-[#705b1e]"
                                                                            : "rounded-full border border-[#d4c9bc] bg-[#e8e1d8] px-3 py-1 text-xs font-bold capitalize text-[#665e57]"
                                                                    }
                                                                >
                                                                    {
                                                                        ticket.priority
                                                                    }
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <StatusBadge
                                                                    status={
                                                                        ticket.status
                                                                    }
                                                                />
                                                            </td>

                                                            <td>
                                                                {ticket
                                                                    .counter
                                                                    ?.name ||
                                                                    "-"}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {queueTickets.length ===
                                        0 && (
                                        <div className="border-t border-[#e8dccb] p-6 text-center text-sm text-[#786e65]">
                                            No tickets found for this queue.
                                        </div>
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </>
            )}
        </main>
    );
}