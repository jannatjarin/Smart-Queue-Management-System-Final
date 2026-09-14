"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";
import Link from "next/link";

import api from "@/lib/axios";
import StatusBadge from "@/components/ui/StatusBadge";


interface UserData {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;
}


interface Ticket {
    id: number;
    ticketNumber: string;
    status: string;
    priority: string;
    issuedAt: string;

    estimatedWaitMinutes:
        number | null;

    service: {
        id: number;
        name: string;
    };

    queue: {
        id: number;
        name: string;
    };

    counter: {
        id: number;
        name: string;
    } | null;
}


export default function CustomerDashboard() {

    const [
        user,
        setUser
    ] =
        useState<UserData | null>(
            null
        );


    const [
        tickets,
        setTickets
    ] =
        useState<Ticket[]>(
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

            const loadDashboard =
                async () => {

                    try {

                        const userResponse =
                            await api.get<UserData>(
                                "/users/me"
                            );


                        const ticketsResponse =
                            await api.get<Ticket[]>(
                                "/tickets/mytickets"
                            );


                        setUser(
                            userResponse.data
                        );


                        setTickets(
                            ticketsResponse.data
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

                            const message =
                                error.response
                                    .data
                                    .message;


                            setErr(
                                Array.isArray(
                                    message
                                )
                                    ? message.join(
                                        ", "
                                    )
                                    : message
                            );

                        }

                        else {

                            setErr(
                                "Could not load dashboard information"
                            );

                        }

                    }

                    finally {

                        setLoading(
                            false
                        );

                    }

                };


            loadDashboard();

        },
        []
    );


    const waitingCount =
        tickets.filter(
            (ticket) =>
                ticket.status ==
                "waiting"
        ).length;


    const calledCount =
        tickets.filter(
            (ticket) =>
                ticket.status ==
                "called"
        ).length;


    const completedCount =
        tickets.filter(
            (ticket) =>
                ticket.status ==
                "completed"
        ).length;


    const activeCount =
        waitingCount +
        calledCount;


    const activeTicket =
        tickets.find(
            (ticket) =>
                ticket.status ==
                "called"
        ) ||
        tickets.find(
            (ticket) =>
                ticket.status ==
                "waiting"
        ) ||
        null;


    const recentTickets =
        tickets.slice(
            0,
            4
        );


    if (loading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <span className="loading loading-spinner loading-md text-[#8f3d27]" />

                    <p className="mt-3 font-medium text-[#665d54]">
                        Loading your dashboard...
                    </p>

                </div>

            </div>
        );

    }


    return (
        <div
            className="
                mx-auto
                max-w-7xl
                py-8
                text-[#352f29]
                sm:py-10
            "
        >

            {/* WELCOME SECTION */}

            <section
                className="
                    relative
                    mb-7
                    overflow-hidden
                    rounded-[30px]
                    border
                    border-[#d8c8b3]
                    bg-[#fffaf0]
                    shadow-sm
                "
            >

                <div
                    className="
                        h-3
                        bg-[#963b24]
                    "
                />


                <div
                    className="
                        grid
                        gap-6
                        p-6
                        sm:p-8
                        lg:grid-cols-[1fr_auto]
                        lg:items-center
                    "
                >

                    <div>

                        <p
                            className="
                                mb-3
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.18em]
                                text-[#9a4932]
                            "
                        >
                            Customer Dashboard
                        </p>


                        <h1
                            className="
                                text-4xl
                                font-bold
                                leading-tight
                                text-[#332c26]
                                sm:text-5xl
                            "
                        >
                            Hello,{" "}
                            {
                                user
                                    ?.fullName
                                    .split(" ")[0] ||
                                "there"
                            }.
                        </h1>


                        <p
                            className="
                                mt-3
                                max-w-xl
                                text-base
                                leading-7
                                text-[#70675f]
                            "
                        >
                            Everything you need for your queue,
                            kept simple and easy to find.
                        </p>

                    </div>


                    <Link
                        href="/customer/queues"
                        className="
                            btn
                            min-h-12
                            rounded-full
                            border-[#5d7d5f]
                            bg-[#5d7d5f]
                            px-6
                            text-white
                            shadow-none
                            hover:border-[#4e6c50]
                            hover:bg-[#4e6c50]
                        "
                    >
                        Get a ticket
                    </Link>

                </div>


                <div
                    className="
                        border-t
                        border-[#dfd0bd]
                        bg-[#f5df91]
                        px-6
                        py-3
                        text-center
                        text-sm
                        font-semibold
                        text-[#67572d]
                    "
                >
                    Check your place • Follow your ticket •
                    Arrive when it is your turn
                </div>

            </section>


            {
                err &&
                <div
                    className="
                        alert
                        alert-error
                        mb-7
                    "
                >
                    <span>
                        {err}
                    </span>
                </div>
            }


            {/* STATUS SUMMARY */}

            <section className="mb-8">

                <div
                    className="
                        mb-4
                        flex
                        items-end
                        justify-between
                    "
                >

                    <div>

                        <p
                            className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-[#8f3d27]
                            "
                        >
                            At a glance
                        </p>

                        <h2
                            className="
                                mt-1
                                text-2xl
                                font-bold
                                text-[#332c26]
                            "
                        >
                            Your queue activity
                        </h2>

                    </div>

                </div>


                <div
                    className="
                        grid
                        gap-4
                        sm:grid-cols-3
                    "
                >

                    <div
                        className="
                            rounded-[24px]
                            border
                            border-[#bed1dc]
                            bg-[#dcebf3]
                            p-5
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-bold
                                text-[#526d7a]
                            "
                        >
                            Active
                        </p>

                        <p
                            className="
                                mt-3
                                text-4xl
                                font-black
                                text-[#304f60]
                            "
                        >
                            {activeCount}
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#657e89]
                            "
                        >
                            Waiting or called
                        </p>

                    </div>


                    <div
                        className="
                            rounded-[24px]
                            border
                            border-[#e5cf78]
                            bg-[#f7e49a]
                            p-5
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-bold
                                text-[#796523]
                            "
                        >
                            Waiting
                        </p>

                        <p
                            className="
                                mt-3
                                text-4xl
                                font-black
                                text-[#64521b]
                            "
                        >
                            {waitingCount}
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#806f35]
                            "
                        >
                            Still in queue
                        </p>

                    </div>


                    <div
                        className="
                            rounded-[24px]
                            border
                            border-[#bfd5bd]
                            bg-[#dcebd8]
                            p-5
                        "
                    >

                        <p
                            className="
                                text-sm
                                font-bold
                                text-[#587057]
                            "
                        >
                            Completed
                        </p>

                        <p
                            className="
                                mt-3
                                text-4xl
                                font-black
                                text-[#405b40]
                            "
                        >
                            {completedCount}
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-[#667c65]
                            "
                        >
                            Finished visits
                        </p>

                    </div>

                </div>

            </section>


            {/* CURRENT TICKET */}

            <section className="mb-8">

                <div className="mb-4">

                    <p
                        className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-[#8f3d27]
                        "
                    >
                        Most important
                    </p>

                    <h2
                        className="
                            mt-1
                            text-2xl
                            font-bold
                            text-[#332c26]
                        "
                    >
                        Current ticket
                    </h2>

                </div>


                {
                    activeTicket
                        ? (
                            <article
                                className="
                                    overflow-hidden
                                    rounded-[28px]
                                    border
                                    border-[#d8c8b3]
                                    bg-[#fffaf0]
                                    shadow-sm
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-5
                                        border-b
                                        border-[#eadfce]
                                        p-6
                                        sm:flex-row
                                        sm:items-start
                                        sm:justify-between
                                        sm:p-7
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-[#7d7166]
                                            "
                                        >
                                            Your ticket number
                                        </p>


                                        <div
                                            className="
                                                mt-2
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-3
                                            "
                                        >

                                            <p
                                                className="
                                                    text-5xl
                                                    font-black
                                                    tracking-tight
                                                    text-[#8f3d27]
                                                "
                                            >
                                                {
                                                    activeTicket
                                                        .ticketNumber
                                                }
                                            </p>


                                            <StatusBadge
                                                status={
                                                    activeTicket
                                                        .status
                                                }
                                            />

                                        </div>

                                    </div>


                                    <Link
                                        href="/customer/tickets"
                                        className="
                                            btn
                                            rounded-full
                                            border-[#b9a895]
                                            bg-white
                                            px-5
                                            text-[#66574d]
                                            shadow-none
                                            hover:border-[#8f3d27]
                                            hover:bg-[#fff7ed]
                                            hover:text-[#8f3d27]
                                        "
                                    >
                                        View details
                                    </Link>

                                </div>


                                <div
                                    className="
                                        grid
                                        gap-5
                                        p-6
                                        sm:grid-cols-2
                                        sm:p-7
                                        lg:grid-cols-4
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-[#8b8178]
                                            "
                                        >
                                            Service
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                font-bold
                                                text-[#403831]
                                            "
                                        >
                                            {
                                                activeTicket
                                                    .service
                                                    .name
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-[#8b8178]
                                            "
                                        >
                                            Queue
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                font-bold
                                                text-[#403831]
                                            "
                                        >
                                            {
                                                activeTicket
                                                    .queue
                                                    .name
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-[#8b8178]
                                            "
                                        >
                                            Counter
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                font-bold
                                                text-[#403831]
                                            "
                                        >
                                            {
                                                activeTicket
                                                    .counter
                                                    ?.name ||
                                                "Not assigned yet"
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-[#8b8178]
                                            "
                                        >
                                            {
                                                activeTicket
                                                    .status ==
                                                "called"
                                                    ? "Now"
                                                    : "Estimated wait"
                                            }
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                font-bold
                                                text-[#403831]
                                            "
                                        >
                                            {
                                                activeTicket
                                                    .status ==
                                                "waiting"
                                                    ? activeTicket
                                                        .estimatedWaitMinutes ==
                                                    null
                                                        ? "Not available"
                                                        : `${activeTicket.estimatedWaitMinutes} min`
                                                    : "It is your turn"
                                            }
                                        </p>

                                    </div>

                                </div>


                                {
                                    activeTicket.status ==
                                    "called" &&
                                    <div
                                        className="
                                            border-t
                                            border-[#bfd5bd]
                                            bg-[#e1efde]
                                            px-6
                                            py-4
                                            text-sm
                                            font-bold
                                            text-[#486348]
                                            sm:px-7
                                        "
                                    >
                                        Your ticket has been called.
                                        Please proceed to your assigned counter.
                                    </div>
                                }

                            </article>
                        )
                        : (
                            <div
                                className="
                                    rounded-[28px]
                                    border
                                    border-dashed
                                    border-[#ccbca8]
                                    bg-[#fffaf0]
                                    p-8
                                    text-center
                                "
                            >

                                <p
                                    className="
                                        text-xl
                                        font-bold
                                        text-[#403831]
                                    "
                                >
                                    You do not have an active ticket.
                                </p>

                                <p
                                    className="
                                        mx-auto
                                        mt-2
                                        max-w-md
                                        text-sm
                                        leading-6
                                        text-[#756b62]
                                    "
                                >
                                    Choose a service and join a queue
                                    whenever you are ready.
                                </p>


                                <Link
                                    href="/customer/queues"
                                    className="
                                        btn
                                        mt-5
                                        rounded-full
                                        border-[#5d7d5f]
                                        bg-[#5d7d5f]
                                        px-6
                                        text-white
                                        shadow-none
                                        hover:border-[#4e6c50]
                                        hover:bg-[#4e6c50]
                                    "
                                >
                                    Join a queue
                                </Link>

                            </div>
                        )
                }

            </section>


            {/* RECENT + QUICK LINKS */}

            <section
                className="
                    grid
                    gap-7
                    lg:grid-cols-[1fr_340px]
                "
            >

                {/* RECENT TICKETS */}

                <div>

                    <div
                        className="
                            mb-4
                            flex
                            items-end
                            justify-between
                            gap-4
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#8f3d27]
                                "
                            >
                                History
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-2xl
                                    font-bold
                                    text-[#332c26]
                                "
                            >
                                Recent tickets
                            </h2>

                        </div>


                        <Link
                            href="/customer/tickets"
                            className="
                                text-sm
                                font-bold
                                text-[#8f3d27]
                                hover:underline
                            "
                        >
                            View all
                        </Link>

                    </div>


                    <div
                        className="
                            overflow-hidden
                            rounded-[26px]
                            border
                            border-[#d8c8b3]
                            bg-[#fffaf0]
                        "
                    >

                        {
                            recentTickets.length ==
                            0
                                ? (
                                    <div
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                        "
                                    >

                                        <p
                                            className="
                                                font-bold
                                                text-[#554c44]
                                            "
                                        >
                                            No tickets yet.
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-[#81766c]
                                            "
                                        >
                                            Your recent tickets will
                                            appear here.
                                        </p>

                                    </div>
                                )
                                : (
                                    <div
                                        className="
                                            divide-y
                                            divide-[#e8dccb]
                                        "
                                    >

                                        {
                                            recentTickets.map(
                                                (
                                                    ticket
                                                ) => (
                                                    <div
                                                        key={
                                                            ticket.id
                                                        }
                                                        className="
                                                            flex
                                                            flex-col
                                                            gap-3
                                                            px-5
                                                            py-4
                                                            sm:flex-row
                                                            sm:items-center
                                                            sm:justify-between
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    flex
                                                                    h-11
                                                                    w-11
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-[#f1dfca]
                                                                    text-sm
                                                                    font-black
                                                                    text-[#8f3d27]
                                                                "
                                                            >
                                                                Q
                                                            </div>


                                                            <div>

                                                                <p
                                                                    className="
                                                                        font-black
                                                                        text-[#403831]
                                                                    "
                                                                >
                                                                    {
                                                                        ticket
                                                                            .ticketNumber
                                                                    }
                                                                </p>

                                                                <p
                                                                    className="
                                                                        text-sm
                                                                        text-[#756b62]
                                                                    "
                                                                >
                                                                    {
                                                                        ticket
                                                                            .service
                                                                            .name
                                                                    }
                                                                    {" • "}
                                                                    {
                                                                        ticket
                                                                            .queue
                                                                            .name
                                                                    }
                                                                </p>

                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-xs
                                                                        text-[#968b81]
                                                                    "
                                                                >
                                                                    {
                                                                        new Date(
                                                                            ticket
                                                                                .issuedAt
                                                                        )
                                                                            .toLocaleString()
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>


                                                        <StatusBadge
                                                            status={
                                                                ticket
                                                                    .status
                                                            }
                                                        />

                                                    </div>
                                                )
                                            )
                                        }

                                    </div>
                                )
                        }

                    </div>

                </div>


                {/* QUICK LINKS */}

                <div>

                    <div className="mb-4">

                        <p
                            className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-[#8f3d27]
                            "
                        >
                            Need something?
                        </p>

                        <h2
                            className="
                                mt-1
                                text-2xl
                                font-bold
                                text-[#332c26]
                            "
                        >
                            Quick links
                        </h2>

                    </div>


                    <div className="grid gap-3">

                        <Link
                            href="/services"
                            className="
                                group
                                rounded-[22px]
                                border
                                border-[#ddc9a1]
                                bg-[#f6e6b3]
                                p-5
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            font-bold
                                            text-[#544728]
                                        "
                                    >
                                        Browse services
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-[#7b6a42]
                                        "
                                    >
                                        See what is available.
                                    </p>

                                </div>

                                <span
                                    className="
                                        text-xl
                                        text-[#8f3d27]
                                        transition
                                        group-hover:translate-x-1
                                    "
                                >
                                    →
                                </span>

                            </div>

                        </Link>


                        <Link
                            href="/customer/notifications"
                            className="
                                group
                                rounded-[22px]
                                border
                                border-[#bfd3df]
                                bg-[#deedf5]
                                p-5
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            font-bold
                                            text-[#3f5967]
                                        "
                                    >
                                        Notifications
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-[#647b87]
                                        "
                                    >
                                        Check ticket updates.
                                    </p>

                                </div>

                                <span
                                    className="
                                        text-xl
                                        text-[#527487]
                                        transition
                                        group-hover:translate-x-1
                                    "
                                >
                                    →
                                </span>

                            </div>

                        </Link>


                        <Link
                            href="/customer/profile"
                            className="
                                group
                                rounded-[22px]
                                border
                                border-[#dfc5b9]
                                bg-[#f5dfd5]
                                p-5
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-sm
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            font-bold
                                            text-[#674c41]
                                        "
                                    >
                                        Your profile
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-[#826b61]
                                        "
                                    >
                                        Review account details.
                                    </p>

                                </div>

                                <span
                                    className="
                                        text-xl
                                        text-[#8f3d27]
                                        transition
                                        group-hover:translate-x-1
                                    "
                                >
                                    →
                                </span>

                            </div>

                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
}