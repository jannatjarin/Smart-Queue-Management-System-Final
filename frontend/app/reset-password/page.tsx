"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function ResetPasswordPage() {

    const router =
    useRouter();
    
    const [err, setErr] =
    useState("");

    const [responseMsg, setResponseMsg] =
    useState("");


    const [formData, setFormData] =
        useState(
            {
                token: "",
                newPassword: "",
                confirmPassword: ""
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

    };
    const onSubmitHandle = (
    e: React.FormEvent<HTMLFormElement>
) => {

    e.preventDefault();

    setErr("");

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

    const resetPassword = async () => {

        try {

            await axios.post(
                "http://localhost:3000/auth/reset-password",
                {
                    token:
                        formData.token,

                    newPassword:
                        formData.newPassword
                }
            );

            setResponseMsg(
                "Password reset successfully"
            );

            setErr("");

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

    resetPassword();

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
    )
}