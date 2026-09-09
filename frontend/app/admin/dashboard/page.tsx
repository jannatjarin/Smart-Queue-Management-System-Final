"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface UsersResponse {
    data: [],
    total: number,
    page: number,
    limit: number
}

interface Service {
    id: number,
    name: string
}

interface Queue {
    id: number,
    name: string
}

interface Counter {
    id: number,
    name: string
}

export default function AdminDashboard() {

    const [stats, setStats] = useState(
        {
            users: 0,
            customers: 0,
            staff: 0,
            services: 0,
            queues: 0,
            counters: 0,
            waiting: 0,
            completed: 0
        }
    );

    const [err, setErr] =
        useState("");

    useEffect(() => {

        const getDashboardData = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                const usersResponse =
                    await axios.get<UsersResponse>(
                        "http://localhost:3000/users?limit=1",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                const customersResponse =
                    await axios.get<UsersResponse>(
                        "http://localhost:3000/users?role=customer&limit=1",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                const staffResponse =
                    await axios.get<UsersResponse>(
                        "http://localhost:3000/users?role=staff&limit=1",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                const servicesResponse =
                    await axios.get<Service[]>(
                        "http://localhost:3000/services?includeInactive=true"
                    );

                const queuesResponse =
                    await axios.get<Queue[]>(
                        "http://localhost:3000/queues"
                    );

                const countersResponse =
                    await axios.get<Counter[]>(
                        "http://localhost:3000/counters",
                        {
                            headers:
                            {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setStats(
                    {
                        ...stats,

                        users:
                            usersResponse.data.total,

                        customers:
                            customersResponse.data.total,

                        staff:
                            staffResponse.data.total,

                        services:
                            servicesResponse.data.length,

                        queues:
                            queuesResponse.data.length,

                        counters:
                            countersResponse.data.length
                    }
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
                        "Could not load dashboard data"
                    );

                }

            }

        }

        getDashboardData();

    }, []);

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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

                <div className="card bg-base-100 shadow border">
                    <div className="card-body">

                        <h2 className="card-title">
                            Total Users
                        </h2>

                        <p className="text-3xl font-bold">
                            {stats.users}
                        </p>

                    </div>
                </div>

                <div className="card bg-base-100 shadow border">
                    <div className="card-body">

                        <h2 className="card-title">
                            Customers
                        </h2>

                        <p className="text-3xl font-bold">
                            {stats.customers}
                        </p>

                    </div>
                </div>

                <div className="card bg-base-100 shadow border">
                    <div className="card-body">

                        <h2 className="card-title">
                            Staff
                        </h2>

                        <p className="text-3xl font-bold">
                            {stats.staff}
                        </p>
                        <div className="card bg-base-100 shadow border">
                            <div className="card-body">

                                <h2 className="card-title">
                                    Services
                                </h2>

                                <p className="text-3xl font-bold">
                                    {stats.services}
                                </p>

                            </div>
                        </div>

                        <div className="card bg-base-100 shadow border">
                            <div className="card-body">

                                <h2 className="card-title">
                                    Queues
                                </h2>

                                <p className="text-3xl font-bold">
                                    {stats.queues}
                                </p>

                            </div>
                        </div>

                        <div className="card bg-base-100 shadow border">
                            <div className="card-body">

                                <h2 className="card-title">
                                    Counters
                                </h2>

                                <p className="text-3xl font-bold">
                                    {stats.counters}
                                </p>

                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}