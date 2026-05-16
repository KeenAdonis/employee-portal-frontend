"use client";

import {
    Building2,
    Briefcase,
    CalendarClock,
    BadgeCheck,
    Wallet,
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
            value: profile?.DateHired,
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
            icon: BadgeCheck,
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
                rounded-3xl
                border
                border-gray-200
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:shadow-md
            "
        >

            {/* HEADER */}
            <div className="mb-6">

                <h2 className="text-xl font-semibold text-gray-900">
                    Employment Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Employment and organizational information.
                </p>

            </div>

            {/* DIVIDER */}
            <div className="mb-6 border-t border-gray-100" />

            {/* CONTENT */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                {fields.map((field, index) => {

                    const Icon = field.icon;

                    return (
                        <div
                            key={index}
                            className="
                                rounded-2xl
                                border
                                border-gray-100
                                bg-gray-50
                                p-4
                            "
                        >

                            <div className="flex items-center gap-2">

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-violet-100
                                        text-violet-600
                                    "
                                >
                                    <Icon size={16} />
                                </div>

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            uppercase
                                            tracking-wide
                                            text-gray-400
                                        "
                                    >
                                        {field.label}
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-gray-900
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
    );
}