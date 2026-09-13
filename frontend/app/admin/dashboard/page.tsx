"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";
import Link from "next/link";

import api from "@/lib/axios";


interface User {

    id: number;
    role: string;

}


interface UsersResponse {

    data: User[];
    total: number;
    page: number;
    limit: number;

}


interface Service {

    id: number;
    name: string;

}


interface Queue {

    id: number;
    name: string;

}


interface Counter {

    id: number;
    name: string;

}


interface Ticket {

    id: number;
    status: string;

}


interface DashboardStats {

    users: number;
    admins: number;
    customers: number;
    staff: number;
    services: number;
    queues: number;
    counters: number;
    waiting: number;
    called: number;
    completed: number;

}


export default function AdminDashboard() {

    const [stats, setStats] =
        useState<DashboardStats>(
            {
                users: 0,
                admins: 0,
                customers: 0,
                staff: 0,
                services: 0,
                queues: 0,
                counters: 0,
                waiting: 0,
                called: 0,
                completed: 0,
            }
        );

    const [err, setErr] =
        useState("");

    const [loading, setLoading] =
        useState(true);


    useEffect(
        () => {

            const getDashboardData =
                async () => {

                    try {

                        const usersResponse =
                            await api.get<UsersResponse>(
                                "/users?limit=1"
                            );


                        const adminResponse =
                            await api.get<UsersResponse>(
                                "/users?role=admin&limit=1"
                            );


                        const customerResponse =
                            await api.get<UsersResponse>(
                                "/users?role=customer&limit=1"
                            );


                        const staffResponse =
                            await api.get<UsersResponse>(
                                "/users?role=staff&limit=1"
                            );


                        const servicesResponse =
                            await api.get<Service[]>(
                                "/services?includeInactive=true"
                            );


                        const queuesResponse =
                            await api.get<Queue[]>(
                                "/queues"
                            );


                        const countersResponse =
                            await api.get<Counter[]>(
                                "/counters"
                            );


                        const ticketsResponse =
                            await api.get<Ticket[]>(
                                "/tickets"
                            );


                        const waiting =
                            ticketsResponse.data.filter(
                                (ticket) =>
                                    ticket.status ==
                                    "waiting"
                            ).length;


                        const called =
                            ticketsResponse.data.filter(
                                (ticket) =>
                                    ticket.status ==
                                    "called"
                            ).length;


                        const completed =
                            ticketsResponse.data.filter(
                                (ticket) =>
                                    ticket.status ==
                                    "completed"
                            ).length;


                        setStats(
                            {
                                users:
                                    usersResponse
                                        .data
                                        .total,

                                admins:
                                    adminResponse
                                        .data
                                        .total,

                                customers:
                                    customerResponse
                                        .data
                                        .total,

                                staff:
                                    staffResponse
                                        .data
                                        .total,

                                services:
                                    servicesResponse
                                        .data
                                        .length,

                                queues:
                                    queuesResponse
                                        .data
                                        .length,

                                counters:
                                    countersResponse
                                        .data
                                        .length,

                                waiting,

                                called,

                                completed,
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
                                "Could not load dashboard data"
                            );

                        }

                    }

                    finally {

                        setLoading(
                            false
                        );

                    }

                };


            getDashboardData();

        },
        []
    );


    const maxUserCount =
        Math.max(
            stats.admins,
            stats.staff,
            stats.customers,
            1
        );


    const adminWidth =
        (
            stats.admins /
            maxUserCount
        ) * 100;


    const staffWidth =
        (
            stats.staff /
            maxUserCount
        ) * 100;


    const customerWidth =
        (
            stats.customers /
            maxUserCount
        ) * 100;


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
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Admin Dashboard
            </h1>


            <p className="mb-8">
                Smart Queue Management System overview
            </p>


            {
                err &&
                <div className="alert alert-error mb-5">

                    <span>
                        {err}
                    </span>

                </div>
            }


            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Total Users
                    </div>

                    <div className="stat-value text-3xl">
                        {stats.users}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Customers
                    </div>

                    <div className="stat-value text-3xl">
                        {stats.customers}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Staff
                    </div>

                    <div className="stat-value text-3xl">
                        {stats.staff}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Admins
                    </div>

                    <div className="stat-value text-3xl">
                        {stats.admins}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Services
                    </div>

                    <div className="stat-value text-3xl">
                        {stats.services}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Queues
                    </div>

                    <div className="stat-value text-3xl">
                        {stats.queues}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Counters
                    </div>

                    <div className="stat-value text-3xl">
                        {stats.counters}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Waiting Tickets
                    </div>

                    <div className="stat-value text-3xl">
                        {stats.waiting}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Called Tickets
                    </div>

                    <div className="stat-value text-3xl">
                        {stats.called}
                    </div>

                </div>


                <div className="stat bg-base-100 shadow border rounded-box">

                    <div className="stat-title">
                        Completed Tickets
                    </div>

                    <div className="stat-value text-3xl">
                        {stats.completed}
                    </div>

                </div>

            </div>


            <div className="card bg-base-100 shadow border mb-8">

                <div className="card-body">

                    <h2 className="card-title">
                        User Statistics
                    </h2>

                    <p className="text-sm opacity-70 mb-5">
                        Number of users by role
                    </p>


                    <div className="flex flex-col gap-5">

                        <div>

                            <div className="flex justify-between mb-2">

                                <span>
                                    Customers
                                </span>

                                <span className="font-bold">
                                    {stats.customers}
                                </span>

                            </div>


                            <div className="w-full h-8 bg-base-200 rounded">

                                <div
                                    className="h-8 bg-primary rounded flex items-center justify-end px-2"
                                    style={
                                        {
                                            width:
                                                `${customerWidth}%`,
                                        }
                                    }
                                >
                                </div>

                            </div>

                        </div>


                        <div>

                            <div className="flex justify-between mb-2">

                                <span>
                                    Staff
                                </span>

                                <span className="font-bold">
                                    {stats.staff}
                                </span>

                            </div>


                            <div className="w-full h-8 bg-base-200 rounded">

                                <div
                                    className="h-8 bg-secondary rounded"
                                    style={
                                        {
                                            width:
                                                `${staffWidth}%`,
                                        }
                                    }
                                >
                                </div>

                            </div>

                        </div>


                        <div>

                            <div className="flex justify-between mb-2">

                                <span>
                                    Admins
                                </span>

                                <span className="font-bold">
                                    {stats.admins}
                                </span>

                            </div>


                            <div className="w-full h-8 bg-base-200 rounded">

                                <div
                                    className="h-8 bg-accent rounded"
                                    style={
                                        {
                                            width:
                                                `${adminWidth}%`,
                                        }
                                    }
                                >
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <h2 className="text-2xl font-bold mb-4">
                Management
            </h2>


            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

                <Link
                    href="/admin/users"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            Users
                        </h3>

                        <p>
                            Manage users and roles
                        </p>

                    </div>

                </Link>


                <Link
                    href="/admin/services"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            Services
                        </h3>

                        <p>
                            Manage system services
                        </p>

                    </div>

                </Link>


                <Link
                    href="/admin/queues"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            Queues
                        </h3>

                        <p>
                            Create and manage queues
                        </p>

                    </div>

                </Link>


                <Link
                    href="/admin/counters"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            Counters
                        </h3>

                        <p>
                            Manage counters and Staff
                        </p>

                    </div>

                </Link>


                <Link
                    href="/admin/tickets"
                    className="card bg-base-100 shadow border hover:shadow-md"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            Tickets
                        </h3>

                        <p>
                            View and manage tickets
                        </p>

                    </div>

                </Link>


                <Link
                    href="/admin/profile"
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