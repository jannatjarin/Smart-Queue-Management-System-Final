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

}


interface Queue {

    id: number;
    name: string;
    location: string;
    status: string;
    currentTicketNumber: number;
    service: Service;

}


export default function AdminQueuesPage() {

    const [queues, setQueues] =
        useState<Queue[]>([]);

    const [services, setServices] =
        useState<Service[]>([]);

    const [formData, setFormData] =
        useState(
            {
                name: "",
                location: "",
                serviceId: "",
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

            const getData =
                async () => {

                    setLoading(
                        true
                    );


                    try {

                        const queuesResponse =
                            await api.get<Queue[]>(
                                "/queues"
                            );


                        const servicesResponse =
                            await api.get<Service[]>(
                                "/services"
                            );


                        setQueues(
                            queuesResponse.data
                        );

                        setServices(
                            servicesResponse.data
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
                                "Could not load queue information"
                            );

                        }

                    }

                    finally {

                        setLoading(
                            false
                        );

                    }

                };


            getData();

        },
        [refresh]
    );


    const onChangeHandle = (
        e:
            ChangeEvent<
                HTMLInputElement |
                HTMLSelectElement
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


    const clearForm =
        () => {

            setFormData(
                {
                    name: "",
                    location: "",
                    serviceId: "",
                }
            );

            setEditId(
                null
            );

        };


    const editQueue = (
        queue: Queue
    ) => {

        setEditId(
            queue.id
        );


        setFormData(
            {
                name:
                    queue.name,

                location:
                    queue.location,

                serviceId:
                    String(
                        queue.service.id
                    ),
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
                !formData.location.trim()
            ) {

                setErr(
                    "Queue name and location are required"
                );

                return;

            }


            if (
                editId == null &&
                !formData.serviceId
            ) {

                setErr(
                    "Please select a service"
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
                        "/queues",
                        {
                            name:
                                formData.name,

                            location:
                                formData.location,

                            serviceId:
                                Number(
                                    formData.serviceId
                                ),
                        }
                    );


                    setResponseMsg(
                        "Queue created successfully"
                    );

                }

                else {

                    await api.patch(
                        `/queues/${editId}`,
                        {
                            name:
                                formData.name,

                            location:
                                formData.location,
                        }
                    );


                    setResponseMsg(
                        "Queue updated successfully"
                    );

                }


                clearForm();


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
                        "Could not save queue"
                    );

                }

            }

            finally {

                setSaving(
                    false
                );

            }

        };


    const updateQueueStatus =
        async (
            id: number,
            status: string
        ) => {

            setResponseMsg("");
            setErr("");


            try {

                await api.patch(
                    `/queues/${id}/status`,
                    {
                        status,
                    }
                );


                setResponseMsg(
                    "Queue status updated successfully"
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
                        "Could not update queue status"
                    );

                }

            }

        };


    const deleteQueue =
        async (
            id: number
        ) => {

            setResponseMsg("");
            setErr("");


            try {

                await api.delete(
                    `/queues/${id}`
                );


                setResponseMsg(
                    "Queue deleted successfully"
                );


                if (
                    editId == id
                ) {

                    clearForm();

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
                        "Could not delete queue"
                    );

                }

            }

        };


    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Queue Management
            </h1>


            <p className="mb-6">
                Create and manage queues.
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
                                ? "Create Queue"
                                : "Edit Queue"
                        }

                    </h2>


                    <form
                        onSubmit={
                            onSubmitHandle
                        }
                    >

                        <div className="grid md:grid-cols-3 gap-4">

                            <div>

                                <label className="label">
                                    Queue Name
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
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    className="input input-bordered w-full"
                                    value={
                                        formData.location
                                    }
                                    onChange={
                                        onChangeHandle
                                    }
                                    required
                                />

                            </div>


                            <div>

                                <label className="label">
                                    Service
                                </label>

                                <select
                                    name="serviceId"
                                    className="select select-bordered w-full"
                                    value={
                                        formData.serviceId
                                    }
                                    onChange={
                                        onChangeHandle
                                    }
                                    disabled={
                                        editId != null
                                    }
                                    required={
                                        editId == null
                                    }
                                >

                                    <option value="">
                                        Select Service
                                    </option>


                                    {
                                        services.map(
                                            (service) => (

                                                <option
                                                    key={
                                                        service.id
                                                    }
                                                    value={
                                                        service.id
                                                    }
                                                >
                                                    {
                                                        service.name
                                                    }
                                                </option>

                                            )
                                        )
                                    }

                                </select>


                                {
                                    editId != null &&
                                    <p className="text-xs opacity-70 mt-1">
                                        Service cannot be changed while editing a queue.
                                    </p>
                                }

                            </div>

                        </div>


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
                                            ? "Create Queue"
                                            : "Update Queue"
                                }

                            </button>


                            {
                                editId != null &&
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={
                                        clearForm
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
                                Loading queues...
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
                                        <th>Service</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                        <th>Current Number</th>
                                        <th>Actions</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        queues.map(
                                            (queue) => (

                                                <tr
                                                    key={
                                                        queue.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            queue.id
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            queue.name
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            queue
                                                                .service
                                                                .name
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            queue.location
                                                        }
                                                    </td>


                                                    <td>

                                                        <select
                                                            className="select select-bordered select-sm"
                                                            value={
                                                                queue.status
                                                            }
                                                            onChange={
                                                                (e) =>
                                                                    updateQueueStatus(
                                                                        queue.id,
                                                                        e.target.value
                                                                    )
                                                            }
                                                        >

                                                            <option value="open">
                                                                Open
                                                            </option>

                                                            <option value="closed">
                                                                Closed
                                                            </option>

                                                        </select>

                                                    </td>


                                                    <td>
                                                        {
                                                            queue.currentTicketNumber
                                                        }
                                                    </td>


                                                    <td>

                                                        <div className="flex flex-wrap gap-2">

                                                            <button
                                                                className="btn btn-outline btn-sm"
                                                                onClick={
                                                                    () =>
                                                                        editQueue(
                                                                            queue
                                                                        )
                                                                }
                                                            >
                                                                Edit
                                                            </button>


                                                            <button
                                                                className="btn btn-error btn-sm"
                                                                onClick={
                                                                    () =>
                                                                        deleteQueue(
                                                                            queue.id
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
                                queues.length == 0 &&
                                <p className="mt-4">
                                    No queues found.
                                </p>
                            }

                        </div>
                    )
            }

        </div>
    );

}