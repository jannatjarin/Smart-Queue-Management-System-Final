"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";
import Link from "next/link";

import api from "@/lib/axios";


interface UserData {

    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;

}


interface Ticket {

    id: number;
    ticketNumber: string;
    status: string;
    priority: string;
    issuedAt: string;
    estimatedWaitMinutes:
        number | null;

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


export default function CustomerDashboard() {

    const [user, setUser] =
        useState<UserData | null>(
            null
        );

    const [tickets, setTickets] =
        useState<Ticket[]>([]);

    const [err, setErr] =
        useState("");

    const [loading, setLoading] =
        useState(true);


    useEffect(
        () => {

            const loadDashboard =
                async () => {

                    try {

                        const userResponse =
                            await api.get<UserData>(
                                "/users/me"
                            );


                        setUser(
                            userResponse.data
                        );


                        const ticketsResponse =
                            await api.get<Ticket[]>(
                                "/tickets/mytickets"
                            );


                        setTickets(
                            ticketsResponse.data
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
                                "Could not load dashboard information"
                            );

                        }

                    }

                    finally {

                        setLoading(
                            false
                        );

                    }

                };


            loadDashboard();

        },
        []
    );


    const waitingCount =
        tickets.filter(
            (ticket) =>
                ticket.status ==
                "waiting"
        ).length;


    const calledCount =
        tickets.filter(
            (ticket) =>
                ticket.status ==
                "called"
        ).length;


    const completedCount =
        tickets.filter(
            (ticket) =>
                ticket.status ==
                "completed"
        ).length;


    const activeCount =
        waitingCount +
        calledCount;


    const activeTicket =
        tickets.find(
            (ticket) =>
                ticket.status ==
                "called"
        ) ||
        tickets.find(
            (ticket) =>
                ticket.status ==
                "waiting"
        ) ||
        null;


    const recentActivity =
        tickets.slice(
            0,
            5
        );


    if (loading) {

        return (
            <div className="flex items-center justify-center p-10">

                <span className="loading loading-spinner"></span>

                <span className="ml-3">
                    Loading dashboard...
                </span>

            </div>
        );

    }


    return (
        <div className="max-w-6xl mx-auto py-8">

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Customer Dashboard
                </h1>

                <p>
                    Welcome to your SQMS account.
                </p>

            </div>


            {
                err &&
                <div className="alert alert-error mb-5">

                    <span>
                        {err}
                    </span>

                </div>
            }


            {
                user &&
                <div className="card bg-base-100 shadow-md border mb-8">

                    <div className="card-body">

                        <h2 className="card-title">
                            Welcome, {user.fullName}
                        </h2>


                        <p>
                            <b>Email:</b>{" "}
                            {user.email}
                        </p>


                        <p>
                            <b>Phone:</b>{" "}
                            {
                                user.phone ||
                                "Not provided"
                            }
                        </p>

                    </div>

                </div>
            }


            <h2 className="text-xl font-bold mb-4">
                Ticket Summary
            </h2>


            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Total Tickets
                    </div>

                    <div className="stat-value text-2xl">
                        {tickets.length}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Active
                    </div>

                    <div className="stat-value text-2xl">
                        {activeCount}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Waiting
                    </div>

                    <div className="stat-value text-2xl">
                        {waitingCount}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Completed
                    </div>

                    <div className="stat-value text-2xl">
                        {completedCount}
                    </div>

                </div>

            </div>


            <h2 className="text-xl font-bold mb-4">
                Current Active Ticket
            </h2>


            {
                activeTicket
                    ? (
                        <div className="card bg-base-100 shadow border mb-8">

                            <div className="card-body">

                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">

                                    <div>

                                        <h3 className="card-title text-2xl">
                                            {
                                                activeTicket
                                                    .ticketNumber
                                            }
                                        </h3>


                                        <p>
                                            <b>Service:</b>{" "}
                                            {
                                                activeTicket
                                                    .service
                                                    .name
                                            }
                                        </p>


                                        <p>
                                            <b>Queue:</b>{" "}
                                            {
                                                activeTicket
                                                    .queue
                                                    .name
                                            }
                                        </p>


                                        <p>
                                            <b>Status:</b>{" "}
                                            {
                                                activeTicket
                                                    .status
                                            }
                                        </p>


                                        <p>
                                            <b>Priority:</b>{" "}
                                            {
                                                activeTicket
                                                    .priority
                                            }
                                        </p>


                                        <p>
                                            <b>Counter:</b>{" "}
                                            {
                                                activeTicket
                                                    .counter
                                                    ?.name ||
                                                "Not assigned yet"
                                            }
                                        </p>


                                        {
                                            activeTicket.status ==
                                                "waiting" &&
                                            <p>
                                                <b>
                                                    Estimated Wait:
                                                </b>{" "}

                                                {
                                                    activeTicket
                                                        .estimatedWaitMinutes ==
                                                        null
                                                        ? "Not available"
                                                        : `${activeTicket.estimatedWaitMinutes} minutes`
                                                }

                                            </p>
                                        }

                                    </div>


                                    <Link
                                        href="/customer/tickets"
                                        className="btn btn-outline"
                                    >
                                        View Ticket Details
                                    </Link>

                                </div>

                            </div>

                        </div>
                    )
                    : (
                        <div className="alert mb-8">

                            <span>
                                You do not have an active ticket right now.
                            </span>

                        </div>
                    )
            }


            <h2 className="text-xl font-bold mb-4">
                Recent Activity
            </h2>


            <div className="card bg-base-100 shadow border mb-8">

                <div className="card-body">

                    {
                        recentActivity.length ==
                            0
                            ? (
                                <p>
                                    No ticket activity yet.
                                </p>
                            )
                            : (
                                <div className="overflow-x-auto">

                                    <table className="table table-zebra">

                                        <thead>

                                            <tr>
                                                <th>Ticket</th>
                                                <th>Queue</th>
                                                <th>Status</th>
                                                <th>Time</th>
                                            </tr>

                                        </thead>


                                        <tbody>

                                            {
                                                recentActivity.map(
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
                                                                        .queue
                                                                        .name
                                                                }
                                                            </td>

                                                            <td>

                                                                <span className="badge badge-outline">
                                                                    {
                                                                        ticket
                                                                            .status
                                                                    }
                                                                </span>

                                                            </td>

                                                            <td>
                                                                {
                                                                    new Date(
                                                                        ticket
                                                                            .issuedAt
                                                                    )
                                                                        .toLocaleString()
                                                                }
                                                            </td>

                                                        </tr>

                                                    )
                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>
                            )
                    }

                </div>

            </div>


            <h2 className="text-xl font-bold mb-4">
                Quick Actions
            </h2>


            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">

                <Link
                    href="/services"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            Services
                        </h3>

                        <p>
                            View available services
                        </p>

                    </div>

                </Link>


                <Link
                    href="/customer/queues"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            Get Ticket
                        </h3>

                        <p>
                            Join an available queue
                        </p>

                    </div>

                </Link>


                <Link
                    href="/customer/tickets"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            My Tickets
                        </h3>

                        <p>
                            View and manage tickets
                        </p>

                    </div>

                </Link>


                <Link
                    href="/customer/notifications"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            Notifications
                        </h3>

                        <p>
                            View ticket updates
                        </p>

                    </div>

                </Link>


                <Link
                    href="/customer/profile"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            Profile
                        </h3>

                        <p>
                            View and update profile
                        </p>

                    </div>

                </Link>

            </div>

        </div>
    );

}