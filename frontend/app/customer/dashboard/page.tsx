"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function CustomerDashboard() {

    const [user, setUser] = useState(
        {
            id: 0,
            fullName: "",
            email: "",
            phone: "",
            role: ""
        }
    );

    const [err, setErr] =
        useState("");

    const handleClick = async () => {

        const token =
            localStorage.getItem(
                "access_token"
            );

        try {

            const response =
                await axios.get(
                    "http://localhost:3000/users/me",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        }
                    }
                )

            setUser(
                response.data
            );

        }

        catch (error: any) {

            if (error.response?.data?.message) {

                setErr(
                    error.response.data.message
                );

            }

            else {

                setErr(
                    "Could not load user information"
                );

            }

        }

    }

    return (
        <div className="max-w-6xl mx-auto py-8">

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-3xl font-bold">
                        Customer Dashboard
                    </h1>

                    <p>
                        Welcome to your SQMS account.
                    </p>

                </div>

                <button
                    onClick={handleClick}
                    className="btn btn-primary"
                >
                    Load My Information
                </button>

            </div>

            {
                err &&
                <div className="alert alert-error mb-5">
                    {err}
                </div>
            }

            {
                user.id !== 0 &&

                <div className="card bg-base-100 shadow-md border mb-8">

                    <div className="card-body">

                        <h2 className="card-title">
                            My Information
                        </h2>

                        <p>
                            <b>Name:</b>{" "}
                            {user.fullName}
                        </p>

                        <p>
                            <b>Email:</b>{" "}
                            {user.email}
                        </p>

                        <p>
                            <b>Phone:</b>{" "}
                            {user.phone}
                        </p>

                        <p>
                            <b>Role:</b>{" "}
                            {user.role}
                        </p>

                    </div>

                </div>
            }

            <h2 className="text-xl font-bold mb-4">
                Quick Actions
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                <Link
                    href="/services"
                    className="card bg-base-100 shadow border"
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
                    className="card bg-base-100 shadow border"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            Queues
                        </h3>

                        <p>
                            View available queues
                        </p>

                    </div>

                </Link>

                <Link
                    href="/customer/profile"
                    className="card bg-base-100 shadow border"
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

                <Link
                    href="/customer/notifications"
                    className="card bg-base-100 shadow border"
                >

                    <div className="card-body">

                        <h3 className="font-bold">
                            Notifications
                        </h3>

                        <p>
                            View your notifications
                        </p>

                    </div>

                </Link>

            </div>

        </div>
    )
}