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

    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [role, setRole] =
        useState("");

    const [sort, setSort] =
        useState("DESC");

    const [page, setPage] =
        useState(1);

    const [total, setTotal] =
        useState(0);

    const [refresh, setRefresh] =
        useState(0);

    const [responseMsg, setResponseMsg] =
        useState("");

    const [err, setErr] =
        useState("");

    const limit = 10;

    useEffect(() => {

        const getUsers = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                let url =
                    `http://localhost:3000/users?page=${page}&limit=${limit}&sort=${sort}`;

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

                setTotal(
                    response.data.total
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

    }, [
        search,
        role,
        sort,
        page,
        refresh
    ]);

    const updateRole = (
        id: number,
        newRole: string
    ) => {

        const updateData = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                await axios.patch(
                    `http://localhost:3000/users/${id}/role`,
                    {
                        role: newRole
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setResponseMsg(
                    "User role updated successfully"
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
                        "Could not update user role"
                    );

                }

            }

        }

        updateData();

    }

    const totalPages =
        Math.ceil(
            total / limit
        );

    return (
        <div className="max-w-7xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                User Management
            </h1>

            <p className="mb-6">
                Search users and manage roles
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

            <div className="card bg-base-100 shadow border mb-6">

                <div className="card-body">

                    <div className="grid md:grid-cols-4 gap-4">

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

                        <select
                            className="select select-bordered w-full"
                            value={role}
                            onChange={
                                (e) => {

                                    setRole(
                                        e.target.value
                                    );

                                    setPage(1);

                                }
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
                            className="select select-bordered w-full"
                            value={sort}
                            onChange={
                                (e) => {

                                    setSort(
                                        e.target.value
                                    );

                                    setPage(1);

                                }
                            }
                        >

                            <option value="DESC">
                                Newest First
                            </option>

                            <option value="ASC">
                                Oldest First
                            </option>

                        </select>

                        <button
                            className="btn btn-primary"
                            onClick={
                                () => {

                                    setPage(1);

                                    setSearch(
                                        searchInput
                                    );

                                }
                            }
                        >
                            Search
                        </button>

                    </div>

                </div>

            </div>

            <div className="overflow-x-auto">

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

                                            <select
                                                className="select select-bordered select-sm"
                                                value={user.role}
                                                onChange={
                                                    (e) =>
                                                        updateRole(
                                                            user.id,
                                                            e.target.value
                                                        )
                                                }
                                            >

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

                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>

            </div>

            {
                users.length == 0 &&
                !err &&

                <p className="mt-4">
                    No users found
                </p>
            }

            <div className="flex justify-between items-center mt-6">

                <button
                    className="btn btn-outline"
                    disabled={page <= 1}
                    onClick={
                        () =>
                            setPage(
                                page - 1
                            )
                    }
                >
                    Previous
                </button>

                <span>
                    Page {page} of {totalPages || 1}
                </span>

                <button
                    className="btn btn-outline"
                    disabled={
                        page >= totalPages
                    }
                    onClick={
                        () =>
                            setPage(
                                page + 1
                            )
                    }
                >
                    Next
                </button>

            </div>

        </div>
    )
}
