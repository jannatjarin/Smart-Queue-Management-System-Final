"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {

    const [formData, setFormData] =
        useState(
            {
                email: ""
            }
        );

    const onChangeHandle = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const {
            name,
            value
        } = e.target;

        setFormData(
            {
                ...formData,
                [name]: value
            }
        );

    }

    return (
        <div className="max-w-md mx-auto py-10">

            <h1 className="text-3xl font-bold mb-2">
                Forgot Password
            </h1>

            <p className="mb-6">
                Enter your account email
            </p>

            <form>

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
    )
}