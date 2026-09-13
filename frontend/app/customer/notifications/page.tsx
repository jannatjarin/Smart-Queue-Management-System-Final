"use client";

import {
 useEffect,
 useState,
} from "react";

import axios from "axios";

import api from "@/lib/axios";


interface Notification {

 id: number;
 type: string;
 message: string;
 status: string;
 sentAt: string;

}


export default function NotificationsPage() {

 const [
 notifications,
 setNotifications
 ] =
 useState<Notification[]>(
 []
 );

 const [err, setErr] =
 useState("");

 const [loading, setLoading] =
 useState(true);


 useEffect(
 () => {

 const getNotifications =
 async () => {

 try {

 const response =
 await api.get<
 Notification[]
 >(
 "/notifications/me"
 );

 setNotifications(
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
 "Could not load notifications"
 );

 }

 }

 finally {

 setLoading(
 false
 );

 }

 };


 getNotifications();

 },
 []
 );


 if (loading) {

 return (
 <div className="flex items-center justify-center p-10">

 <span className="loading loading-spinner"></span>

 <span className="ml-3">
 Loading notifications...
 </span>

 </div>
 );

 }


 return (
 <div className="max-w-4xl mx-auto py-8">

 <div className="mb-6">

 <h1 className="text-3xl font-bold">
 My Notifications
 </h1>

 <p>
 View updates related to your account and tickets.
 </p>

 </div>


 {
 err &&
 <div className="alert alert-error mb-4">

 <span>
 {err}
 </span>

 </div>
 }


 {
 notifications.length ==
 0 &&
 !err &&
 <div className="alert">

 <span>
 You have no notifications yet.
 </span>

 </div>
 }


 <div className="flex flex-col gap-4">

 {
 notifications.map(
 (
 notification
 ) => (

 <div
 key={
 notification.id
 }
 className="card bg-white shadow border"
 >

 <div className="card-body">

 <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">

 <h2 className="font-bold">
 {
 notification
 .type
 }
 </h2>


 <span className="badge badge-outline">
 {
 notification
 .status
 }
 </span>

 </div>


 <p>
 {
 notification
 .message
 }
 </p>


 <p className="text-sm opacity-70">
 {
 new Date(
 notification
 .sentAt
 )
 .toLocaleString()
 }
 </p>

 </div>

 </div>

 )
 )
 }

 </div>

 </div>
 );

}

