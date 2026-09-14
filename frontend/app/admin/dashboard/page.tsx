"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import api from "@/lib/axios";

interface User {
    id: number;
    role: string;
}

interface UsersResponse {
    data: User[];
    total: number;
    page: number;
    limit: number;
}

interface Service {
    id: number;
    name: string;
}

interface Queue {
    id: number;
    name: string;
}

interface Counter {
    id: number;
    name: string;
}

interface Ticket {
    id: number;
    status: string;
}

interface DashboardStats {
    users: number;
    admins: number;
    customers: number;
    staff: number;
    services: number;
    queues: number;
    counters: number;
    waiting: number;
    called: number;
    completed: number;
    cancelled: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        users: 0,
        admins: 0,
        customers: 0,
        staff: 0,
        services: 0,
        queues: 0,
        counters: 0,
        waiting: 0,
        called: 0,
        completed: 0,
        cancelled: 0,
    });

    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const usersResponse = await api.get<UsersResponse>(
                    "/users?limit=1"
                );

                const adminResponse = await api.get<UsersResponse>(
                    "/users?role=admin&limit=1"
                );

                const customerResponse = await api.get<UsersResponse>(
                    "/users?role=customer&limit=1"
                );

                const staffResponse = await api.get<UsersResponse>(
                    "/users?role=staff&limit=1"
                );

                const servicesResponse = await api.get<Service[]>(
                    "/services?includeInactive=true"
                );

                const queuesResponse =
                    await api.get<Queue[]>("/queues");

                const countersResponse =
                    await api.get<Counter[]>("/counters");

                const ticketsResponse =
                    await api.get<Ticket[]>("/tickets");

                const waiting =
                    ticketsResponse.data.filter(
                        (ticket) =>
                            ticket.status ==
                            "waiting"
                    ).length;

                const called =
                    ticketsResponse.data.filter(
                        (ticket) =>
                            ticket.status ==
                            "called"
                    ).length;

                const completed =
                    ticketsResponse.data.filter(
                        (ticket) =>
                            ticket.status ==
                            "completed"
                    ).length;

                const cancelled =
                    ticketsResponse.data.filter(
                        (ticket) =>
                            ticket.status ==
                            "cancelled"
                    ).length;

                setStats({
                    users:
                        usersResponse.data.total,

                    admins:
                        adminResponse.data.total,

                    customers:
                        customerResponse.data.total,

                    staff:
                        staffResponse.data.total,

                    services:
                        servicesResponse.data.length,

                    queues:
                        queuesResponse.data.length,

                    counters:
                        countersResponse.data.length,

                    waiting,
                    called,
                    completed,
                    cancelled,
                });

                setErr("");
            } catch (error) {
                if (
                    axios.isAxiosError(error) &&
                    error.response?.data?.message
                ) {
                    const message =
                        error.response.data.message;

                    setErr(
                        Array.isArray(message)
                            ? message.join(", ")
                            : message
                    );
                } else {
                    setErr(
                        "Could not load dashboard data"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        getDashboardData();
    }, []);

    const userTotal =
        stats.customers +
        stats.staff +
        stats.admins;

    const safeUserTotal =
        Math.max(userTotal, 1);

    const customerEnd =
        (
            stats.customers /
            safeUserTotal
        ) * 100;

    const staffEnd =
        customerEnd +
        (
            stats.staff /
            safeUserTotal
        ) * 100;

    const donutBackground =
        userTotal === 0
            ? "#eee9f4"
            : `conic-gradient(
                #b9a7ea 0% ${customerEnd}%,
                #95c8e8 ${customerEnd}% ${staffEnd}%,
                #f5c98d ${staffEnd}% 100%
            )`;

    const ticketChart = [
        {
            label: "Waiting",
            value: stats.waiting,
            color: "#e7c857",
            soft: "#fff2b8",
        },
        {
            label: "Called",
            value: stats.called,
            color: "#79b7dc",
            soft: "#dcefff",
        },
        {
            label: "Completed",
            value: stats.completed,
            color: "#7fba95",
            soft: "#dff2e6",
        },
        {
            label: "Cancelled",
            value: stats.cancelled,
            color: "#d987a0",
            soft: "#fae1e9",
        },
    ];

    const highestTicketValue =
        Math.max(
            ...ticketChart.map(
                (item) =>
                    item.value
            ),
            1
        );

    const tickStep =
        Math.max(
            1,
            Math.ceil(
                highestTicketValue / 4
            )
        );

    const chartMax =
        tickStep * 4;

    const yAxisTicks = [
        chartMax,
        chartMax - tickStep,
        chartMax - tickStep * 2,
        chartMax - tickStep * 3,
        0,
    ];

    const totalTickets =
        stats.waiting +
        stats.called +
        stats.completed +
        stats.cancelled;

    const managementLinks = [
        {
            href: "/admin/users",
            title: "Users",
            note: "Roles and accounts",
            color: "#e9e0ff",
            border: "#d7c9f1",
            ink: "#5c507b",
            letter: "U",
        },
        {
            href: "/admin/services",
            title: "Services",
            note: "Service catalogue",
            color: "#ffe3d1",
            border: "#f0cdb9",
            ink: "#7a5140",
            letter: "S",
        },
        {
            href: "/admin/queues",
            title: "Queues",
            note: "Queue settings",
            color: "#dceeff",
            border: "#c7dfef",
            ink: "#476a88",
            letter: "Q",
        },
        {
            href: "/admin/counters",
            title: "Counters",
            note: "Staff and counters",
            color: "#dff2e6",
            border: "#c8e2d3",
            ink: "#466c56",
            letter: "C",
        },
        {
            href: "/admin/tickets",
            title: "Tickets",
            note: "Ticket activity",
            color: "#fff0b9",
            border: "#e9d691",
            ink: "#77601f",
            letter: "T",
        },
        {
            href: "/admin/profile",
            title: "Profile",
            note: "Admin account",
            color: "#f9e0e9",
            border: "#eacbd7",
            ink: "#805165",
            letter: "P",
        },
    ];

    if (loading) {
        return (
            <div
                className="
                    -mx-5
                    flex
                    min-h-[70vh]
                    items-center
                    justify-center
                    bg-[#fbf8ff]
                    px-5
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-[24px]
                        border
                        border-[#ddd3ed]
                        bg-[#ebe3ff]
                        px-6
                        py-4
                        shadow-[0_14px_35px_rgba(92,72,118,0.10)]
                    "
                >
                    <span
                        className="
                            loading
                            loading-spinner
                            loading-sm
                            text-[#7463a3]
                        "
                    />

                    <span
                        className="
                            text-sm
                            font-bold
                            text-[#585161]
                        "
                    >
                        Loading dashboard...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="
                -mx-5
                min-h-screen
                px-5
                py-8
                text-[#3f3949]
                sm:py-10
            "
            style={{
                backgroundColor:
                    "#fbf8ff",

                backgroundImage:
                    "radial-gradient(circle at 4% 5%, rgba(226,214,255,.86) 0, rgba(226,214,255,0) 25rem), radial-gradient(circle at 96% 10%, rgba(255,225,207,.78) 0, rgba(255,225,207,0) 25rem), radial-gradient(circle at 82% 84%, rgba(215,240,255,.70) 0, rgba(215,240,255,0) 28rem)",
            }}
        >
            <div
                className="
                    mx-auto
                    max-w-7xl
                "
            >
                <header
                    className="
                        mb-8
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >
                    <div>
                        <p
                            className="
                                text-xs
                                font-extrabold
                                uppercase
                                tracking-[0.17em]
                                text-[#796ba0]
                            "
                        >
                            Administration
                        </p>

                        <h1
                            className="
                                mt-1
                                font-serif
                                text-4xl
                                font-bold
                                tracking-[-0.045em]
                                text-[#3f3949]
                                sm:text-5xl
                            "
                        >
                            Admin Dashboard
                        </h1>
                    </div>

                    <div
                        className="
                            w-fit
                            rounded-full
                            border
                            border-[#ddd5e6]
                            bg-white/70
                            px-4
                            py-2
                            text-sm
                            font-bold
                            text-[#77707d]
                            shadow-sm
                            backdrop-blur-sm
                        "
                    >
                        {totalTickets} total tickets
                    </div>
                </header>

                {
                    err &&
                    <div
                        className="
                            mb-6
                            rounded-[22px]
                            border
                            border-[#e9bdcb]
                            bg-[#fbe3ea]
                            px-5
                            py-4
                            text-sm
                            font-bold
                            text-[#814d5d]
                        "
                    >
                        {err}
                    </div>
                }

                {/* TOP SUMMARY CARDS */}

                <section
                    className="
                        mb-8
                        grid
                        grid-cols-2
                        gap-4
                        lg:grid-cols-4
                    "
                >
                    <article
                        className="
                            relative
                            overflow-hidden
                            rounded-[28px]
                            border
                            border-[#d9cdf1]
                            bg-[#e9e0ff]
                            p-5
                            shadow-[0_14px_34px_rgba(91,73,126,0.08)]
                            sm:p-6
                        "
                    >
                        <div
                            className="
                                absolute
                                -right-8
                                -top-8
                                h-24
                                w-24
                                rounded-full
                                bg-white/35
                            "
                        />

                        <p
                            className="
                                text-sm
                                font-extrabold
                                text-[#665987]
                            "
                        >
                            Total Users
                        </p>

                        <p
                            className="
                                mt-5
                                text-4xl
                                font-black
                                tracking-[-0.06em]
                                text-[#4d4564]
                            "
                        >
                            {stats.users}
                        </p>
                    </article>

                    <article
                        className="
                            relative
                            overflow-hidden
                            rounded-[28px]
                            border
                            border-[#efcdb9]
                            bg-[#ffe3d1]
                            p-5
                            shadow-[0_14px_34px_rgba(129,82,59,0.07)]
                            sm:p-6
                        "
                    >
                        <div
                            className="
                                absolute
                                -right-8
                                -top-8
                                h-24
                                w-24
                                rounded-full
                                bg-white/35
                            "
                        />

                        <p
                            className="
                                text-sm
                                font-extrabold
                                text-[#895b47]
                            "
                        >
                            Services
                        </p>

                        <p
                            className="
                                mt-5
                                text-4xl
                                font-black
                                tracking-[-0.06em]
                                text-[#6e4938]
                            "
                        >
                            {stats.services}
                        </p>
                    </article>

                    <article
                        className="
                            relative
                            overflow-hidden
                            rounded-[28px]
                            border
                            border-[#c7dfef]
                            bg-[#dceeff]
                            p-5
                            shadow-[0_14px_34px_rgba(75,108,139,0.07)]
                            sm:p-6
                        "
                    >
                        <div
                            className="
                                absolute
                                -right-8
                                -top-8
                                h-24
                                w-24
                                rounded-full
                                bg-white/35
                            "
                        />

                        <p
                            className="
                                text-sm
                                font-extrabold
                                text-[#4d6e8b]
                            "
                        >
                            Queues
                        </p>

                        <p
                            className="
                                mt-5
                                text-4xl
                                font-black
                                tracking-[-0.06em]
                                text-[#3f5c76]
                            "
                        >
                            {stats.queues}
                        </p>
                    </article>

                    <article
                        className="
                            relative
                            overflow-hidden
                            rounded-[28px]
                            border
                            border-[#c9e2d3]
                            bg-[#dff2e6]
                            p-5
                            shadow-[0_14px_34px_rgba(65,104,79,0.07)]
                            sm:p-6
                        "
                    >
                        <div
                            className="
                                absolute
                                -right-8
                                -top-8
                                h-24
                                w-24
                                rounded-full
                                bg-white/35
                            "
                        />

                        <p
                            className="
                                text-sm
                                font-extrabold
                                text-[#52725e]
                            "
                        >
                            Counters
                        </p>

                        <p
                            className="
                                mt-5
                                text-4xl
                                font-black
                                tracking-[-0.06em]
                                text-[#405e4c]
                            "
                        >
                            {stats.counters}
                        </p>
                    </article>
                </section>

                {/* CHARTS */}

                <section
                    className="
                        mb-8
                        grid
                        gap-6
                        xl:grid-cols-[1.2fr_0.8fr]
                    "
                >
                    {/* VERTICAL BAR CHART */}

                    <article
                        className="
                            rounded-[30px]
                            border
                            border-[#e2d8ec]
                            bg-white/76
                            p-5
                            shadow-[0_18px_50px_rgba(89,71,116,0.08)]
                            backdrop-blur-sm
                            sm:p-7
                        "
                    >
                        <div
                            className="
                                mb-7
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
                                sm:items-end
                                sm:justify-between
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-xs
                                        font-extrabold
                                        uppercase
                                        tracking-[0.15em]
                                        text-[#8a7ea7]
                                    "
                                >
                                    Queue activity
                                </p>

                                <h2
                                    className="
                                        mt-1
                                        font-serif
                                        text-2xl
                                        font-bold
                                        tracking-[-0.035em]
                                        text-[#433d4d]
                                        sm:text-3xl
                                    "
                                >
                                    Tickets by status
                                </h2>
                            </div>

                            <p
                                className="
                                    text-sm
                                    font-bold
                                    text-[#8a8492]
                                "
                            >
                                Current ticket distribution
                            </p>
                        </div>

                        <div
                            className="
                                grid
                                grid-cols-[34px_1fr]
                                gap-3
                            "
                        >
                            {/* Y AXIS */}

                            <div
                                className="
                                    flex
                                    h-[300px]
                                    flex-col
                                    justify-between
                                    pb-10
                                    pt-1
                                    text-right
                                    text-xs
                                    font-bold
                                    text-[#928b99]
                                "
                            >
                                {
                                    yAxisTicks.map(
                                        (
                                            tick,
                                            index
                                        ) => (
                                            <span
                                                key={
                                                    `${tick}-${index}`
                                                }
                                            >
                                                {tick}
                                            </span>
                                        )
                                    )
                                }
                            </div>

                            {/* GRAPH */}

                            <div
                                className="
                                    relative
                                    h-[300px]
                                "
                            >
                                {/* GRID LINES */}

                                <div
                                    className="
                                        absolute
                                        inset-x-0
                                        top-0
                                        h-[250px]
                                    "
                                >
                                    {
                                        [
                                            0,
                                            25,
                                            50,
                                            75,
                                            100,
                                        ].map(
                                            (
                                                top
                                            ) => (
                                                <div
                                                    key={
                                                        top
                                                    }
                                                    className="
                                                        absolute
                                                        left-0
                                                        right-0
                                                        border-t
                                                        border-dashed
                                                        border-[#ddd6e5]
                                                    "
                                                    style={{
                                                        top:
                                                            `${top}%`,
                                                    }}
                                                />
                                            )
                                        )
                                    }
                                </div>

                                {/* BARS */}

                                <div
                                    className="
                                        absolute
                                        inset-x-0
                                        top-0
                                        flex
                                        h-[250px]
                                        items-end
                                        justify-around
                                        gap-3
                                        px-2
                                        sm:px-5
                                    "
                                >
                                    {
                                        ticketChart.map(
                                            (
                                                item
                                            ) => {

                                                const height =
                                                    item.value ===
                                                    0
                                                        ? 0
                                                        : Math.max(
                                                            (
                                                                item.value /
                                                                chartMax
                                                            ) *
                                                            100,

                                                            5
                                                        );

                                                return (
                                                    <div
                                                        key={
                                                            item.label
                                                        }
                                                        className="
                                                            flex
                                                            h-full
                                                            flex-1
                                                            flex-col
                                                            items-center
                                                            justify-end
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                mb-2
                                                                text-sm
                                                                font-black
                                                                text-[#514b58]
                                                            "
                                                        >
                                                            {
                                                                item.value
                                                            }
                                                        </span>

                                                        <div
                                                            className="
                                                                flex
                                                                h-[210px]
                                                                w-full
                                                                max-w-[76px]
                                                                items-end
                                                                justify-center
                                                                rounded-t-[18px]
                                                            "
                                                        >
                                                            <div
                                                                className="
                                                                    w-full
                                                                    rounded-t-[16px]
                                                                    shadow-[0_10px_22px_rgba(87,71,108,0.10)]
                                                                    transition-all
                                                                    duration-500
                                                                "
                                                                style={{
                                                                    height:
                                                                        `${height}%`,

                                                                    backgroundColor:
                                                                        item.color,

                                                                    minHeight:
                                                                        item.value ===
                                                                        0
                                                                            ? "0px"
                                                                            : "14px",
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )
                                    }
                                </div>

                                {/* X AXIS LABELS */}

                                <div
                                    className="
                                        absolute
                                        bottom-0
                                        left-0
                                        right-0
                                        grid
                                        grid-cols-4
                                        gap-2
                                        border-t
                                        border-[#d7d0df]
                                        pt-3
                                        text-center
                                    "
                                >
                                    {
                                        ticketChart.map(
                                            (
                                                item
                                            ) => (
                                                <div
                                                    key={
                                                        item.label
                                                    }
                                                >
                                                    <span
                                                        className="
                                                            mx-auto
                                                            mb-1.5
                                                            block
                                                            h-2.5
                                                            w-2.5
                                                            rounded-full
                                                        "
                                                        style={{
                                                            backgroundColor:
                                                                item.color,
                                                        }}
                                                    />

                                                    <p
                                                        className="
                                                            text-[11px]
                                                            font-extrabold
                                                            text-[#746e7b]
                                                            sm:text-xs
                                                        "
                                                    >
                                                        {
                                                            item.label
                                                        }
                                                    </p>
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* DONUT CHART */}

                    <article
                        className="
                            rounded-[30px]
                            border
                            border-[#e2d8ec]
                            bg-white/76
                            p-5
                            shadow-[0_18px_50px_rgba(89,71,116,0.08)]
                            backdrop-blur-sm
                            sm:p-7
                        "
                    >
                        <div
                            className="
                                mb-6
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-extrabold
                                    uppercase
                                    tracking-[0.15em]
                                    text-[#8a7ea7]
                                "
                            >
                                User mix
                            </p>

                            <h2
                                className="
                                    mt-1
                                    font-serif
                                    text-2xl
                                    font-bold
                                    tracking-[-0.035em]
                                    text-[#433d4d]
                                    sm:text-3xl
                                "
                            >
                                Users by role
                            </h2>
                        </div>

                        <div
                            className="
                                flex
                                flex-col
                                items-center
                                gap-7
                            "
                        >
                            <div
                                className="
                                    relative
                                    h-52
                                    w-52
                                    rounded-full
                                    shadow-[0_15px_38px_rgba(89,71,116,0.12)]
                                    sm:h-56
                                    sm:w-56
                                "
                                style={{
                                    background:
                                        donutBackground,
                                }}
                            >
                                <div
                                    className="
                                        absolute
                                        inset-[39px]
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#fffdfd]
                                        shadow-inner
                                    "
                                >
                                    <span
                                        className="
                                            text-4xl
                                            font-black
                                            tracking-[-0.06em]
                                            text-[#474150]
                                        "
                                    >
                                        {userTotal}
                                    </span>

                                    <span
                                        className="
                                            mt-1
                                            text-xs
                                            font-extrabold
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#928b99]
                                        "
                                    >
                                        Users
                                    </span>
                                </div>
                            </div>

                            <div
                                className="
                                    grid
                                    w-full
                                    gap-3
                                    sm:grid-cols-3
                                    xl:grid-cols-1
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-[18px]
                                        bg-[#eee7ff]
                                        px-4
                                        py-3
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2.5
                                        "
                                    >
                                        <span
                                            className="
                                                h-3
                                                w-3
                                                rounded-full
                                                bg-[#b9a7ea]
                                            "
                                        />

                                        <span
                                            className="
                                                text-sm
                                                font-bold
                                                text-[#625a70]
                                            "
                                        >
                                            Customers
                                        </span>
                                    </div>

                                    <span
                                        className="
                                            font-black
                                            text-[#4d4659]
                                        "
                                    >
                                        {stats.customers}
                                    </span>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-[18px]
                                        bg-[#e2f1ff]
                                        px-4
                                        py-3
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2.5
                                        "
                                    >
                                        <span
                                            className="
                                                h-3
                                                w-3
                                                rounded-full
                                                bg-[#95c8e8]
                                            "
                                        />

                                        <span
                                            className="
                                                text-sm
                                                font-bold
                                                text-[#557086]
                                            "
                                        >
                                            Staff
                                        </span>
                                    </div>

                                    <span
                                        className="
                                            font-black
                                            text-[#405d72]
                                        "
                                    >
                                        {stats.staff}
                                    </span>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-[18px]
                                        bg-[#fff0da]
                                        px-4
                                        py-3
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2.5
                                        "
                                    >
                                        <span
                                            className="
                                                h-3
                                                w-3
                                                rounded-full
                                                bg-[#f5c98d]
                                            "
                                        />

                                        <span
                                            className="
                                                text-sm
                                                font-bold
                                                text-[#806440]
                                            "
                                        >
                                            Admins
                                        </span>
                                    </div>

                                    <span
                                        className="
                                            font-black
                                            text-[#6a5233]
                                        "
                                    >
                                        {stats.admins}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>

                {/* TICKET COUNTS */}

                <section
                    className="
                        mb-8
                        grid
                        grid-cols-2
                        gap-3
                        sm:grid-cols-4
                    "
                >
                    {
                        ticketChart.map(
                            (item) => (
                                <div
                                    key={
                                        item.label
                                    }
                                    className="
                                        rounded-[22px]
                                        border
                                        px-5
                                        py-4
                                    "
                                    style={{
                                        backgroundColor:
                                            item.soft,

                                        borderColor:
                                            item.color,
                                    }}
                                >
                                    <p
                                        className="
                                            text-xs
                                            font-extrabold
                                            uppercase
                                            tracking-[0.11em]
                                            text-[#6f6876]
                                        "
                                    >
                                        {
                                            item.label
                                        }
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-2xl
                                            font-black
                                            text-[#4b4552]
                                        "
                                    >
                                        {
                                            item.value
                                        }
                                    </p>
                                </div>
                            )
                        )
                    }
                </section>

                {/* MANAGEMENT */}

                <section>
                    <div
                        className="
                            mb-4
                        "
                    >
                        <p
                            className="
                                text-xs
                                font-extrabold
                                uppercase
                                tracking-[0.16em]
                                text-[#8275a2]
                            "
                        >
                            Management
                        </p>

                        <h2
                            className="
                                mt-1
                                font-serif
                                text-3xl
                                font-bold
                                tracking-[-0.035em]
                                text-[#403a4c]
                            "
                        >
                            Manage the system
                        </h2>
                    </div>

                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-3
                        "
                    >
                        {
                            managementLinks.map(
                                (
                                    item
                                ) => (
                                    <Link
                                        key={
                                            item.href
                                        }
                                        href={
                                            item.href
                                        }
                                        className="
                                            group
                                            rounded-[26px]
                                            border
                                            p-5
                                            shadow-[0_12px_30px_rgba(86,68,110,0.06)]
                                            transition
                                            hover:-translate-y-1
                                            hover:shadow-[0_18px_36px_rgba(86,68,110,0.10)]
                                        "
                                        style={{
                                            backgroundColor:
                                                item.color,

                                            borderColor:
                                                item.border,
                                        }}
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
                                                    h-12
                                                    w-12
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-[17px]
                                                    bg-white/55
                                                    text-lg
                                                    font-black
                                                    shadow-sm
                                                "
                                                style={{
                                                    color:
                                                        item.ink,
                                                }}
                                            >
                                                {
                                                    item.letter
                                                }
                                            </div>

                                            <div
                                                className="
                                                    min-w-0
                                                    flex-1
                                                "
                                            >
                                                <h3
                                                    className="
                                                        font-extrabold
                                                    "
                                                    style={{
                                                        color:
                                                            item.ink,
                                                    }}
                                                >
                                                    {
                                                        item.title
                                                    }
                                                </h3>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-sm
                                                        font-semibold
                                                        opacity-75
                                                    "
                                                    style={{
                                                        color:
                                                            item.ink,
                                                    }}
                                                >
                                                    {
                                                        item.note
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className="
                                                    text-xl
                                                    font-bold
                                                    opacity-60
                                                    transition
                                                    group-hover:translate-x-1
                                                "
                                                style={{
                                                    color:
                                                        item.ink,
                                                }}
                                                aria-hidden="true"
                                            >
                                                →
                                            </span>
                                        </div>
                                    </Link>
                                )
                            )
                        }
                    </div>
                </section>
            </div>
        </div>
    );
}