"use client";

import { useState, useEffect } from "react";
import type {
    ChangeEvent,
    FormEvent
} from "react";
import axios from "axios";

interface Service {
    id: number,
    name: string
}

interface Queue {
    id: number,
    name: string,
    location: string,
    status: string,
    currentTicketNumber: number,
    service: Service
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
                serviceId: ""
            }
        );

    const [editId, setEditId] =
        useState<number | null>(
            null
        );

    const [refresh, setRefresh] =
        useState(0);

    const [responseMsg, setResponseMsg] =
        useState("");

    const [err, setErr] =
        useState("");

    useEffect(() => {

        const getData = async () => {

            try {

                const queuesResponse =
                    await axios.get<Queue[]>(
                        "http://localhost:3000/queues"
                    );

                const servicesResponse =
                    await axios.get<Service[]>(
                        "http://localhost:3000/services"
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
                    axios.isAxiosError(error) &&
                    error.response?.data?.message
                ) {

                    setErr(
                        error.response.data.message
                    );

                }

                else {

                    setErr(
                        "Could not load queue information"
                    );

                }

            }

        }

        getData();

    }, [refresh]);

    const onChangeHandle = (
        e: ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement
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

    const clearForm = () => {

        setFormData(
            {
                name: "",
                location: "",
                serviceId: ""
            }
        );

        setEditId(
            null
        );

    }

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
                        queue.service?.id || ""
                    )
            }
        );

        setResponseMsg("");

        setErr("");

    }

    const onSubmitHandle = (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        const saveQueue = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                if (editId == null) {

                    await axios.post(
                        "http://localhost:3000/queues",
                        {
                            name:
                                formData.name,

                            location:
                                formData.location,

                            serviceId:
                                Number(
                                    formData.serviceId
                                )
                        },
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                    setResponseMsg(
                        "Queue created successfully"
                    );

                }

                else {

                    await axios.patch(
                        `http://localhost:3000/queues/${editId}`,
                        {
                            name:
                                formData.name,

                            location:
                                formData.location
                        },
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                    setResponseMsg(
                        "Queue updated successfully"
                    );

                }

                setErr("");

                clearForm();

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
                        "Could not save queue"
                    );

                }

            }

        }

        saveQueue();

    }

    const updateQueueStatus = (
        id: number,
        status: string
    ) => {

        const updateData = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                await axios.patch(
                    `http://localhost:3000/queues/${id}/status`,
                    {
                        status:
                            status
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setResponseMsg(
                    "Queue status updated successfully"
                );

                setErr("");

                setRefresh(
                    refresh + 1
                );

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
                        "Could not update queue status"
                    );

                }

            }

        }

        updateData();

    }

    const deleteQueue = (
        id: number
    ) => {

        const removeQueue = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                await axios.delete(
                    `http://localhost:3000/queues/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setResponseMsg(
                    "Queue deleted successfully"
                );

                setErr("");

                setRefresh(
                    refresh + 1
                );

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
                        "Could not delete queue"
                    );

                }

            }

        }

        removeQueue();

    }

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Queue Management
            </h1>

            <p className="mb-6">
                Create and manage queues
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

                    <form onSubmit={onSubmitHandle}>

                        <div className="grid md:grid-cols-3 gap-4">

                            <div>

                                <label className="label">
                                    Queue Name
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
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    className="input input-bordered w-full"
                                    value={formData.location}
                                    onChange={onChangeHandle}
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
                                    value={formData.serviceId}
                                    onChange={onChangeHandle}
                                    required={editId == null}
                                    disabled={editId != null}
                                >

                                    <option value="">
                                        Select Service
                                    </option>

                                    {
                                        services &&
                                        services.map(
                                            (
                                                service: Service
                                            ) => (

                                                <option
                                                    key={service.id}
                                                    value={service.id}
                                                >
                                                    {service.name}
                                                </option>

                                            )
                                        )
                                    }

                                </select>

                            </div>

                        </div>

                        <div className="flex gap-3 mt-6">

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >

                                {
                                    editId == null
                                        ? "Create Queue"
                                        : "Update Queue"
                                }

                            </button>

                            {
                                editId != null &&

                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={clearForm}
                                >
                                    Cancel Edit
                                </button>
                            }

                        </div>

                    </form>

                </div>

            </div>

            <div className="overflow-x-auto">

                <table className="table table-zebra">

                    <thead>

                        <tr>
                            <th>Name</th>
                            <th>Service</th>
                            <th>Location</th>
                            <th>Current Ticket</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {
                            queues &&
                            queues.map(
                                (queue: Queue) => (

                                    <tr key={queue.id}>

                                        <td>
                                            {queue.name}
                                        </td>

                                        <td>
                                            {queue.service?.name}
                                        </td>

                                        <td>
                                            {queue.location}
                                        </td>

                                        <td>
                                            {queue.currentTicketNumber}
                                        </td>

                                        <td>
                                             <select
                                                className="select select-bordered select-sm"
                                                value={queue.status}
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

                                            <div className="flex gap-2">

                                                <button
                                                    className="btn btn-sm btn-outline"
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
                                                    className="btn btn-sm btn-error"
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

            </div>

        </div>
    )
}