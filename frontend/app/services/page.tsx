"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import api from "@/lib/axios";

interface Service {
    id: number;
    name: string;
    description: string | null;
    estimatedTime: number;
    department: string;
    isActive: boolean;
}

export default function ServicesPage() {
    const [services, setServices] =
        useState<Service[]>([]);

    const [err, setErr] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const getServices = async () => {
            try {
                const response =
                    await api.get<Service[]>(
                        "/services"
                    );

                setServices(
                    response.data
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
                        "Could not load services"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        getServices();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[55vh] items-center justify-center">
                <span className="loading loading-spinner loading-md" />

                <span className="ml-3 font-semibold text-[#665d54]">
                    Loading services...
                </span>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-6xl py-8 sm:py-10">
            <header className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                    What we offer
                </p>

                <h1 className="mt-1 text-4xl font-bold text-[#332c26]">
                    Services
                </h1>

                <p className="mt-2 text-sm text-[#746960]">
                    Choose the service you need.
                </p>
            </header>

            {err && (
                <div className="mb-6 rounded-[18px] border border-[#dfb4b7] bg-[#f4d5d7] px-4 py-3 text-sm font-bold text-[#82464b]">
                    {err}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map(
                    (service, index) => {
                        const colors = [
                            "border-[#ded08d] bg-[#f8e9ad]",
                            "border-[#bad0dc] bg-[#deedf5]",
                            "border-[#bfd2bb] bg-[#e0edde]",
                            "border-[#dfc1ae] bg-[#f4ded1]",
                        ];

                        return (
                            <article
                                key={service.id}
                                className={`rounded-[24px] border p-5 ${
                                    colors[
                                        index %
                                            colors.length
                                    ]
                                }`}
                            >
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#756b62]">
                                    {
                                        service.department
                                    }
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-[#40372f]">
                                    {service.name}
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-[#665d55]">
                                    {service.description ||
                                        "Service available through SQMS."}
                                </p>

                                <div className="mt-5 border-t border-black/10 pt-4">
                                    <p className="text-sm text-[#746960]">
                                        Estimated service time
                                    </p>

                                    <p className="mt-1 font-bold text-[#443b34]">
                                        {
                                            service.estimatedTime
                                        }{" "}
                                        minutes
                                    </p>
                                </div>
                            </article>
                        );
                    }
                )}
            </div>

            {services.length === 0 &&
                !err && (
                    <div className="rounded-[24px] border border-dashed border-[#cdbba7] bg-[#fffaf0] p-8 text-center">
                        <p className="font-bold text-[#4b423a]">
                            No services are available right now.
                        </p>
                    </div>
                )}
        </main>
    );
}