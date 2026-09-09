"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface StaffProfile {
    id: number,
    fullName: string,
    email: string,
    phone?: string,
    role: string
}

export default function StaffProfilePage() {

    const [formData, setFormData] =
        useState(
            {
                fullName: "",
                email: "",
                phone: "",
                role: ""
            }
        );

    const [err, setErr] =
        useState("");

    const [responseMsg, setResponseMsg] =
        useState("");

    useEffect(() => {

        const getProfile = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

                const response =
                    await axios.get<StaffProfile>(
                        "http://localhost:3000/users/me",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

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
                        "Could not load profile"
                    );

                }

            }

        }

        getProfile();

    }, []);

    const onChangeHandle = (
        e: React.ChangeEvent<HTMLInputElement>
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
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        const updateProfile = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            try {

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
                                `Bearer ${token}`
                        }
                    }
                );

                setResponseMsg(
                    "Profile updated successfully"
                );

                setErr("");

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
                        "Could not update profile"
                    );

                }

            }

        }

        updateProfile();

    }

    return (
        <div className="max-w-3xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-2">
                Staff Profile
            </h1>

            <p className="mb-6">
                View your profile
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

            <div className="card bg-base-100 shadow border">

                <div className="card-body">

                    <form onSubmit={onSubmitHandle}>

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

                        <label className="label mt-4">
                            Email
                        </label>

                        <input
                            type="email"
                            className="input input-bordered w-full"
                            value={formData.email}
                            disabled
                        />

                        <label className="label mt-4">
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            className="input input-bordered w-full"
                            value={formData.phone}
                            onChange={onChangeHandle}
                        />

                        <label className="label mt-4">
                            Role
                        </label>

                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={formData.role}
                            disabled
                        />

                        <button
                            type="submit"
                            className="btn btn-primary w-full mt-6"
                        >
                            Update Profile
                        </button>

                    </form>

                </div>

            </div>

        </div>
    )
}