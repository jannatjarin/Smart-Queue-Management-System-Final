"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import axios from "axios";

import api from "@/lib/axios";


export default function ForgotPasswordPage() {

    const [formData, setFormData] =
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

    const [err, setErr] =
        useState("");


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

        setResponseMsg("");
        setErr("");


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
                axios.isAxiosError(error) &&
                error.response?.data?.message
            ) {

                setErr(
                    error.response.data.message
                );

            }

            else {

                setErr(
                    "Could not send reset request"
                );

            }

        }

    };


    return (
        <div className="max-w-md mx-auto py-10">

            <h1 className="text-3xl font-bold mb-2">
                Forgot Password
            </h1>

            <p className="mb-6">
                Enter your account email
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
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    className="input input-bordered w-full"
                    value={formData.email}
                    onChange={onChangeHandle}
                    required
                />


                <button
                    type="submit"
                    className="btn btn-primary w-full mt-6"
                >
                    Send Reset Token
                </button>

            </form>

        </div>
    );

}