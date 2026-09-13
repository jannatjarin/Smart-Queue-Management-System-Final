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

 const [formData, setFormData] =
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

 const [err, setErr] =
 useState("");

 const [loading, setLoading] =
 useState(true);

 const [saving, setSaving] =
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


 const updateProfile = async (
 e:
 FormEvent<
 HTMLFormElement
 >
 ) => {

 e.preventDefault();

 setResponseMsg("");
 setErr("");


 if (
 !formData.fullName.trim()
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
 formData.fullName,

 phone:
 formData.phone,
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
 <div className="flex items-center justify-center p-10">

 <span className="loading loading-spinner"></span>

 <span className="ml-3">
 Loading profile...
 </span>

 </div>
 );

 }


 return (
 <div className="max-w-xl mx-auto py-8">

 <div className="card bg-white shadow-xl border">

 <div className="card-body">

 <h1 className="text-2xl font-bold">
 My Profile
 </h1>


 {
 responseMsg &&
 <div className="alert alert-success mt-4">

 <span>
 {responseMsg}
 </span>

 </div>
 }


 {
 err &&
 <div className="alert alert-error mt-4">

 <span>
 {err}
 </span>

 </div>
 }


 <form
 onSubmit={
 updateProfile
 }
 className="mt-4"
 >

 <label className="label">
 Full Name
 </label>

 <input
 type="text"
 name="fullName"
 className="input input-bordered w-full"
 value={
 formData.fullName
 }
 onChange={
 onChangeHandle
 }
 required
 />


 <label className="label mt-3">
 Email
 </label>

 <input
 type="email"
 name="email"
 className="input input-bordered w-full"
 value={
 formData.email
 }
 disabled
 />


 <label className="label mt-3">
 Phone
 </label>

 <input
 type="text"
 name="phone"
 className="input input-bordered w-full"
 value={
 formData.phone
 }
 onChange={
 onChangeHandle
 }
 />


 <label className="label mt-3">
 Role
 </label>

 <input
 type="text"
 name="role"
 className="input input-bordered w-full"
 value={
 formData.role
 }
 disabled
 />


 <button
 type="submit"
 className="btn btn-primary w-full mt-6"
 disabled={
 saving
 }
 >

 {
 saving
 ? "Updating..."
 : "Update Profile"
 }

 </button>

 </form>

 </div>

 </div>

 </div>
 );

}

