"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const customerLinks = [
    {
        href: "/customer/dashboard",
        label: "Overview",
    },
    {
        href: "/customer/queues",
        label: "Get a Ticket",
    },
    {
        href: "/customer/tickets",
        label: "My Tickets",
    },
    {
        href: "/customer/notifications",
        label: "Notifications",
    },
    {
        href: "/customer/profile",
        label: "Profile",
    },
];

export default function CustomerNavigation() {
    const pathname = usePathname();

    return (
        <div className="border-b border-[#dccbb7] bg-[#f1dfc9]">
            <div className="mx-auto max-w-7xl overflow-x-auto px-5">
                <nav
                    className="flex min-w-max items-center gap-1 py-3"
                    aria-label="Customer navigation"
                >
                    {customerLinks.map((link) => {
                        const active = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={active ? "page" : undefined}
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