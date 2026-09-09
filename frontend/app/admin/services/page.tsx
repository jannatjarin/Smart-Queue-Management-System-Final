"use client";

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

export default function AdminServicesPage() {

    const [services, setServices] =
        useState<Service[]>([]);

    const [err, setErr] =
        useState("");

    useEffect(() => {

        const getServices = async () => {

            try {

                const response =
                    await axios.get<Service[]>(
                        "http://localhost:3000/services?includeInactive=true"
                    );

                setServices(
                    response.data
                );

                setErr("");

            }

            catch (error) {

                if (
                    axios.isAxiosError(error) &&
                    error.response?.data?.message
                ) {

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
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Service Management
            </h1>

            <p className="mb-6">
                Manage system services
            </p>

            {
                err &&
                <div className="alert alert-error mb-4">
                    {err}
                </div>
            }

            <div className="overflow-x-auto">

                <table className="table table-zebra">

                    <thead>

                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Department</th>
                            <th>Estimated Time</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {
                            services &&
                            services.map(
                                (service: Service) => (

                                    <tr key={service.id}>

                                        <td>
                                            {service.name}
                                        </td>

                                        <td>
                                            {service.description}
                                        </td>

                                        <td>
                                            {service.department}
                                        </td>

                                        <td>
                                            {service.estimatedTime} minutes
                                        </td>

                                        <td>

                                            {
                                                service.isActive
                                                    ? "Active"
                                                    : "Inactive"
                                            }

                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>
    )
}