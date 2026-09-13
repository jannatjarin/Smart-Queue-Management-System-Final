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


interface UserData {

    role: string;

}


export default function LoginPage() {

    const router =
        useRouter();

    const [formData, setFormData] =
        useState(
            {
                email: "",
                pass: "",
            }
        );

    const [
        responseMsg,
        setResponseMsg
    ] =
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


            setResponseMsg(
                "Login successful"
            );


            if (role == "admin") {

                router.push(
                    "/admin/dashboard"
                );

            }

            else if (
                role == "staff"
            ) {

                router.push(
                    "/staff/dashboard"
                );

            }

            else if (
                role == "customer"
            ) {

                router.push(
                    "/customer/dashboard"
                );

            }

            else {

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

        }

        catch (error) {

            if (
                axios.isAxiosError(error) &&
                error.response?.data?.message
            ) {

                setResponseMsg(
                    error.response.data.message
                );

            }

            else {

                setResponseMsg(
                    "Login failed"
                );

            }

        }

    };


    return (
        <div className="min-h-[80vh] flex items-center justify-center">

            <div className="card bg-base-100 shadow-xl w-full max-w-md">

                <div className="card-body">

                    <h1 className="text-2xl font-bold text-center mb-4">
                        Login
                    </h1>


                    <form onSubmit={onSubmitHandle}>

                        <fieldset className="fieldset">

                            <label className="label">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                                onChange={onChangeHandle}
                                value={formData.email}
                                required
                            />


                            <label className="label mt-3">
                                Password
                            </label>

                            <input
                                type="password"
                                name="pass"
                                id="pass"
                                placeholder="Enter your password"
                                className="input input-bordered w-full"
                                onChange={onChangeHandle}
                                value={formData.pass}
                                required
                            />


                            <input
                                type="submit"
                                value="Login"
                                name="submit"
                                className="btn btn-primary w-full mt-6"
                            />

                        </fieldset>

                    </form>


                    {
                        responseMsg &&
                        <div className="alert mt-4">

                            <span>
                                {responseMsg}
                            </span>

                        </div>
                    }

                </div>

            </div>

        </div>
    );

}