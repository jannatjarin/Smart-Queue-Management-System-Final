"use client";

import {
 useEffect,
 useState,
} from "react";

import axios from "axios";

import Link from "next/link";

import api from "@/lib/axios";


interface Ticket {

 id: number;
 ticketNumber: string;
 status: string;
 priority: string;

 issuedAt: string;

 calledAt:
 string | null;

 completedAt:
 string | null;

 estimatedWaitMinutes:
 number | null;

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


export default function CustomerTicketsPage() {

 const [tickets, setTickets] =
 useState<Ticket[]>([]);

 const [err, setErr] =
 useState("");

 const [status, setStatus] =
 useState("");

 const [
 selectedTicket,
 setSelectedTicket
 ] =
 useState<Ticket | null>(
 null
 );

 const [
 refresh,
 setRefresh
 ] =
 useState(0);

 const [
 responseMsg,
 setResponseMsg
 ] =
 useState("");


 useEffect(
 () => {

 const getTickets =
 async () => {

 try {

 const response =
 await api.get<
 Ticket[]
 >(
 "/tickets/mytickets"
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

 setErr(
 error.response
 .data
 .message
 );

 }

 else {

 setErr(
 "Could not load tickets"
 );

 }

 }

 };


 getTickets();

 },
 [refresh]
 );


 const filteredTickets =
 status
 ? tickets.filter(
 (ticket) =>
 ticket.status ==
 status
 )
 : tickets;


 const cancelTicket =
 async (
 id: number
 ) => {

 setErr("");
 setResponseMsg("");


 try {

 await api.patch(
 `/tickets/${id}/cancel`,
 {}
 );


 setResponseMsg(
 "Ticket cancelled successfully"
 );


 setSelectedTicket(
 null
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
 "Could not cancel ticket"
 );

 }

 }

 };


 const showEstimatedWait =
 (
 ticket: Ticket
 ) => {

 if (
 ticket.status !=
 "waiting"
 ) {

 return "-";

 }

 if (
 ticket
 .estimatedWaitMinutes
 === null
 ) {

 return "Not available";

 }

 return `${ticket.estimatedWaitMinutes} minutes`;

 };


 return (
 <div className="max-w-6xl mx-auto py-8">

 <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

 <div>

 <h1 className="text-3xl font-bold">
 My Tickets
 </h1>

 <p>
 View and manage your queue tickets.
 </p>

 </div>


 <Link
 href="/customer/queues"
 className="btn btn-primary"
 >
 Get New Ticket
 </Link>

 </div>


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

 <label className="label">
 Filter by Status
 </label>


 <select
 className="select select-bordered max-w-sm"
 value={status}
 onChange={
 (e) =>
 setStatus(
 e.target.value
 )
 }
 >

 <option value="">
 All Tickets
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

 </div>


 {
 filteredTickets.length ==
 0 &&
 !err &&
 <div className="alert">

 <span>
 No tickets found.
 </span>

 </div>
 }


 <div className="grid md:grid-cols-2 gap-5">

 {
 filteredTickets.map(
 (ticket) => (

 <div
 key={
 ticket.id
 }
 className="card bg-white shadow border"
 >

 <div className="card-body">

 <div className="flex justify-between items-center">

 <h2 className="card-title">
 {
 ticket
 .ticketNumber
 }
 </h2>


 <span className="badge badge-outline">
 {
 ticket.status
 }
 </span>

 </div>


 <p>
 <b>
 Service:
 </b>{" "}
 {
 ticket
 .service
 ?.name
 }
 </p>


 <p>
 <b>
 Queue:
 </b>{" "}
 {
 ticket
 .queue
 ?.name
 }
 </p>


 <p>
 <b>
 Priority:
 </b>{" "}
 {
 ticket
 .priority
 }
 </p>


 <p>
 <b>
 Counter:
 </b>{" "}
 {
 ticket
 .counter
 ?.name ||
 "Not Assigned"
 }
 </p>


 <p>
 <b>
 Estimated Wait:
 </b>{" "}
 {
 showEstimatedWait(
 ticket
 )
 }
 </p>


 <p>
 <b>
 Issued:
 </b>{" "}
 {
 new Date(
 ticket
 .issuedAt
 )
 .toLocaleString()
 }
 </p>


 <button
 className="btn btn-outline mt-3"
 onClick={
 () =>
 setSelectedTicket(
 ticket
 )
 }
 >
 View Details
 </button>


 {
 ticket.status ==
 "waiting" &&
 <button
 className="btn btn-error mt-2"
 onClick={
 () =>
 cancelTicket(
 ticket.id
 )
 }
 >
 Cancel Ticket
 </button>
 }

 </div>

 </div>

 )
 )
 }

 </div>


 {
 selectedTicket &&
 <div className="card bg-white shadow border mt-8">

 <div className="card-body">

 <div className="flex justify-between items-center">

 <h2 className="card-title">
 Ticket Details
 </h2>


 <button
 className="btn btn-sm"
 onClick={
 () =>
 setSelectedTicket(
 null
 )
 }
 >
 Close
 </button>

 </div>


 <p>
 <b>
 Ticket Number:
 </b>{" "}
 {
 selectedTicket
 .ticketNumber
 }
 </p>


 <p>
 <b>
 Service:
 </b>{" "}
 {
 selectedTicket
 .service
 ?.name
 }
 </p>


 <p>
 <b>
 Queue:
 </b>{" "}
 {
 selectedTicket
 .queue
 ?.name
 }
 </p>


 <p>
 <b>
 Priority:
 </b>{" "}
 {
 selectedTicket
 .priority
 }
 </p>


 <p>
 <b>
 Status:
 </b>{" "}
 {
 selectedTicket
 .status
 }
 </p>


 <p>
 <b>
 Estimated Wait:
 </b>{" "}
 {
 showEstimatedWait(
 selectedTicket
 )
 }
 </p>


 <p>
 <b>
 Counter:
 </b>{" "}
 {
 selectedTicket
 .counter
 ?.name ||
 "Not Assigned"
 }
 </p>


 <p>
 <b>
 Issued At:
 </b>{" "}
 {
 new Date(
 selectedTicket
 .issuedAt
 )
 .toLocaleString()
 }
 </p>


 <p>
 <b>
 Called At:
 </b>{" "}
 {
 selectedTicket
 .calledAt
 ? new Date(
 selectedTicket
 .calledAt
 )
 .toLocaleString()
 : "-"
 }
 </p>


 <p>
 <b>
 Completed At:
 </b>{" "}
 {
 selectedTicket
 .completedAt
 ? new Date(
 selectedTicket
 .completedAt
 )
 .toLocaleString()
 : "-"
 }
 </p>

 </div>

 </div>
 }

 </div>
 );

}

