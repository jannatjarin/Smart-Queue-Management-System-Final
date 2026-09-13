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
 description: string | null;
 estimatedTime: number;
 department: string;
 isActive: boolean;

}


export default function ServicesPage() {

 const [services, setServices] =
 useState<Service[]>([]);

 const [err, setErr] =
 useState("");

 const [loading, setLoading] =
 useState(true);


 useEffect(
 () => {

 const getServices =
 async () => {

 try {

 const response =
 await api.get<Service[]>(
 "/services"
 );


 setServices(
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
 "Could not load services"
 );

 }

 }

 finally {

 setLoading(
 false
 );

 }

 };


 getServices();

 },
 []
 );


 if (loading) {

 return (
 <div className="flex items-center justify-center p-10">

 <span className="loading loading-spinner"></span>

 <span className="ml-3">
 Loading services...
 </span>

 </div>
 );

 }


 return (
 <div className="max-w-7xl mx-auto py-12 px-4 animate-fade-in">

 <div className="text-center mb-16">
 <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
 Available Services
 </h1>
 <p className="text-slate-500 max-w-2xl mx-auto text-lg">
 View the services available in the Smart Queue Management System.
 </p>
 </div>


 {
 err &&
 <div className="alert alert-error mb-10 max-w-2xl mx-auto shadow-lg rounded-2xl">

 <span>
 {err}
 </span>

 </div>
 }


 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

 {
 services.map(
 (service, index) => (

 <div
 key={
 service.id
 }
 className="bg-white border border-slate-200 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
 style={{ animationDelay: `${index * 100}ms` }}
 >
 <h2 className="text-2xl font-bold mb-3 text-slate-900 ">
 {service.name}
 </h2>


 <p className="text-slate-600 mb-6 min-h-[3rem]">
 {
 service.description ||
 "No description available."
 }
 </p>

 <div className="space-y-3">
 <div className="flex items-center justify-between bg-white/50 p-3 rounded-xl">
 <span className="text-sm font-semibold text-slate-500 ">Department</span>
 <span className="font-bold text-indigo-600 ">{service.department}</span>
 </div>
 <div className="flex items-center justify-between bg-white/50 p-3 rounded-xl">
 <span className="text-sm font-semibold text-slate-500 ">Est. Time</span>
 <span className="font-bold text-slate-700 ">{service.estimatedTime} min</span>
 </div>
 </div>

 </div>

 )
 )
 }

 </div>


 {
 services.length == 0 &&
 !err &&
 <div className="glass-card p-12 text-center rounded-3xl max-w-2xl mx-auto mt-10">
 <h3 className="text-2xl font-bold text-slate-400">No services available right now.</h3>
 </div>
 }

 </div>
 );

}
