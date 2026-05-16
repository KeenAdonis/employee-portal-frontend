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
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {/* =========================================================
                HEADER
            ========================================================= */}
            <div className="mb-6">

                <h2 className="text-xl font-bold text-gray-900">
                    Quick Actions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Frequently used HR management shortcuts.
                </p>

            </div>

            {/* =========================================================
                ACTION GRID
            ========================================================= */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                {actions.map((action, index) => {

                    const Icon = action.icon;

                    return (
                        <Link
                            key={index}
                            href={action.href}
                            className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500 hover:bg-white hover:shadow-md"
                        >

                            {/* TOP */}
                            <div className="flex items-start justify-between">

                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${action.iconBg}`}
                                >

                                    <Icon
                                        className={`h-7 w-7 ${action.iconColor}`}
                                    />

                                </div>

                                <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#0B1739]" />

                            </div>

                            {/* CONTENT */}
                            <div className="mt-5">

                                <h3 className="text-base font-semibold text-gray-900">
                                    {action.title}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
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