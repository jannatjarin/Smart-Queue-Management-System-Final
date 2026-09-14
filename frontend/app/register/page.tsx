"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

import api from "@/lib/axios";
import ToastMessage from "@/components/ui/ToastMessage";

const registerSchema =
    z.object({
        fullName:
            z.string().min(
                2,
                "Full name must be at least 2 characters"
            ),

        email:
            z.string().email(
                "Enter a valid email address"
            ),

        phone:
            z.string(),

        password:
            z.string().min(
                6,
                "Password must be at least 6 characters"
            ),

        confirmPassword:
            z.string().min(
                6,
                "Confirm password is required"
            ),
    }).refine(
        (data) =>
            data.password ===
            data.confirmPassword,
        {
            message:
                "Passwords do not match",

            path: [
                "confirmPassword",
            ],
        }
    );

export default function RegisterPage() {
    const router =
        useRouter();

    const [formData, setFormData] =
        useState({
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
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

        const validationResult =
            registerSchema.safeParse(
                formData
            );

        if (
            !validationResult.success
        ) {
            setErr(
                validationResult
                    .error
                    .issues[0]
                    .message
            );

            return;
        }

        setLoading(true);

        try {
            await api.post(
                "/auth/register",
                {
                    fullName:
                        formData.fullName,

                    email:
                        formData.email,

                    phone:
                        formData.phone ||
                        undefined,

                    password:
                        formData.password,
                }
            );

            setResponseMsg(
                "Registration successful"
            );

            setTimeout(() => {
                router.push(
                    "/login"
                );
            }, 1200);
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
                    "Registration failed"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-[72vh] items-center justify-center py-10">
            <ToastMessage
                message={responseMsg}
                type="success"
            />

            <ToastMessage
                message={err}
                type="error"
            />

            <section className="w-full max-w-lg rounded-[28px] border border-[#d6c5b1] bg-[#fffaf0] p-6 shadow-[0_14px_35px_rgba(70,52,40,0.08)] sm:p-8">
                <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f3d27]">
                        New to SQMS
                    </p>

                    <h1 className="mt-2 text-4xl font-bold text-[#332c26]">
                        Create account
                    </h1>

                    <p className="mt-2 text-sm text-[#746960]">
                        Create a customer account to join queues online.
                    </p>
                </div>

                <form
                    onSubmit={
                        onSubmitHandle
                    }
                    className="mt-7 space-y-4"
                >
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
                            className="input w-full"
                            placeholder="Enter your full name"
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
                            className="input w-full"
                            placeholder="Optional"
                            value={
                                formData.phone
                            }
                            onChange={
                                onChangeHandle
                            }
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-bold text-[#574d44]"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                className="input w-full"
                                placeholder="At least 6 characters"
                                value={
                                    formData.password
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="min-h-12 w-full rounded-full bg-[#5d7d5f] px-5 text-sm font-bold text-white transition hover:bg-[#4e6c50] disabled:cursor-not-allowed disabled:bg-[#aaa39a]"
                    >
                        {loading
                            ? "Creating account..."
                            : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#746960]">
                    Already have an account?{" "}

                    <Link
                        href="/login"
                        className="font-bold text-[#8f3d27] hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </section>
        </main>
    );
}