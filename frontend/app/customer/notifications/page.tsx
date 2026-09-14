"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import api from "@/lib/axios";

import StatusBadge from
    "@/components/ui/StatusBadge";


interface Notification {
    id: number;
    type: string;
    message: string;
    status: string;
    sentAt: string;
}


export default function NotificationsPage() {

    const [
        notifications,
        setNotifications
    ] =
        useState<Notification[]>(
            []
        );


    const [
        err,
        setErr
    ] =
        useState("");


    const [
        loading,
        setLoading
    ] =
        useState(true);


    useEffect(
        () => {

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

                            setErr(
                                error.response
                                    .data
                                    .message
                            );

                        }

                        else {

                            setErr(
                                "Could not load notifications"
                            );

                        }

                    }

                    finally {

                        setLoading(
                            false
                        );

                    }

                };


            getNotifications();

        },
        []
    );


    const formatType =
        (
            type: string
        ) =>
            type
                .replaceAll(
                    "_",
                    " "
                )
                .replace(
                    /\b\w/g,
                    (
                        letter
                    ) =>
                        letter
                            .toUpperCase()
                );


    const notificationTone =
        (
            type: string
        ) => {

            if (
                type.includes(
                    "called"
                )
            ) {

                return "bg-[#e6f1ff] border-[#d4e3f6] text-[#4e6e91]";

            }


            if (
                type.includes(
                    "completed"
                )
            ) {

                return "bg-[#e2f5ec] border-[#cfe8dc] text-[#4d705d]";

            }


            if (
                type.includes(
                    "cancel"
                )
            ) {

                return "bg-[#fce4ec] border-[#efd4dd] text-[#855365]";

            }


            if (
                type.includes(
                    "reset"
                )
            ) {

                return "bg-[#fff3cd] border-[#eadcae] text-[#7b672e]";

            }


            return "bg-[#ece7ff] border-[#ddd5f0] text-[#625987]";

        };


    if (loading) {

        return (
            <div
                className="
                    mx-auto
                    flex
                    min-h-[55vh]
                    max-w-4xl
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        sq-panel
                        flex
                        items-center
                        gap-3
                        rounded-[22px]
                        px-5
                        py-4
                    "
                >

                    <span
                        className="
                            loading
                            loading-spinner
                            loading-sm
                            text-[#756aa5]
                        "
                    />

                    <span
                        className="
                            text-sm
                            font-semibold
                            text-[#6f6b7b]
                        "
                    >
                        Loading notifications...
                    </span>

                </div>

            </div>
        );

    }


    return (
        <div
            className="
                mx-auto
                max-w-5xl
                py-8
                sm:py-10
            "
        >

            <section
                className="
                    relative
                    mb-8
                    overflow-hidden
                    rounded-[30px]
                    border
                    border-white/80
                    bg-[linear-gradient(120deg,#e2f5ec_0%,#e6f1ff_48%,#ece7ff_100%)]
                    px-6
                    py-7
                    shadow-[0_20px_55px_rgba(100,83,128,0.1)]
                    sm:px-8
                "
            >

                <div
                    className="
                        absolute
                        -right-10
                        -top-10
                        h-36
                        w-36
                        rounded-full
                        bg-white/30
                    "
                />


                <div className="relative">

                    <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#8a7ea7]">
                        Nothing important gets lost
                    </p>


                    <h1
                        className="
                            sq-title
                            mt-1
                            text-4xl
                            sm:text-5xl
                        "
                    >
                        Notifications
                    </h1>


                    <p
                        className="
                            mt-3
                            max-w-2xl
                            text-[15px]
                            font-medium
                            leading-7
                            text-[#666174]
                        "
                    >
                        Ticket updates and account
                        messages stay together here,
                        with the newest updates first.
                    </p>

                </div>

            </section>


            {
                err &&
                <div
                    className="
                        mb-5
                        rounded-[20px]
                        border
                        border-[#efc9d5]
                        bg-[#fce4ec]
                        px-4
                        py-3.5
                        text-sm
                        font-semibold
                        text-[#82495a]
                        shadow-sm
                    "
                >
                    {err}
                </div>
            }


            {
                notifications.length ==
                    0 &&
                !err &&
                <div
                    className="
                        rounded-[30px]
                        border
                        border-dashed
                        border-[#d8cde5]
                        bg-white/65
                        px-6
                        py-14
                        text-center
                        shadow-sm
                    "
                >

                    <div
                        className="
                            mx-auto
                            mb-4
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-[22px]
                            bg-[linear-gradient(135deg,#ece7ff,#e2f5ec)]
                            text-2xl
                            font-black
                            text-[#675e91]
                        "
                    >
                        i
                    </div>


                    <p
                        className="
                            text-lg
                            font-extrabold
                            text-[#4d495a]
                        "
                    >
                        You are all caught up.
                    </p>


                    <p
                        className="
                            mx-auto
                            mt-1.5
                            max-w-md
                            text-sm
                            font-medium
                            leading-6
                            text-[#817c8d]
                        "
                    >
                        Ticket and account updates
                        will appear here automatically
                        when something changes.
                    </p>

                </div>
            }


            <div
                className="
                    relative
                    space-y-4

                    before:absolute
                    before:bottom-4
                    before:left-[22px]
                    before:top-4
                    before:w-px
                    before:bg-[#ded5e8]

                    sm:before:left-[26px]
                "
            >

                {
                    notifications.map(
                        (
                            notification
                        ) => (
                            <article
                                key={
                                    notification.id
                                }
                                className="
                                    relative
                                    pl-12
                                    sm:pl-14
                                "
                            >

                                <div
                                    className="
                                        absolute
                                        left-2.5
                                        top-6
                                        z-10
                                        flex
                                        h-6
                                        w-6
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-4
                                        border-[#faf7fd]
                                        bg-[#9c8fc8]
                                        shadow-sm
                                        sm:left-3.5
                                    "
                                />


                                <div
                                    className="
                                        sq-card
                                        rounded-[26px]
                                        p-5
                                        transition
                                        hover:-translate-y-0.5
                                        sm:p-6
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            flex-col
                                            gap-3
                                            sm:flex-row
                                            sm:items-start
                                            sm:justify-between
                                        "
                                    >

                                        <div className="min-w-0">

                                            <div
                                                className={`
                                                    inline-flex
                                                    rounded-full
                                                    border
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-extrabold
                                                    ${
                                                        notificationTone(
                                                            notification.type
                                                        )
                                                    }
                                                `}
                                            >
                                                {
                                                    formatType(
                                                        notification.type
                                                    )
                                                }
                                            </div>


                                            <p
                                                className="
                                                    mt-3
                                                    text-[15px]
                                                    font-medium
                                                    leading-7
                                                    text-[#5d5868]
                                                "
                                            >
                                                {
                                                    notification
                                                        .message
                                                }
                                            </p>


                                            <p
                                                className="
                                                    mt-3
                                                    text-xs
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.08em]
                                                    text-[#96909f]
                                                "
                                            >
                                                {
                                                    new Date(
                                                        notification
                                                            .sentAt
                                                    )
                                                        .toLocaleString()
                                                }
                                            </p>

                                        </div>


                                        <StatusBadge
                                            status={
                                                notification
                                                    .status
                                            }
                                        />

                                    </div>

                                </div>

                            </article>
                        )
                    )
                }

            </div>

        </div>
    );

}