"use client";

import { useState } from "react";
import axios from "axios";

interface Notification {
    id: number,
    type: string,
    message: string,
    status: string,
    sentAt: string
}

export default function NotificationsPage() {

    const [notifications, setNotifications] =
        useState<Notification[]>([]);

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
                    "http://localhost:3000/notifications/me",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        }
                    }
                )

            setNotifications(
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
                    "Could not load notifications"
                );

            }

        }

    }

    return (
        <div className="max-w-4xl mx-auto py-8">

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold">
                        My Notifications
                    </h1>

                    <p>
                        View updates related to your account and tickets.
                    </p>

                </div>

                <button
                    onClick={handleClick}
                    className="btn btn-primary"
                >
                    Load Notifications
                </button>

            </div>

            {
                err &&
                <div className="alert alert-error mb-4">
                    {err}
                </div>
            }

            <div className="flex flex-col gap-4">

                {
                    notifications.map(
                        (
                            notification:
                            Notification
                        ) => (

                            <div
                                key={notification.id}
                                className="card bg-base-100 shadow border"
                            >

                                <div className="card-body">

                                    <div className="flex justify-between">

                                        <h2 className="font-bold">
                                            {notification.type}
                                        </h2>

                                        <span className="badge">
                                            {notification.status}
                                        </span>

                                    </div>

                                    <p>
                                        {notification.message}
                                    </p>

                                    <p className="text-sm">
                                        {notification.sentAt}
                                    </p>

                                </div>

                            </div>

                        )
                    )
                }

            </div>

            {
                notifications.length === 0 &&
                !err &&

                <p className="mt-4">
                    No notifications loaded.
                </p>
            }

        </div>
    )
}