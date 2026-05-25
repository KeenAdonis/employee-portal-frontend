"use client";

import { formatDate } from "@/lib/format";

import {
    User,
    CalendarDays,
    Heart,
    VenusAndMars,
} from "lucide-react";

export default function ProfileInformationCard({ profile }) {

    const fields = [

        {
            label: "Gender",
            value: profile?.SSSNumber,
            icon: VenusAndMars,
        },
        {
            label: "Civil Status",
            value: profile?.CivilStatus,
            icon: Heart,
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
                    Goverment ID
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Personal employee details and basic information.
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
                                        bg-indigo-100
                                        text-indigo-600
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