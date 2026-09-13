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
 <div className="min-h-[85vh] flex items-center justify-center p-4">

 <div className="bg-white shadow-xl border border-slate-200 rounded-2xl w-full max-w-md p-8 md:p-10">

 <div className="text-center mb-8">
 <h1 className="text-3xl font-bold text-slate-900 mb-2">
 Reset Password
 </h1>
 <p className="text-slate-600 ">
 Enter the reset token and your new password
 </p>
 </div>


 {
 responseMsg &&
 <div className="alert bg-green-100 text-green-800 border-green-200 rounded-xl mb-6 p-3">
 <span>{responseMsg}</span>
 </div>
 }


 {
 err &&
 <div className="alert bg-red-100 text-red-800 border-red-200 rounded-xl mb-6 p-3">
 <span>{err}</span>
 </div>
 }


 <form onSubmit={onSubmitHandle} className="w-full">
 <fieldset className="fieldset space-y-4">
 <div className="w-full">
 <label className="label text-sm font-semibold text-slate-700 ">
 Reset Token
 </label>

 <input
 type="text"
 name="token"
 className="input input-bordered w-full bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
 value={formData.token}
 onChange={onChangeHandle}
 required
 />
 </div>

 <div className="w-full">
 <label className="label text-sm font-semibold text-slate-700 ">
 New Password
 </label>

 <input
 type="password"
 name="newPassword"
 className="input input-bordered w-full bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
 value={formData.newPassword}
 onChange={onChangeHandle}
 required
 />
 </div>

 <div className="w-full">
 <label className="label text-sm font-semibold text-slate-700 ">
 Confirm Password
 </label>

 <input
 type="password"
 name="confirmPassword"
 className="input input-bordered w-full bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
 value={formData.confirmPassword}
 onChange={onChangeHandle}
 required
 />
 </div>

 <button
 type="submit"
 className="btn btn-primary w-full mt-6 py-3 h-auto font-bold rounded-xl"
 >
 Reset Password
 </button>
 </fieldset>
 </form>

 </div>

 </div>
 );

}
