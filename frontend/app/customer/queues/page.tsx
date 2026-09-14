"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import api from "@/lib/axios";
import StatusBadge from "@/components/ui/StatusBadge";

interface Queue {
    id: number;
    name: string;
    location: string;
    status: string;
    currentTicketNumber: number;

    service: {
        id: number;
        name: string;
    };
}

interface CreatedTicket {
    id: number;
    ticketNumber: string;
    status: string;
    priority: string;
    estimatedWaitMinutes: number | null;
}

export default function QueuesPage() {
    const [queues, setQueues] = useState<Queue[]>([]);

    const [priority, setPriority] =
        useState<"normal" | "urgent">("normal");

    const [serviceFilter, setServiceFilter] =
        useState("");

    const [createdTicket, setCreatedTicket] =
        useState<CreatedTicket | null>(null);

    const [creatingQueueId, setCreatingQueueId] =
        useState<number | null>(null);

    const [err, setErr] = useState("");

    const [responseMsg, setResponseMsg] =
        useState("");

    useEffect(() => {
        const getQueues = async () => {
            try {
                const response =
                    await api.get<Queue[]>("/queues");

                setQueues(response.data);
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
                        "Could not load queues"
                    );
                }
            }
        };

        getQueues();
    }, []);

    const serviceOptions =
        Array.from(
            new Map(
                queues.map((queue) => [
                    queue.service.id,
                    queue.service,
                ])
            ).values()
        );

    const filteredQueues =
        serviceFilter
            ? queues.filter(
                (queue) =>
                    queue.service.id ==
                    Number(serviceFilter)
            )
            : queues;

    const getTicket = async (
        queue: Queue
    ) => {
        setErr("");
        setResponseMsg("");
        setCreatedTicket(null);
        setCreatingQueueId(queue.id);

        try {
            const response =
                await api.post<CreatedTicket>(
                    "/tickets",
                    {
                        serviceId:
                            queue.service.id,

                        queueId:
                            queue.id,

                        priority,
                    }
                );

            setCreatedTicket(
                response.data
            );

            setResponseMsg(
                "Ticket created successfully"
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
                    "Could not create ticket"
                );
            }
        } finally {
            setCreatingQueueId(null);
        }
    };

    const queueColors = [
        "border-[#d9c7ae] bg-[#fff8ea]",
        "border-[#bcd0dc] bg-[#deedf5]",
        "border-[#ded08d] bg-[#f8e9ad]",
        "border-[#bfd2bb] bg-[#e0edde]",
    ];

    return (
        <div className="mx-auto max-w-6xl py-8 sm:py-10">
            <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                        Join a queue
                    </p>

                    <h1 className="mt-1 text-4xl font-bold text-[#332c26]">
                        Get a ticket
                    </h1>

                    <p className="mt-2 text-sm text-[#746960]">
                        Choose a service, priority and queue.
                    </p>
                </div>

                <Link
                    href="/customer/tickets"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#b9a895] bg-[#fffaf0] px-5 text-sm font-bold text-[#66574d] transition hover:border-[#8f3d27] hover:text-[#8f3d27]"
                >
                    My tickets
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

            {createdTicket && (
                <section className="mb-6 rounded-[26px] border border-[#b8d0b7] bg-[#dcebd8] p-5 sm:p-6">
                    <p className="text-sm font-bold text-[#507153]">
                        Ticket created
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <p className="text-4xl font-black text-[#36583b]">
                            {createdTicket.ticketNumber}
                        </p>

                        <StatusBadge
                            status={createdTicket.status}
                        />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                        <p className="text-[#57705b]">
                            Priority:{" "}
                            <span className="font-bold capitalize">
                                {createdTicket.priority}
                            </span>
                        </p>

                        <p className="text-[#57705b]">
                            Estimated wait:{" "}
                            <span className="font-bold">
                                {createdTicket
                                    .estimatedWaitMinutes ==
                                null
                                    ? "Not available"
                                    : `${createdTicket.estimatedWaitMinutes} min`}
                            </span>
                        </p>
                    </div>

                    <Link
                        href="/customer/tickets"
                        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#5d7d5f] px-5 text-sm font-bold text-white transition hover:bg-[#4e6c50]"
                    >
                        View ticket
                    </Link>
                </section>
            )}

            <section className="mb-7 rounded-[26px] border border-[#dacbb9] bg-[#fffaf0] p-5 sm:p-6">
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="serviceFilter"
                            className="mb-2 block text-sm font-bold text-[#574d44]"
                        >
                            Service
                        </label>

                        <select
                            id="serviceFilter"
                            className="select w-full border-[#cabaa7] bg-[#fffdf8] text-[#443b34]"
                            value={serviceFilter}
                            onChange={(e) =>
                                setServiceFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                All services
                            </option>

                            {serviceOptions.map(
                                (service) => (
                                    <option
                                        key={service.id}
                                        value={service.id}
                                    >
                                        {service.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-bold text-[#574d44]">
                            Priority
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setPriority(
                                        "normal"
                                    )
                                }
                                className={`rounded-[16px] border px-4 py-3 text-left text-sm font-bold transition ${
                                    priority ==
                                    "normal"
                                        ? "border-[#90afbf] bg-[#dcebf3] text-[#405f70]"
                                        : "border-[#d4c7b8] bg-[#fffdf8] text-[#665d55] hover:bg-[#f5eee4]"
                                }`}
                            >
                                Normal
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setPriority(
                                        "urgent"
                                    )
                                }
                                className={`rounded-[16px] border px-4 py-3 text-left text-sm font-bold transition ${
                                    priority ==
                                    "urgent"
                                        ? "border-[#d9bf5d] bg-[#f7e49a] text-[#6d591d]"
                                        : "border-[#d4c7b8] bg-[#fffdf8] text-[#665d55] hover:bg-[#f5eee4]"
                                }`}
                            >
                                Urgent
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                    Available now
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#332c26]">
                    Choose a queue
                </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {filteredQueues.map(
                    (queue, index) => {
                        const isOpen =
                            queue.status ==
                            "open";

                        const isCreating =
                            creatingQueueId ==
                            queue.id;

                        return (
                            <article
                                key={queue.id}
                                className={`rounded-[24px] border p-5 ${
                                    queueColors[
                                        index %
                                            queueColors.length
                                    ]
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-[#746960]">
                                            {
                                                queue
                                                    .service
                                                    .name
                                            }
                                        </p>

                                        <h3 className="mt-1 text-2xl font-bold text-[#3e352e]">
                                            {queue.name}
                                        </h3>
                                    </div>

                                    <StatusBadge
                                        status={
                                            queue.status
                                        }
                                    />
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-[#81756b]">
                                            Location
                                        </p>

                                        <p className="mt-1 font-bold text-[#443b34]">
                                            {
                                                queue.location
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[#81756b]">
                                            Current ticket
                                        </p>

                                        <p className="mt-1 font-bold text-[#443b34]">
                                            {
                                                queue
                                                    .currentTicketNumber
                                            }
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={
                                        !isOpen ||
                                        isCreating
                                    }
                                    onClick={() =>
                                        getTicket(
                                            queue
                                        )
                                    }
                                    className="mt-5 min-h-11 w-full rounded-full bg-[#5d7d5f] px-4 text-sm font-bold text-white transition hover:bg-[#4e6c50] disabled:cursor-not-allowed disabled:bg-[#b8b1a9] disabled:text-white"
                                >
                                    {isCreating
                                        ? "Creating..."
                                        : isOpen
                                            ? "Get ticket"
                                            : "Queue closed"}
                                </button>
                            </article>
                        );
                    }
                )}
            </div>

            {filteredQueues.length ==
                0 &&
                !err && (
                    <div className="rounded-[24px] border border-dashed border-[#cdbba7] bg-[#fffaf0] p-8 text-center">
                        <p className="font-bold text-[#4b423a]">
                            No queues available.
                        </p>
                    </div>
                )}
        </div>
    );
}