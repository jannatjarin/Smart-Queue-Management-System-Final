"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Service {
    id: number,
    name: string
}

interface Staff {
    id: number,
    fullName: string,
    email: string
}

interface Counter {
    id: number,
    name: string,
    status: string,
    staff: Staff | null,
    services: Service[]
}

export default function AdminCountersPage() {

    const [counters, setCounters] =
        useState<Counter[]>([]);

    const [err, setErr] =
        useState("");

    useEffect(() => {

        const getCounters = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                const response =
                    await axios.get<Counter[]>(
                        "http://localhost:3000/counters",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setCounters(
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
                        "Could not load counters"
                    );

                }

            }

        }

        getCounters();

    }, []);

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Counter Management
            </h1>

            <p className="mb-6">
                Manage service counters
            </p>

            {
                err &&
                <div className="alert alert-error mb-4">
                    {err}
                </div>
            }

            <div className="overflow-x-auto">

                <table className="table table-zebra">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Services</th>
                            <th>Staff</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {
                            counters &&
                            counters.map(
                                (counter: Counter) => (

                                    <tr key={counter.id}>

                                        <td>
                                            {counter.id}
                                        </td>

                                        <td>
                                            {counter.name}
                                        </td>

                                        <td>

                                            {
                                                counter.services &&
                                                counter.services.map(
                                                    (
                                                        service: Service
                                                    ) => (

                                                        <div key={service.id}>
                                                            {service.name}
                                                        </div>

                                                    )
                                                )
                                            }

                                        </td>

                                        <td>

                                            {
                                                counter.staff
                                                    ? counter.staff.fullName
                                                    : "Not Assigned"
                                            }

                                        </td>

                                        <td>
                                            {counter.status}
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