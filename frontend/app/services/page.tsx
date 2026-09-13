"use client";

import {
    useEffect,
    useState,
} from "react";

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


    useEffect(
        () => {

            const getServices =
                async () => {

                    try {

                        const response =
                            await api.get<Service[]>(
                                "/services"
                            );


                        setServices(
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
                                "Could not load services"
                            );

                        }

                    }

                    finally {

                        setLoading(
                            false
                        );

                    }

                };


            getServices();

        },
        []
    );


    if (loading) {

        return (
            <div className="flex items-center justify-center p-10">

                <span className="loading loading-spinner"></span>

                <span className="ml-3">
                    Loading services...
                </span>

            </div>
        );

    }


    return (
        <div className="max-w-6xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Available Services
            </h1>

            <p className="mb-6">
                View the services available in the Smart Queue Management System.
            </p>


            {
                err &&
                <div className="alert alert-error mb-4">

                    <span>
                        {err}
                    </span>

                </div>
            }


            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                {
                    services.map(
                        (service) => (

                            <div
                                key={
                                    service.id
                                }
                                className="card bg-base-100 shadow-md border"
                            >

                                <div className="card-body">

                                    <h2 className="card-title">
                                        {service.name}
                                    </h2>


                                    <p>
                                        {
                                            service.description ||
                                            "No description available."
                                        }
                                    </p>


                                    <p>
                                        <b>
                                            Department:
                                        </b>{" "}
                                        {service.department}
                                    </p>


                                    <p>
                                        <b>
                                            Estimated Time:
                                        </b>{" "}
                                        {service.estimatedTime} minutes
                                    </p>

                                </div>

                            </div>

                        )
                    )
                }

            </div>


            {
                services.length == 0 &&
                !err &&
                <div className="alert">

                    <span>
                        No services available.
                    </span>

                </div>
            }

        </div>
    );

}