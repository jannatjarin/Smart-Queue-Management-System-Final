"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import axios from "axios";
import Link from "next/link";

import api from "@/lib/axios";

export default function ForgotPasswordPage() {
    const [formData, setFormData] =
        useState({
            email: "",
        });

    const [responseMsg, setResponseMsg] =
        useState("");

    const [err, setErr] =
        useState("");

    const [loading, setLoading] =
        useState(false);

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

        setResponseMsg("");
        setErr("");
        setLoading(true);

        try {
            const response =
                await api.post(
                    "/auth/forgot-password",
                    {
                        email:
                            formData.email,
                    }
                );

            setResponseMsg(
                response.data.message
            );
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
                    "Could not send reset request"
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
                        Forgot password?
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#746960]">
                        Enter your email to receive a reset token.
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
                    className="mt-6"
                >
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-bold text-[#574d44]"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        className="input w-full"
                        placeholder="you@example.com"
                        value={
                            formData.email
                        }
                        onChange={
                            onChangeHandle
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-5 min-h-12 w-full rounded-full bg-[#5d7d5f] px-5 text-sm font-bold text-white transition hover:bg-[#4e6c50] disabled:cursor-not-allowed disabled:bg-[#aaa39a]"
                    >
                        {loading
                            ? "Sending..."
                            : "Send reset token"}
                    </button>
                </form>

                <div className="mt-6 flex flex-col items-center gap-2 text-sm">
                    <Link
                        href="/reset-password"
                        className="font-bold text-[#8f3d27] hover:underline"
                    >
                        I already have a token
                    </Link>

                    <Link
                        href="/login"
                        className="font-semibold text-[#746960] hover:text-[#8f3d27]"
                    >
                        Back to login
                    </Link>
                </div>
            </section>
        </main>
    );
}