"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import Link from "next/link";

import api from "@/lib/axios";


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

    const [queues, setQueues] =
        useState<Queue[]>([]);

    const [priority, setPriority] =
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

    const [err, setErr] =
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
                    (queue) => [
                        queue.service.id,
                        queue.service,
                    ]
                )
            ).values()
        );


    const filteredQueues =
        serviceFilter
            ? queues.filter(
                (queue) =>
                    queue.service.id ==
                    Number(
                        serviceFilter
                    )
            )
            : queues;


    const getTicket =
        async (
            queue: Queue
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
        <div className="max-w-6xl mx-auto py-8">

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

                <div>

                    <h1 className="text-3xl font-bold">
                        Available Queues
                    </h1>

                    <p>
                        Choose an open queue and get your ticket.
                    </p>

                </div>


                <Link
                    href="/customer/tickets"
                    className="btn btn-outline"
                >
                    My Tickets
                </Link>

            </div>


            {
                responseMsg &&
                <div className="alert alert-success mb-4">

                    <span>
                        {responseMsg}
                    </span>

                </div>
            }


            {
                err &&
                <div className="alert alert-error mb-4">

                    <span>
                        {err}
                    </span>

                </div>
            }


            {
                createdTicket &&
                <div className="card bg-base-100 shadow border mb-6">

                    <div className="card-body">

                        <h2 className="card-title">
                            Your Ticket
                        </h2>

                        <p className="text-3xl font-bold">
                            {
                                createdTicket
                                    .ticketNumber
                            }
                        </p>

                        <p>
                            Status:{" "}
                            {
                                createdTicket
                                    .status
                            }
                        </p>

                        <p>
                            Priority:{" "}
                            {
                                createdTicket
                                    .priority
                            }
                        </p>

                        <p>
                            Estimated Wait:{" "}
                            {
                                createdTicket
                                    .estimatedWaitMinutes
                                    === null
                                    ? "Not available"
                                    : `${createdTicket.estimatedWaitMinutes} minutes`
                            }
                        </p>


                        <div className="card-actions mt-3">

                            <Link
                                href="/customer/tickets"
                                className="btn btn-primary"
                            >
                                View My Tickets
                            </Link>

                        </div>

                    </div>

                </div>
            }


            <div className="card bg-base-100 shadow border mb-6">

                <div className="card-body">

                    <h2 className="font-bold">
                        Ticket Options
                    </h2>


                    <div className="grid md:grid-cols-2 gap-4">

                        <div>

                            <label className="label">
                                Filter by Service
                            </label>

                            <select
                                className="select select-bordered w-full"
                                value={
                                    serviceFilter
                                }
                                onChange={
                                    (e) =>
                                        setServiceFilter(
                                            e.target.value
                                        )
                                }
                            >

                                <option value="">
                                    All Services
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
                                                    service.name
                                                }
                                            </option>

                                        )
                                    )
                                }

                            </select>

                        </div>


                        <div>

                            <label className="label">
                                Priority
                            </label>

                            <select
                                className="select select-bordered w-full"
                                value={priority}
                                onChange={
                                    (e) =>
                                        setPriority(
                                            e.target.value as
                                            "normal" |
                                            "urgent"
                                        )
                                }
                            >

                                <option value="normal">
                                    Normal
                                </option>

                                <option value="urgent">
                                    Urgent
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>


            <div className="overflow-x-auto">

                <table className="table table-zebra">

                    <thead>

                        <tr>
                            <th>Queue</th>
                            <th>Service</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Current Ticket</th>
                            <th>Action</th>
                        </tr>

                    </thead>


                    <tbody>

                        {
                            filteredQueues.map(
                                (queue) => (

                                    <tr
                                        key={
                                            queue.id
                                        }
                                    >

                                        <td>
                                            {
                                                queue.name
                                            }
                                        </td>

                                        <td>
                                            {
                                                queue
                                                    .service
                                                    ?.name
                                            }
                                        </td>

                                        <td>
                                            {
                                                queue.location
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    queue.status ==
                                                    "open"
                                                        ? "badge badge-success"
                                                        : "badge badge-error"
                                                }
                                            >
                                                {
                                                    queue.status
                                                }
                                            </span>

                                        </td>

                                        <td>
                                            {
                                                queue
                                                    .currentTicketNumber
                                            }
                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-primary btn-sm"
                                                disabled={
                                                    queue.status !=
                                                    "open" ||
                                                    creatingQueueId ==
                                                    queue.id
                                                }
                                                onClick={
                                                    () =>
                                                        getTicket(
                                                            queue
                                                        )
                                                }
                                            >

                                                {
                                                    creatingQueueId ==
                                                    queue.id
                                                        ? "Creating..."
                                                        : "Get Ticket"
                                                }

                                            </button>

                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>

            </div>


            {
                filteredQueues.length ===
                    0 &&
                !err &&
                <p className="mt-4">
                    No queues available.
                </p>
            }

        </div>
    );

}