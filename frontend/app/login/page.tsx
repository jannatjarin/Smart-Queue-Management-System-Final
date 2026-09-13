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
 <div className="min-h-[85vh] flex items-center justify-center p-4">

 <div className="bg-white shadow-xl border border-slate-200 rounded-2xl w-full max-w-md p-8 md:p-10">

 <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">
 Login
 </h1>

 <form onSubmit={onSubmitHandle} className="w-full">
 <fieldset className="fieldset space-y-4">
 <div className="w-full">
 <label className="label text-sm font-semibold text-slate-700 ">
 Email
 </label>
 <input
 type="email"
 name="email"
 id="email"
 placeholder="Enter your email"
 className="input input-bordered w-full bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
 onChange={onChangeHandle}
 value={formData.email}
 required
 />
 </div>

 <div className="w-full">
 <label className="label text-sm font-semibold text-slate-700 mt-2">
 Password
 </label>
 <input
 type="password"
 name="pass"
 id="pass"
 placeholder="Enter your password"
 className="input input-bordered w-full bg-slate-50 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
 onChange={onChangeHandle}
 value={formData.pass}
 required
 />
 </div>

 <button
 type="submit"
 name="submit"
 className="btn btn-primary w-full mt-6 py-3 h-auto font-bold rounded-xl"
 >
 Login
 </button>
 </fieldset>
 </form>

 {
 responseMsg &&
 <div className="alert bg-red-100 text-red-800 border-red-200 rounded-xl mt-6 p-3">
 <span>{responseMsg}</span>
 </div>
 }

 </div>

 </div>
 );

}
