"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Staff {
    id: number,
    fullName: string,
    email: string,
    phone?: string,
    role: string
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

export default function StaffDashboard() {

    const [staff, setStaff] =
        useState<Staff | null>(
            null
        );

    const [err, setErr] =
    useState("")

    const [counters, setCounters] =
    useState<Counter[]>([]);

    useEffect(() => {

    const getStaff = async () => {

        const token =
            localStorage.getItem(
                "access_token"
            );

        try {

            const response =
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
                response.data
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
                    "Could not load staff information"
                );

            }

        }

    }

    getStaff();

}, []);

const assignedCounter =
    staff
        ? counters.find(
            (counter: Counter) => {

                return (
                    counter.staff?.id ==
                    staff.id
                );

            }
        )
        : undefined;

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

                <p>
                    Welcome, {staff.fullName}
                </p>
            }

            <h2 className="text-2xl font-bold mt-8 mb-4">
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
                                    Status:{" "}
                                    {assignedCounter.status}
                                </p>

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