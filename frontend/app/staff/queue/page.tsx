"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import api from "@/lib/axios";


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
        useState<Counter | null>(
            null
        );

    const [queues, setQueues] =
        useState<Queue[]>([]);

    const [tickets, setTickets] =
        useState<Ticket[]>([]);

    const [
        selectedQueueId,
        setSelectedQueueId
    ] =
        useState("");

    const [refresh, setRefresh] =
        useState(0);

    const [
        responseMsg,
        setResponseMsg
    ] =
        useState("");

    const [err, setErr] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [
        actionLoading,
        setActionLoading
    ] =
        useState(false);


    useEffect(
        () => {

            const getData =
                async () => {

                    setLoading(
                        true
                    );


                    try {

                        const countersResponse =
                            await api.get<Counter[]>(
                                "/counters"
                            );


                        const assignedCounter =
                            countersResponse.data.length > 0
                                ? countersResponse.data[0]
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
                                            queue.id ==
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

                            const message =
                                error.response
                                    .data
                                    .message;


                            setErr(
                                Array.isArray(
                                    message
                                )
                                    ? message.join(
                                        ", "
                                    )
                                    : message
                            );

                        }

                        else {

                            setErr(
                                "Could not load queue information"
                            );

                        }

                    }

                    finally {

                        setLoading(
                            false
                        );

                    }

                };


            getData();

        },
        [refresh]
    );


    const selectedQueue =
        queues.find(
            (queue) =>
                queue.id ==
                Number(
                    selectedQueueId
                )
        );


    const queueTickets =
        selectedQueueId
            ? tickets.filter(
                (ticket) =>
                    ticket.queue?.id ==
                    Number(
                        selectedQueueId
                    )
            )
            : [];


    const waitingTickets =
        queueTickets.filter(
            (ticket) =>
                ticket.status ==
                "waiting"
        );


    const calledTicket =
        counter
            ? tickets.find(
                (ticket) =>
                    ticket.status ==
                    "called" &&
                    ticket.counter?.id ==
                    counter.id
            )
            : undefined;


    const callNext =
        async () => {

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
                    (value) =>
                        value + 1
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

                    const message =
                        error.response
                            .data
                            .message;


                    setErr(
                        Array.isArray(
                            message
                        )
                            ? message.join(
                                ", "
                            )
                            : message
                    );

                }

                else {

                    setErr(
                        "Could not call next ticket"
                    );

                }

            }

            finally {

                setActionLoading(
                    false
                );

            }

        };


    const completeTicket =
        async (
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
                    (value) =>
                        value + 1
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

                    const message =
                        error.response
                            .data
                            .message;


                    setErr(
                        Array.isArray(
                            message
                        )
                            ? message.join(
                                ", "
                            )
                            : message
                    );

                }

                else {

                    setErr(
                        "Could not complete ticket"
                    );

                }

            }

            finally {

                setActionLoading(
                    false
                );

            }

        };


    const updateQueueStatus =
        async (
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
                    (value) =>
                        value + 1
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

                    const message =
                        error.response
                            .data
                            .message;


                    setErr(
                        Array.isArray(
                            message
                        )
                            ? message.join(
                                ", "
                            )
                            : message
                    );

                }

                else {

                    setErr(
                        "Could not update queue status"
                    );

                }

            }

        };


    if (loading) {

        return (
            <div className="flex items-center justify-center p-10">

                <span className="loading loading-spinner"></span>

                <span className="ml-3">
                    Loading queues...
                </span>

            </div>
        );

    }


    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Queue Management
            </h1>


            <p className="mb-6">
                Manage queues supported by your assigned counter.
            </p>


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
                !counter &&
                <div className="alert mb-6">

                    <span>
                        No counter assigned. Ask an Admin to assign you to a counter first.
                    </span>

                </div>
            }


            {
                counter &&
                <div className="card bg-base-100 shadow border mb-6">

                    <div className="card-body">

                        <h2 className="card-title">
                            {counter.name}
                        </h2>


                        <p>
                            <b>
                                Counter Status:
                            </b>{" "}
                            {counter.status}
                        </p>


                        <div>

                            <b>
                                Supported Services:
                            </b>


                            <div className="flex flex-wrap gap-2 mt-2">

                                {
                                    counter.services.map(
                                        (service) => (

                                            <span
                                                key={
                                                    service.id
                                                }
                                                className="badge badge-outline"
                                            >
                                                {service.name}
                                            </span>

                                        )
                                    )
                                }

                            </div>

                        </div>

                    </div>

                </div>
            }


            {
                counter &&
                <div className="card bg-base-100 shadow border mb-6">

                    <div className="card-body">

                        <label className="label">
                            Select Supported Queue
                        </label>


                        <select
                            className="select select-bordered max-w-md"
                            value={
                                selectedQueueId
                            }
                            onChange={
                                (e) =>
                                    setSelectedQueueId(
                                        e.target.value
                                    )
                            }
                        >

                            <option value="">
                                Select Queue
                            </option>


                            {
                                queues.map(
                                    (queue) => (

                                        <option
                                            key={
                                                queue.id
                                            }
                                            value={
                                                queue.id
                                            }
                                        >
                                            {queue.name} - {queue.service.name}
                                        </option>

                                    )
                                )
                            }

                        </select>


                        {
                            queues.length ==
                                0 &&
                            <p className="mt-3">
                                No queues are available for your counter services.
                            </p>
                        }

                    </div>

                </div>
            }


            {
                calledTicket &&
                <div className="card bg-base-100 shadow border mb-6">

                    <div className="card-body">

                        <h2 className="card-title">
                            Current Called Ticket
                        </h2>


                        <p className="text-3xl font-bold">
                            {
                                calledTicket
                                    .ticketNumber
                            }
                        </p>


                        <p>
                            <b>Queue:</b>{" "}
                            {
                                calledTicket
                                    .queue
                                    .name
                            }
                        </p>


                        <p>
                            <b>Customer:</b>{" "}
                            {
                                calledTicket
                                    .user
                                    .fullName
                            }
                        </p>


                        <button
                            className="btn btn-success mt-3"
                            onClick={
                                () =>
                                    completeTicket(
                                        calledTicket.id
                                    )
                            }
                            disabled={
                                actionLoading
                            }
                        >

                            {
                                actionLoading
                                    ? "Processing..."
                                    : `Complete ${calledTicket.ticketNumber}`
                            }

                        </button>

                    </div>

                </div>
            }


            {
                selectedQueue &&
                <div className="grid lg:grid-cols-2 gap-5">

                    <div className="card bg-base-100 shadow border">

                        <div className="card-body">

                            <h2 className="card-title">
                                {
                                    selectedQueue
                                        .name
                                }
                            </h2>


                            <p>
                                <b>Service:</b>{" "}
                                {
                                    selectedQueue
                                        .service
                                        .name
                                }
                            </p>


                            <p>
                                <b>Location:</b>{" "}
                                {
                                    selectedQueue
                                        .location
                                }
                            </p>


                            <p>
                                <b>
                                    Queue Status:
                                </b>{" "}
                                {
                                    selectedQueue
                                        .status
                                }
                            </p>


                            <p>
                                <b>
                                    Waiting Tickets:
                                </b>{" "}
                                {
                                    waitingTickets
                                        .length
                                }
                            </p>


                            {
                                counter?.status !=
                                    "open" &&
                                <div className="alert alert-warning mt-3">

                                    <span>
                                        Open your counter before calling the next ticket.
                                    </span>

                                </div>
                            }


                            {
                                selectedQueue.status !=
                                    "open" &&
                                <div className="alert alert-warning mt-3">

                                    <span>
                                        Open this queue before calling the next ticket.
                                    </span>

                                </div>
                            }


                            {
                                calledTicket &&
                                <div className="alert alert-info mt-3">

                                    <span>
                                        Complete {calledTicket.ticketNumber} before calling another ticket.
                                    </span>

                                </div>
                            }


                            <button
                                className="btn btn-primary mt-4"
                                onClick={
                                    callNext
                                }
                                disabled={
                                    actionLoading ||
                                    counter?.status !=
                                    "open" ||
                                    selectedQueue.status !=
                                    "open" ||
                                    waitingTickets.length ==
                                    0 ||
                                    !!calledTicket
                                }
                            >

                                {
                                    actionLoading
                                        ? "Processing..."
                                        : "Call Next"
                                }

                            </button>


                            <div className="mt-4">

                                <label className="label">
                                    Queue Status
                                </label>


                                <select
                                    className="select select-bordered"
                                    value={
                                        selectedQueue
                                            .status
                                    }
                                    onChange={
                                        (e) =>
                                            updateQueueStatus(
                                                selectedQueue.id,
                                                e.target.value
                                            )
                                    }
                                >

                                    <option value="open">
                                        Open
                                    </option>

                                    <option value="closed">
                                        Closed
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="table table-zebra">

                            <thead>

                                <tr>
                                    <th>Ticket</th>
                                    <th>Customer</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Counter</th>
                                </tr>

                            </thead>


                            <tbody>

                                {
                                    queueTickets.map(
                                        (ticket) => (

                                            <tr
                                                key={
                                                    ticket.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        ticket
                                                            .ticketNumber
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
                                                    {
                                                        ticket
                                                            .priority
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        ticket
                                                            .status
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        ticket
                                                            .counter
                                                            ?.name ||
                                                        "-"
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )
                                }

                            </tbody>

                        </table>


                        {
                            queueTickets.length ==
                                0 &&
                            <p className="mt-4">
                                No tickets found for this queue.
                            </p>
                        }

                    </div>

                </div>
            }

        </div>
    );

}