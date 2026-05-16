"use client";

import Link from "next/link";

import {
    UserPlus,
    CalendarCheck2,
    Clock3,
    Wallet,
    ArrowRight,
} from "lucide-react";

const actions = [
    {
        title: "Add Employee",
        description: "Create new employee account",
        icon: UserPlus,
        href: "/dashboard/adminhr/employee-list",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
    },

    {
        title: "Approve Leaves",
        description: "Review pending leave requests",
        icon: CalendarCheck2,
        href: "/dashboard/adminhr/leave-list",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
    },

    {
        title: "Approve Overtime",
        description: "Review overtime requests",
        icon: Clock3,
        href: "/dashboard/adminhr/overtime-list",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
    },

    {
        title: "Payroll",
        description: "Open payroll management",
        icon: Wallet,
        href: "/dashboard/adminhr/payroll-list",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
    },
];

export default function QuickActions() {

    return (
        <section
            className="
                rounded-3xl
                border
                border-slate-200
                bg-slate-50
                p-8
            "
        >

            {/* =========================================================
                HEADER
            ========================================================= */}
            <div className="mb-8">

                <h2
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-slate-900
                    "
                >
                    Quick Actions
                </h2>

                <p
                    className="
                        mt-2
                        text-sm
                        text-slate-500
                    "
                >
                    Frequently used HR management shortcuts.
                </p>

            </div>

            {/* =========================================================
                ACTION GRID
            ========================================================= */}
            <div
                className="
                    grid
                    grid-cols-1
                    gap-5
                    md:grid-cols-2
                    xl:grid-cols-4
                "
            >

                {actions.map((action, index) => {

                    const Icon = action.icon;

                    return (
                        <Link
                            key={index}
                            href={action.href}
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-[0_2px_10px_rgba(15,23,42,0.04)]
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-slate-300
                                hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]
                            "
                        >

                            {/* TOP */}
                            <div
                                className="
                                    flex
                                    items-start
                                    justify-between
                                "
                            >

                                <div
                                    className={`
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        ${action.iconBg}
                                    `}
                                >

                                    <Icon
                                        className={`
                                            h-6
                                            w-6
                                            ${action.iconColor}
                                        `}
                                    />

                                </div>

                                <ArrowRight
                                    className="
                                        h-5
                                        w-5
                                        text-slate-400
                                        transition-all
                                        duration-300
                                        group-hover:translate-x-1
                                        group-hover:text-slate-700
                                    "
                                />

                            </div>

                            {/* CONTENT */}
                            <div className="mt-6">

                                <h3
                                    className="
                                        text-xl
                                        font-bold
                                        tracking-tight
                                        text-slate-900
                                    "
                                >
                                    {action.title}
                                </h3>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >
                                    {action.description}
                                </p>

                            </div>

                        </Link>
                    );
                })}

            </div>

        </section>
    );
}