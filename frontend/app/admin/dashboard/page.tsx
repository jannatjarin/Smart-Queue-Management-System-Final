"use client";

import { useState } from "react";

export default function AdminDashboard() {

    const [stats] = useState(
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

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Admin Dashboard
            </h1>

            <p className="mb-8">
                Smart Queue Management System overview
            </p>

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