"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import api from "@/lib/axios";
import StatusBadge from "@/components/ui/StatusBadge";

interface Notification {
    id: number;
    type: string;
    message: string;
    status: string;
    sentAt: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] =
        useState<Notification[]>([]);

    const [err, setErr] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const getNotifications =
            async () => {
                try {
                    const response =
                        await api.get<
                            Notification[]
                        >(
                            "/notifications/me"
                        );

                    setNotifications(
                        response.data
                    );

                    setErr("");
                } catch (error) {
                    if (
                        axios.isAxiosError(
                            error
                        ) &&
                        error.response?.data
                            ?.message
                    ) {
                        setErr(
                            error.response
                                .data
                                .message
                        );
                    } else {
                        setErr(
                            "Could not load notifications"
                        );
                    }
                } finally {
                    setLoading(false);
                }
            };

        getNotifications();
    }, []);

    const formatType = (
        type: string
    ) =>
        type
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (letter) =>
                    letter.toUpperCase()
            );

    const notificationColor = (
        index: number
    ) => {
        const colors = [
            "border-[#c0d2dd] bg-[#deedf5]",
            "border-[#ddd08e] bg-[#f8e9ad]",
            "border-[#bfd2bb] bg-[#e0edde]",
            "border-[#dfc1ae] bg-[#f4ded1]",
        ];

        return colors[
            index % colors.length
        ];
    };

    if (loading) {
        return (
            <div className="mx-auto flex min-h-[55vh] max-w-4xl items-center justify-center">
                <span className="loading loading-spinner loading-md text-[#8f3d27]" />

                <span className="ml-3 font-semibold text-[#665d54]">
                    Loading notifications...
                </span>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl py-8 sm:py-10">
            <header className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                    Updates
                </p>

                <h1 className="mt-1 text-4xl font-bold text-[#332c26]">
                    Notifications
                </h1>

                <p className="mt-2 text-sm text-[#746960]">
                    Your latest ticket and account updates.
                </p>
            </header>

            {err && (
                <div className="mb-5 rounded-[18px] border border-[#dfb4b7] bg-[#f4d5d7] px-4 py-3 text-sm font-bold text-[#82464b]">
                    {err}
                </div>
            )}

            <div className="space-y-3">
                {notifications.map(
                    (
                        notification,
                        index
                    ) => (
                        <article
                            key={
                                notification.id
                            }
                            className={`rounded-[22px] border p-5 ${notificationColor(
                                index
                            )}`}
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-[#413830]">
                                        {
                                            formatType(
                                                notification.type
                                            )
                                        }
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-[#665d55]">
                                        {
                                            notification.message
                                        }
                                    </p>

                                    <p className="mt-3 text-xs font-semibold text-[#83776e]">
                                        {new Date(
                                            notification.sentAt
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <StatusBadge
                                    status={
                                        notification.status
                                    }
                                />
                            </div>
                        </article>
                    )
                )}
            </div>

            {notifications.length ==
                0 &&
                !err && (
                    <div className="rounded-[24px] border border-dashed border-[#cdbba7] bg-[#fffaf0] p-8 text-center">
                        <p className="font-bold text-[#4b423a]">
                            No notifications yet.
                        </p>

                        <p className="mt-1 text-sm text-[#786e65]">
                            New updates will appear here.
                        </p>
                    </div>
                )}
        </div>
    );
}