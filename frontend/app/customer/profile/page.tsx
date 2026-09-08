"use client";

import { useState } from "react";
import axios from "axios";

export default function ProfilePage() {

    const [formData, setFormData] =
        useState(
            {
                fullName: "",
                email: "",
                phone: "",
                role: ""
            }
        )

    const [responseMsg, setResponseMsg] =
        useState("");

    const getProfile = async () => {

        const token =
            localStorage.getItem(
                "access_token"
            );

        try {

            const response =
                await axios.get(
                    "http://localhost:3000/users/me",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        }
                    }
                )

            setFormData(
                {
                    fullName:
                        response.data.fullName,

                    email:
                        response.data.email,

                    phone:
                        response.data.phone || "",

                    role:
                        response.data.role
                }
            )

        }

        catch (error: any) {

            if (error.response?.data?.message) {

                setResponseMsg(
                    error.response.data.message
                );

            }

        }

    }

    const onChangeHandle = (e: any) => {

        const { name, value } =
            e.target;

        setFormData(
            {
                ...formData,
                [name]: value,
            }
        )

    }

    const updateProfile = async () => {

        const token =
            localStorage.getItem(
                "access_token"
            );

        try {

            const response =
                await axios.patch(
                    "http://localhost:3000/users/me",

                    {
                        fullName:
                            formData.fullName,

                        phone:
                            formData.phone
                    },

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        }
                    }
                )

            setResponseMsg(
                "Profile updated successfully"
            );

        }

        catch (error: any) {

            if (error.response?.data?.message) {

                setResponseMsg(
                    error.response.data.message
                );

            }

        }

    }

    return (
        <div className="max-w-xl mx-auto py-8">

            <div className="card bg-base-100 shadow-xl">

                <div className="card-body">

                    <div className="flex justify-between items-center">

                        <h1 className="text-2xl font-bold">
                            My Profile
                        </h1>

                        <button
                            onClick={getProfile}
                            className="btn btn-sm btn-outline"
                        >
                            Load Profile
                        </button>

                    </div>

                    <div className="mt-4">

                        <label className="label">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            className="input input-bordered w-full"
                            value={formData.fullName}
                            onChange={onChangeHandle}
                        />

                        <label className="label mt-3">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            className="input input-bordered w-full"
                            value={formData.email}
                            disabled
                        />

                        <label className="label mt-3">
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            className="input input-bordered w-full"
                            value={formData.phone}
                            onChange={onChangeHandle}
                        />

                        <label className="label mt-3">
                            Role
                        </label>

                        <input
                            type="text"
                            name="role"
                            className="input input-bordered w-full"
                            value={formData.role}
                            disabled
                        />

                        <button
                            onClick={updateProfile}
                            className="btn btn-primary w-full mt-6"
                        >
                            Update Profile
                        </button>

                    </div>

                    {
                        responseMsg &&
                        <div className="alert mt-4">
                            {responseMsg}
                        </div>
                    }

                </div>

            </div>

        </div>
    )
}