"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import Link from "next/link";

import api from "@/lib/axios";

import StatusBadge from
    "@/components/ui/StatusBadge";


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

    estimatedWaitMinutes:
        number | null;

}


export default function QueuesPage() {

    const [
        queues,
        setQueues
    ] =
        useState<Queue[]>(
            []
        );


    const [
        priority,
        setPriority
    ] =
        useState<
            "normal" |
            "urgent"
        >(
            "normal"
        );


    const [
        serviceFilter,
        setServiceFilter
    ] =
        useState("");


    const [
        createdTicket,
        setCreatedTicket
    ] =
        useState<CreatedTicket | null>(
            null
        );


    const [
        creatingQueueId,
        setCreatingQueueId
    ] =
        useState<number | null>(
            null
        );


    const [
        err,
        setErr
    ] =
        useState("");


    const [
        responseMsg,
        setResponseMsg
    ] =
        useState("");


    useEffect(
        () => {

            const getQueues =
                async () => {

                    try {

                        const response =
                            await api.get<Queue[]>(
                                "/queues"
                            );


                        setQueues(
                            response.data
                        );


                        setErr("");

                    }

                    catch (error) {

                        if (
                            axios.isAxiosError(
                                error
                            ) &&
                            error.response
                                ?.data
                                ?.message
                        ) {

                            setErr(
                                error.response
                                    .data
                                    .message
                            );

                        }

                        else {

                            setErr(
                                "Could not load queues"
                            );

                        }

                    }

                };


            getQueues();

        },
        []
    );


    const serviceOptions =
        Array.from(
            new Map(
                queues.map(
                    (
                        queue
                    ) => [
                        queue.service.id,
                        queue.service,
                    ]
                )
            ).values()
        );


    const filteredQueues =
        serviceFilter
            ? queues.filter(
                (
                    queue
                ) =>
                    queue.service.id ==
                    Number(
                        serviceFilter
                    )
            )
            : queues;


    const getTicket =
        async (
            queue:
                Queue
        ) => {

            setErr("");

            setResponseMsg("");

            setCreatedTicket(
                null
            );

            setCreatingQueueId(
                queue.id
            );


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

            }

            catch (error) {

                if (
                    axios.isAxiosError(
                        error
                    ) &&
                    error.response
                        ?.data
                        ?.message
                ) {

                    setErr(
                        error.response
                            .data
                            .message
                    );

                }

                else {

                    setErr(
                        "Could not create ticket"
                    );

                }

            }

            finally {

                setCreatingQueueId(
                    null
                );

            }

        };


    return (
        <div className="sq-page">

            <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <h1 className="sq-title">
                        Get a ticket
                    </h1>

                    <p className="sq-subtitle">
                        Choose a service and an open queue.
                    </p>

                </div>


                <Link
                    href="/customer/tickets"
                    className="sq-secondary"
                >
                    My tickets
                </Link>

            </header>


            {
                responseMsg &&
                <div className="alert alert-success mb-5">

                    <span>
                        {responseMsg}
                    </span>

                </div>
            }


            {
                err &&
                <div className="alert alert-error mb-5">

                    <span>
                        {err}
                    </span>

                </div>
            }


            {
                createdTicket &&
                <section className="sq-panel sq-mint mb-6 p-5 sm:p-6">

                    <p className="text-sm font-bold text-[#557563]">
                        Ticket created
                    </p>


                    <div className="mt-2 flex flex-wrap items-center gap-3">

                        <p className="text-4xl font-black text-[#3f5f4d]">
                            {
                                createdTicket
                                    .ticketNumber
                            }
                        </p>


                        <StatusBadge
                            status={
                                createdTicket
                                    .status
                            }
                        />

                    </div>


                    <p className="mt-3 text-sm font-semibold text-[#5f7567]">

                        Priority:{" "}

                        <span className="capitalize">
                            {
                                createdTicket
                                    .priority
                            }
                        </span>

                        {" · "}

                        Wait:{" "}

                        {
                            createdTicket
                                .estimatedWaitMinutes ==
                            null
                                ? "Not available"
                                : `${createdTicket.estimatedWaitMinutes} min`
                        }

                    </p>

                </section>
            }


            <section className="sq-panel mb-6 p-5">

                <div className="grid gap-4 md:grid-cols-2">

                    <div>

                        <label
                            htmlFor="serviceFilter"
                            className="sq-label"
                        >
                            Service
                        </label>


                        <select
                            id="serviceFilter"
                            className="select w-full"
                            value={
                                serviceFilter
                            }
                            onChange={
                                (
                                    e
                                ) =>
                                    setServiceFilter(
                                        e.target
                                            .value
                                    )
                            }
                        >

                            <option value="">
                                All services
                            </option>


                            {
                                serviceOptions.map(
                                    (
                                        service
                                    ) => (
                                        <option
                                            key={
                                                service.id
                                            }
                                            value={
                                                service.id
                                            }
                                        >
                                            {
                                                service
                                                    .name
                                            }
                                        </option>
                                    )
                                )
                            }

                        </select>

                    </div>


                    <div>

                        <p className="sq-label">
                            Priority
                        </p>


                        <div className="grid grid-cols-2 gap-3">

                            <button
                                type="button"
                                onClick={
                                    () =>
                                        setPriority(
                                            "normal"
                                        )
                                }
                                className={
                                    `rounded-[16px] border px-4 py-3 text-left font-bold ${
                                        priority ==
                                        "normal"
                                            ? "border-[#b9a9df] bg-[#ece5ff] text-[#5c507d]"
                                            : "border-[#ddd4e7] bg-white/70 text-[#6f6877]"
                                    }`
                                }
                            >
                                Normal
                            </button>


                            <button
                                type="button"
                                onClick={
                                    () =>
                                        setPriority(
                                            "urgent"
                                        )
                                }
                                className={
                                    `rounded-[16px] border px-4 py-3 text-left font-bold ${
                                        priority ==
                                        "urgent"
                                            ? "border-[#e2c86e] bg-[#fff2ba] text-[#756022]"
                                            : "border-[#ddd4e7] bg-white/70 text-[#6f6877]"
                                    }`
                                }
                            >
                                Urgent
                            </button>

                        </div>

                    </div>

                </div>

            </section>


            <div className="grid gap-4 md:grid-cols-2">

                {
                    filteredQueues.map(
                        (
                            queue,
                            index
                        ) => {

                            const isOpen =
                                queue.status ==
                                "open";


                            const isCreating =
                                creatingQueueId ==
                                queue.id;


                            const tone =
                                index %
                                4 ==
                                0
                                    ? "sq-lavender"
                                    : index %
                                        4 ==
                                        1
                                        ? "sq-orange"
                                        : index %
                                            4 ==
                                            2
                                            ? "sq-blue"
                                            : "sq-mint";


                            return (
                                <article
                                    key={
                                        queue.id
                                    }
                                    className={`sq-panel ${tone} p-5`}
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <p className="text-sm font-bold text-[#756f7d]">
                                                {
                                                    queue
                                                        .service
                                                        .name
                                                }
                                            </p>

                                            <h2 className="mt-1 text-2xl font-bold">
                                                {
                                                    queue
                                                        .name
                                                }
                                            </h2>

                                        </div>


                                        <StatusBadge
                                            status={
                                                queue
                                                    .status
                                            }
                                        />

                                    </div>


                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

                                        <div>

                                            <p className="text-[#81798b]">
                                                Location
                                            </p>

                                            <p className="font-bold">
                                                {
                                                    queue
                                                        .location
                                                }
                                            </p>

                                        </div>


                                        <div>

                                            <p className="text-[#81798b]">
                                                Current
                                            </p>

                                            <p className="font-bold">
                                                {
                                                    queue
                                                        .currentTicketNumber
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        className="sq-primary mt-5 w-full disabled:cursor-not-allowed disabled:border-[#cfc9d4] disabled:bg-[#dcd7df]"
                                        disabled={
                                            !isOpen ||
                                            isCreating
                                        }
                                        onClick={
                                            () =>
                                                getTicket(
                                                    queue
                                                )
                                        }
                                    >
                                        {
                                            isCreating
                                                ? "Creating..."
                                                : isOpen
                                                    ? "Get ticket"
                                                    : "Queue closed"
                                        }
                                    </button>

                                </article>
                            );

                        }
                    )
                }

            </div>


            {
                filteredQueues.length ==
                    0 &&
                !err &&
                <div className="sq-panel sq-lavender p-6 text-center font-semibold">
                    No queues available.
                </div>
            }

        </div>
    );

}