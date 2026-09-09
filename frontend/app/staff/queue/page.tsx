"use client";

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

interface Ticket {
    id: number,
    ticketNumber: string,
    status: string,
    priority: string,
    issuedAt: string,

    user: {
        id: number,
        fullName: string
    },

    queue: {
        id: number,
        name: string
    },

    service: {
        id: number,
        name: string
    },

    counter: {
        id: number,
        name: string
    } | null
}

interface Service {
    id: number,
    name: string
}

export default function StaffQueuePage() {

    const [queues, setQueues] =
        useState<Queue[]>([]);

    const [tickets, setTickets] =
        useState<Ticket[]>([]);

    const [refresh, setRefresh] =
        useState(0);

    const [selectedQueueId, setSelectedQueueId] =
        useState("");

    const [responseMsg, setResponseMsg] =
        useState("");

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

        }, [refresh]);

        const selectedQueue =
            queues.find(
                (queue: Queue) =>
                    queue.id ==
                    Number(
                        selectedQueueId
                    )
            );

        const queueTickets =
            selectedQueueId
                ? tickets.filter(
                    (ticket: Ticket) =>
                        ticket.queue?.id ==
                        Number(
                            selectedQueueId
                        )
                )
                : [];

        const waitingTickets =
            queueTickets.filter(
                (ticket: Ticket) =>
                    ticket.status == "waiting"
            );

        const calledTicket =
            queueTickets.find(
                (ticket: Ticket) =>
                    ticket.status == "called"
            );

        const callNext = () => {

            if (!selectedQueueId) {

                setErr(
                    "Please select a queue"
                );

                return;

            }

            const callNextTicket = async () => {

                const token =
                    localStorage.getItem(
                        "access_token"
                    );

                try {

                    await axios.patch(
                        `http://localhost:3000/tickets/queue/${selectedQueueId}/next`,
                        {},
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                    setResponseMsg(
                        "Next ticket called successfully"
                    );

                    setErr("");

                    setRefresh(
                        refresh + 1
                    );

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
                            "Could not call next ticket"
                        );

                    }

                }

            }

            callNextTicket();

        }

        const completeTicket = (
            id: number
        ) => {

            const completeData = async () => {

                const token =
                    localStorage.getItem(
                        "access_token"
                    );

                try {

                    await axios.patch(
                        `http://localhost:3000/tickets/${id}/complete`,
                        {},
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                    setResponseMsg(
                        "Ticket completed successfully"
                    );

                    setErr("");

                    setRefresh(
                        refresh + 1
                    );

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
                            "Could not complete ticket"
                        );

                    }

                }

            }

            completeData();

        }

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Queue Management
            </h1>

            <p className="mb-6">
                Manage queue operations
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
                queues.length == 0 &&
                !err &&

                <p>
                    No queues found
                </p>
            }

            <div className="card bg-base-100 shadow border mb-6">

                <div className="card-body">

                    <label className="label">
                        Select Queue
                    </label>

                    <select
                        className="select select-bordered max-w-md"
                        value={selectedQueueId}
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
                            queues &&
                            queues.map(
                                (queue: Queue) => (

                                    <option
                                        key={queue.id}
                                        value={queue.id}
                                    >
                                        {queue.name}
                                    </option>

                                )
                            )
                        }

                    </select>

                </div>

            </div>

            <div className="grid md:grid-cols-2 gap-5">

                {
                    
                    selectedQueue &&

                    <div className="card bg-base-100 shadow border mb-6">

                        <div className="card-body">

                            <h2 className="card-title">
                                {selectedQueue.name}
                            </h2>

                            <p>
                                Service:{" "}
                                {selectedQueue.service?.name}
                            </p>

                            <p>
                                Location:{" "}
                                {selectedQueue.location}
                            </p>

                            <p>
                                Status:{" "}
                                {selectedQueue.status}
                            </p>

                            <p>
                                Waiting Tickets:{" "}
                                {waitingTickets.length}
                            </p>

                            <p>
                                Current Called Ticket:{" "}
                                {
                                    calledTicket
                                        ? calledTicket.ticketNumber
                                        : "None"
                                }
                            </p>

                            <button
                                className="btn btn-primary mt-4"
                                onClick={callNext}
                                disabled={
                                    waitingTickets.length == 0
                                }
                            >
                                Call Next
                            </button>

                            {
                                calledTicket &&

                                <button
                                    className="btn btn-success mt-4 ml-2"
                                    onClick={
                                        () =>
                                            completeTicket(
                                                calledTicket.id
                                            )
                                    }
                                >
                                    Complete {
                                        calledTicket.ticketNumber
                                    }
                                </button>
                            }

                        </div>

                    </div>
                }

                {
                    selectedQueueId &&

                    <div className="overflow-x-auto">

                        <table className="table table-zebra">

                            <thead>

                                <tr>
                                    <th>Ticket</th>
                                    <th>Customer</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {
                                    queueTickets.map(
                                        (ticket: Ticket) => (

                                            <tr key={ticket.id}>

                                                <td>
                                                    {ticket.ticketNumber}
                                                </td>

                                                <td>
                                                    {ticket.user?.fullName}
                                                </td>

                                                <td>
                                                    {ticket.priority}
                                                </td>

                                                <td>
                                                    {ticket.status}
                                                </td>

                                            </tr>

                                        )
                                    )
                                }

                            </tbody>

                        </table>

                    </div>
                }

            </div>
        </div>
    )
}