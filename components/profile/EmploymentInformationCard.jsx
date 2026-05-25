"use client";

import { formatDate } from "@/lib/format";

import {
    Building2,
    Briefcase,
    CalendarClock,
    BadgeCheck,
    Wallet,
    Building,
} from "lucide-react";

export default function EmploymentInformationCard({ profile }) {

    const fields = [
        {
            label: "Department",
            value: profile?.Department,
            icon: Building2,
        },
        {
            label: "Position",
            value: profile?.Position,
            icon: Briefcase,
        },
        {
            label: "Date Hired",
            value: formatDate(profile?.DateHired),
            icon: CalendarClock,
        },
        {
            label: "Company Status",
            value: profile?.CompanyStatus,
            icon: BadgeCheck,
        },
        {
            label: "Company Name",
            value: profile?.Company,
            icon: Building,
        },
        {
            label: "Monthly Salary",
            value: profile?.MonthlySalary
                ? `₱ ${Number(profile.MonthlySalary).toLocaleString()}`
                : "—",
            icon: Wallet,
        },
    ];

    return (
        <div
            className="
                overflow-hidden
                rounded-[30px]
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:shadow-md
            "
        >

            {/* HEADER */}
            <div className="border-b border-slate-100 px-6 py-5">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-2xl
                            bg-violet-100
                            text-violet-700
                        "
                    >

                        <Briefcase size={20} />

                    </div>

                    <div>

                        <h2
                            className="
                                text-lg
                                font-semibold
                                tracking-tight
                                text-slate-900
                            "
                        >

                            Employment Information

                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-sm
                                text-slate-500
                            "
                        >

                            Employment and organizational details.

                        </p>

                    </div>

                </div>

            </div>

            {/* CONTENT */}
            <div className="p-6">

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                    "
                >

                    {fields.map((field, index) => {

                        const Icon = field.icon;

                        return (
                            <div
                                key={index}
                                className="
                                    group
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-slate-50/80
                                    p-4
                                    transition-all
                                    duration-200
                                    hover:border-slate-300
                                    hover:bg-white
                                "
                            >

                                <div className="flex items-start gap-4">

                                    {/* ICON */}
                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-slate-200
                                            bg-white
                                            text-slate-700
                                            transition-all
                                            duration-200
                                            group-hover:border-violet-200
                                            group-hover:text-violet-700
                                        "
                                    >

                                        <Icon size={18} />

                                    </div>

                                    {/* CONTENT */}
                                    <div className="min-w-0 flex-1">

                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            "
                                        >

                                            {field.label}

                                        </p>

                                        <p
                                            className="
                                                mt-1.5
                                                break-words
                                                text-sm
                                                font-semibold
                                                text-slate-900
                                            "
                                        >

                                            {field.value || "—"}

                                        </p>

                                    </div>

                                </div>

                            </div>
                        );

                    })}

                </div>

            </div>

        </div>
    );
}