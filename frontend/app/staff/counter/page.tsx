"use client";

import {
 useEffect,
 useState,
} from "react";

import axios from "axios";

import api from "@/lib/axios";


interface Service {

 id: number;
 name: string;

}


interface Staff {

 id: number;
 fullName: string;
 email: string;

}


interface Counter {

 id: number;
 name: string;
 status: string;
 staff: Staff | null;
 services: Service[];

}


export default function StaffCounterPage() {

 const [counter, setCounter] =
 useState<Counter | null>(
 null
 );

 const [refresh, setRefresh] =
 useState(0);

 const [responseMsg, setResponseMsg] =
 useState("");

 const [err, setErr] =
 useState("");

 const [loading, setLoading] =
 useState(true);


 useEffect(
 () => {

 const getCounter =
 async () => {

 try {

 const response =
 await api.get<Counter[]>(
 "/counters"
 );

 setCounter(
 response.data.length > 0
 ? response.data[0]
 : null
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
 "Could not load counter"
 );

 }

 }

 finally {

 setLoading(
 false
 );

 }

 };


 getCounter();

 },
 [refresh]
 );


 const updateCounterStatus =
 async (
 id: number,
 status: string
 ) => {

 setResponseMsg("");
 setErr("");


 try {

 await api.patch(
 `/counters/${id}/status`,
 {
 status,
 }
 );

 setResponseMsg(
 "Counter status updated successfully"
 );

 setRefresh(
 (value) =>
 value + 1
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
 "Could not update counter status"
 );

 }

 }

 };


 if (loading) {

 return (
 <div className="flex items-center justify-center p-10">

 <span className="loading loading-spinner"></span>

 <span className="ml-3">
 Loading counter...
 </span>

 </div>
 );

 }


 return (
 <div className="max-w-4xl mx-auto py-8">

 <h1 className="text-3xl font-bold mb-2">
 My Counter
 </h1>

 <p className="mb-6">
 View your assigned counter and manage its status.
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


 {
 counter
 ? (
 <div className="card bg-white shadow border">

 <div className="card-body">

 <h2 className="card-title">
 {counter.name}
 </h2>

 <p>
 <b>Staff:</b>{" "}
 {
 counter.staff?.fullName ||
 "Not Assigned"
 }
 </p>

 <p>
 <b>Status:</b>{" "}
 {counter.status}
 </p>


 <label className="label mt-4">
 Change Status
 </label>

 <select
 className="select select-bordered max-w-sm"
 value={counter.status}
 onChange={
 (e) =>
 updateCounterStatus(
 counter.id,
 e.target.value
 )
 }
 >

 <option value="open">
 Open
 </option>

 <option value="closed">
 Closed
 </option>

 <option value="on_break">
 On Break
 </option>

 </select>


 <h3 className="font-bold mt-6">
 Assigned Services
 </h3>


 {
 counter.services.length > 0
 ? (
 <div className="flex flex-wrap gap-2 mt-2">

 {
 counter.services.map(
 (service) => (

 <span
 key={service.id}
 className="badge badge-outline"
 >
 {service.name}
 </span>

 )
 )
 }

 </div>
 )
 : (
 <p>
 No services assigned
 </p>
 )
 }

 </div>

 </div>
 )
 : (
 <div className="alert">

 <span>
 No counter assigned. Ask an Admin to assign you to a counter.
 </span>

 </div>
 )
 }

 </div>
 );

}

