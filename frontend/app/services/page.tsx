"use client"

import { useState, useEffect } from "react";
import axios from "axios";

interface Service {
    id: number,
    name: string,
    description: string,
    estimatedTime: number,
    department: string,
    isActive: boolean
}

export default function ServicesPage() {

    const [services, setServices] =
        useState<Service[]>([]);

    const [err, setErr] =
        useState("");

    useEffect(() => {

        const getServices = async () => {

            try {

                const response =
                    await axios.get(
                        "http://localhost:3000/services"
                    );

                setServices(
                    response.data
                );

            }

            catch (error: any) {

                if (error.response?.data?.message) {

                    setErr(
                        error.response.data.message
                    );

                }

                else {

                    setErr(
                        "Could not load services"
                    );

                }

            }

        }

        getServices();

    }, []);

    return (
        <div className="max-w-6xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Available Services
            </h1>

            <p className="mb-6">
                Select from the available services below.
            </p>

            {
                err &&
                <div className="alert alert-error mb-4">
                    {err}
                </div>
            }

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                {
                    services &&
                    services.map(
                        (service: Service) => (

                            <div
                                key={service.id}
                                className="card bg-base-100 shadow-md border"
                            >

                                <div className="card-body">

                                    <h2 className="card-title">
                                        {service.name}
                                    </h2>

                                    <p>
                                        {service.description}
                                    </p>

                                    <p>
                                        <b>Department:</b>{" "}
                                        {service.department}
                                    </p>

                                    <p>
                                        <b>Estimated Time:</b>{" "}
                                        {service.estimatedTime} minutes
                                    </p>

                                </div>

                            </div>

                        )
                    )
                }

            </div>

            {
                services.length === 0 &&
                !err &&

                <p>
                    No services available.
                </p>
            }

        </div>
    )
}