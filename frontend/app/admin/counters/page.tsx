"use client";

import {
 ChangeEvent,
 FormEvent,
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


interface UsersResponse {

 data: Staff[];
 total: number;
 page: number;
 limit: number;

}


interface Counter {

 id: number;
 name: string;
 status: string;
 staff: Staff | null;
 services: Service[];

}


export default function AdminCountersPage() {

 const [counters, setCounters] =
 useState<Counter[]>([]);

 const [services, setServices] =
 useState<Service[]>([]);

 const [staff, setStaff] =
 useState<Staff[]>([]);

 const [formData, setFormData] =
 useState(
 {
 name: "",
 serviceIds: [] as number[],
 }
 );

 const [refresh, setRefresh] =
 useState(0);

 const [
 responseMsg,
 setResponseMsg
 ] =
 useState("");

 const [err, setErr] =
 useState("");

 const [loading, setLoading] =
 useState(true);

 const [creating, setCreating] =
 useState(false);


 useEffect(
 () => {

 const getData =
 async () => {

 try {

 const countersResponse =
 await api.get<
 Counter[]
 >(
 "/counters"
 );

 const servicesResponse =
 await api.get<
 Service[]
 >(
 "/services"
 );

 const staffResponse =
 await api.get<
 UsersResponse
 >(
 "/users?role=staff&limit=100"
 );


 setCounters(
 countersResponse.data
 );

 setServices(
 servicesResponse.data
 );

 setStaff(
 staffResponse.data.data
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
 "Could not load counter information"
 );

 }

 }

 finally {

 setLoading(
 false
 );

 }

 };


 getData();

 },
 [refresh]
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


 const handleServiceChange = (
 e:
 ChangeEvent<
 HTMLInputElement
 >
 ) => {

 const serviceId =
 Number(
 e.target.value
 );

 const checked =
 e.target.checked;


 if (checked) {

 setFormData(
 {
 ...formData,

 serviceIds: [
 ...formData
 .serviceIds,

 serviceId,
 ],
 }
 );

 return;

 }


 setFormData(
 {
 ...formData,

 serviceIds:
 formData
 .serviceIds
 .filter(
 (id) =>
 id !=
 serviceId
 ),
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


 if (
 formData
 .serviceIds
 .length == 0
 ) {

 setErr(
 "Select at least one service"
 );

 return;

 }


 setCreating(
 true
 );


 try {

 await api.post(
 "/counters",
 {
 name:
 formData.name,

 serviceIds:
 formData
 .serviceIds,
 }
 );


 setResponseMsg(
 "Counter created successfully"
 );


 setFormData(
 {
 name: "",
 serviceIds: [],
 }
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
 "Could not create counter"
 );

 }

 }

 finally {

 setCreating(
 false
 );

 }

 };


 const assignStaff =
 async (
 counterId: number,
 staffId: string
 ) => {

 if (!staffId) {

 return;

 }


 setResponseMsg("");
 setErr("");


 try {

 await api.patch(
 `/counters/${counterId}/assign-staff`,
 {
 staffId:
 Number(
 staffId
 ),
 }
 );


 setResponseMsg(
 "Staff assigned successfully"
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
 "Could not assign staff"
 );

 }

 }

 };


 const updateStatus =
 async (
 counterId: number,
 status: string
 ) => {

 setResponseMsg("");
 setErr("");


 try {

 await api.patch(
 `/counters/${counterId}/status`,
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
 Loading counters...
 </span>

 </div>
 );

 }


 return (
 <div className="max-w-7xl mx-auto py-8">

 <h1 className="text-3xl font-bold mb-2">
 Counter Management
 </h1>


 <p className="mb-6">
 Create counters, assign Staff and manage counter status.
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


 <div className="card bg-white shadow border mb-8">

 <div className="card-body">

 <h2 className="card-title">
 Create Counter
 </h2>


 <form
 onSubmit={
 onSubmitHandle
 }
 >

 <label className="label">
 Counter Name
 </label>


 <input
 type="text"
 name="name"
 className="input input-bordered w-full"
 value={
 formData.name
 }
 onChange={
 onChangeHandle
 }
 required
 />


 <h3 className="font-semibold mt-5 mb-2">
 Services
 </h3>


 <div className="grid md:grid-cols-3 gap-3">

 {
 services.map(
 (
 service
 ) => (

 <label
 key={
 service.id
 }
 className="flex items-center gap-2"
 >

 <input
 type="checkbox"
 className="checkbox"
 value={
 service.id
 }
 checked={
 formData
 .serviceIds
 .includes(
 service.id
 )
 }
 onChange={
 handleServiceChange
 }
 />

 {
 service.name
 }

 </label>

 )
 )
 }

 </div>


 <button
 type="submit"
 className="btn btn-primary mt-6"
 disabled={
 creating
 }
 >

 {
 creating
 ? "Creating..."
 : "Create Counter"
 }

 </button>

 </form>

 </div>

 </div>


 {
 counters.length == 0
 ? (
 <div className="alert">

 <span>
 No counters found.
 </span>

 </div>
 )
 : (
 <div className="overflow-x-auto">

 <table className="table ">

 <thead>

 <tr>
 <th>
 ID
 </th>

 <th>
 Name
 </th>

 <th>
 Services
 </th>

 <th>
 Staff
 </th>

 <th>
 Status
 </th>
 </tr>

 </thead>


 <tbody>

 {
 counters.map(
 (
 counter
 ) => (

 <tr
 key={
 counter.id
 }
 >

 <td>
 {
 counter.id
 }
 </td>


 <td>
 {
 counter.name
 }
 </td>


 <td>

 {
 counter
 .services
 .map(
 (
 service
 ) => (

 <div
 key={
 service.id
 }
 >
 {
 service.name
 }
 </div>

 )
 )
 }

 </td>


 <td>

 <select
 className="select select-bordered select-sm"
 value={
 counter
 .staff
 ?.id ||
 ""
 }
 disabled={
 counter.status !=
 "closed"
 }
 onChange={
 (
 e
 ) =>
 assignStaff(
 counter.id,
 e.target.value
 )
 }
 >

 <option value="">
 Select Staff
 </option>


 {
 staff.map(
 (
 user
 ) => (

 <option
 key={
 user.id
 }
 value={
 user.id
 }
 >
 {
 user.fullName
 }
 </option>

 )
 )
 }

 </select>


 {
 counter.status !=
 "closed" &&
 <p className="text-xs mt-1 opacity-70">
 Close counter to change Staff
 </p>
 }

 </td>


 <td>

 <select
 className="select select-bordered select-sm"
 value={
 counter.status
 }
 onChange={
 (
 e
 ) =>
 updateStatus(
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

 </td>

 </tr>

 )
 )
 }

 </tbody>

 </table>

 </div>
 )
 }

 </div>
 );

}

