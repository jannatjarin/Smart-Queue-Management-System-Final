"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";

import axios from "axios";

import api from "@/lib/axios";

interface UserData {
    fullName: string;
    email: string;
    phone: string | null;
    role: string;
}

export default function ProfilePage() {
    const [formData, setFormData] =
        useState({
            fullName: "",
            email: "",
            phone: "",
            role: "",
        });

    const [responseMsg, setResponseMsg] =
        useState("");

    const [err, setErr] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response =
                    await api.get<UserData>(
                        "/users/me"
                    );

                setFormData({
                    fullName:
                        response.data
                            .fullName,

                    email:
                        response.data
                            .email,

                    phone:
                        response.data
                            .phone || "",

                    role:
                        response.data
                            .role,
                });

                setErr("");
            } catch (error) {
                if (
                    axios.isAxiosError(
                        error
                    ) &&
                    error.response?.data
                        ?.message
                ) {
                    setErr(
                        error.response.data
                            .message
                    );
                } else {
                    setErr(
                        "Could not load profile"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, []);

    const onChangeHandle = (
        e:
            ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } =
            e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const updateProfile = async (
        e:
            FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setResponseMsg("");
        setErr("");

        if (
            !formData.fullName.trim()
        ) {
            setErr(
                "Full name is required"
            );

            return;
        }

        setSaving(true);

        try {
            const response =
                await api.patch<UserData>(
                    "/users/me",
                    {
                        fullName:
                            formData
                                .fullName,

                        phone:
                            formData.phone,
                    }
                );

            setFormData({
                fullName:
                    response.data
                        .fullName,

                email:
                    response.data.email,

                phone:
                    response.data.phone ||
                    "",

                role:
                    response.data.role,
            });

            setResponseMsg(
                "Profile updated successfully"
            );
        } catch (error) {
            if (
                axios.isAxiosError(
                    error
                ) &&
                error.response?.data
                    ?.message
            ) {
                setErr(
                    error.response.data
                        .message
                );
            } else {
                setErr(
                    "Could not update profile"
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center">
                <span className="loading loading-spinner loading-md text-[#8f3d27]" />

                <span className="ml-3 font-semibold text-[#665d54]">
                    Loading profile...
                </span>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl py-8 sm:py-10">
            <header className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                    Your account
                </p>

                <h1 className="mt-1 text-4xl font-bold text-[#332c26]">
                    Profile
                </h1>

                <p className="mt-2 text-sm text-[#746960]">
                    Update your account details.
                </p>
            </header>

            {responseMsg && (
                <div className="mb-5 rounded-[18px] border border-[#b6ceb2] bg-[#dcebd8] px-4 py-3 text-sm font-bold text-[#416343]">
                    {responseMsg}
                </div>
            )}

            {err && (
                <div className="mb-5 rounded-[18px] border border-[#dfb4b7] bg-[#f4d5d7] px-4 py-3 text-sm font-bold text-[#82464b]">
                    {err}
                </div>
            )}

            <form
                onSubmit={updateProfile}
                className="rounded-[26px] border border-[#d7c6b1] bg-[#fffaf0] p-5 sm:p-7"
            >
                <div className="space-y-5">
                    <div>
                        <label
                            htmlFor="fullName"
                            className="mb-2 block text-sm font-bold text-[#574d44]"
                        >
                            Full name
                        </label>

                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            className="input w-full border-[#cbbba8] bg-[#fffdf8] text-[#443b34]"
                            value={
                                formData.fullName
                            }
                            onChange={
                                onChangeHandle
                            }
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-bold text-[#574d44]"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            className="input w-full border-[#ded5c9] bg-[#eee8df] text-[#81776d]"
                            value={
                                formData.email
                            }
                            disabled
                        />

                        <p className="mt-1 text-xs text-[#8b8178]">
                            Email cannot be changed here.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block text-sm font-bold text-[#574d44]"
                        >
                            Phone
                        </label>

                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            className="input w-full border-[#cbbba8] bg-[#fffdf8] text-[#443b34]"
                            value={
                                formData.phone
                            }
                            onChange={
                                onChangeHandle
                            }
                            placeholder="Add phone number"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="role"
                            className="mb-2 block text-sm font-bold text-[#574d44]"
                        >
                            Role
                        </label>

                        <input
                            id="role"
                            type="text"
                            className="input w-full border-[#ded5c9] bg-[#eee8df] capitalize text-[#81776d]"
                            value={
                                formData.role
                            }
                            disabled
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="mt-6 min-h-11 rounded-full bg-[#5d7d5f] px-6 text-sm font-bold text-white transition hover:bg-[#4e6c50] disabled:cursor-not-allowed disabled:bg-[#aaa39a]"
                >
                    {saving
                        ? "Saving..."
                        : "Save changes"}
                </button>
            </form>
        </div>
    );
}