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


interface Queue {
    id: number;
    name: string;
    location: string;
    status: string;
    currentTicketNumber: number;

    service: {
        id: number;
        name: string;
    };
}


interface CreatedTicket {
    id: number;
    ticketNumber: string;
    status: string;
    priority: string;

    estimatedWaitMinutes:
        number | null;
}


export default function QueuesPage() {

    const [
        queues,
        setQueues
    ] =
        useState<Queue[]>(
            []
        );


    const [
        priority,
        setPriority
    ] =
        useState<
            "normal" |
            "urgent"
        >(
            "normal"
        );


    const [
        serviceFilter,
        setServiceFilter
    ] =
        useState("");


    const [
        createdTicket,
        setCreatedTicket
    ] =
        useState<CreatedTicket | null>(
            null
        );


    const [
        creatingQueueId,
        setCreatingQueueId
    ] =
        useState<number | null>(
            null
        );


    const [
        err,
        setErr
    ] =
        useState("");


    const [
        responseMsg,
        setResponseMsg
    ] =
        useState("");


    useEffect(
        () => {

            const getQueues =
                async () => {

                    try {

                        const response =
                            await api.get<Queue[]>(
                                "/queues"
                            );


                        setQueues(
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
                                "Could not load queues"
                            );

                        }

                    }

                };


            getQueues();

        },
        []
    );


    const serviceOptions =
        Array.from(
            new Map(
                queues.map(
                    (queue) => [
                        queue.service.id,
                        queue.service,
                    ]
                )
            ).values()
        );


    const filteredQueues =
        serviceFilter
            ? queues.filter(
                (queue) =>
                    queue.service.id ==
                    Number(
                        serviceFilter
                    )
            )
            : queues;


    const getTicket =
        async (
            queue: Queue
        ) => {

            setErr("");

            setResponseMsg("");

            setCreatedTicket(
                null
            );

            setCreatingQueueId(
                queue.id
            );


            try {

                const response =
                    await api.post<CreatedTicket>(
                        "/tickets",
                        {
                            serviceId:
                                queue.service.id,

                            queueId:
                                queue.id,

                            priority,
                        }
                    );


                setCreatedTicket(
                    response.data
                );


                setResponseMsg(
                    "Ticket created successfully"
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
                        "Could not create ticket"
                    );

                }

            }

            finally {

                setCreatingQueueId(
                    null
                );

            }

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
                    bg-[linear-gradient(120deg,#e6f1ff_0%,#ece7ff_48%,#ffe8dc_100%)]
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
                        bg-white/35
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
                            A calmer way to wait
                        </p>


                        <h1
                            className="
                                sqms-title
                                mt-1
                                text-4xl
                                sm:text-5xl
                            "
                        >
                            Get a ticket
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
                            Choose the service you need,
                            select a priority, and join
                            an open queue. Your ticket
                            will be ready to track right away.
                        </p>

                    </div>


                    <Link
                        href="/customer/tickets"
                        className="
                            sqms-secondary-button
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
                        View my tickets
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


            {
                createdTicket &&
                <section
                    className="
                        sqms-ticket-card
                        mb-7
                        rounded-[30px]
                        p-6
                        sm:p-8
                    "
                >

                    <div
                        className="
                            relative
                            z-10
                            flex
                            flex-col
                            gap-6
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        <div>

                            <div
                                className="
                                    mb-3
                                    inline-flex
                                    rounded-full
                                    bg-[#e2f5ec]
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-extrabold
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#4c755f]
                                "
                            >
                                Your ticket is ready
                            </div>


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                "
                            >

                                <p
                                    className="
                                        text-4xl
                                        font-black
                                        tracking-[-0.05em]
                                        text-[#3c384e]
                                        sm:text-5xl
                                    "
                                >
                                    {
                                        createdTicket
                                            .ticketNumber
                                    }
                                </p>


                                <StatusBadge
                                    status={
                                        createdTicket
                                            .status
                                    }
                                />

                            </div>


                            <div
                                className="
                                    mt-5
                                    flex
                                    flex-wrap
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        rounded-[17px]
                                        bg-[#fff0e7]
                                        px-4
                                        py-3
                                    "
                                >

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.1em]
                                            text-[#987566]
                                        "
                                    >
                                        Priority
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            font-extrabold
                                            capitalize
                                            text-[#634d44]
                                        "
                                    >
                                        {
                                            createdTicket
                                                .priority
                                        }
                                    </p>

                                </div>


                                <div
                                    className="
                                        rounded-[17px]
                                        bg-[#fff5d7]
                                        px-4
                                        py-3
                                    "
                                >

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.1em]
                                            text-[#8d7740]
                                        "
                                    >
                                        Estimated wait
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            font-extrabold
                                            text-[#665526]
                                        "
                                    >
                                        {
                                            createdTicket
                                                .estimatedWaitMinutes ===
                                            null
                                                ? "Not available"
                                                : `${createdTicket.estimatedWaitMinutes} minutes`
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>


                        <Link
                            href="/customer/tickets"
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
                            Track this ticket

                            <span
                                className="ml-2"
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </Link>

                    </div>

                </section>
            }


            <section
                className="
                    sqms-glass
                    mb-7
                    rounded-[28px]
                    p-5
                    sm:p-7
                "
            >

                <div className="mb-6">

                    <p className="sqms-eyebrow">
                        Before you join
                    </p>


                    <h2
                        className="
                            mt-1
                            text-2xl
                            font-extrabold
                            text-[#3b384a]
                        "
                    >
                        Choose your ticket options
                    </h2>


                    <p
                        className="
                            mt-1.5
                            text-sm
                            font-medium
                            text-[#817b8d]
                        "
                    >
                        Keep it simple: filter by
                        service, then choose the
                        priority that fits your visit.
                    </p>

                </div>


                <div
                    className="
                        grid
                        gap-6
                        lg:grid-cols-[0.8fr_1.2fr]
                    "
                >

                    <div>

                        <label
                            htmlFor="serviceFilter"
                            className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-[#565163]
                            "
                        >
                            Service
                        </label>


                        <select
                            id="serviceFilter"
                            className="
                                select
                                sqms-input
                                min-h-12
                                w-full
                                rounded-[16px]
                            "
                            value={
                                serviceFilter
                            }
                            onChange={
                                (e) =>
                                    setServiceFilter(
                                        e.target.value
                                    )
                            }
                        >

                            <option value="">
                                All services
                            </option>


                            {
                                serviceOptions.map(
                                    (
                                        service
                                    ) => (
                                        <option
                                            key={
                                                service.id
                                            }
                                            value={
                                                service.id
                                            }
                                        >
                                            {
                                                service
                                                    .name
                                            }
                                        </option>
                                    )
                                )
                            }

                        </select>

                    </div>


                    <fieldset>

                        <legend
                            className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-[#565163]
                            "
                        >
                            Priority
                        </legend>


                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-3
                            "
                        >

                            <label
                                className={`
                                    cursor-pointer
                                    rounded-[20px]
                                    border
                                    p-4
                                    transition
                                    ${
                                        priority ===
                                        "normal"
                                            ? "border-[#b9add8] bg-[#ece7ff] shadow-[0_8px_22px_rgba(117,106,165,0.1)]"
                                            : "border-[#e4deeb] bg-white/65 hover:border-[#cabee0] hover:bg-[#f8f4ff]"
                                    }
                                `}
                            >

                                <input
                                    type="radio"
                                    name="priority"
                                    value="normal"
                                    className="sr-only"
                                    checked={
                                        priority ===
                                        "normal"
                                    }
                                    onChange={
                                        () =>
                                            setPriority(
                                                "normal"
                                            )
                                    }
                                />


                                <span
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        font-extrabold
                                        text-[#4c475a]
                                    "
                                >

                                    <span
                                        className="
                                            h-3
                                            w-3
                                            rounded-full
                                            bg-[#9b8ec7]
                                        "
                                    />

                                    Normal

                                </span>


                                <span
                                    className="
                                        mt-2
                                        block
                                        text-xs
                                        font-medium
                                        leading-5
                                        text-[#797486]
                                    "
                                >
                                    Best for regular visits
                                    and routine service.
                                </span>

                            </label>


                            <label
                                className={`
                                    cursor-pointer
                                    rounded-[20px]
                                    border
                                    p-4
                                    transition
                                    ${
                                        priority ===
                                        "urgent"
                                            ? "border-[#e3c879] bg-[#fff3cd] shadow-[0_8px_22px_rgba(184,147,54,0.1)]"
                                            : "border-[#e4deeb] bg-white/65 hover:border-[#e6d08d] hover:bg-[#fff9e9]"
                                    }
                                `}
                            >

                                <input
                                    type="radio"
                                    name="priority"
                                    value="urgent"
                                    className="sr-only"
                                    checked={
                                        priority ===
                                        "urgent"
                                    }
                                    onChange={
                                        () =>
                                            setPriority(
                                                "urgent"
                                            )
                                    }
                                />


                                <span
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        font-extrabold
                                        text-[#574d38]
                                    "
                                >

                                    <span
                                        className="
                                            h-3
                                            w-3
                                            rounded-full
                                            bg-[#d7ae45]
                                        "
                                    />

                                    Urgent

                                </span>


                                <span
                                    className="
                                        mt-2
                                        block
                                        text-xs
                                        font-medium
                                        leading-5
                                        text-[#7f7258]
                                    "
                                >
                                    Marks this ticket as
                                    urgent in the system.
                                </span>

                            </label>

                        </div>

                    </fieldset>

                </div>

            </section>


            <section>

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

                        <p className="sqms-eyebrow">
                            Available now
                        </p>

                        <h2
                            className="
                                mt-1
                                text-2xl
                                font-extrabold
                                text-[#3b384a]
                            "
                        >
                            Choose a queue
                        </h2>

                    </div>


                    <span
                        className="
                            rounded-full
                            bg-white/65
                            px-3
                            py-1.5
                            text-sm
                            font-bold
                            text-[#777183]
                            shadow-sm
                        "
                    >
                        {
                            filteredQueues
                                .length
                        }{" "}
                        {
                            filteredQueues
                                .length ===
                            1
                                ? "queue"
                                : "queues"
                        }
                    </span>

                </div>


                {
                    filteredQueues
                        .length ===
                        0 &&
                    !err
                        ? (
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
                                        h-12
                                        w-12
                                        rounded-full
                                        bg-[#ece7ff]
                                    "
                                />

                                <p
                                    className="
                                        text-lg
                                        font-extrabold
                                        text-[#4d495a]
                                    "
                                >
                                    No queues available.
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-medium
                                        text-[#817c8d]
                                    "
                                >
                                    Try another service or
                                    check again later.
                                </p>

                            </div>
                        )
                        : (
                            <div
                                className="
                                    grid
                                    gap-5
                                    md:grid-cols-2
                                "
                            >

                                {
                                    filteredQueues.map(
                                        (
                                            queue
                                        ) => {

                                            const isOpen =
                                                queue.status ==
                                                "open";


                                            const isCreating =
                                                creatingQueueId ==
                                                queue.id;


                                            return (
                                                <article
                                                    key={
                                                        queue.id
                                                    }
                                                    className="
                                                        group
                                                        relative
                                                        overflow-hidden
                                                        rounded-[28px]
                                                        border
                                                        border-[#e4ddec]
                                                        bg-white/80
                                                        p-5
                                                        shadow-[0_14px_40px_rgba(91,74,115,0.08)]
                                                        transition
                                                        hover:-translate-y-0.5
                                                        hover:shadow-[0_18px_46px_rgba(91,74,115,0.12)]
                                                        sm:p-6
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            absolute
                                                            inset-x-0
                                                            top-0
                                                            h-2
                                                            bg-[linear-gradient(90deg,#d9d0fb,#f7d8e4,#d7efe4)]
                                                        "
                                                    />


                                                    <div
                                                        className="
                                                            mt-1
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
                                                                    text-[#8276a6]
                                                                "
                                                            >
                                                                {
                                                                    queue
                                                                        .service
                                                                        .name
                                                                }
                                                            </p>


                                                            <h3
                                                                className="
                                                                    mt-2
                                                                    text-2xl
                                                                    font-black
                                                                    tracking-[-0.035em]
                                                                    text-[#423e50]
                                                                "
                                                            >
                                                                {
                                                                    queue
                                                                        .name
                                                                }
                                                            </h3>

                                                        </div>


                                                        <StatusBadge
                                                            status={
                                                                queue
                                                                    .status
                                                            }
                                                        />

                                                    </div>


                                                    <div
                                                        className="
                                                            mt-5
                                                            grid
                                                            grid-cols-[1fr_auto]
                                                            gap-3
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
                                                                    tracking-[0.1em]
                                                                    text-[#8a8297]
                                                                "
                                                            >
                                                                Location
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1.5
                                                                    font-extrabold
                                                                    text-[#565160]
                                                                "
                                                            >
                                                                {
                                                                    queue
                                                                        .location
                                                                }
                                                            </p>

                                                        </div>


                                                        <div
                                                            className="
                                                                min-w-[108px]
                                                                rounded-[18px]
                                                                bg-[#e6f1ff]
                                                                p-4
                                                                text-center
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    font-bold
                                                                    uppercase
                                                                    tracking-[0.1em]
                                                                    text-[#7289a4]
                                                                "
                                                            >
                                                                Current
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-3xl
                                                                    font-black
                                                                    tracking-[-0.05em]
                                                                    text-[#4c6684]
                                                                "
                                                            >
                                                                {
                                                                    queue
                                                                        .currentTicketNumber
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <button
                                                        type="button"
                                                        className="
                                                            sqms-primary-button
                                                            mt-5
                                                            min-h-11
                                                            w-full
                                                            rounded-full
                                                            px-4
                                                            py-2.5
                                                            text-sm
                                                            font-bold
                                                            transition
                                                            disabled:cursor-not-allowed
                                                            disabled:bg-[#ddd8e3]
                                                            disabled:text-[#8f8998]
                                                            disabled:shadow-none
                                                        "
                                                        disabled={
                                                            !isOpen ||
                                                            isCreating
                                                        }
                                                        onClick={
                                                            () =>
                                                                getTicket(
                                                                    queue
                                                                )
                                                        }
                                                    >
                                                        {
                                                            isCreating
                                                                ? "Creating ticket..."
                                                                : isOpen
                                                                    ? "Get this ticket"
                                                                    : "Queue closed"
                                                        }
                                                    </button>

                                                </article>
                                            );

                                        }
                                    )
                                }

                            </div>
                        )
                }

            </section>

        </div>
    );

}