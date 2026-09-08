"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

    const router = useRouter();

    const [formData, setFormData] = useState(
        {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: ""
        }
    )

    const [responseMsg, setResponseMsg] = useState("");

    const onChangeHandle = (e: any) => {

        const { name, value } = e.target;

        setFormData(
            {
                ...formData,
                [name]: value,
            }
        )

    }

    const onSubmitHandle = (e: any) => {

        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {

            setResponseMsg("Passwords do not match");

            return;

        }

        const fetchData = async () => {

            try {

                const response = await axios.post(
                    "http://localhost:3000/auth/register",
                    {
                        fullName: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        password: formData.password
                    }
                )

                setResponseMsg("Registration successful");

                router.push("../login");

            }

            catch (error: any) {

                if (error.response?.data?.message) {

                    if (Array.isArray(error.response.data.message)) {

                        setResponseMsg(
                            error.response.data.message.join(", ")
                        );

                    }

                    else {

                        setResponseMsg(
                            error.response.data.message
                        );

                    }

                }

                else {

                    setResponseMsg(
                        "Registration failed"
                    );

                }

            }

        }

        fetchData();

    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-10">

            <div className="card bg-base-100 shadow-xl w-full max-w-lg">

                <div className="card-body">

                    <h1 className="text-2xl font-bold text-center mb-4">
                        Create Account
                    </h1>

                    <form onSubmit={onSubmitHandle}>

                        <fieldset className="fieldset">

                            <label className="label">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                className="input input-bordered w-full"
                                onChange={onChangeHandle}
                                value={formData.fullName}
                            />

                            <label className="label mt-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                                onChange={onChangeHandle}
                                value={formData.email}
                            />

                            <label className="label mt-2">
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter phone number"
                                className="input input-bordered w-full"
                                onChange={onChangeHandle}
                                value={formData.phone}
                            />

                            <label className="label mt-2">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                className="input input-bordered w-full"
                                onChange={onChangeHandle}
                                value={formData.password}
                            />

                            <label className="label mt-2">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                className="input input-bordered w-full"
                                onChange={onChangeHandle}
                                value={formData.confirmPassword}
                            />

                            <input
                                type="submit"
                                value="Register"
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
    )
}