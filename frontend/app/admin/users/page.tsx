"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface User {
    id: number,
    fullName: string,
    email: string,
    phone?: string,
    role: string
}

interface UsersResponse {
    data: User[],
    total: number,
    page: number,
    limit: number
}

export default function AdminUsersPage() {

    const [users, setUsers] =
        useState<User[]>([]);

    const [err, setErr] =
        useState("");

    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [role, setRole] =
        useState("");

    const [sort, setSort] =
        useState("DESC");

    useEffect(() => {

        const getUsers = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                let url =
                    `http://localhost:3000/users?page=1&limit=10&sort=${sort}`;

                if (search) {

                    url =
                        url +
                        `&search=${encodeURIComponent(search)}`;

                }

                if (role) {

                    url =
                        url +
                        `&role=${role}`;

                }

                const response =
                    await axios.get<UsersResponse>(
                        url,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setUsers(
                    response.data.data
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
                        "Could not load users"
                    );

                }

            }

        }

        getUsers();

    }, [search, role, sort]);

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                User Management
            </h1>

            <p className="mb-6">
                View registered users
            </p>

            {
                err &&
                <div className="alert alert-error mb-4">

                    <span>
                        {err}
                    </span>

                </div>
            }

            <div className="overflow-x-auto">

                <div className="card bg-base-100 shadow border mb-6">

                    <div className="card-body">

                        <div className="flex gap-3">

                            <input
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Search name or email"
                                value={searchInput}
                                onChange={
                                    (e) =>
                                        setSearchInput(
                                            e.target.value
                                        )
                                }
                            />

                            <button
                                className="btn btn-primary"
                                onClick={
                                    () =>
                                        setSearch(
                                            searchInput
                                        )
                                }
                            >
                                Search
                            </button>
                            <select
                                className="select select-bordered"
                                value={role}
                                onChange={
                                    (e) =>
                                        setRole(
                                            e.target.value
                                        )
                                }
                            >

                                <option value="">
                                    All Roles
                                </option>

                                <option value="admin">
                                    Admin
                                </option>

                                <option value="staff">
                                    Staff
                                </option>

                                <option value="customer">
                                    Customer
                                </option>

                            </select>

                            <select
                                className="select select-bordered"
                                value={sort}
                                onChange={
                                    (e) =>
                                        setSort(
                                            e.target.value
                                        )
                                }
                            >

                                <option value="DESC">
                                    Newest First
                                </option>

                                <option value="ASC">
                                    Oldest First
                                </option>

                            </select>
                        </div>

                    </div>

                </div>

                <table className="table table-zebra">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                        </tr>

                    </thead>

                    <tbody>

                        {
                            users &&
                            users.map(
                                (user: User) => (

                                    <tr key={user.id}>

                                        <td>
                                            {user.id}
                                        </td>

                                        <td>
                                            {user.fullName}
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {user.phone || "-"}
                                        </td>

                                        <td>
                                            {user.role}
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