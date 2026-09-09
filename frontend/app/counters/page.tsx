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

interface Staff {
    id: number,
    fullName: string,
    email: string
}

interface UsersResponse {
    data: Staff[],
    total: number,
    page: number,
    limit: number
}

interface Counter {
    id: number,
    name: string,
    status: string,
    staff: Staff | null,
    services: Service[]
}

export default function AdminCountersPage() {

    const [counters, setCounters] =
        useState<Counter[]>([]);

    const [services, setServices] =
        useState<Service[]>([]);

    const [formData, setFormData] =
        useState(
            {
                name: "",
                serviceIds: [] as number[]
            }
        );

    const [refresh, setRefresh] =
        useState(0);

    const [responseMsg, setResponseMsg] =
        useState("");

    const [err, setErr] =
        useState("");

    const [staff, setStaff] =
        useState<Staff[]>([]);


    useEffect(() => {

        const getData = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                const countersResponse =
                    await axios.get<Counter[]>(
                        "http://localhost:3000/counters",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                const servicesResponse =
                    await axios.get<Service[]>(
                        "http://localhost:3000/services"
                    );

                const staffResponse =
                    await axios.get<UsersResponse>(
                        "http://localhost:3000/users?role=staff&limit=100",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setCounters(
                    countersResponse.data
                );

                setServices(
                    servicesResponse.data
                );

                setStaff(
                    staffResponse.data.data
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
                        "Could not load counter information"
                    );

                }

            }

        }

        getData();

    }, [refresh]);

    const onChangeHandle = (
        e: ChangeEvent<HTMLInputElement>
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

    const handleServiceChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const serviceId =
            Number(
                e.target.value
            );

        const checked =
            e.target.checked;

        if (checked) {

            setFormData(
                {
                    ...formData,

                    serviceIds: [
                        ...formData.serviceIds,
                        serviceId
                    ]
                }
            );

        }

        else {

            setFormData(
                {
                    ...formData,

                    serviceIds:
                        formData.serviceIds.filter(
                            (id: number) => {

                                return id != serviceId;

                            }
                        )
                }
            );

        }

    }

    const onSubmitHandle = (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        const createCounter = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                await axios.post(
                    "http://localhost:3000/counters",
                    {
                        name:
                            formData.name,

                        serviceIds:
                            formData.serviceIds
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setResponseMsg(
                    "Counter created successfully"
                );

                setErr("");

                setFormData(
                    {
                        name: "",
                        serviceIds: []
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
                        "Could not create counter"
                    );

                }

            }

        }

        createCounter();

    }

    const assignStaff = (
        counterId: number,
        staffId: string
    ) => {

        if (!staffId) {
            return;
        }

        const assignData = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                await axios.patch(
                    `http://localhost:3000/counters/${counterId}/assign-staff`,
                    {
                        staffId:
                            Number(
                                staffId
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
                    "Staff assigned successfully"
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
                        "Could not assign staff"
                    );

                }

            }

        }

        assignData();

    }

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Counter Management
            </h1>

            <p className="mb-6">
                Create and manage counters
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
                        Create Counter
                    </h2>

                    <form onSubmit={onSubmitHandle}>

                        <label className="label">
                            Counter Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            className="input input-bordered w-full"
                            value={formData.name}
                            onChange={onChangeHandle}
                            required
                        />

                        <h3 className="font-semibold mt-5 mb-2">
                            Services
                        </h3>

                        <div className="grid md:grid-cols-3 gap-3">

                            {
                                services &&
                                services.map(
                                    (service: Service) => (

                                        <label
                                            key={service.id}
                                            className="flex items-center gap-2"
                                        >

                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                value={service.id}
                                                checked={
                                                    formData.serviceIds.includes(
                                                        service.id
                                                    )
                                                }
                                                onChange={handleServiceChange}
                                            />

                                            {service.name}

                                        </label>

                                    )
                                )
                            }

                        </div>

                        <input
                            type="submit"
                            value="Create Counter"
                            className="btn btn-primary mt-6"
                        />

                    </form>

                </div>

            </div>

            <div className="overflow-x-auto">

                <table className="table table-zebra">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Services</th>
                            <th>Staff</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {
                            counters &&
                            counters.map(
                                (counter: Counter) => (

                                    <tr key={counter.id}>

                                        <td>
                                            {counter.id}
                                        </td>

                                        <td>
                                            {counter.name}
                                        </td>

                                        <td>

                                            {
                                                counter.services &&
                                                counter.services.map(
                                                    (
                                                        service: Service
                                                    ) => (

                                                        <div key={service.id}>
                                                            {service.name}
                                                        </div>

                                                    )
                                                )
                                            }

                                        </td>

                                        <td>

                                            <select
                                                className="select select-bordered select-sm"
                                                value={
                                                    counter.staff?.id || ""
                                                }
                                                onChange={
                                                    (e) =>
                                                        assignStaff(
                                                            counter.id,
                                                            e.target.value
                                                        )
                                                }
                                            >

                                                <option value="">
                                                    Select Staff
                                                </option>

                                                {
                                                    staff &&
                                                    staff.map(
                                                        (
                                                            user: Staff
                                                        ) => (

                                                            <option
                                                                key={user.id}
                                                                value={user.id}
                                                            >
                                                                {user.fullName}
                                                            </option>

                                                        )
                                                    )
                                                }

                                            </select>

                                        </td>

                                        <td>
                                            {counter.status}
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