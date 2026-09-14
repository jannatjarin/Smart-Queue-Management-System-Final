"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";

import axios from "axios";

import api from "@/lib/axios";


interface UserData {

    fullName: string;
    email: string;
    phone: string | null;
    role: string;

}


export default function ProfilePage() {

    const [
        formData,
        setFormData
    ] =
        useState(
            {
                fullName: "",
                email: "",
                phone: "",
                role: "",
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
        useState(true);


    const [
        saving,
        setSaving
    ] =
        useState(false);


    useEffect(
        () => {

            const getProfile =
                async () => {

                    try {

                        const response =
                            await api.get<UserData>(
                                "/users/me"
                            );


                        setFormData(
                            {
                                fullName:
                                    response.data
                                        .fullName,

                                email:
                                    response.data
                                        .email,

                                phone:
                                    response.data
                                        .phone ||
                                    "",

                                role:
                                    response.data
                                        .role,
                            }
                        );


                        setErr("");

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
                                "Could not load profile"
                            );

                        }

                    }

                    finally {

                        setLoading(
                            false
                        );

                    }

                };


            getProfile();

        },
        []
    );


    const onChangeHandle =
        (
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


    const updateProfile =
        async (
            e:
                FormEvent<
                    HTMLFormElement
                >
        ) => {

            e.preventDefault();

            setResponseMsg("");
            setErr("");


            if (
                !formData
                    .fullName
                    .trim()
            ) {

                setErr(
                    "Full name is required"
                );

                return;

            }


            setSaving(
                true
            );


            try {

                const response =
                    await api.patch<UserData>(
                        "/users/me",
                        {
                            fullName:
                                formData
                                    .fullName,

                            phone:
                                formData
                                    .phone,
                        }
                    );


                setFormData(
                    {
                        fullName:
                            response.data
                                .fullName,

                        email:
                            response.data
                                .email,

                        phone:
                            response.data
                                .phone ||
                            "",

                        role:
                            response.data
                                .role,
                    }
                );


                setResponseMsg(
                    "Profile updated successfully"
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
                        "Could not update profile"
                    );

                }

            }

            finally {

                setSaving(
                    false
                );

            }

        };


    if (loading) {

        return (
            <div className="sq-page flex min-h-[55vh] items-center justify-center">

                <span className="loading loading-spinner" />

                <span className="ml-3 font-semibold">
                    Loading profile...
                </span>

            </div>
        );

    }


    return (
        <div className="sq-page max-w-3xl">

            <header className="mb-7">

                <h1 className="sq-title">
                    Profile
                </h1>

                <p className="sq-subtitle">
                    Update your account details.
                </p>

            </header>


            {
                responseMsg &&
                <div className="alert alert-success mb-5">

                    <span>
                        {responseMsg}
                    </span>

                </div>
            }


            {
                err &&
                <div className="alert alert-error mb-5">

                    <span>
                        {err}
                    </span>

                </div>
            }


            <form
                onSubmit={
                    updateProfile
                }
                className="sq-panel sq-lavender space-y-5 p-5 sm:p-6"
            >

                <div>

                    <label
                        htmlFor="fullName"
                        className="sq-label"
                    >
                        Full name
                    </label>

                    <input
                        id="fullName"
                        name="fullName"
                        className="sq-input"
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
                        className="sq-label"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        className="sq-input opacity-70"
                        value={
                            formData.email
                        }
                        disabled
                    />

                </div>


                <div>

                    <label
                        htmlFor="phone"
                        className="sq-label"
                    >
                        Phone
                    </label>

                    <input
                        id="phone"
                        name="phone"
                        className="sq-input"
                        value={
                            formData.phone
                        }
                        onChange={
                            onChangeHandle
                        }
                    />

                </div>


                <div>

                    <label
                        htmlFor="role"
                        className="sq-label"
                    >
                        Role
                    </label>

                    <input
                        id="role"
                        className="sq-input capitalize opacity-70"
                        value={
                            formData.role
                        }
                        disabled
                    />

                </div>


                <button
                    type="submit"
                    className="sq-primary"
                    disabled={
                        saving
                    }
                >
                    {
                        saving
                            ? "Saving..."
                            : "Save changes"
                    }
                </button>

            </form>

        </div>
    );

}