"use client";

import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import Link from "next/link";

import api from "@/lib/axios";

import StatusBadge from
    "@/components/ui/StatusBadge";


interface Ticket {
    id: number;
    ticketNumber: string;
    status: string;
    priority: string;
    issuedAt: string;
    calledAt: string | null;
    completedAt: string | null;

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


export default function CustomerTicketsPage() {

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
        status,
        setStatus
    ] =
        useState("");


    const [
        selectedTicket,
        setSelectedTicket
    ] =
        useState<Ticket | null>(
            null
        );


    const [
        refresh,
        setRefresh
    ] =
        useState(0);


    const [
        responseMsg,
        setResponseMsg
    ] =
        useState("");


    useEffect(
        () => {

            const getTickets =
                async () => {

                    try {

                        const response =
                            await api.get<Ticket[]>(
                                "/tickets/mytickets"
                            );


                        setTickets(
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
                                "Could not load tickets"
                            );

                        }

                    }

                };


            getTickets();

        },
        [refresh]
    );


    const filteredTickets =
        status
            ? tickets.filter(
                (ticket) =>
                    ticket.status ==
                    status
            )
            : tickets;


    const cancelTicket =
        async (
            id: number
        ) => {

            setErr("");

            setResponseMsg("");


            try {

                await api.patch(
                    `/tickets/${id}/cancel`,
                    {}
                );


                setResponseMsg(
                    "Ticket cancelled successfully"
                );


                setSelectedTicket(
                    null
                );


                setRefresh(
                    (value) =>
                        value + 1
                );

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
                        "Could not cancel ticket"
                    );

                }

            }

        };


    const showEstimatedWait =
        (
            ticket: Ticket
        ) => {

            if (
                ticket.status !=
                "waiting"
            ) {

                return "-";

            }


            if (
                ticket
                    .estimatedWaitMinutes ===
                null
            ) {

                return "Not available";

            }


            return `${ticket.estimatedWaitMinutes} minutes`;

        };


    const cardTone =
        (
            ticketStatus:
                string
        ) => {

            if (
                ticketStatus ==
                "waiting"
            ) {

                return "from-[#fff8df] to-[#fffdf7] border-[#eadcae]";

            }


            if (
                ticketStatus ==
                "called"
            ) {

                return "from-[#edf5ff] to-[#fffdfd] border-[#d6e4f5]";

            }


            if (
                ticketStatus ==
                "completed"
            ) {

                return "from-[#eaf7f1] to-[#fffdfd] border-[#d0e8dc]";

            }


            if (
                ticketStatus ==
                "cancelled"
            ) {

                return "from-[#fdf0f4] to-[#fffdfd] border-[#efd7df]";

            }


            return "from-[#f8f4ff] to-[#fffdfd] border-[#e4ddec]";

        };


    return (
        <div
            className="
                mx-auto
                max-w-6xl
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
                    bg-[linear-gradient(120deg,#ffe8dc_0%,#fce4ec_44%,#ece7ff_100%)]
                    px-6
                    py-7
                    shadow-[0_20px_55px_rgba(100,83,128,0.1)]
                    sm:px-8
                "
            >

                <div
                    className="
                        absolute
                        -left-10
                        -top-12
                        h-36
                        w-36
                        rounded-full
                        bg-white/30
                    "
                />


                <div
                    className="
                        relative
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >

                    <div>

                        <p className="sqms-eyebrow">
                            Your visits, all in one place
                        </p>


                        <h1
                            className="
                                sqms-title
                                mt-1
                                text-4xl
                                sm:text-5xl
                            "
                        >
                            My tickets
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
                            Track what is active now,
                            check where you were served,
                            and look back at previous
                            queue visits.
                        </p>

                    </div>


                    <Link
                        href="/customer/queues"
                        className="
                            sqms-primary-button
                            inline-flex
                            min-h-11
                            items-center
                            justify-center
                            rounded-full
                            px-5
                            py-2.5
                            text-sm
                            font-bold
                            transition
                        "
                    >
                        Get a new ticket

                        <span
                            className="ml-2"
                            aria-hidden="true"
                        >
                            →
                        </span>
                    </Link>

                </div>

            </section>


            {
                responseMsg &&
                <div
                    className="
                        mb-5
                        rounded-[20px]
                        border
                        border-[#c6e5d6]
                        bg-[#e2f5ec]
                        px-4
                        py-3.5
                        text-sm
                        font-bold
                        text-[#3f6a53]
                        shadow-sm
                    "
                >
                    {responseMsg}
                </div>
            }


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


            <section
                className="
                    sqms-glass
                    mb-7
                    rounded-[25px]
                    p-4
                    sm:p-5
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

                    <div>

                        <p
                            className="
                                text-sm
                                font-extrabold
                                text-[#4c4858]
                            "
                        >
                            Find the ticket you need
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                font-medium
                                text-[#858092]
                            "
                        >
                            Filter by status without
                            changing your ticket history.
                        </p>

                    </div>


                    <select
                        className="
                            select
                            sqms-input
                            min-h-11
                            w-full
                            rounded-[15px]
                            sm:max-w-xs
                        "
                        value={
                            status
                        }
                        onChange={
                            (e) =>
                                setStatus(
                                    e.target.value
                                )
                        }
                        aria-label="Filter tickets by status"
                    >

                        <option value="">
                            All tickets
                        </option>

                        <option value="waiting">
                            Waiting
                        </option>

                        <option value="called">
                            Called
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>

                    </select>

                </div>

            </section>


            {
                filteredTickets
                    .length ==
                    0 &&
                !err &&
                <div
                    className="
                        rounded-[28px]
                        border
                        border-dashed
                        border-[#d8cde5]
                        bg-white/65
                        px-6
                        py-12
                        text-center
                        shadow-sm
                    "
                >

                    <div
                        className="
                            mx-auto
                            mb-4
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-full
                            bg-[#ece7ff]
                            text-xl
                            font-black
                            text-[#6d6398]
                        "
                    >
                        Q
                    </div>


                    <p
                        className="
                            text-lg
                            font-extrabold
                            text-[#4d495a]
                        "
                    >
                        No tickets found.
                    </p>


                    <p
                        className="
                            mt-1
                            text-sm
                            font-medium
                            text-[#817c8d]
                        "
                    >
                        Your tickets will appear
                        here after you join a queue.
                    </p>

                </div>
            }


            <div
                className="
                    grid
                    gap-5
                    md:grid-cols-2
                "
            >

                {
                    filteredTickets.map(
                        (
                            ticket
                        ) => (
                            <article
                                key={
                                    ticket.id
                                }
                                className={`
                                    relative
                                    overflow-hidden
                                    rounded-[28px]
                                    border
                                    bg-gradient-to-br
                                    ${cardTone(
                                        ticket.status
                                    )}
                                    p-5
                                    shadow-[0_14px_38px_rgba(91,74,115,0.08)]
                                    transition
                                    hover:-translate-y-0.5
                                    hover:shadow-[0_18px_45px_rgba(91,74,115,0.11)]
                                    sm:p-6
                                `}
                            >

                                <div
                                    className="
                                        absolute
                                        right-0
                                        top-0
                                        h-20
                                        w-20
                                        translate-x-6
                                        -translate-y-6
                                        rounded-full
                                        bg-white/35
                                    "
                                />


                                <div
                                    className="
                                        relative
                                        flex
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
                                                tracking-[0.13em]
                                                text-[#8a8495]
                                            "
                                        >
                                            Ticket number
                                        </p>


                                        <h2
                                            className="
                                                mt-1.5
                                                text-3xl
                                                font-black
                                                tracking-[-0.05em]
                                                text-[#403c4e]
                                            "
                                        >
                                            {
                                                ticket
                                                    .ticketNumber
                                            }
                                        </h2>

                                    </div>


                                    <StatusBadge
                                        status={
                                            ticket.status
                                        }
                                    />

                                </div>


                                <div
                                    className="
                                        relative
                                        mt-5
                                        grid
                                        grid-cols-2
                                        gap-3
                                        text-sm
                                    "
                                >

                                    <div
                                        className="
                                            col-span-2
                                            rounded-[18px]
                                            bg-white/60
                                            p-4
                                            sm:col-span-1
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.09em]
                                                text-[#8b8594]
                                            "
                                        >
                                            Service
                                        </p>

                                        <p
                                            className="
                                                mt-1.5
                                                font-extrabold
                                                text-[#504b5b]
                                            "
                                        >
                                            {
                                                ticket
                                                    .service
                                                    ?.name
                                            }
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            col-span-2
                                            rounded-[18px]
                                            bg-white/60
                                            p-4
                                            sm:col-span-1
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.09em]
                                                text-[#8b8594]
                                            "
                                        >
                                            Queue
                                        </p>

                                        <p
                                            className="
                                                mt-1.5
                                                font-extrabold
                                                text-[#504b5b]
                                            "
                                        >
                                            {
                                                ticket
                                                    .queue
                                                    ?.name
                                            }
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            rounded-[18px]
                                            bg-white/52
                                            p-4
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.09em]
                                                text-[#8b8594]
                                            "
                                        >
                                            Priority
                                        </p>

                                        <p
                                            className="
                                                mt-1.5
                                                font-extrabold
                                                capitalize
                                                text-[#504b5b]
                                            "
                                        >
                                            {
                                                ticket
                                                    .priority
                                            }
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            rounded-[18px]
                                            bg-white/52
                                            p-4
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.09em]
                                                text-[#8b8594]
                                            "
                                        >
                                            Counter
                                        </p>

                                        <p
                                            className="
                                                mt-1.5
                                                font-extrabold
                                                text-[#504b5b]
                                            "
                                        >
                                            {
                                                ticket
                                                    .counter
                                                    ?.name ||
                                                "Not assigned"
                                            }
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            rounded-[18px]
                                            bg-white/52
                                            p-4
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.09em]
                                                text-[#8b8594]
                                            "
                                        >
                                            Estimated wait
                                        </p>

                                        <p
                                            className="
                                                mt-1.5
                                                font-extrabold
                                                text-[#504b5b]
                                            "
                                        >
                                            {
                                                showEstimatedWait(
                                                    ticket
                                                )
                                            }
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            rounded-[18px]
                                            bg-white/52
                                            p-4
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.09em]
                                                text-[#8b8594]
                                            "
                                        >
                                            Issued
                                        </p>

                                        <p
                                            className="
                                                mt-1.5
                                                text-xs
                                                font-bold
                                                leading-5
                                                text-[#5e5967]
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


                                <div
                                    className="
                                        relative
                                        mt-5
                                        flex
                                        flex-col
                                        gap-2
                                        sm:flex-row
                                    "
                                >

                                    <button
                                        type="button"
                                        className="
                                            sqms-secondary-button
                                            min-h-11
                                            flex-1
                                            rounded-full
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-bold
                                            transition
                                        "
                                        onClick={
                                            () =>
                                                setSelectedTicket(
                                                    ticket
                                                )
                                        }
                                    >
                                        View details
                                    </button>


                                    {
                                        ticket.status ==
                                        "waiting" &&
                                        <button
                                            type="button"
                                            className="
                                                min-h-11
                                                flex-1
                                                rounded-full
                                                border
                                                border-[#e6bfc9]
                                                bg-[#fce4ec]
                                                px-4
                                                py-2.5
                                                text-sm
                                                font-bold
                                                text-[#8a4c5f]
                                                transition
                                                hover:bg-[#f8d7e1]
                                            "
                                            onClick={
                                                () =>
                                                    cancelTicket(
                                                        ticket.id
                                                    )
                                            }
                                        >
                                            Cancel ticket
                                        </button>
                                    }

                                </div>

                            </article>
                        )
                    )
                }

            </div>


            {
                selectedTicket &&
                <section
                    className="
                        sqms-glass
                        mt-8
                        overflow-hidden
                        rounded-[30px]
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
                            border-b
                            border-[#e8e1ef]
                            bg-[linear-gradient(90deg,#f1ecff,#fff0e9)]
                            px-5
                            py-5
                            sm:px-6
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-xs
                                    font-extrabold
                                    uppercase
                                    tracking-[0.13em]
                                    text-[#847b98]
                                "
                            >
                                Ticket details
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-2xl
                                    font-black
                                    tracking-[-0.04em]
                                    text-[#423e50]
                                "
                            >
                                {
                                    selectedTicket
                                        .ticketNumber
                                }
                            </h2>

                        </div>


                        <button
                            type="button"
                            className="
                                sqms-secondary-button
                                rounded-full
                                px-4
                                py-2
                                text-sm
                                font-bold
                                transition
                            "
                            onClick={
                                () =>
                                    setSelectedTicket(
                                        null
                                    )
                            }
                        >
                            Close
                        </button>

                    </div>


                    <div
                        className="
                            grid
                            gap-3
                            p-5
                            sm:grid-cols-2
                            sm:p-6
                            lg:grid-cols-3
                        "
                    >

                        <div
                            className="
                                rounded-[18px]
                                bg-[#f5f0fb]
                                p-4
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.09em]
                                    text-[#8b8496]
                                "
                            >
                                Status
                            </p>

                            <div className="mt-2">

                                <StatusBadge
                                    status={
                                        selectedTicket
                                            .status
                                    }
                                />

                            </div>

                        </div>


                        <div
                            className="
                                rounded-[18px]
                                bg-[#fff0e8]
                                p-4
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.09em]
                                    text-[#99796a]
                                "
                            >
                                Service
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    font-extrabold
                                    text-[#5b4b45]
                                "
                            >
                                {
                                    selectedTicket
                                        .service
                                        ?.name
                                }
                            </p>
                        </div>


                        <div
                            className="
                                rounded-[18px]
                                bg-[#eaf7f1]
                                p-4
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.09em]
                                    text-[#668477]
                                "
                            >
                                Queue
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    font-extrabold
                                    text-[#466156]
                                "
                            >
                                {
                                    selectedTicket
                                        .queue
                                        ?.name
                                }
                            </p>
                        </div>


                        <div
                            className="
                                rounded-[18px]
                                bg-[#fff6d9]
                                p-4
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.09em]
                                    text-[#8d7740]
                                "
                            >
                                Priority
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    font-extrabold
                                    capitalize
                                    text-[#665526]
                                "
                            >
                                {
                                    selectedTicket
                                        .priority
                                }
                            </p>
                        </div>


                        <div
                            className="
                                rounded-[18px]
                                bg-[#edf5ff]
                                p-4
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.09em]
                                    text-[#7289a4]
                                "
                            >
                                Estimated wait
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    font-extrabold
                                    text-[#4c6684]
                                "
                            >
                                {
                                    showEstimatedWait(
                                        selectedTicket
                                    )
                                }
                            </p>
                        </div>


                        <div
                            className="
                                rounded-[18px]
                                bg-[#f8edf1]
                                p-4
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.09em]
                                    text-[#91727c]
                                "
                            >
                                Counter
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    font-extrabold
                                    text-[#655159]
                                "
                            >
                                {
                                    selectedTicket
                                        .counter
                                        ?.name ||
                                    "Not assigned"
                                }
                            </p>
                        </div>


                        <div
                            className="
                                rounded-[18px]
                                bg-white/75
                                p-4
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.09em]
                                    text-[#8b8496]
                                "
                            >
                                Issued at
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    text-sm
                                    font-bold
                                    text-[#5c5765]
                                "
                            >
                                {
                                    new Date(
                                        selectedTicket
                                            .issuedAt
                                    )
                                        .toLocaleString()
                                }
                            </p>
                        </div>


                        <div
                            className="
                                rounded-[18px]
                                bg-white/75
                                p-4
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.09em]
                                    text-[#8b8496]
                                "
                            >
                                Called at
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    text-sm
                                    font-bold
                                    text-[#5c5765]
                                "
                            >
                                {
                                    selectedTicket
                                        .calledAt
                                        ? new Date(
                                            selectedTicket
                                                .calledAt
                                        )
                                            .toLocaleString()
                                        : "-"
                                }
                            </p>
                        </div>


                        <div
                            className="
                                rounded-[18px]
                                bg-white/75
                                p-4
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.09em]
                                    text-[#8b8496]
                                "
                            >
                                Completed at
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    text-sm
                                    font-bold
                                    text-[#5c5765]
                                "
                            >
                                {
                                    selectedTicket
                                        .completedAt
                                        ? new Date(
                                            selectedTicket
                                                .completedAt
                                        )
                                            .toLocaleString()
                                        : "-"
                                }
                            </p>
                        </div>

                    </div>

                </section>
            }

        </div>
    );

}