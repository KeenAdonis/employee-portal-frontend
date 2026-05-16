"use client";

import {
    BriefcaseBusiness,
    HeartPulse,
    ShieldPlus,
} from "lucide-react";

import LeaveCreditCard from "./LeaveCreditCard";

const credits = [
    {
        title: "Vacation Leave",
        key: "vacation_leave",
        icon: BriefcaseBusiness,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
    },

    {
        title: "Sick Leave",
        key: "sick_leave",
        icon: HeartPulse,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
    },

    {
        title: "Emergency Leave",
        key: "emergency_leave",
        icon: ShieldPlus,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
    },

    {
        title: "Maternity Leave",
        key: "maternity_leave",
        icon: HeartPulse,
        iconBg: "bg-pink-100",
        iconColor: "text-pink-600",
    },

    {
        title: "Paternity Leave",
        key: "paternity_leave",
        icon: BriefcaseBusiness,
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
    },

    {
        title: "Bereavement Leave",
        key: "bereavement_leave",
        icon: ShieldPlus,
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
    },

    {
        title: "Birthday Leave",
        key: "birthday_leave",
        icon: HeartPulse,
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
    },
];

export default function EmployeeLeaveCredits({
    leaveCredits,
}) {

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

            {/* =====================================================
                HEADER
            ===================================================== */}
            <div className="mb-8">

                <h2
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-slate-900
                    "
                >
                    Leave Credits
                </h2>

                <p
                    className="
                        mt-2
                        text-sm
                        text-slate-500
                    "
                >
                    Available employee leave balances.
                </p>
            </div>

            {/* =====================================================
                CREDIT LIST
            ===================================================== */}
            <div className="max-h-[290px] space-y-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">

                {credits.map((credit) => (

                    <LeaveCreditCard
                        key={credit.key}
                        title={credit.title}
                        value={
                            leaveCredits?.[
                                credit.key
                            ] ?? 0
                        }
                        icon={credit.icon}
                        iconBg={credit.iconBg}
                        iconColor={credit.iconColor}
                    />

                ))}
            </div>
        </section>
    );
}