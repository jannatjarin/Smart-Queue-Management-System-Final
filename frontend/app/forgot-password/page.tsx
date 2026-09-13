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
 <div className="min-h-[85vh] flex items-center justify-center p-4">

 <div className="bg-white shadow-xl border border-slate-200 rounded-2xl w-full max-w-md p-8 md:p-10">

 <div className="text-center mb-8">
 <h1 className="text-3xl font-bold text-slate-900 mb-2">
 Forgot Password
 </h1>
 <p className="text-slate-600 ">
 Enter your account email
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
 Email Address
 </label>

 <input
 type="email"
 name="email"
 className="input input-bordered w-full bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
 value={formData.email}
 onChange={onChangeHandle}
 required
 />
 </div>

 <button
 type="submit"
 className="btn btn-primary w-full mt-6 py-3 h-auto font-bold rounded-xl"
 >
 Send Reset Token
 </button>
 </fieldset>
 </form>

 </div>

 </div>
 );

}
