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

interface Queue {
    id: number,
    name: string
}

export default function AdminTicketsPage() {

    const [tickets, setTickets] =
        useState<Ticket[]>([]);

    const [err, setErr] =
        useState("");

    const [status, setStatus] =
    useState("");


    const [queues, setQueues] =
    useState<Queue[]>([]);

    const [queueId, setQueueId] =
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

        }

        catch {

            setErr(
                "Could not load queues"
            );

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

                let url =
    "http://localhost:3000/tickets?";

if (status) {

    url =
        url +
        `status=${status}&`;

}

if (queueId) {

    url =
        url +
        `queueId=${queueId}&`;



}

const response =
    await axios.get<Ticket[]>(
        url,
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

    }, [status, queueId]);

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

            

            <div className="card bg-base-100 shadow border mb-6">

    <div className="card-body">

        <label className="label">
            Status
        </label>

        <select
            className="select select-bordered max-w-sm"
            value={status}
            onChange={
                (e) =>
                    setStatus(
                        e.target.value
                    )
            }
        >

            <option value="">
                All Statuses
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


        <label className="label mt-4">
    Queue
</label>

<select
    className="select select-bordered max-w-sm"
    value={queueId}
    onChange={
        (e) =>
            setQueueId(
                e.target.value
            )
    }
>

    <option value="">
        All Queues
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