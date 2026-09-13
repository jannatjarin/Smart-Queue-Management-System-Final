"use client";

import {
 useEffect,
 useState,
} from "react";

import {
 useRouter,
} from "next/navigation";

import api from "@/lib/axios";


interface UserData {

 id: number;
 email: string;
 role: string;

}


interface RoleGuardProps {

 children: React.ReactNode;
 allowedRole: string;

}


export default function RoleGuard(
 {
 children,
 allowedRole,
 }: RoleGuardProps
) {

 const router =
 useRouter();

 const [allowed, setAllowed] =
 useState(false);


 useEffect(
 () => {

 const checkRole =
 async () => {

 const token =
 localStorage.getItem(
 "access_token"
 );

 if (!token) {

 router.replace(
 "/login"
 );

 return;

 }

 try {

 const response =
 await api.get<UserData>(
 "/users/me"
 );

 const role =
 response.data.role;

 if (
 role ==
 allowedRole
 ) {

 setAllowed(
 true
 );

 return;

 }

 setAllowed(
 false
 );


 if (
 role == "admin"
 ) {

 router.replace(
 "/admin/dashboard"
 );

 }

 else if (
 role == "staff"
 ) {

 router.replace(
 "/staff/dashboard"
 );

 }

 else if (
 role == "customer"
 ) {

 router.replace(
 "/customer/dashboard"
 );

 }

 else {

 router.replace(
 "/login"
 );

 }

 }

 catch {

 localStorage.removeItem(
 "access_token"
 );

 localStorage.removeItem(
 "refresh_token"
 );

 router.replace(
 "/login"
 );

 }

 };


 checkRole();

 },
 [
 allowedRole,
 router,
 ]
 );


 if (!allowed) {

 return (
 <div className="flex items-center justify-center p-8">

 <span className="loading loading-spinner"></span>

 <span className="ml-3">
 Checking access...
 </span>

 </div>
 );

 }


 return (
 <>
 {children}
 </>
 );

}
