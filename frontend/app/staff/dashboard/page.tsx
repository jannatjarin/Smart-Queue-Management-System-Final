"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import api from "@/lib/axios";
import StatusBadge from "@/components/ui/StatusBadge";

interface Staff {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;
}

interface Service {
    id: number;
    name: string;
}

interface Counter {
    id: number;
    name: string;
    status: string;
    staff: Staff | null;
    services: Service[];
}

interface Ticket {
    id: number;
    ticketNumber?: string;
    status: string;

    counter: {
        id: number;
        name: string;
    } | null;
}

export default function StaffDashboard() {
    const [staff, setStaff] =
        useState<Staff | null>(null);

    const [counters, setCounters] =
        useState<Counter[]>([]);

    const [tickets, setTickets] =
        useState<Ticket[]>([]);

    const [err, setErr] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const staffResponse =
                    await api.get<Staff>(
                        "/users/me"
                    );

                const countersResponse =
                    await api.get<Counter[]>(
                        "/counters"
                    );

                const ticketsResponse =
                    await api.get<Ticket[]>(
                        "/tickets"
                    );

                setStaff(
                    staffResponse.data
                );

                setCounters(
                    countersResponse.data
                );

                setTickets(
                    ticketsResponse.data
                );

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
                        "Could not load staff dashboard"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const assignedCounter =
        counters.length > 0
            ? counters[0]
            : null;

    const waitingCount =
        tickets.filter(
            (ticket) =>
                ticket.status === "waiting"
        ).length;

    const calledCount =
        assignedCounter
            ? tickets.filter(
                (ticket) =>
                    ticket.status ===
                        "called" &&
                    ticket.counter?.id ===
                        assignedCounter.id
            ).length
            : 0;

    const serviceCount =
        assignedCounter
            ? assignedCounter.services.length
            : 0;

    if (loading) {
        return (
            <div className="flex min-h-[55vh] items-center justify-center">
                <span className="loading loading-spinner loading-md text-[#8f3d27]" />

                <span className="ml-3 font-semibold text-[#665d54]">
                    Loading dashboard...
                </span>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-6xl py-8 sm:py-10">
            <section className="mb-7 overflow-hidden rounded-[28px] border border-[#d7c5af] bg-[#fffaf0]">
                <div className="h-2.5 bg-[#8f3d27]" />

                <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                            Staff overview
                        </p>

                        <h1 className="mt-2 text-4xl font-bold text-[#332c26]">
                            Good day,{" "}
                            {staff?.fullName
                                .split(" ")[0] ||
                                "there"}
                        </h1>

                        <p className="mt-2 text-sm text-[#746960]">
                            Your counter and queue activity.
                        </p>
                    </div>

                    <Link
                        href="/staff/queue"
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#5d7d5f] px-6 text-sm font-bold text-white transition hover:bg-[#4e6c50]"
                    >
                        Go to queue desk
                    </Link>
                </div>
            </section>

            {err && (
                <div className="mb-6 rounded-[18px] border border-[#dfb4b7] bg-[#f4d5d7] px-4 py-3 text-sm font-bold text-[#82464b]">
                    {err}
                </div>
            )}

            <section className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-[#dfca70] bg-[#f7e49a] p-5">
                    <p className="text-sm font-bold text-[#735e20]">
                        Waiting
                    </p>

                    <p className="mt-3 text-4xl font-black text-[#5d4c1a]">
                        {waitingCount}
                    </p>

                    <p className="mt-1 text-sm text-[#7d6c35]">
                        Tickets waiting
                    </p>
                </div>

                <div className="rounded-[24px] border border-[#b8ceda] bg-[#deedf5] p-5">
                    <p className="text-sm font-bold text-[#4d6b7a]">
                        Called
                    </p>

                    <p className="mt-3 text-4xl font-black text-[#385868]">
                        {calledCount}
                    </p>

                    <p className="mt-1 text-sm text-[#647d89]">
                        At your counter
                    </p>
                </div>

                <div className="rounded-[24px] border border-[#bed2ba] bg-[#e0edde] p-5">
                    <p className="text-sm font-bold text-[#506f53]">
                        Services
                    </p>

                    <p className="mt-3 text-4xl font-black text-[#3e5d41]">
                        {serviceCount}
                    </p>

                    <p className="mt-1 text-sm text-[#687d68]">
                        Assigned to you
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                        Your workstation
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-[#332c26]">
                        Assigned counter
                    </h2>
                </div>

                {assignedCounter ? (
                    <div className="rounded-[26px] border border-[#d6c5b1] bg-[#fffaf0] p-6">
                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-3xl font-bold text-[#40372f]">
                                        {assignedCounter.name}
                                    </h3>

                                    <StatusBadge
                                        status={
                                            assignedCounter.status
                                        }
                                    />
                                </div>

                                <p className="mt-5 text-sm font-bold text-[#665d55]">
                                    Services
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {assignedCounter
                                        .services
                                        .length > 0 ? (
                                        assignedCounter.services.map(
                                            (
                                                service
                                            ) => (
                                                <span
                                                    key={
                                                        service.id
                                                    }
                                                    className="rounded-full border border-[#d8c68f] bg-[#f7e8b4] px-3 py-1.5 text-xs font-bold text-[#705e2d]"
                                                >
                                                    {
                                                        service.name
                                                    }
                                                </span>
                                            )
                                        )
                                    ) : (
                                        <span className="text-sm text-[#81766d]">
                                            No services assigned
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Link
                                href="/staff/counter"
                                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#b9a895] bg-[#fffaf0] px-5 text-sm font-bold text-[#66574d] transition hover:border-[#8f3d27] hover:text-[#8f3d27]"
                            >
                                Manage counter
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-[24px] border border-[#dfca70] bg-[#f7e49a] p-5 text-sm font-bold text-[#6d591d]">
                        No counter has been assigned to you yet.
                    </div>
                )}
            </section>

            <section>
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                        Staff tools
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-[#332c26]">
                        Quick access
                    </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Link
                        href="/staff/queue"
                        className="rounded-[22px] border border-[#bed2ba] bg-[#e0edde] p-5 transition hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-[#426245]">
                            Queue desk
                        </h3>

                        <p className="mt-1 text-sm text-[#697b69]">
                            Call and complete tickets.
                        </p>
                    </Link>

                    <Link
                        href="/staff/counter"
                        className="rounded-[22px] border border-[#ded08d] bg-[#f8e9ad] p-5 transition hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-[#65531d]">
                            My counter
                        </h3>

                        <p className="mt-1 text-sm text-[#7a6b38]">
                            Change counter status.
                        </p>
                    </Link>

                    <Link
                        href="/staff/profile"
                        className="rounded-[22px] border border-[#bcd0dc] bg-[#deedf5] p-5 transition hover:-translate-y-0.5"
                    >
                        <h3 className="text-lg font-bold text-[#405f70]">
                            Profile
                        </h3>

                        <p className="mt-1 text-sm text-[#687d89]">
                            Manage account details.
                        </p>
                    </Link>
                </div>
            </section>
        </main>
    );
}