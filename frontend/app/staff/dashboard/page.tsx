"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";
import Link from "next/link";

import api from "@/lib/axios";


interface Staff {

    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;

}


interface Service {

    id: number;
    name: string;

}


interface Counter {

    id: number;
    name: string;
    status: string;
    staff: Staff | null;
    services: Service[];

}


interface Ticket {

    id: number;
    status: string;

    counter: {
        id: number;
        name: string;
    } | null;

}


export default function StaffDashboard() {

    const [staff, setStaff] =
        useState<Staff | null>(
            null
        );

    const [counters, setCounters] =
        useState<Counter[]>([]);

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

                        const staffResponse =
                            await api.get<Staff>(
                                "/users/me"
                            );

                        const countersResponse =
                            await api.get<Counter[]>(
                                "/counters"
                            );

                        const ticketsResponse =
                            await api.get<Ticket[]>(
                                "/tickets"
                            );

                        setStaff(
                            staffResponse.data
                        );

                        setCounters(
                            countersResponse.data
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

                            setErr(
                                error.response
                                    .data
                                    .message
                            );

                        }

                        else {

                            setErr(
                                "Could not load staff information"
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


    const assignedCounter =
        counters.length > 0
            ? counters[0]
            : null;


    const waitingTickets =
        tickets.filter(
            (ticket) =>
                ticket.status ==
                "waiting"
        ).length;


    const calledTickets =
        assignedCounter
            ? tickets.filter(
                (ticket) =>
                    ticket.status ==
                    "called" &&
                    ticket.counter?.id ==
                    assignedCounter.id
            ).length
            : 0;


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

            <h1 className="text-3xl font-bold mb-2">
                Staff Dashboard
            </h1>

            <p className="mb-6">
                Smart Queue Management System
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
                staff &&
                <div className="card bg-base-100 shadow border mb-8">

                    <div className="card-body">

                        <h2 className="card-title">
                            Welcome, {staff.fullName}
                        </h2>

                        <p>
                            <b>Email:</b>{" "}
                            {staff.email}
                        </p>

                    </div>

                </div>
            }


            <h2 className="text-2xl font-bold mb-4">
                Assigned Counter
            </h2>


            {
                assignedCounter
                    ? (
                        <div className="card bg-base-100 shadow border">

                            <div className="card-body">

                                <h2 className="card-title">
                                    {assignedCounter.name}
                                </h2>

                                <p>
                                    <b>Status:</b>{" "}
                                    {assignedCounter.status}
                                </p>

                                <div>
                                    <b>Services:</b>

                                    <div className="flex flex-wrap gap-2 mt-2">

                                        {
                                            assignedCounter.services.map(
                                                (service) => (

                                                    <span
                                                        key={service.id}
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
                    )
                    : (
                        <div className="alert">

                            <span>
                                No counter assigned. Ask an Admin to assign you to a counter.
                            </span>

                        </div>
                    )
            }


            <div className="grid md:grid-cols-2 gap-5 mt-8">

                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Waiting Tickets
                    </div>

                    <div className="stat-value text-3xl">
                        {waitingTickets}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Called At My Counter
                    </div>

                    <div className="stat-value text-3xl">
                        {calledTickets}
                    </div>

                </div>

            </div>


            <h2 className="text-2xl font-bold mt-8 mb-4">
                Staff Actions
            </h2>


            <div className="grid md:grid-cols-3 gap-4">

                <Link
                    href="/staff/queue"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h2 className="font-bold">
                            Queue
                        </h2>

                        <p>
                            Call and complete queue tickets
                        </p>

                    </div>

                </Link>


                <Link
                    href="/staff/counter"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h2 className="font-bold">
                            Counter
                        </h2>

                        <p>
                            Manage your counter status
                        </p>

                    </div>

                </Link>


                <Link
                    href="/staff/profile"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h2 className="font-bold">
                            Profile
                        </h2>

                        <p>
                            View and update your profile
                        </p>

                    </div>

                </Link>

            </div>

        </div>
    );

}