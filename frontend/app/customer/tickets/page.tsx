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
        [
            refresh,
        ]
    );


    const filteredTickets =
        status
            ? tickets.filter(
                (
                    ticket
                ) =>
                    ticket.status ==
                    status
            )
            : tickets;


    const cancelTicket =
        async (
            id:
                number
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
                    (
                        value
                    ) =>
                        value +
                        1
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
            ticket:
                Ticket
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


            return `${ticket.estimatedWaitMinutes} min`;

        };


    const toneForStatus =
        (
            ticketStatus:
                string
        ) => {

            if (
                ticketStatus ==
                "waiting"
            ) {

                return "sq-butter";

            }


            if (
                ticketStatus ==
                "called"
            ) {

                return "sq-blue";

            }


            if (
                ticketStatus ==
                "completed"
            ) {

                return "sq-mint";

            }


            if (
                ticketStatus ==
                "cancelled"
            ) {

                return "sq-pink";

            }


            return "sq-lavender";

        };


    return (
        <div className="sq-page">

            <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <h1 className="sq-title">
                        My tickets
                    </h1>

                    <p className="sq-subtitle">
                        Track current and previous tickets.
                    </p>

                </div>


                <Link
                    href="/customer/queues"
                    className="sq-primary"
                >
                    Get a ticket
                </Link>

            </header>


            {
                responseMsg &&
                <div className="alert alert-success mb-5">

                    <span>
                        {responseMsg}
                    </span>

                </div>
            }


            {
                err &&
                <div className="alert alert-error mb-5">

                    <span>
                        {err}
                    </span>

                </div>
            }


            <div className="sq-panel mb-6 p-4 sm:max-w-sm">

                <label
                    htmlFor="statusFilter"
                    className="sq-label"
                >
                    Status
                </label>

                <select
                    id="statusFilter"
                    className="select w-full"
                    value={
                        status
                    }
                    onChange={
                        (
                            e
                        ) =>
                            setStatus(
                                e.target
                                    .value
                            )
                    }
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


            <div className="grid gap-4 md:grid-cols-2">

                {
                    filteredTickets.map(
                        (
                            ticket
                        ) => (
                            <article
                                key={
                                    ticket.id
                                }
                                className={`sq-panel ${toneForStatus(
                                    ticket.status
                                )} p-5`}
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div>

                                        <p className="text-sm font-semibold text-[#81798b]">
                                            Ticket
                                        </p>

                                        <h2 className="text-3xl font-black">
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


                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

                                    <div>

                                        <p className="text-[#81798b]">
                                            Service
                                        </p>

                                        <p className="font-bold">
                                            {
                                                ticket
                                                    .service
                                                    ?.name
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-[#81798b]">
                                            Queue
                                        </p>

                                        <p className="font-bold">
                                            {
                                                ticket
                                                    .queue
                                                    ?.name
                                            }
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-[#81798b]">
                                            Counter
                                        </p>

                                        <p className="font-bold">

                                            {
                                                ticket
                                                    .counter
                                                    ?.name ||
                                                "Not assigned"
                                            }

                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-[#81798b]">
                                            Wait
                                        </p>

                                        <p className="font-bold">
                                            {
                                                showEstimatedWait(
                                                    ticket
                                                )
                                            }
                                        </p>

                                    </div>

                                </div>


                                <div className="mt-5 flex gap-2">

                                    <button
                                        type="button"
                                        className="sq-secondary flex-1"
                                        onClick={
                                            () =>
                                                setSelectedTicket(
                                                    ticket
                                                )
                                        }
                                    >
                                        Details
                                    </button>


                                    {
                                        ticket.status ==
                                            "waiting" &&
                                        <button
                                            type="button"
                                            className="flex-1 rounded-full border border-[#e4bcc8] bg-[#f9e1e9] px-4 py-2.5 text-sm font-bold text-[#805165]"
                                            onClick={
                                                () =>
                                                    cancelTicket(
                                                        ticket.id
                                                    )
                                            }
                                        >
                                            Cancel
                                        </button>
                                    }

                                </div>

                            </article>
                        )
                    )
                }

            </div>


            {
                filteredTickets.length ==
                    0 &&
                !err &&
                <div className="sq-panel sq-lavender p-6 text-center font-semibold">
                    No tickets found.
                </div>
            }


            {
                selectedTicket &&
                <section className="sq-panel mt-7 p-5 sm:p-6">

                    <div className="flex items-start justify-between gap-4">

                        <div>

                            <p className="text-sm text-[#81798b]">
                                Ticket details
                            </p>

                            <h2 className="text-2xl font-bold">
                                {
                                    selectedTicket
                                        .ticketNumber
                                }
                            </h2>

                        </div>


                        <button
                            type="button"
                            className="sq-secondary"
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


                    <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">

                        <div>

                            <p className="text-[#81798b]">
                                Status
                            </p>

                            <div className="mt-1">

                                <StatusBadge
                                    status={
                                        selectedTicket
                                            .status
                                    }
                                />

                            </div>

                        </div>


                        <div>

                            <p className="text-[#81798b]">
                                Priority
                            </p>

                            <p className="font-bold capitalize">
                                {
                                    selectedTicket
                                        .priority
                                }
                            </p>

                        </div>


                        <div>

                            <p className="text-[#81798b]">
                                Issued
                            </p>

                            <p className="font-bold">
                                {
                                    new Date(
                                        selectedTicket
                                            .issuedAt
                                    )
                                        .toLocaleString()
                                }
                            </p>

                        </div>


                        <div>

                            <p className="text-[#81798b]">
                                Called
                            </p>

                            <p className="font-bold">

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


                        <div>

                            <p className="text-[#81798b]">
                                Completed
                            </p>

                            <p className="font-bold">

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