import Link from "next/link";


export const dynamic =
 "force-static";


export default function Home() {

 return (
 <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 md:px-8 animate-fade-in">

 <div className="bg-white p-8 md:p-16 rounded-2xl w-full max-w-4xl mx-auto shadow-lg border border-slate-200 ">

 <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 ">
 Smart Queue Management System
 </h1>

 <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl mx-auto">
 Manage services, queues and tickets easily without waiting unnecessarily.
 </p>

 <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full sm:w-auto">
 <Link
 href="/login"
 className="btn btn-primary w-full sm:w-auto px-8 py-3 text-lg font-bold rounded-xl"
 >
 Login
 </Link>

 <Link
 href="/register"
 className="btn btn-outline w-full sm:w-auto px-8 py-3 text-lg font-bold rounded-xl text-slate-800 border-slate-300 "
 >
 Register
 </Link>

 <Link
 href="/services"
 className="btn btn-ghost rounded-xl hover:bg-slate-100 :bg-slate-800 px-8 py-3 h-auto font-semibold text-lg"
 >
 View Services
 </Link>
 </div>

 </div>

 </div>
 );

}
