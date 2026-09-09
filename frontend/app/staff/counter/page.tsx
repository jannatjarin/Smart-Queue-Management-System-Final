"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Staff {
    id: number,
    fullName: string,
    email: string
}

interface Service {
    id: number,
    name: string
}

interface Counter {
    id: number,
    name: string,
    status: string,
    staff: Staff | null,
    services: Service[]
}

export default function StaffCounterPage() {

    const [staff, setStaff] =
        useState<Staff | null>(
            null
        );

    const [counters, setCounters] =
        useState<Counter[]>([]);

    const [err, setErr] =
        useState("");

    useEffect(() => {

        const getData = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                const staffResponse =
                    await axios.get<Staff>(
                        "http://localhost:3000/users/me",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                const countersResponse =
                    await axios.get<Counter[]>(
                        "http://localhost:3000/counters",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setStaff(
                    staffResponse.data
                );

                setCounters(
                    countersResponse.data
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
                        "Could not load counter"
                    );

                }

            }

        }

        getData();

    }, []);

    const assignedCounter =
        staff
            ? counters.find(
                (counter: Counter) =>
                    counter.staff?.id ==
                    staff.id
            )
            : undefined;

    return (
        <div className="max-w-4xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                My Counter
            </h1>

            <p className="mb-6">
                View your assigned counter
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
                assignedCounter
                    ? (
                        <div className="card bg-base-100 shadow border">

                            <div className="card-body">

                                <h2 className="card-title">
                                    {assignedCounter.name}
                                </h2>

                                <p>
                                    Staff:{" "}
                                    {
                                        assignedCounter.staff?.fullName
                                    }
                                </p>

                                <p>
                                    Status:{" "}
                                    {assignedCounter.status}
                                </p>

                                <h3 className="font-bold mt-4">
                                    Assigned Services
                                </h3>

                                {
                                    assignedCounter.services &&
                                    assignedCounter.services.length > 0
                                        ? (
                                            <div className="flex flex-col gap-2">

                                                {
                                                    assignedCounter.services.map(
                                                        (
                                                            service: Service
                                                        ) => (

                                                            <p key={service.id}>
                                                                {service.name}
                                                            </p>

                                                        )
                                                    )
                                                }

                                            </div>
                                        )
                                        : (
                                            <p>
                                                No services assigned
                                            </p>
                                        )
                                }

                            </div>

                        </div>
                    )
                    : (
                        <p>
                            No counter assigned
                        </p>
                    )
            }

        </div>
    )
}