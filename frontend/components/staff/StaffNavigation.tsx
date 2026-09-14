"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const staffLinks = [
    {
        href: "/staff/dashboard",
        label: "Overview",
    },
    {
        href: "/staff/queue",
        label: "Queue Desk",
    },
    {
        href: "/staff/counter",
        label: "My Counter",
    },
    {
        href: "/staff/profile",
        label: "Profile",
    },
];

export default function StaffNavigation() {
    const pathname = usePathname();

    return (
        <div className="border-b border-[#dccbb7] bg-[#f1dfc9]">
            <div className="mx-auto max-w-7xl overflow-x-auto px-5">
                <nav
                    className="flex min-w-max items-center gap-1 py-3"
                    aria-label="Staff navigation"
                >
                    {staffLinks.map((link) => {
                        const active =
                            pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={
                                    active
                                        ? "page"
                                        : undefined
                                }
                                className={
                                    active
                                        ? "rounded-full bg-[#8f3d27] px-4 py-2.5 text-sm font-bold text-white"
                                        : "rounded-full px-4 py-2.5 text-sm font-semibold text-[#675a50] transition hover:bg-[#fff8ec] hover:text-[#8f3d27]"
                                }
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}