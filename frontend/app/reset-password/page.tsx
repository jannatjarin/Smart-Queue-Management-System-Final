"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import api from "@/lib/axios";

export default function ResetPasswordPage() {
    const router =
        useRouter();

    const [err, setErr] =
        useState("");

    const [responseMsg, setResponseMsg] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            token: "",
            newPassword: "",
            confirmPassword: "",
        });

    const onChangeHandle = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } =
            e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const onSubmitHandle = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setErr("");
        setResponseMsg("");

        if (
            formData.newPassword.length <
            6
        ) {
            setErr(
                "Password must be at least 6 characters"
            );

            return;
        }

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {
            setErr(
                "Passwords do not match"
            );

            return;
        }

        setLoading(true);

        try {
            const response =
                await api.post(
                    "/auth/reset-password",
                    {
                        token:
                            formData.token,

                        newPassword:
                            formData.newPassword,
                    }
                );

            setResponseMsg(
                response.data.message
            );

            setTimeout(() => {
                router.push(
                    "/login"
                );
            }, 1500);
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.data?.message
            ) {
                const message =
                    error.response.data.message;

                setErr(
                    Array.isArray(message)
                        ? message.join(", ")
                        : message
                );
            } else {
                setErr(
                    "Could not reset password"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-[72vh] items-center justify-center py-10">
            <section className="w-full max-w-md rounded-[28px] border border-[#d6c5b1] bg-[#fffaf0] p-6 shadow-[0_14px_35px_rgba(70,52,40,0.08)] sm:p-8">
                <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                        Account recovery
                    </p>

                    <h1 className="mt-2 text-4xl font-bold text-[#332c26]">
                        Reset password
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#746960]">
                        Enter your reset token and choose a new password.
                    </p>
                </div>

                {responseMsg && (
                    <div className="mt-5 rounded-[16px] border border-[#b6ceb2] bg-[#dcebd8] px-4 py-3 text-sm font-bold text-[#416343]">
                        {responseMsg}
                    </div>
                )}

                {err && (
                    <div className="mt-5 rounded-[16px] border border-[#dfb4b7] bg-[#f4d5d7] px-4 py-3 text-sm font-bold text-[#82464b]">
                        {err}
                    </div>
                )}

                <form
                    onSubmit={
                        onSubmitHandle
                    }
                    className="mt-6 space-y-4"
                >
                    <div>
                        <label
                            htmlFor="token"
                            className="mb-2 block text-sm font-bold text-[#574d44]"
                        >
                            Reset token
                        </label>

                        <input
                            id="token"
                            type="text"
                            name="token"
                            className="input w-full"
                            placeholder="Paste your token"
                            value={
                                formData.token
                            }
                            onChange={
                                onChangeHandle
                            }
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="newPassword"
                            className="mb-2 block text-sm font-bold text-[#574d44]"
                        >
                            New password
                        </label>

                        <input
                            id="newPassword"
                            type="password"
                            name="newPassword"
                            className="input w-full"
                            placeholder="At least 6 characters"
                            value={
                                formData
                                    .newPassword
                            }
                            onChange={
                                onChangeHandle
                            }
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-bold text-[#574d44]"
                        >
                            Confirm password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            className="input w-full"
                            placeholder="Repeat password"
                            value={
                                formData
                                    .confirmPassword
                            }
                            onChange={
                                onChangeHandle
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="min-h-12 w-full rounded-full bg-[#5d7d5f] px-5 text-sm font-bold text-white transition hover:bg-[#4e6c50] disabled:cursor-not-allowed disabled:bg-[#aaa39a]"
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset password"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm">
                    <Link
                        href="/login"
                        className="font-bold text-[#8f3d27] hover:underline"
                    >
                        Back to login
                    </Link>
                </p>
            </section>
        </main>
    );
}