import type {
 Metadata,
} from "next";

import type {
 ReactNode,
} from "react";

import {
 Inter,
 Outfit,
} from "next/font/google";

import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


const inter =
 Inter(
 {
 variable:
 "--font-inter",

 subsets: [
 "latin",
 ],
 }
 );


const outfit =
 Outfit(
 {
 variable:
 "--font-outfit",

 subsets: [
 "latin",
 ],
 }
 );


export const metadata:
 Metadata =
 {
 title:
 "SQMS",

 description:
 "Smart Queue Management System",
 };


export default function RootLayout(
 {
 children,
 }: Readonly<{
 children: ReactNode;
 }>
) {

 return (
 <html
 lang="en"
 data-theme="light"
 className={`${inter.variable} ${outfit.variable} font-sans h-full antialiased`}
 >

 <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">

 <Navbar />


 <main className="flex-1 px-5">

 {children}

 </main>


 <Footer />

 </body>

 </html>
 );

}
