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

    const [
        formData,
        setFormData
    ] =
        useState(
            {
                email: "",
            }
        );


    const [
        responseMsg,
        setResponseMsg
    ] =
        useState("");


    const [
        err,
        setErr
    ] =
        useState("");


    const [
        loading,
        setLoading
    ] =
        useState(false);


    const onChangeHandle = (
        e:
            ChangeEvent<
                HTMLInputElement
            >
    ) => {

        const {
            name,
            value,
        } =
            e.target;


        setFormData(
            {
                ...formData,
                [name]:
                    value,
            }
        );

    };


    const onSubmitHandle =
        async (
            e:
                FormEvent<
                    HTMLFormElement
                >
        ) => {

            e.preventDefault();

            setResponseMsg("");
            setErr("");

            setLoading(
                true
            );


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

            }

            catch (error) {

                if (
                    axios.isAxiosError(
                        error
                    ) &&
                    error.response
                        ?.data
                        ?.message
                ) {

                    setErr(
                        error.response
                            .data
                            .message
                    );

                }

                else {

                    setErr(
                        "Could not send reset request"
                    );

                }

            }

            finally {

                setLoading(
                    false
                );

            }

        };


    return (
        <div className="sq-auth-page">

            <section className="sq-auth-card">

                <h1 className="sq-title text-center">
                    Forgot password?
                </h1>

                <p className="sq-subtitle text-center">
                    Enter your email to receive a reset token.
                </p>


                {
                    responseMsg &&
                    <div className="alert alert-success mt-5">

                        <span>
                            {responseMsg}
                        </span>

                    </div>
                }


                {
                    err &&
                    <div className="alert alert-error mt-5">

                        <span>
                            {err}
                        </span>

                    </div>
                }


                <form
                    onSubmit={
                        onSubmitHandle
                    }
                    className="mt-6 space-y-4"
                >

                    <div>

                        <label
                            htmlFor="email"
                            className="sq-label"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="sq-input"
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


                    <button
                        type="submit"
                        className="sq-primary w-full"
                        disabled={
                            loading
                        }
                    >
                        {
                            loading
                                ? "Sending..."
                                : "Send reset token"
                        }
                    </button>

                </form>


                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">

                    <Link
                        href="/reset-password"
                        className="font-bold text-[#6b5b95] hover:underline"
                    >
                        I already have a token
                    </Link>


                    <Link
                        href="/login"
                        className="font-bold text-[#77707e] hover:underline"
                    >
                        Back to login
                    </Link>

                </div>

            </section>

        </div>
    );

}