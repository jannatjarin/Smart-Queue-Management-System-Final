"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import api from "@/lib/axios";
import StatusBadge from "@/components/ui/StatusBadge";

interface Service {
    id: number;
    name: string;
}

interface Staff {
    id: number;
    fullName: string;
    email: string;
}

interface Counter {
    id: number;
    name: string;
    status: string;
    staff: Staff | null;
    services: Service[];
}

export default function StaffCounterPage() {
    const [counter, setCounter] =
        useState<Counter | null>(null);

    const [refresh, setRefresh] =
        useState(0);

    const [responseMsg, setResponseMsg] =
        useState("");

    const [err, setErr] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [updating, setUpdating] =
        useState(false);

    useEffect(() => {
        const getCounter = async () => {
            setLoading(true);

            try {
                const response =
                    await api.get<Counter[]>(
                        "/counters"
                    );

                setCounter(
                    response.data.length > 0
                        ? response.data[0]
                        : null
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
                        "Could not load counter"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        getCounter();
    }, [refresh]);

    const updateCounterStatus = async (
        id: number,
        status: string
    ) => {
        setResponseMsg("");
        setErr("");
        setUpdating(true);

        try {
            await api.patch(
                `/counters/${id}/status`,
                {
                    status,
                }
            );

            setResponseMsg(
                "Counter status updated successfully"
            );

            setRefresh(
                (value) => value + 1
            );
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
                    "Could not update counter status"
                );
            }
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[55vh] items-center justify-center">
                <span className="loading loading-spinner loading-md text-[#8f3d27]" />

                <span className="ml-3 font-semibold text-[#665d54]">
                    Loading counter...
                </span>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-5xl py-8 sm:py-10">
            <header className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                    Work station
                </p>

                <h1 className="mt-1 text-4xl font-bold text-[#332c26]">
                    My counter
                </h1>

                <p className="mt-2 text-sm text-[#746960]">
                    View your counter and change its status.
                </p>
            </header>

            {responseMsg && (
                <div className="mb-5 rounded-[18px] border border-[#b6ceb2] bg-[#dcebd8] px-4 py-3 text-sm font-bold text-[#416343]">
                    {responseMsg}
                </div>
            )}

            {err && (
                <div className="mb-5 rounded-[18px] border border-[#dfb4b7] bg-[#f4d5d7] px-4 py-3 text-sm font-bold text-[#82464b]">
                    {err}
                </div>
            )}

            {counter ? (
                <>
                    <section className="mb-6 rounded-[28px] border border-[#d6c5b1] bg-[#fffaf0] p-6 sm:p-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-[#81766d]">
                                    Assigned counter
                                </p>

                                <h2 className="mt-1 text-4xl font-bold text-[#40372f]">
                                    {counter.name}
                                </h2>
                            </div>

                            <StatusBadge
                                status={
                                    counter.status
                                }
                            />
                        </div>

                        <div className="mt-7 grid gap-5 border-t border-[#e6dacb] pt-6 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-[#81766d]">
                                    Staff member
                                </p>

                                <p className="mt-1 font-bold text-[#443b34]">
                                    {counter.staff
                                        ?.fullName ||
                                        "Not assigned"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-[#81766d]">
                                    Current status
                                </p>

                                <p className="mt-1 font-bold capitalize text-[#443b34]">
                                    {counter.status.replaceAll(
                                        "_",
                                        " "
                                    )}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-6">
                        <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                                Availability
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-[#332c26]">
                                Change counter status
                            </h2>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <button
                                type="button"
                                disabled={
                                    updating ||
                                    counter.status ===
                                        "open"
                                }
                                onClick={() =>
                                    updateCounterStatus(
                                        counter.id,
                                        "open"
                                    )
                                }
                                className={`rounded-[22px] border p-5 text-left transition ${
                                    counter.status ===
                                    "open"
                                        ? "border-[#8dac8e] bg-[#dcebd8] ring-2 ring-[#6f946f]"
                                        : "border-[#bfd2bb] bg-[#e0edde] hover:-translate-y-0.5"
                                } disabled:cursor-default`}
                            >
                                <p className="text-lg font-bold text-[#405f43]">
                                    Open
                                </p>

                                <p className="mt-1 text-sm text-[#667d67]">
                                    Ready to serve customers.
                                </p>
                            </button>

                            <button
                                type="button"
                                disabled={
                                    updating ||
                                    counter.status ===
                                        "on_break"
                                }
                                onClick={() =>
                                    updateCounterStatus(
                                        counter.id,
                                        "on_break"
                                    )
                                }
                                className={`rounded-[22px] border p-5 text-left transition ${
                                    counter.status ===
                                    "on_break"
                                        ? "border-[#c5aa42] bg-[#f7e49a] ring-2 ring-[#c5aa42]"
                                        : "border-[#ded08d] bg-[#f8e9ad] hover:-translate-y-0.5"
                                } disabled:cursor-default`}
                            >
                                <p className="text-lg font-bold text-[#69571d]">
                                    On break
                                </p>

                                <p className="mt-1 text-sm text-[#7a6b36]">
                                    Temporarily unavailable.
                                </p>
                            </button>

                            <button
                                type="button"
                                disabled={
                                    updating ||
                                    counter.status ===
                                        "closed"
                                }
                                onClick={() =>
                                    updateCounterStatus(
                                        counter.id,
                                        "closed"
                                    )
                                }
                                className={`rounded-[22px] border p-5 text-left transition ${
                                    counter.status ===
                                    "closed"
                                        ? "border-[#bc6b70] bg-[#f2d4d6] ring-2 ring-[#b85c62]"
                                        : "border-[#dfb4b7] bg-[#f4d8da] hover:-translate-y-0.5"
                                } disabled:cursor-default`}
                            >
                                <p className="text-lg font-bold text-[#82464b]">
                                    Closed
                                </p>

                                <p className="mt-1 text-sm text-[#916267]">
                                    Stop serving this counter.
                                </p>
                            </button>
                        </div>
                    </section>

                    <section>
                        <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                                Services
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-[#332c26]">
                                Assigned services
                            </h2>
                        </div>

                        <div className="rounded-[24px] border border-[#d7c6b1] bg-[#fffaf0] p-5">
                            {counter.services.length >
                            0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {counter.services.map(
                                        (service) => (
                                            <span
                                                key={
                                                    service.id
                                                }
                                                className="rounded-full border border-[#dac58c] bg-[#f7e8b4] px-4 py-2 text-sm font-bold text-[#705e2d]"
                                            >
                                                {
                                                    service.name
                                                }
                                            </span>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-[#786e65]">
                                    No services assigned.
                                </p>
                            )}
                        </div>
                    </section>
                </>
            ) : (
                <div className="rounded-[24px] border border-[#dfca70] bg-[#f7e49a] p-6">
                    <p className="font-bold text-[#69571d]">
                        No counter assigned
                    </p>

                    <p className="mt-1 text-sm text-[#796a37]">
                        Ask an Admin to assign you to a counter.
                    </p>
                </div>
            )}
        </main>
    );
}