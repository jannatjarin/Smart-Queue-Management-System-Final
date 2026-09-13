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

import {
 z,
} from "zod";

import api from "@/lib/axios";

import ToastMessage from "@/components/ui/ToastMessage";


const registerSchema =
 z.object(
 {
 fullName:
 z.string()
 .min(
 2,
 "Full name must be at least 2 characters"
 ),

 email:
 z.string()
 .email(
 "Enter a valid email address"
 ),

 phone:
 z.string(),

 password:
 z.string()
 .min(
 6,
 "Password must be at least 6 characters"
 ),

 confirmPassword:
 z.string()
 .min(
 6,
 "Confirm password is required"
 ),
 }
 )
 .refine(
 (data) =>
 data.password ==
 data.confirmPassword,

 {
 message:
 "Passwords do not match",

 path: [
 "confirmPassword",
 ],
 }
 );


export default function RegisterPage() {

 const router =
 useRouter();


 const [formData, setFormData] =
 useState(
 {
 fullName: "",
 email: "",
 phone: "",
 password: "",
 confirmPassword: "",
 }
 );


 const [
 responseMsg,
 setResponseMsg
 ] =
 useState("");


 const [err, setErr] =
 useState("");


 const [loading, setLoading] =
 useState(false);


 const onChangeHandle = (
 e:
 ChangeEvent<
 HTMLInputElement
 >
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


 const onSubmitHandle =
 async (
 e:
 FormEvent<
 HTMLFormElement
 >
 ) => {

 e.preventDefault();

 setResponseMsg("");
 setErr("");


 const validationResult =
 registerSchema.safeParse(
 formData
 );


 if (
 !validationResult.success
 ) {

 setErr(
 validationResult
 .error
 .issues[0]
 .message
 );

 return;

 }


 setLoading(
 true
 );


 try {

 await api.post(
 "/auth/register",
 {
 fullName:
 formData.fullName,

 email:
 formData.email,

 phone:
 formData.phone ||
 undefined,

 password:
 formData.password,
 }
 );


 setResponseMsg(
 "Registration successful"
 );


 setTimeout(
 () => {

 router.push(
 "/login"
 );

 },
 1200
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

 const message =
 error.response
 .data
 .message;


 setErr(
 Array.isArray(
 message
 )
 ? message.join(
 ", "
 )
 : message
 );

 }

 else {

 setErr(
 "Registration failed"
 );

 }

 }

 finally {

 setLoading(
 false
 );

 }

 };


 return (
 <div className="min-h-[85vh] flex items-center justify-center p-4">
 
 <ToastMessage message={responseMsg} type="success" />
 <ToastMessage message={err} type="error" />

 <div className="bg-white shadow-xl border border-slate-200 rounded-2xl w-full max-w-lg p-8 md:p-10 my-8">

 <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">
 Create Account
 </h1>

 <form onSubmit={onSubmitHandle} className="w-full">
 <fieldset className="fieldset space-y-4">
 
 <div className="w-full">
 <label className="label text-sm font-semibold text-slate-700 ">
 Full Name
 </label>
 <input
 type="text"
 name="fullName"
 placeholder="Enter your full name"
 className="input input-bordered w-full bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
 onChange={onChangeHandle}
 value={formData.fullName}
 required
 />
 </div>

 <div className="w-full">
 <label className="label text-sm font-semibold text-slate-700 ">
 Email
 </label>
 <input
 type="email"
 name="email"
 placeholder="Enter your email"
 className="input input-bordered w-full bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
 onChange={onChangeHandle}
 value={formData.email}
 required
 />
 </div>

 <div className="w-full">
 <label className="label text-sm font-semibold text-slate-700 ">
 Phone
 </label>
 <input
 type="text"
 name="phone"
 placeholder="Enter your phone number"
 className="input input-bordered w-full bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
 onChange={onChangeHandle}
 value={formData.phone}
 />
 </div>

 <div className="w-full">
 <label className="label text-sm font-semibold text-slate-700 ">
 Password
 </label>
 <input
 type="password"
 name="password"
 placeholder="Enter password"
 className="input input-bordered w-full bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
 onChange={onChangeHandle}
 value={formData.password}
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
 placeholder="Confirm password"
 className="input input-bordered w-full bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
 onChange={onChangeHandle}
 value={formData.confirmPassword}
 required
 />
 </div>

 <button
 type="submit"
 className="btn btn-primary w-full mt-6 py-3 h-auto font-bold rounded-xl"
 disabled={loading}
 >
 {loading ? "Registering..." : "Register"}
 </button>
 </fieldset>
 </form>

 </div>

 </div>
 );

}
