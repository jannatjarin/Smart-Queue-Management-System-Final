"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import api from "@/lib/axios";


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
    estimatedWaitMinutes: number | null;

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


const statusStyles:
    Record<string, string> =
{
    waiting:
        "border-[#E7C96C] bg-[#FFF3BF] text-[#745B12]",

    called:
        "border-[#A9CDEC] bg-[#DDEEFF] text-[#315C80]",

    completed:
        "border-[#ACD7C0] bg-[#DFF3E7] text-[#35634A]",

    cancelled:
        "border-[#E7BAC9] bg-[#FBE1E9] text-[#814A5C]",
};


const statusDotStyles:
    Record<string, string> =
{
    waiting:
        "bg-[#D9AF32]",

    called:
        "bg-[#70A8D6]",

    completed:
        "bg-[#67A880]",

    cancelled:
        "bg-[#C97991]",
};


function StatusPill(
    {
        status,
    }: {
        status: string;
    }
) {

    const normalized =
        status.toLowerCase();


    return (
        <span
            className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                px-3
                py-1.5
                text-xs
                font-bold
                capitalize

                ${
                    statusStyles[
                        normalized
                    ] ||
                    "border-[#DCD5E7] bg-[#F3EFF7] text-[#655F70]"
                }
            `}
        >

            <span
                className={`
                    h-2
                    w-2
                    rounded-full

                    ${
                        statusDotStyles[
                            normalized
                        ] ||
                        "bg-[#948C9D]"
                    }
                `}
                aria-hidden="true"
            />

            {
                status.replaceAll(
                    "_",
                    " "
                )
            }

        </span>
    );

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


                        setUser(
                            userResponse.data
                        );


                        const ticketsResponse =
                            await api.get<Ticket[]>(
                                "/tickets/mytickets"
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


    const recentActivity =
        tickets.slice(
            0,
            5
        );


    if (loading) {

        return (
            <div
                className="
                    -mx-5
                    flex
                    min-h-[70vh]
                    items-center
                    justify-center
                    bg-[#FBF8FF]
                    px-5
                "
            >

                <div
                    className="
                        rounded-[28px]
                        border
                        border-[#E6DDF0]
                        bg-[#F0E9FF]
                        px-7
                        py-5
                        shadow-[0_14px_40px_rgba(93,75,120,0.10)]
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <span
                            className="
                                loading
                                loading-spinner
                                loading-sm
                                text-[#7968A8]
                            "
                        />

                        <span
                            className="
                                font-semibold
                                text-[#595365]
                            "
                        >
                            Loading your dashboard...
                        </span>

                    </div>

                </div>

            </div>
        );

    }


    return (
        <div
            className="
                -mx-5
                min-h-screen
                overflow-hidden
                px-5
                py-8
                sm:py-10
            "
            style={{
                backgroundColor:
                    "#FBF8FF",

                backgroundImage:
                    "radial-gradient(circle at 5% 8%, rgba(224,211,255,.78) 0, rgba(224,211,255,0) 27rem), radial-gradient(circle at 96% 14%, rgba(255,225,199,.72) 0, rgba(255,225,199,0) 25rem), radial-gradient(circle at 85% 78%, rgba(211,238,255,.72) 0, rgba(211,238,255,0) 28rem), radial-gradient(circle at 18% 92%, rgba(255,240,182,.60) 0, rgba(255,240,182,0) 24rem)",
            }}
        >

            <div
                className="
                    mx-auto
                    max-w-7xl
                "
            >

                {/* HERO */}

                <section
                    className="
                        relative
                        mb-7
                        overflow-hidden
                        rounded-[34px]
                        border
                        border-white/80
                        bg-[linear-gradient(120deg,#EDE5FF_0%,#FFE8D9_45%,#DFF0FF_100%)]
                        p-6
                        shadow-[0_24px_70px_rgba(101,80,130,0.13)]
                        sm:p-9
                        lg:p-10
                    "
                >

                    <div
                        className="
                            absolute
                            -right-14
                            -top-16
                            h-52
                            w-52
                            rounded-full
                            bg-white/35
                            blur-[2px]
                        "
                    />


                    <div
                        className="
                            absolute
                            bottom-[-62px]
                            left-[46%]
                            h-40
                            w-40
                            rounded-full
                            bg-[#FFF2B8]/50
                        "
                    />


                    <div
                        className="
                            absolute
                            right-[28%]
                            top-8
                            hidden
                            h-16
                            w-16
                            rotate-12
                            rounded-[22px]
                            border
                            border-white/70
                            bg-white/25
                            lg:block
                        "
                    />


                    <div
                        className="
                            relative
                            grid
                            gap-7
                            lg:grid-cols-[1.25fr_0.75fr]
                            lg:items-center
                        "
                    >

                        <div>

                            <div
                                className="
                                    mb-5
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-white/80
                                    bg-white/55
                                    px-3.5
                                    py-2
                                    text-xs
                                    font-extrabold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#6E5F95]
                                    shadow-sm
                                    backdrop-blur-sm
                                "
                            >

                                <span
                                    className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-[#9B86C8]
                                    "
                                />

                                Your queue space

                            </div>


                            <h1
                                className="
                                    max-w-3xl
                                    font-serif
                                    text-[2.75rem]
                                    font-bold
                                    leading-[1.04]
                                    tracking-[-0.045em]
                                    text-[#3D374B]
                                    sm:text-5xl
                                    lg:text-[3.7rem]
                                "
                            >

                                Hi, {
                                    user
                                        ?.fullName
                                        .split(" ")[0] ||
                                    "there"
                                }.

                                <span
                                    className="
                                        block
                                        text-[#675B91]
                                    "
                                >
                                    Your wait, made simpler.
                                </span>

                            </h1>


                            <p
                                className="
                                    mt-5
                                    max-w-2xl
                                    text-[15px]
                                    font-medium
                                    leading-7
                                    text-[#625C6D]
                                    sm:text-base
                                "
                            >
                                See where you are in line,
                                keep an eye on your current
                                ticket, and join another queue
                                without the usual confusion.
                            </p>


                            <div
                                className="
                                    mt-7
                                    flex
                                    flex-wrap
                                    gap-3
                                "
                            >

                                <Link
                                    href="/customer/queues"
                                    className="
                                        inline-flex
                                        min-h-12
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#7464A4]
                                        px-6
                                        py-3
                                        text-sm
                                        font-extrabold
                                        text-white
                                        shadow-[0_10px_26px_rgba(116,100,164,0.28)]
                                        transition
                                        hover:-translate-y-0.5
                                        hover:bg-[#66558F]
                                    "
                                >
                                    Get a ticket

                                    <span
                                        className="
                                            ml-2
                                            text-lg
                                        "
                                        aria-hidden="true"
                                    >
                                        →
                                    </span>
                                </Link>


                                <Link
                                    href="/customer/tickets"
                                    className="
                                        inline-flex
                                        min-h-12
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-[#D7CCE5]
                                        bg-white/70
                                        px-6
                                        py-3
                                        text-sm
                                        font-extrabold
                                        text-[#5B5368]
                                        shadow-sm
                                        backdrop-blur-sm
                                        transition
                                        hover:-translate-y-0.5
                                        hover:bg-white
                                    "
                                >
                                    My tickets
                                </Link>

                            </div>

                        </div>


                        {/* LITTLE PASTEL CARD */}

                        <div
                            className="
                                relative
                                mx-auto
                                w-full
                                max-w-sm
                                lg:ml-auto
                            "
                        >

                            <div
                                className="
                                    rotate-2
                                    rounded-[30px]
                                    border
                                    border-white/80
                                    bg-white/55
                                    p-4
                                    shadow-[0_18px_50px_rgba(99,81,126,0.12)]
                                    backdrop-blur-md
                                "
                            >

                                <div
                                    className="
                                        -rotate-2
                                        rounded-[24px]
                                        bg-[#FFF6C9]
                                        p-5
                                    "
                                >

                                    <p
                                        className="
                                            text-xs
                                            font-extrabold
                                            uppercase
                                            tracking-[0.14em]
                                            text-[#8A7331]
                                        "
                                    >
                                        Right now
                                    </p>


                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-end
                                            justify-between
                                            gap-5
                                        "
                                    >

                                        <div>

                                            <p
                                                className="
                                                    text-5xl
                                                    font-black
                                                    tracking-[-0.06em]
                                                    text-[#5E5029]
                                                "
                                            >
                                                {activeCount}
                                            </p>


                                            <p
                                                className="
                                                    mt-1
                                                    text-sm
                                                    font-bold
                                                    text-[#7A682F]
                                                "
                                            >
                                                active{" "}
                                                {
                                                    activeCount ===
                                                    1
                                                        ? "ticket"
                                                        : "tickets"
                                                }
                                            </p>

                                        </div>


                                        <div
                                            className="
                                                flex
                                                h-16
                                                w-16
                                                items-center
                                                justify-center
                                                rounded-[22px]
                                                bg-white/55
                                                text-2xl
                                                text-[#806F37]
                                            "
                                        >
                                            ◌
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ERROR */}

                {
                    err &&
                    <div
                        className="
                            mb-6
                            rounded-[22px]
                            border
                            border-[#EABCCA]
                            bg-[#FBE3EA]
                            px-5
                            py-4
                            text-sm
                            font-bold
                            text-[#814D5D]
                            shadow-sm
                        "
                    >
                        {err}
                    </div>
                }


                {/* STATS */}

                <section className="mb-8">

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
                                    font-extrabold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#8575A7]
                                "
                            >
                                At a glance
                            </p>


                            <h2
                                className="
                                    mt-1
                                    font-serif
                                    text-3xl
                                    font-bold
                                    tracking-[-0.035em]
                                    text-[#403A4C]
                                "
                            >
                                Your ticket story
                            </h2>

                        </div>


                        <p
                            className="
                                hidden
                                text-sm
                                font-medium
                                text-[#8A8491]
                                sm:block
                            "
                        >
                            A quick look at your activity
                        </p>

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-4
                            lg:grid-cols-4
                        "
                    >

                        {/* LAVENDER */}

                        <article
                            className="
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-[#DDD1F4]
                                bg-[#E9E0FF]
                                p-5
                                shadow-[0_14px_35px_rgba(104,83,137,0.09)]
                                sm:p-6
                            "
                        >

                            <div
                                className="
                                    absolute
                                    -right-7
                                    -top-7
                                    h-20
                                    w-20
                                    rounded-full
                                    bg-white/35
                                "
                            />


                            <div
                                className="
                                    mb-8
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-[16px]
                                    bg-white/55
                                    text-xl
                                    text-[#6B5D95]
                                "
                            >
                                #
                            </div>


                            <p
                                className="
                                    text-sm
                                    font-extrabold
                                    text-[#625783]
                                "
                            >
                                Total tickets
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-4xl
                                    font-black
                                    tracking-[-0.06em]
                                    text-[#4D4564]
                                "
                            >
                                {tickets.length}
                            </p>

                        </article>


                        {/* SKY BLUE */}

                        <article
                            className="
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-[#C8DFF2]
                                bg-[#DCEEFF]
                                p-5
                                shadow-[0_14px_35px_rgba(75,112,143,0.08)]
                                sm:p-6
                            "
                        >

                            <div
                                className="
                                    absolute
                                    -right-7
                                    -top-7
                                    h-20
                                    w-20
                                    rounded-full
                                    bg-white/35
                                "
                            />


                            <div
                                className="
                                    mb-8
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-[16px]
                                    bg-white/55
                                    text-xl
                                    text-[#4E7599]
                                "
                            >
                                ◉
                            </div>


                            <p
                                className="
                                    text-sm
                                    font-extrabold
                                    text-[#4D6E8C]
                                "
                            >
                                Active now
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-4xl
                                    font-black
                                    tracking-[-0.06em]
                                    text-[#3E5D78]
                                "
                            >
                                {activeCount}
                            </p>

                        </article>


                        {/* BUTTER YELLOW */}

                        <article
                            className="
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-[#E6D695]
                                bg-[#FFF2BA]
                                p-5
                                shadow-[0_14px_35px_rgba(142,117,45,0.08)]
                                sm:p-6
                            "
                        >

                            <div
                                className="
                                    absolute
                                    -right-7
                                    -top-7
                                    h-20
                                    w-20
                                    rounded-full
                                    bg-white/35
                                "
                            />


                            <div
                                className="
                                    mb-8
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-[16px]
                                    bg-white/55
                                    text-xl
                                    text-[#8B742C]
                                "
                            >
                                ◷
                            </div>


                            <p
                                className="
                                    text-sm
                                    font-extrabold
                                    text-[#7B6527]
                                "
                            >
                                Waiting
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-4xl
                                    font-black
                                    tracking-[-0.06em]
                                    text-[#63511F]
                                "
                            >
                                {waitingCount}
                            </p>

                        </article>


                        {/* SOFT ORANGE */}

                        <article
                            className="
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-[#F0CDBB]
                                bg-[#FFE2D2]
                                p-5
                                shadow-[0_14px_35px_rgba(139,92,70,0.08)]
                                sm:p-6
                            "
                        >

                            <div
                                className="
                                    absolute
                                    -right-7
                                    -top-7
                                    h-20
                                    w-20
                                    rounded-full
                                    bg-white/35
                                "
                            />


                            <div
                                className="
                                    mb-8
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-[16px]
                                    bg-white/55
                                    text-xl
                                    text-[#9C6750]
                                "
                            >
                                ✓
                            </div>


                            <p
                                className="
                                    text-sm
                                    font-extrabold
                                    text-[#8B5B46]
                                "
                            >
                                Completed
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-4xl
                                    font-black
                                    tracking-[-0.06em]
                                    text-[#704936]
                                "
                            >
                                {completedCount}
                            </p>

                        </article>

                    </div>

                </section>


                {/* CURRENT TICKET + QUICK ACTIONS */}

                <div
                    className="
                        grid
                        gap-6
                        xl:grid-cols-[1.45fr_0.55fr]
                    "
                >

                    <section>

                        <div className="mb-4">

                            <p
                                className="
                                    text-xs
                                    font-extrabold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#8575A7]
                                "
                            >
                                The one that matters most
                            </p>


                            <h2
                                className="
                                    mt-1
                                    font-serif
                                    text-3xl
                                    font-bold
                                    tracking-[-0.035em]
                                    text-[#403A4C]
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
                                            relative
                                            overflow-hidden
                                            rounded-[34px]
                                            border
                                            border-[#DAD0E7]
                                            bg-[#FFF9FD]
                                            shadow-[0_22px_60px_rgba(95,76,122,0.12)]
                                        "
                                    >

                                        <div
                                            className="
                                                absolute
                                                inset-x-0
                                                top-0
                                                h-3
                                                bg-[linear-gradient(90deg,#CFC2F5_0%,#FFD7C4_34%,#BFDFF6_68%,#F8E492_100%)]
                                            "
                                        />


                                        <div
                                            className="
                                                grid
                                                lg:grid-cols-[1fr_200px]
                                            "
                                        >

                                            <div
                                                className="
                                                    p-6
                                                    pt-8
                                                    sm:p-8
                                                    sm:pt-10
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        flex-wrap
                                                        items-start
                                                        justify-between
                                                        gap-4
                                                    "
                                                >

                                                    <div>

                                                        <p
                                                            className="
                                                                text-xs
                                                                font-extrabold
                                                                uppercase
                                                                tracking-[0.16em]
                                                                text-[#948B9E]
                                                            "
                                                        >
                                                            Your number
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                font-serif
                                                                text-5xl
                                                                font-bold
                                                                tracking-[-0.05em]
                                                                text-[#3D374A]
                                                                sm:text-6xl
                                                            "
                                                        >
                                                            {
                                                                activeTicket
                                                                    .ticketNumber
                                                            }
                                                        </p>

                                                    </div>


                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            gap-2
                                                        "
                                                    >

                                                        <StatusPill
                                                            status={
                                                                activeTicket
                                                                    .status
                                                            }
                                                        />


                                                        <span
                                                            className="
                                                                inline-flex
                                                                rounded-full
                                                                border
                                                                border-[#DDD5E7]
                                                                bg-[#F4EFF8]
                                                                px-3
                                                                py-1.5
                                                                text-xs
                                                                font-bold
                                                                capitalize
                                                                text-[#655F70]
                                                            "
                                                        >
                                                            {
                                                                activeTicket
                                                                    .priority
                                                            }{" "}
                                                            priority
                                                        </span>

                                                    </div>

                                                </div>


                                                <div
                                                    className="
                                                        my-7
                                                        border-t-2
                                                        border-dashed
                                                        border-[#E6DDEA]
                                                    "
                                                />


                                                <div
                                                    className="
                                                        grid
                                                        gap-3
                                                        sm:grid-cols-2
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            rounded-[20px]
                                                            bg-[#EEE7FF]
                                                            p-4
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-[11px]
                                                                font-extrabold
                                                                uppercase
                                                                tracking-[0.13em]
                                                                text-[#887BA5]
                                                            "
                                                        >
                                                            Service
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1.5
                                                                font-extrabold
                                                                text-[#51495F]
                                                            "
                                                        >
                                                            {
                                                                activeTicket
                                                                    .service
                                                                    .name
                                                            }
                                                        </p>

                                                    </div>


                                                    <div
                                                        className="
                                                            rounded-[20px]
                                                            bg-[#FFE9DC]
                                                            p-4
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-[11px]
                                                                font-extrabold
                                                                uppercase
                                                                tracking-[0.13em]
                                                                text-[#9A7462]
                                                            "
                                                        >
                                                            Queue
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1.5
                                                                font-extrabold
                                                                text-[#624C42]
                                                            "
                                                        >
                                                            {
                                                                activeTicket
                                                                    .queue
                                                                    .name
                                                            }
                                                        </p>

                                                    </div>


                                                    <div
                                                        className="
                                                            rounded-[20px]
                                                            bg-[#DFF0FF]
                                                            p-4
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-[11px]
                                                                font-extrabold
                                                                uppercase
                                                                tracking-[0.13em]
                                                                text-[#6886A2]
                                                            "
                                                        >
                                                            Counter
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1.5
                                                                font-extrabold
                                                                text-[#45617A]
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


                                                    <div
                                                        className="
                                                            rounded-[20px]
                                                            bg-[#FFF2BA]
                                                            p-4
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                text-[11px]
                                                                font-extrabold
                                                                uppercase
                                                                tracking-[0.13em]
                                                                text-[#8B742C]
                                                            "
                                                        >
                                                            {
                                                                activeTicket
                                                                    .status ==
                                                                "waiting"
                                                                    ? "Estimated wait"
                                                                    : "Current status"
                                                            }
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1.5
                                                                font-extrabold
                                                                text-[#665420]
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
                                                                        : `${activeTicket.estimatedWaitMinutes} minutes`
                                                                    : "Please proceed when called"
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* TICKET STUB */}

                                            <div
                                                className="
                                                    relative
                                                    flex
                                                    flex-col
                                                    justify-between
                                                    border-t-2
                                                    border-dashed
                                                    border-[#E1D6E8]
                                                    bg-[linear-gradient(180deg,#F1E9FF_0%,#E3F2FF_100%)]
                                                    p-6
                                                    lg:border-l-2
                                                    lg:border-t-0
                                                "
                                            >

                                                <div>

                                                    <p
                                                        className="
                                                            text-xs
                                                            font-extrabold
                                                            uppercase
                                                            tracking-[0.14em]
                                                            text-[#75698D]
                                                        "
                                                    >
                                                        Keep this handy
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-3
                                                            text-sm
                                                            font-semibold
                                                            leading-6
                                                            text-[#655E70]
                                                        "
                                                    >
                                                        You can check every
                                                        update from your
                                                        ticket history.
                                                    </p>

                                                </div>


                                                <Link
                                                    href="/customer/tickets"
                                                    className="
                                                        mt-8
                                                        inline-flex
                                                        min-h-11
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-[#7464A4]
                                                        px-5
                                                        py-2.5
                                                        text-sm
                                                        font-extrabold
                                                        text-white
                                                        shadow-[0_8px_20px_rgba(116,100,164,0.22)]
                                                        transition
                                                        hover:-translate-y-0.5
                                                        hover:bg-[#66558F]
                                                    "
                                                >
                                                    View details
                                                </Link>

                                            </div>

                                        </div>

                                    </article>
                                )
                                : (
                                    <article
                                        className="
                                            relative
                                            overflow-hidden
                                            rounded-[34px]
                                            border
                                            border-[#DCCFEE]
                                            bg-[linear-gradient(130deg,#EFE7FF_0%,#FFF2C9_52%,#E4F1FF_100%)]
                                            p-7
                                            shadow-[0_20px_55px_rgba(99,80,126,0.10)]
                                            sm:p-9
                                        "
                                    >

                                        <div
                                            className="
                                                absolute
                                                -right-12
                                                -top-12
                                                h-44
                                                w-44
                                                rounded-full
                                                bg-white/30
                                            "
                                        />


                                        <div
                                            className="
                                                relative
                                                max-w-xl
                                            "
                                        >

                                            <div
                                                className="
                                                    mb-5
                                                    flex
                                                    h-14
                                                    w-14
                                                    items-center
                                                    justify-center
                                                    rounded-[20px]
                                                    bg-white/60
                                                    text-2xl
                                                    font-black
                                                    text-[#6C5F94]
                                                    shadow-sm
                                                "
                                            >
                                                Q
                                            </div>


                                            <h3
                                                className="
                                                    font-serif
                                                    text-3xl
                                                    font-bold
                                                    tracking-[-0.035em]
                                                    text-[#443E50]
                                                "
                                            >
                                                No active ticket right now.
                                            </h3>


                                            <p
                                                className="
                                                    mt-3
                                                    text-sm
                                                    font-medium
                                                    leading-6
                                                    text-[#6C6674]
                                                "
                                            >
                                                Your dashboard is quiet for
                                                now. When you join a queue,
                                                your live ticket and waiting
                                                details will appear right here.
                                            </p>


                                            <Link
                                                href="/customer/queues"
                                                className="
                                                    mt-6
                                                    inline-flex
                                                    min-h-11
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-[#7464A4]
                                                    px-5
                                                    py-2.5
                                                    text-sm
                                                    font-extrabold
                                                    text-white
                                                    shadow-[0_8px_20px_rgba(116,100,164,0.22)]
                                                    transition
                                                    hover:-translate-y-0.5
                                                    hover:bg-[#66558F]
                                                "
                                            >
                                                Browse queues
                                            </Link>

                                        </div>

                                    </article>
                                )
                        }

                    </section>


                    {/* QUICK ACTIONS */}

                    <aside>

                        <div className="mb-4">

                            <p
                                className="
                                    text-xs
                                    font-extrabold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#8575A7]
                                "
                            >
                                Shortcuts
                            </p>


                            <h2
                                className="
                                    mt-1
                                    font-serif
                                    text-3xl
                                    font-bold
                                    tracking-[-0.035em]
                                    text-[#403A4C]
                                "
                            >
                                Quick actions
                            </h2>

                        </div>


                        <div
                            className="
                                grid
                                gap-3
                                sm:grid-cols-2
                                xl:grid-cols-1
                            "
                        >

                            {/* ORANGE */}

                            <Link
                                href="/customer/queues"
                                className="
                                    group
                                    rounded-[25px]
                                    border
                                    border-[#E9C9B8]
                                    bg-[#FFE4D4]
                                    p-5
                                    shadow-[0_12px_30px_rgba(128,83,61,0.07)]
                                    transition
                                    hover:-translate-y-1
                                    hover:shadow-[0_16px_34px_rgba(128,83,61,0.11)]
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
                                                text-sm
                                                font-extrabold
                                                text-[#704F40]
                                            "
                                        >
                                            Get a ticket
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                font-semibold
                                                leading-5
                                                text-[#8B6958]
                                            "
                                        >
                                            Join an open queue
                                        </p>

                                    </div>


                                    <span
                                        className="
                                            text-2xl
                                            text-[#A66F58]
                                            transition
                                            group-hover:translate-x-1
                                        "
                                    >
                                        →
                                    </span>

                                </div>

                            </Link>


                            {/* LAVENDER */}

                            <Link
                                href="/services"
                                className="
                                    group
                                    rounded-[25px]
                                    border
                                    border-[#D8CCEF]
                                    bg-[#EAE2FF]
                                    p-5
                                    shadow-[0_12px_30px_rgba(91,73,126,0.07)]
                                    transition
                                    hover:-translate-y-1
                                    hover:shadow-[0_16px_34px_rgba(91,73,126,0.11)]
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
                                                text-sm
                                                font-extrabold
                                                text-[#5E527C]
                                            "
                                        >
                                            Services
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                font-semibold
                                                leading-5
                                                text-[#786E91]
                                            "
                                        >
                                            See what is available
                                        </p>

                                    </div>


                                    <span
                                        className="
                                            text-2xl
                                            text-[#8171AE]
                                            transition
                                            group-hover:translate-x-1
                                        "
                                    >
                                        →
                                    </span>

                                </div>

                            </Link>


                            {/* SKY BLUE */}

                            <Link
                                href="/customer/notifications"
                                className="
                                    group
                                    rounded-[25px]
                                    border
                                    border-[#C8DEEF]
                                    bg-[#DDEEFF]
                                    p-5
                                    shadow-[0_12px_30px_rgba(76,109,139,0.07)]
                                    transition
                                    hover:-translate-y-1
                                    hover:shadow-[0_16px_34px_rgba(76,109,139,0.11)]
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
                                                text-sm
                                                font-extrabold
                                                text-[#486B89]
                                            "
                                        >
                                            Notifications
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                font-semibold
                                                leading-5
                                                text-[#67839B]
                                            "
                                        >
                                            Catch every update
                                        </p>

                                    </div>


                                    <span
                                        className="
                                            text-2xl
                                            text-[#6D99BE]
                                            transition
                                            group-hover:translate-x-1
                                        "
                                    >
                                        →
                                    </span>

                                </div>

                            </Link>


                            {/* BUTTER YELLOW */}

                            <Link
                                href="/customer/profile"
                                className="
                                    group
                                    rounded-[25px]
                                    border
                                    border-[#E5D58F]
                                    bg-[#FFF2BA]
                                    p-5
                                    shadow-[0_12px_30px_rgba(132,110,41,0.07)]
                                    transition
                                    hover:-translate-y-1
                                    hover:shadow-[0_16px_34px_rgba(132,110,41,0.11)]
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
                                                text-sm
                                                font-extrabold
                                                text-[#6F5D24]
                                            "
                                        >
                                            Profile
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                font-semibold
                                                leading-5
                                                text-[#88763C]
                                            "
                                        >
                                            Keep details current
                                        </p>

                                    </div>


                                    <span
                                        className="
                                            text-2xl
                                            text-[#9C8331]
                                            transition
                                            group-hover:translate-x-1
                                        "
                                    >
                                        →
                                    </span>

                                </div>

                            </Link>

                        </div>

                    </aside>

                </div>


                {/* RECENT ACTIVITY */}

                <section className="mt-8">

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
                                    font-extrabold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#8575A7]
                                "
                            >
                                Recent moments
                            </p>


                            <h2
                                className="
                                    mt-1
                                    font-serif
                                    text-3xl
                                    font-bold
                                    tracking-[-0.035em]
                                    text-[#403A4C]
                                "
                            >
                                Recent activity
                            </h2>

                        </div>


                        <Link
                            href="/customer/tickets"
                            className="
                                text-sm
                                font-extrabold
                                text-[#6C5F94]
                                transition
                                hover:text-[#514675]
                            "
                        >
                            View all →
                        </Link>

                    </div>


                    <div
                        className="
                            overflow-hidden
                            rounded-[30px]
                            border
                            border-[#E3D9EC]
                            bg-white/65
                            p-3
                            shadow-[0_18px_50px_rgba(94,76,120,0.08)]
                            backdrop-blur-sm
                            sm:p-4
                        "
                    >

                        {
                            recentActivity.length ==
                                0
                                ? (
                                    <div
                                        className="
                                            rounded-[24px]
                                            bg-[#F3EDFF]
                                            px-6
                                            py-10
                                            text-center
                                        "
                                    >

                                        <p
                                            className="
                                                font-serif
                                                text-2xl
                                                font-bold
                                                text-[#50495C]
                                            "
                                        >
                                            Your story starts with
                                            your first ticket.
                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                font-medium
                                                text-[#7D7686]
                                            "
                                        >
                                            Recent queue activity
                                            will appear here.
                                        </p>

                                    </div>
                                )
                                : (
                                    <div className="space-y-2">

                                        {
                                            recentActivity.map(
                                                (
                                                    ticket,
                                                    index
                                                ) => {

                                                    const tones =
                                                        [
                                                            "bg-[#F0E9FF]",
                                                            "bg-[#FFF0E4]",
                                                            "bg-[#E5F2FF]",
                                                            "bg-[#FFF5C9]",
                                                            "bg-[#E5F4EA]",
                                                        ];


                                                    return (
                                                        <div
                                                            key={
                                                                ticket.id
                                                            }
                                                            className={`
                                                                grid
                                                                gap-3
                                                                rounded-[22px]
                                                                p-4
                                                                sm:grid-cols-[110px_1fr_auto_auto]
                                                                sm:items-center

                                                                ${
                                                                    tones[
                                                                        index %
                                                                        tones.length
                                                                    ]
                                                                }
                                                            `}
                                                        >

                                                            <p
                                                                className="
                                                                    font-serif
                                                                    text-xl
                                                                    font-bold
                                                                    tracking-[-0.03em]
                                                                    text-[#484252]
                                                                "
                                                            >
                                                                {
                                                                    ticket
                                                                        .ticketNumber
                                                                }
                                                            </p>


                                                            <div>

                                                                <p
                                                                    className="
                                                                        text-sm
                                                                        font-extrabold
                                                                        text-[#56505F]
                                                                    "
                                                                >
                                                                    {
                                                                        ticket
                                                                            .queue
                                                                            .name
                                                                    }
                                                                </p>


                                                                <p
                                                                    className="
                                                                        mt-0.5
                                                                        text-xs
                                                                        font-semibold
                                                                        text-[#86808E]
                                                                    "
                                                                >
                                                                    {
                                                                        ticket
                                                                            .service
                                                                            .name
                                                                    }
                                                                </p>

                                                            </div>


                                                            <StatusPill
                                                                status={
                                                                    ticket
                                                                        .status
                                                                }
                                                            />


                                                            <p
                                                                className="
                                                                    text-xs
                                                                    font-semibold
                                                                    text-[#817A88]
                                                                    sm:text-right
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
                                                    );

                                                }
                                            )
                                        }

                                    </div>
                                )
                        }

                    </div>

                </section>


                {/* SMALL PROFILE STRIP */}

                {
                    user &&
                    <section
                        className="
                            mt-8
                            rounded-[30px]
                            border
                            border-[#DACFED]
                            bg-[linear-gradient(110deg,#EEE7FF_0%,#FDE5ED_48%,#DFF1FF_100%)]
                            p-5
                            shadow-[0_16px_42px_rgba(94,76,120,0.08)]
                            sm:p-6
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                gap-4
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
                                        h-14
                                        w-14
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-[20px]
                                        border
                                        border-white/80
                                        bg-white/60
                                        font-serif
                                        text-2xl
                                        font-bold
                                        text-[#64588E]
                                        shadow-sm
                                    "
                                >
                                    {
                                        user
                                            .fullName
                                            .charAt(0)
                                            .toUpperCase()
                                    }
                                </div>


                                <div>

                                    <p
                                        className="
                                            font-extrabold
                                            text-[#494353]
                                        "
                                    >
                                        {user.fullName}
                                    </p>


                                    <p
                                        className="
                                            mt-0.5
                                            text-sm
                                            font-semibold
                                            text-[#7C7584]
                                        "
                                    >
                                        {user.email}
                                    </p>


                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-[#7C7584]
                                        "
                                    >
                                        {
                                            user.phone ||
                                            "Phone number not provided"
                                        }
                                    </p>

                                </div>

                            </div>


                            <Link
                                href="/customer/profile"
                                className="
                                    inline-flex
                                    min-h-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#CFC2DE]
                                    bg-white/55
                                    px-4
                                    py-2
                                    text-sm
                                    font-extrabold
                                    text-[#62577D]
                                    transition
                                    hover:bg-white
                                "
                            >
                                Edit profile
                            </Link>

                        </div>

                    </section>
                }

            </div>

        </div>
    );

}