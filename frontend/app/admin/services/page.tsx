"use client";

import { useState, useEffect } from "react";
import type {
    ChangeEvent,
    FormEvent
} from "react";
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

    const [formData, setFormData] =
        useState(
            {
                name: "",
                description: "",
                estimatedTime: "",
                department: ""
            }
        );

    const [refresh, setRefresh] =
        useState(0);

    const [responseMsg, setResponseMsg] =
        useState("");

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

    }, [refresh]);

    const onChangeHandle = (
        e: ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement
        >
    ) => {

        const {
            name,
            value
        } = e.target;

        setFormData(
            {
                ...formData,
                [name]: value
            }
        );

    }

    const onSubmitHandle = (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        const createService = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                await axios.post(
                    "http://localhost:3000/services",
                    {
                        name:
                            formData.name,

                        description:
                            formData.description,

                        estimatedTime:
                            Number(
                                formData.estimatedTime
                            ),

                        department:
                            formData.department
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setResponseMsg(
                    "Service created successfully"
                );

                setErr("");

                setFormData(
                    {
                        name: "",
                        description: "",
                        estimatedTime: "",
                        department: ""
                    }
                );

                setRefresh(
                    refresh + 1
                );

            }

            catch (error) {

                if (
                    axios.isAxiosError(error) &&
                    error.response?.data?.message
                ) {

                    if (
                        Array.isArray(
                            error.response.data.message
                        )
                    ) {

                        setErr(
                            error.response.data.message.join(
                                ", "
                            )
                        );

                    }

                    else {

                        setErr(
                            error.response.data.message
                        );

                    }

                }

                else {

                    setErr(
                        "Could not create service"
                    );

                }

            }

        }

        createService();

    }

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Service Management
            </h1>

            <p className="mb-6">
                Create and manage services
            </p>

            {
                responseMsg &&
                <div className="alert alert-success mb-4">
                    {responseMsg}
                </div>
            }

            {
                err &&
                <div className="alert alert-error mb-4">
                    {err}
                </div>
            }

            <div className="card bg-base-100 shadow border mb-8">

                <div className="card-body">

                    <h2 className="card-title">
                        Create Service
                    </h2>

                    <form onSubmit={onSubmitHandle}>

                        <div className="grid md:grid-cols-2 gap-4">

                            <div>

                                <label className="label">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={onChangeHandle}
                                    required
                                />

                            </div>

                            <div>

                                <label className="label">
                                    Department
                                </label>

                                <input
                                    type="text"
                                    name="department"
                                    className="input input-bordered w-full"
                                    value={formData.department}
                                    onChange={onChangeHandle}
                                    required
                                />

                            </div>

                            <div>

                                <label className="label">
                                    Estimated Time
                                </label>

                                <input
                                    type="number"
                                    name="estimatedTime"
                                    className="input input-bordered w-full"
                                    value={formData.estimatedTime}
                                    onChange={onChangeHandle}
                                    min="1"
                                    required
                                />

                            </div>

                            <div>

                                <label className="label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    className="textarea textarea-bordered w-full"
                                    value={formData.description}
                                    onChange={onChangeHandle}
                                />

                            </div>

                        </div>

                        <input
                            type="submit"
                            value="Create Service"
                            className="btn btn-primary mt-6"
                        />

                    </form>

                </div>

            </div>

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