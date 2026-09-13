"use client";

import {
    ChangeEvent,
    FormEvent,
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


export default function AdminServicesPage() {

    const [services, setServices] =
        useState<Service[]>([]);

    const [formData, setFormData] =
        useState(
            {
                name: "",
                description: "",
                estimatedTime: "",
                department: "",
            }
        );

    const [editId, setEditId] =
        useState<number | null>(
            null
        );

    const [refresh, setRefresh] =
        useState(0);

    const [
        responseMsg,
        setResponseMsg
    ] =
        useState("");

    const [err, setErr] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    useEffect(
        () => {

            const getServices =
                async () => {

                    setLoading(
                        true
                    );


                    try {

                        const response =
                            await api.get<Service[]>(
                                "/services?includeInactive=true"
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
        [refresh]
    );


    const onChangeHandle = (
        e:
            ChangeEvent<
                HTMLInputElement |
                HTMLTextAreaElement
            >
    ) => {

        const {
            name,
            value,
        } = e.target;


        setFormData(
            {
                ...formData,
                [name]: value,
            }
        );

    };


    const resetForm =
        () => {

            setEditId(
                null
            );


            setFormData(
                {
                    name: "",
                    description: "",
                    estimatedTime: "",
                    department: "",
                }
            );

        };


    const editService = (
        service: Service
    ) => {

        setEditId(
            service.id
        );


        setFormData(
            {
                name:
                    service.name,

                description:
                    service.description ||
                    "",

                estimatedTime:
                    String(
                        service.estimatedTime
                    ),

                department:
                    service.department,
            }
        );


        setResponseMsg("");
        setErr("");

    };


    const onSubmitHandle =
        async (
            e:
                FormEvent<
                    HTMLFormElement
                >
        ) => {

            e.preventDefault();

            setResponseMsg("");
            setErr("");


            if (
                !formData.name.trim() ||
                !formData.department.trim()
            ) {

                setErr(
                    "Name and department are required"
                );

                return;

            }


            const estimatedTime =
                Number(
                    formData.estimatedTime
                );


            if (
                !Number.isInteger(
                    estimatedTime
                ) ||
                estimatedTime <= 0
            ) {

                setErr(
                    "Estimated time must be a positive whole number"
                );

                return;

            }


            setSaving(
                true
            );


            try {

                if (
                    editId == null
                ) {

                    await api.post(
                        "/services",
                        {
                            name:
                                formData.name,

                            description:
                                formData.description,

                            estimatedTime,

                            department:
                                formData.department,
                        }
                    );


                    setResponseMsg(
                        "Service created successfully"
                    );

                }

                else {

                    await api.patch(
                        `/services/${editId}`,
                        {
                            name:
                                formData.name,

                            description:
                                formData.description,

                            estimatedTime,

                            department:
                                formData.department,
                        }
                    );


                    setResponseMsg(
                        "Service updated successfully"
                    );

                }


                resetForm();


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
                        editId == null
                            ? "Could not create service"
                            : "Could not update service"
                    );

                }

            }

            finally {

                setSaving(
                    false
                );

            }

        };


    const deactivateService =
        async (
            id: number
        ) => {

            setResponseMsg("");
            setErr("");


            try {

                await api.patch(
                    `/services/${id}/deactivate`,
                    {}
                );


                setResponseMsg(
                    "Service deactivated successfully"
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
                        "Could not deactivate service"
                    );

                }

            }

        };


    const deleteService =
        async (
            id: number
        ) => {

            setResponseMsg("");
            setErr("");


            try {

                await api.delete(
                    `/services/${id}`
                );


                setResponseMsg(
                    "Service deleted successfully"
                );


                if (
                    editId == id
                ) {

                    resetForm();

                }


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
                        "Could not delete service"
                    );

                }

            }

        };


    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Service Management
            </h1>

            <p className="mb-6">
                Create and manage queue services.
            </p>


            {
                responseMsg &&
                <div className="alert alert-success mb-4">

                    <span>
                        {responseMsg}
                    </span>

                </div>
            }


            {
                err &&
                <div className="alert alert-error mb-4">

                    <span>
                        {err}
                    </span>

                </div>
            }


            <div className="card bg-base-100 shadow border mb-8">

                <div className="card-body">

                    <h2 className="card-title">
                        {
                            editId == null
                                ? "Create Service"
                                : "Edit Service"
                        }
                    </h2>


                    <form
                        onSubmit={
                            onSubmitHandle
                        }
                    >

                        <div className="grid md:grid-cols-2 gap-4">

                            <div>

                                <label className="label">
                                    Service Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    className="input input-bordered w-full"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        onChangeHandle
                                    }
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
                                    value={
                                        formData.department
                                    }
                                    onChange={
                                        onChangeHandle
                                    }
                                    required
                                />

                            </div>


                            <div>

                                <label className="label">
                                    Estimated Time
                                    (minutes)
                                </label>

                                <input
                                    type="number"
                                    name="estimatedTime"
                                    min="1"
                                    step="1"
                                    className="input input-bordered w-full"
                                    value={
                                        formData.estimatedTime
                                    }
                                    onChange={
                                        onChangeHandle
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <label className="label mt-4">
                            Description
                        </label>

                        <textarea
                            name="description"
                            className="textarea textarea-bordered w-full"
                            value={
                                formData.description
                            }
                            onChange={
                                onChangeHandle
                            }
                        />


                        <div className="flex gap-3 mt-6">

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    saving
                                }
                            >

                                {
                                    saving
                                        ? "Saving..."
                                        : editId == null
                                            ? "Create Service"
                                            : "Update Service"
                                }

                            </button>


                            {
                                editId != null &&
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={
                                        resetForm
                                    }
                                >
                                    Cancel Edit
                                </button>
                            }

                        </div>

                    </form>

                </div>

            </div>


            {
                loading
                    ? (
                        <div className="flex items-center justify-center p-10">

                            <span className="loading loading-spinner"></span>

                            <span className="ml-3">
                                Loading services...
                            </span>

                        </div>
                    )
                    : (
                        <div className="overflow-x-auto">

                            <table className="table table-zebra">

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Estimated Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        services.map(
                                            (
                                                service
                                            ) => (

                                                <tr
                                                    key={
                                                        service.id
                                                    }
                                                >

                                                    <td>
                                                        {service.id}
                                                    </td>


                                                    <td>

                                                        <div className="font-semibold">
                                                            {service.name}
                                                        </div>

                                                        {
                                                            service.description &&
                                                            <div className="text-sm opacity-70">
                                                                {
                                                                    service.description
                                                                }
                                                            </div>
                                                        }

                                                    </td>


                                                    <td>
                                                        {service.department}
                                                    </td>


                                                    <td>
                                                        {
                                                            service.estimatedTime
                                                        } minutes
                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                service.isActive
                                                                    ? "badge badge-success"
                                                                    : "badge badge-error"
                                                            }
                                                        >

                                                            {
                                                                service.isActive
                                                                    ? "Active"
                                                                    : "Inactive"
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="flex flex-wrap gap-2">

                                                            <button
                                                                className="btn btn-outline btn-sm"
                                                                onClick={
                                                                    () =>
                                                                        editService(
                                                                            service
                                                                        )
                                                                }
                                                            >
                                                                Edit
                                                            </button>


                                                            {
                                                                service.isActive &&
                                                                <button
                                                                    className="btn btn-warning btn-sm"
                                                                    onClick={
                                                                        () =>
                                                                            deactivateService(
                                                                                service.id
                                                                            )
                                                                    }
                                                                >
                                                                    Deactivate
                                                                </button>
                                                            }


                                                            <button
                                                                className="btn btn-error btn-sm"
                                                                onClick={
                                                                    () =>
                                                                        deleteService(
                                                                            service.id
                                                                        )
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )
                                    }

                                </tbody>

                            </table>


                            {
                                services.length == 0 &&
                                <p className="mt-4">
                                    No services found.
                                </p>
                            }

                        </div>
                    )
            }

        </div>
    );

}