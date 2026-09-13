"use client";

import Link from "next/link";

import {
    usePathname,
} from "next/navigation";


const customerLinks = [
    {
        href:
            "/customer/dashboard",

        label:
            "Overview",
    },
    {
        href:
            "/customer/queues",

        label:
            "Get a Ticket",
    },
    {
        href:
            "/customer/tickets",

        label:
            "My Tickets",
    },
    {
        href:
            "/customer/notifications",

        label:
            "Notifications",
    },
    {
        href:
            "/customer/profile",

        label:
            "Profile",
    },
];


export default function CustomerNavigation() {

    const pathname =
        usePathname();


    return (
        <div
            className="
                border-b
                border-[#e7e0ee]/80
                bg-[linear-gradient(90deg,rgba(239,234,255,0.75),rgba(255,239,232,0.72),rgba(229,247,238,0.72))]
            "
        >

            <div
                className="
                    mx-auto
                    max-w-7xl
                    overflow-x-auto
                    px-5
                    py-3
                "
            >

                <nav
                    className="
                        flex
                        min-w-max
                        items-center
                        gap-2
                        rounded-[22px]
                        border
                        border-white/80
                        bg-white/55
                        p-1.5
                        shadow-[0_8px_24px_rgba(98,82,125,0.06)]
                        backdrop-blur-md
                    "
                    aria-label="Customer navigation"
                >

                    {
                        customerLinks.map(
                            (link) => {

                                const active =
                                    pathname ===
                                    link.href;


                                return (
                                    <Link
                                        key={
                                            link.href
                                        }
                                        href={
                                            link.href
                                        }
                                        aria-current={
                                            active
                                                ? "page"
                                                : undefined
                                        }
                                        className={
                                            active
                                                ? "rounded-[16px] bg-[#756aa5] px-4 py-2.5 text-sm font-bold text-white shadow-[0_6px_16px_rgba(117,106,165,0.2)]"
                                                : "rounded-[16px] px-4 py-2.5 text-sm font-semibold text-[#706b7c] transition hover:bg-[#f4effb] hover:text-[#514b63]"
                                        }
                                    >
                                        {
                                            link.label
                                        }
                                    </Link>
                                );

                            }
                        )
                    }

                </nav>

            </div>

        </div>
    );

}