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

    useEffect(() => {

        const getUsers = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                const response =
                    await axios.get<UsersResponse>(
                        "http://localhost:3000/users?page=1&limit=10",
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

    }, []);

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