"use client";

import {
 useEffect,
 useState,
} from "react";

import Link from "next/link";

import {
 usePathname,
 useRouter,
} from "next/navigation";

import api from "@/lib/axios";


interface UserData {

 role: string;

}


export default function Navbar() {

 const router =
 useRouter();

 const pathname =
 usePathname();

 const [role, setRole] =
 useState<string | null>(
 null
 );

 const [
 checkingUser,
 setCheckingUser
 ] =
 useState(true);


 useEffect(
 () => {

 const checkUser =
 async () => {

 const token =
 localStorage.getItem(
 "access_token"
 );

 if (!token) {

 setRole(
 null
 );

 setCheckingUser(
 false
 );

 return;

 }

 try {

 const response =
 await api.get<UserData>(
 "/users/me"
 );

 setRole(
 response.data.role
 );

 }

 catch {

 setRole(
 null
 );

 }

 finally {

 setCheckingUser(
 false
 );

 }

 };


 checkUser();

 },
 [pathname]
 );


 const getDashboardLink = () => {

 if (role == "admin") {

 return "/admin/dashboard";

 }

 if (role == "staff") {

 return "/staff/dashboard";

 }

 return "/customer/dashboard";

 };


 const logout = () => {

 localStorage.removeItem(
 "access_token"
 );

 localStorage.removeItem(
 "refresh_token"
 );

 setRole(
 null
 );

 router.push(
 "/login"
 );

 };


 return (
 <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm animate-fade-in">
 <div className="navbar mx-auto max-w-7xl px-4 py-2">

 <div className="flex-1">

 <Link
 href="/"
 className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2 hover:text-primary transition-colors"
 >
 SQMS
 </Link>

 </div>


 <div className="flex gap-3">

 <Link
 href="/"
 className="btn btn-ghost rounded-xl hover:bg-indigo-50 :bg-indigo-900/30"
 >
 Home
 </Link>


 <Link
 href="/services"
 className="btn btn-ghost rounded-xl hover:bg-indigo-50 :bg-indigo-900/30"
 >
 Services
 </Link>


 {
 !checkingUser &&
 !role &&
 <>

 <Link
 href="/login"
 className="btn btn-ghost rounded-xl hover:bg-indigo-50 :bg-indigo-900/30"
 >
 Login
 </Link>


 <Link
 href="/register"
 className="btn border-none bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 rounded-xl hover:scale-105 transition-all duration-300"
 >
 Register
 </Link>

 </>
 }


 {
 !checkingUser &&
 role &&
 <>

 <Link
 href={getDashboardLink()}
 className="btn btn-ghost rounded-xl hover:bg-indigo-50 :bg-indigo-900/30"
 >
 Dashboard
 </Link>


 <button
 onClick={logout}
 className="btn btn-outline border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all duration-300 :bg-rose-950 :border-rose-900"
 >
 Logout
 </button>

 </>
 }

 </div>

 </div>
 </div>
 );

}
