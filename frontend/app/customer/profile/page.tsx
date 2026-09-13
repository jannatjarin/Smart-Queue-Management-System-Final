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
            <div
                className="
                    mx-auto
                    flex
                    min-h-[55vh]
                    max-w-4xl
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        sqms-glass
                        flex
                        items-center
                        gap-3
                        rounded-[22px]
                        px-5
                        py-4
                    "
                >

                    <span
                        className="
                            loading
                            loading-spinner
                            loading-sm
                            text-[#756aa5]
                        "
                    />

                    <span
                        className="
                            text-sm
                            font-semibold
                            text-[#6f6b7b]
                        "
                    >
                        Loading profile...
                    </span>

                </div>

            </div>
        );

    }


    return (
        <div
            className="
                mx-auto
                max-w-5xl
                py-8
                sm:py-10
            "
        >

            <section
                className="
                    relative
                    mb-8
                    overflow-hidden
                    rounded-[30px]
                    border
                    border-white/80
                    bg-[linear-gradient(120deg,#ece7ff_0%,#fce4ec_47%,#fff3cd_100%)]
                    px-6
                    py-7
                    shadow-[0_20px_55px_rgba(100,83,128,0.1)]
                    sm:px-8
                "
            >

                <div
                    className="
                        absolute
                        -right-8
                        -top-12
                        h-36
                        w-36
                        rounded-full
                        bg-white/30
                    "
                />


                <div className="relative">

                    <p className="sqms-eyebrow">
                        Your account
                    </p>


                    <h1
                        className="
                            sqms-title
                            mt-1
                            text-4xl
                            sm:text-5xl
                        "
                    >
                        Profile
                    </h1>


                    <p
                        className="
                            mt-3
                            max-w-2xl
                            text-[15px]
                            font-medium
                            leading-7
                            text-[#666174]
                        "
                    >
                        Keep your name and phone number
                        current. Your email and role
                        stay protected by the system.
                    </p>

                </div>

            </section>


            <div
                className="
                    grid
                    gap-6
                    lg:grid-cols-[0.72fr_1.28fr]
                "
            >

                <aside
                    className="
                        relative
                        overflow-hidden
                        rounded-[30px]
                        border
                        border-white/80
                        bg-[linear-gradient(145deg,#ddd4ff_0%,#f7dce8_48%,#dff3e9_100%)]
                        p-6
                        shadow-[0_18px_48px_rgba(94,78,119,0.12)]
                        sm:p-7
                    "
                >

                    <div
                        className="
                            absolute
                            -right-10
                            -top-10
                            h-36
                            w-36
                            rounded-full
                            bg-white/28
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-12
                            -left-8
                            h-32
                            w-32
                            rounded-full
                            bg-[#fff3cd]/55
                        "
                    />


                    <div className="relative">

                        <div
                            className="
                                flex
                                h-20
                                w-20
                                items-center
                                justify-center
                                rounded-[26px]
                                border
                                border-white/70
                                bg-white/55
                                text-3xl
                                font-black
                                text-[#5e5488]
                                shadow-[0_10px_30px_rgba(91,74,115,0.1)]
                                backdrop-blur-sm
                            "
                        >
                            {
                                formData
                                    .fullName
                                    .charAt(0)
                                    .toUpperCase() ||
                                "U"
                            }
                        </div>


                        <h2
                            className="
                                mt-6
                                text-2xl
                                font-black
                                tracking-[-0.04em]
                                text-[#423e50]
                            "
                        >
                            {
                                formData
                                    .fullName
                            }
                        </h2>


                        <p
                            className="
                                mt-1
                                break-all
                                text-sm
                                font-semibold
                                text-[#6d6778]
                            "
                        >
                            {
                                formData
                                    .email
                            }
                        </p>


                        <div
                            className="
                                mt-7
                                rounded-[22px]
                                border
                                border-white/65
                                bg-white/45
                                p-4
                                backdrop-blur-sm
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-extrabold
                                    uppercase
                                    tracking-[0.13em]
                                    text-[#81769e]
                                "
                            >
                                Account role
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-lg
                                    font-black
                                    capitalize
                                    text-[#514a65]
                                "
                            >
                                {
                                    formData
                                        .role
                                }
                            </p>

                        </div>


                        <p
                            className="
                                mt-6
                                text-sm
                                font-medium
                                leading-6
                                text-[#676172]
                            "
                        >
                            Your email and account role
                            cannot be edited here. This
                            helps keep account access
                            predictable and secure.
                        </p>

                    </div>

                </aside>


                <section
                    className="
                        sqms-glass
                        rounded-[30px]
                        p-5
                        sm:p-7
                    "
                >

                    <div className="mb-6">

                        <p className="sqms-eyebrow">
                            Editable details
                        </p>


                        <h2
                            className="
                                mt-1
                                text-2xl
                                font-extrabold
                                text-[#3b384a]
                            "
                        >
                            Personal information
                        </h2>


                        <p
                            className="
                                mt-1.5
                                text-sm
                                font-medium
                                text-[#817b8d]
                            "
                        >
                            Simple details that help
                            staff identify and contact
                            you when needed.
                        </p>

                    </div>


                    {
                        responseMsg &&
                        <div
                            className="
                                mb-5
                                rounded-[18px]
                                border
                                border-[#c6e5d6]
                                bg-[#e2f5ec]
                                px-4
                                py-3.5
                                text-sm
                                font-bold
                                text-[#3f6a53]
                            "
                        >
                            {responseMsg}
                        </div>
                    }


                    {
                        err &&
                        <div
                            className="
                                mb-5
                                rounded-[18px]
                                border
                                border-[#efc9d5]
                                bg-[#fce4ec]
                                px-4
                                py-3.5
                                text-sm
                                font-semibold
                                text-[#82495a]
                            "
                        >
                            {err}
                        </div>
                    }


                    <form
                        onSubmit={
                            updateProfile
                        }
                        className="space-y-5"
                    >

                        <div>

                            <label
                                htmlFor="fullName"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-bold
                                    text-[#565163]
                                "
                            >
                                Full name
                            </label>


                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                className="
                                    input
                                    sqms-input
                                    min-h-12
                                    w-full
                                    rounded-[16px]
                                "
                                value={
                                    formData
                                        .fullName
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
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-bold
                                    text-[#565163]
                                "
                            >
                                Email
                            </label>


                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="
                                    input
                                    min-h-12
                                    w-full
                                    cursor-not-allowed
                                    rounded-[16px]
                                    border-[#e2dce8]
                                    bg-[#f3eff6]
                                    font-medium
                                    text-[#8b8593]
                                "
                                value={
                                    formData
                                        .email
                                }
                                disabled
                            />


                            <p
                                className="
                                    mt-1.5
                                    text-xs
                                    font-medium
                                    text-[#96909f]
                                "
                            >
                                Email cannot be
                                edited from this page.
                            </p>

                        </div>


                        <div>

                            <label
                                htmlFor="phone"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-bold
                                    text-[#565163]
                                "
                            >
                                Phone number
                            </label>


                            <input
                                id="phone"
                                type="text"
                                name="phone"
                                className="
                                    input
                                    sqms-input
                                    min-h-12
                                    w-full
                                    rounded-[16px]
                                "
                                value={
                                    formData
                                        .phone
                                }
                                onChange={
                                    onChangeHandle
                                }
                                placeholder="Add a phone number"
                            />

                        </div>


                        <div>

                            <label
                                htmlFor="role"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-bold
                                    text-[#565163]
                                "
                            >
                                Role
                            </label>


                            <input
                                id="role"
                                type="text"
                                name="role"
                                className="
                                    input
                                    min-h-12
                                    w-full
                                    cursor-not-allowed
                                    rounded-[16px]
                                    border-[#e2dce8]
                                    bg-[#f3eff6]
                                    font-medium
                                    capitalize
                                    text-[#8b8593]
                                "
                                value={
                                    formData
                                        .role
                                }
                                disabled
                            />

                        </div>


                        <div
                            className="
                                border-t
                                border-[#e8e1ef]
                                pt-5
                            "
                        >

                            <button
                                type="submit"
                                className="
                                    sqms-primary-button
                                    min-h-11
                                    w-full
                                    rounded-full
                                    px-6
                                    py-2.5
                                    text-sm
                                    font-bold
                                    transition

                                    disabled:cursor-not-allowed
                                    disabled:bg-[#d9d4df]
                                    disabled:text-[#8d8795]
                                    disabled:shadow-none

                                    sm:w-auto
                                "
                                disabled={
                                    saving
                                }
                            >
                                {
                                    saving
                                        ? "Saving changes..."
                                        : "Save changes"
                                }
                            </button>

                        </div>

                    </form>

                </section>

            </div>

        </div>
    );

}