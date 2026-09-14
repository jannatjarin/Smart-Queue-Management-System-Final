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

interface UserData {
    role: string;
}

export default function LoginPage() {
    const router =
        useRouter();

    const [formData, setFormData] =
        useState({
            email: "",
            pass: "",
        });

    const [responseMsg, setResponseMsg] =
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
        setLoading(true);

        try {
            const response =
                await api.post(
                    "/auth/login",
                    {
                        email:
                            formData.email,

                        password:
                            formData.pass,
                    }
                );

            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            localStorage.setItem(
                "refresh_token",
                response.data.refresh_token
            );

            const userResponse =
                await api.get<UserData>(
                    "/users/me"
                );

            const role =
                userResponse.data.role;

            if (role === "admin") {
                router.push(
                    "/admin/dashboard"
                );
            } else if (
                role === "staff"
            ) {
                router.push(
                    "/staff/dashboard"
                );
            } else if (
                role === "customer"
            ) {
                router.push(
                    "/customer/dashboard"
                );
            } else {
                localStorage.removeItem(
                    "access_token"
                );

                localStorage.removeItem(
                    "refresh_token"
                );

                setResponseMsg(
                    "Invalid user role"
                );
            }
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.data?.message
            ) {
                const message =
                    error.response.data.message;

                setResponseMsg(
                    Array.isArray(message)
                        ? message.join(", ")
                        : message
                );
            } else {
                setResponseMsg(
                    "Login failed"
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
                        Welcome back
                    </p>

                    <h1 className="mt-2 text-4xl font-bold text-[#332c26]">
                        Login
                    </h1>

                    <p className="mt-2 text-sm text-[#746960]">
                        Sign in to continue to SQMS.
                    </p>
                </div>

                {responseMsg && (
                    <div className="mt-5 rounded-[16px] border border-[#dfb4b7] bg-[#f4d5d7] px-4 py-3 text-sm font-bold text-[#82464b]">
                        {responseMsg}
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
                            htmlFor="email"
                            className="mb-2 block text-sm font-bold text-[#574d44]"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            className="input w-full"
                            value={
                                formData.email
                            }
                            onChange={
                                onChangeHandle
                            }
                            required
                        />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <label
                                htmlFor="pass"
                                className="text-sm font-bold text-[#574d44]"
                            >
                                Password
                            </label>

                            <Link
                                href="/forgot-password"
                                className="text-sm font-bold text-[#8f3d27] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <input
                            id="pass"
                            type="password"
                            name="pass"
                            placeholder="Enter your password"
                            className="input w-full"
                            value={
                                formData.pass
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
                            ? "Signing in..."
                            : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#746960]">
                    Don&apos;t have an account?{" "}

                    <Link
                        href="/register"
                        className="font-bold text-[#8f3d27] hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </section>
        </main>
    );
}