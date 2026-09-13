"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import axios from "axios";

import {
    useRouter,
} from "next/navigation";

import api from "@/lib/axios";


export default function ResetPasswordPage() {

    const router =
        useRouter();

    const [err, setErr] =
        useState("");

    const [
        responseMsg,
        setResponseMsg
    ] =
        useState("");

    const [formData, setFormData] =
        useState(
            {
                token: "",
                newPassword: "",
                confirmPassword: "",
            }
        );


    const onChangeHandle = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const {
            name,
            value,
        } = e.target;

        setFormData(
            {
                ...formData,
                [name]: value,
            }
        );

    };


    const onSubmitHandle = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setErr("");
        setResponseMsg("");


        if (
            formData.newPassword.length < 6
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
                () => {

                    router.push(
                        "/login"
                    );

                },
                1500
            );

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
                    "Could not reset password"
                );

            }

        }

    };


    return (
        <div className="max-w-md mx-auto py-10">

            <h1 className="text-3xl font-bold mb-2">
                Reset Password
            </h1>

            <p className="mb-6">
                Enter the reset token and your new password
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


            <form onSubmit={onSubmitHandle}>

                <label className="label">
                    Reset Token
                </label>

                <input
                    type="text"
                    name="token"
                    className="input input-bordered w-full"
                    value={formData.token}
                    onChange={onChangeHandle}
                    required
                />


                <label className="label mt-4">
                    New Password
                </label>

                <input
                    type="password"
                    name="newPassword"
                    className="input input-bordered w-full"
                    value={formData.newPassword}
                    onChange={onChangeHandle}
                    required
                />


                <label className="label mt-4">
                    Confirm Password
                </label>

                <input
                    type="password"
                    name="confirmPassword"
                    className="input input-bordered w-full"
                    value={formData.confirmPassword}
                    onChange={onChangeHandle}
                    required
                />


                <button
                    type="submit"
                    className="btn btn-primary w-full mt-6"
                >
                    Reset Password
                </button>

            </form>

        </div>
    );

}