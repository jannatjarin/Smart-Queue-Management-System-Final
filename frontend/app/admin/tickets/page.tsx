"use client";

import {
 useEffect,
 useState,
} from "react";

import axios from "axios";

import api from "@/lib/axios";


interface Queue {

 id: number;
 name: string;

}


interface Ticket {

 id: number;
 ticketNumber: string;
 status: string;
 priority: string;
 issuedAt: string;
 calledAt: string | null;
 completedAt: string | null;

 user: {
 id: number;
 fullName: string;
 email: string;
 };

 service: {
 id: number;
 name: string;
 };

 queue: {
 id: number;
 name: string;
 };

 counter: {
 id: number;
 name: string;
 } | null;

}


export default function AdminTicketsPage() {

 const [tickets, setTickets] =
 useState<Ticket[]>([]);

 const [queues, setQueues] =
 useState<Queue[]>([]);

 const [status, setStatus] =
 useState("");

 const [queueId, setQueueId] =
 useState("");

 const [sort, setSort] =
 useState("DESC");

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

 const [
 actionTicketId,
 setActionTicketId
 ] =
 useState<number | null>(
 null
 );


 useEffect(
 () => {

 const getQueues =
 async () => {

 try {

 const response =
 await api.get<Queue[]>(
 "/queues"
 );


 setQueues(
 response.data
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
 "Could not load queues"
 );

 }

 }

 };


 getQueues();

 },
 []
 );


 useEffect(
 () => {

 const getTickets =
 async () => {

 setLoading(
 true
 );


 try {

 let url =
 "/tickets?";


 if (status) {

 url =
 url +
 `status=${status}&`;

 }


 if (queueId) {

 url =
 url +
 `queueId=${queueId}&`;

 }


 url =
 url +
 `sort=${sort}`;


 const response =
 await api.get<Ticket[]>(
 url
 );


 setTickets(
 response.data
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
 "Could not load tickets"
 );

 }

 }

 finally {

 setLoading(
 false
 );

 }

 };


 getTickets();

 },
 [
 status,
 queueId,
 sort,
 refresh,
 ]
 );


 const cancelTicket =
 async (
 id: number
 ) => {

 setResponseMsg("");
 setErr("");

 setActionTicketId(
 id
 );


 try {

 await api.patch(
 `/tickets/${id}/cancel`,
 {}
 );


 setResponseMsg(
 "Ticket cancelled successfully"
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
 "Could not cancel ticket"
 );

 }

 }

 finally {

 setActionTicketId(
 null
 );

 }

 };


 const completeTicket =
 async (
 id: number
 ) => {

 setResponseMsg("");
 setErr("");

 setActionTicketId(
 id
 );


 try {

 await api.patch(
 `/tickets/${id}/complete`,
 {}
 );


 setResponseMsg(
 "Ticket completed successfully"
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
 "Could not complete ticket"
 );

 }

 }

 finally {

 setActionTicketId(
 null
 );

 }

 };


 return (
 <div className="max-w-7xl mx-auto py-8">

 <h1 className="text-3xl font-bold mb-2">
 Ticket Management
 </h1>


 <p className="mb-6">
 View, filter and manage system tickets.
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


 <div className="card bg-white shadow border mb-6">

 <div className="card-body">

 <h2 className="font-bold">
 Ticket Filters
 </h2>


 <div className="grid md:grid-cols-3 gap-4">

 <div>

 <label className="label">
 Status
 </label>

 <select
 className="select select-bordered w-full"
 value={
 status
 }
 onChange={
 (e) =>
 setStatus(
 e.target.value
 )
 }
 >

 <option value="">
 All Statuses
 </option>

 <option value="waiting">
 Waiting
 </option>

 <option value="called">
 Called
 </option>

 <option value="completed">
 Completed
 </option>

 <option value="cancelled">
 Cancelled
 </option>

 </select>

 </div>


 <div>

 <label className="label">
 Queue
 </label>

 <select
 className="select select-bordered w-full"
 value={
 queueId
 }
 onChange={
 (e) =>
 setQueueId(
 e.target.value
 )
 }
 >

 <option value="">
 All Queues
 </option>


 {
 queues.map(
 (queue) => (

 <option
 key={
 queue.id
 }
 value={
 queue.id
 }
 >
 {
 queue.name
 }
 </option>

 )
 )
 }

 </select>

 </div>


 <div>

 <label className="label">
 Sort
 </label>

 <select
 className="select select-bordered w-full"
 value={
 sort
 }
 onChange={
 (e) =>
 setSort(
 e.target.value
 )
 }
 >

 <option value="DESC">
 Newest First
 </option>

 <option value="ASC">
 Oldest First
 </option>

 </select>

 </div>

 </div>

 </div>

 </div>


 {
 loading
 ? (
 <div className="flex items-center justify-center p-10">

 <span className="loading loading-spinner"></span>

 <span className="ml-3">
 Loading tickets...
 </span>

 </div>
 )
 : (
 <div className="overflow-x-auto">

 <table className="table ">

 <thead>

 <tr>
 <th>Ticket</th>
 <th>Customer</th>
 <th>Service</th>
 <th>Queue</th>
 <th>Priority</th>
 <th>Status</th>
 <th>Counter</th>
 <th>Issued</th>
 <th>Actions</th>
 </tr>

 </thead>


 <tbody>

 {
 tickets.map(
 (ticket) => (

 <tr
 key={
 ticket.id
 }
 >

 <td className="font-semibold">
 {
 ticket.ticketNumber
 }
 </td>


 <td>

 <div>
 {
 ticket
 .user
 .fullName
 }
 </div>

 <div className="text-xs opacity-70">
 {
 ticket
 .user
 .email
 }
 </div>

 </td>


 <td>
 {
 ticket
 .service
 .name
 }
 </td>


 <td>
 {
 ticket
 .queue
 .name
 }
 </td>


 <td>
 {
 ticket.priority
 }
 </td>


 <td>

 <span className="badge badge-outline">
 {
 ticket.status
 }
 </span>

 </td>


 <td>
 {
 ticket
 .counter
 ?.name ||
 "-"
 }
 </td>


 <td>
 {
 new Date(
 ticket.issuedAt
 )
 .toLocaleString()
 }
 </td>


 <td>

 <div className="flex flex-col gap-2">

 {
 ticket.status ==
 "called" &&
 <button
 className="btn btn-success btn-sm"
 disabled={
 actionTicketId ==
 ticket.id
 }
 onClick={
 () =>
 completeTicket(
 ticket.id
 )
 }
 >
 Complete
 </button>
 }


 {
 (
 ticket.status ==
 "waiting" ||
 ticket.status ==
 "called"
 ) &&
 <button
 className="btn btn-error btn-sm"
 disabled={
 actionTicketId ==
 ticket.id
 }
 onClick={
 () =>
 cancelTicket(
 ticket.id
 )
 }
 >
 Cancel
 </button>
 }


 {
 (
 ticket.status ==
 "completed" ||
 ticket.status ==
 "cancelled"
 ) &&
 <span className="text-xs opacity-70">
 Finalized
 </span>
 }

 </div>

 </td>

 </tr>

 )
 )
 }

 </tbody>

 </table>


 {
 tickets.length == 0 &&
 <p className="mt-4">
 No tickets found.
 </p>
 }

 </div>
 )
 }

 </div>
 );

}

