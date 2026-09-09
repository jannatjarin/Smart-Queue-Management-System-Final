"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface UsersResponse {
    data: [],
    total: number,
    page: number,
    limit: number
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

                setStats(
                    {
                        ...stats,

                        users:
                            usersResponse.data.total,

                        customers:
                            customersResponse.data.total,

                        staff:
                            staffResponse.data.total
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

                    </div>
                </div>

            </div>

        </div>
    )
}