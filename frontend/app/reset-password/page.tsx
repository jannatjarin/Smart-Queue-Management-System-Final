"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import axios from "axios";

import Link from "next/link";

import {
    useRouter,
} from "next/navigation";

import api from "@/lib/axios";


export default function ResetPasswordPage() {

    const router =
        useRouter();


    const [
        err,
        setErr
    ] =
        useState("");


    const [
        responseMsg,
        setResponseMsg
    ] =
        useState("");


    const [
        loading,
        setLoading
    ] =
        useState(false);


    const [
        formData,
        setFormData
    ] =
        useState(
            {
                token: "",
                newPassword: "",
                confirmPassword: "",
            }
        );


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

            setErr("");
            setResponseMsg("");


            if (
                formData
                    .newPassword
                    .length <
                6
            ) {

                setErr(
                    "Password must be at least 6 characters"
                );

                return;

            }


            if (
                formData.newPassword !=
                formData.confirmPassword
            ) {

                setErr(
                    "Passwords do not match"
                );

                return;

            }


            setLoading(
                true
            );


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


                setTimeout(
                    () =>
                        router.push(
                            "/login"
                        ),
                    1500
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
                        "Could not reset password"
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
                    Reset password
                </h1>

                <p className="sq-subtitle text-center">
                    Paste your token and choose a new password.
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
                            htmlFor="token"
                            className="sq-label"
                        >
                            Reset token
                        </label>

                        <input
                            id="token"
                            type="text"
                            name="token"
                            className="sq-input"
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
                            className="sq-label"
                        >
                            New password
                        </label>

                        <input
                            id="newPassword"
                            type="password"
                            name="newPassword"
                            className="sq-input"
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
                            className="sq-label"
                        >
                            Confirm password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            className="sq-input"
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
                        className="sq-primary w-full"
                        disabled={
                            loading
                        }
                    >
                        {
                            loading
                                ? "Resetting..."
                                : "Reset password"
                        }
                    </button>

                </form>


                <p className="mt-6 text-center text-sm">

                    <Link
                        href="/login"
                        className="font-bold text-[#6b5b95] hover:underline"
                    >
                        Back to login
                    </Link>

                </p>

            </section>

        </div>
    );

}