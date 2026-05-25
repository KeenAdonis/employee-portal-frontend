"use client";

import {
    ShieldCheck,
    CreditCard,
    Landmark,
    ReceiptText,
} from "lucide-react";

export default function GovernmentInformationCard({ profile }) {

    const fields = [
        {
            label: "SSS Number",
            value: profile?.SSSNumber,
            icon: ShieldCheck,
        },
        {
            label: "PhilHealth Number",
            value: profile?.PhilHealthNumber,
            icon: CreditCard,
        },
        {
            label: "Pag-IBIG Number",
            value: profile?.PagIbigNumber,
            icon: Landmark,
        },
        {
            label: "TIN",
            value: profile?.TIN,
            icon: ReceiptText,
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
                            bg-blue-100
                            text-blue-700
                        "
                    >

                        <ShieldCheck size={20} />

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

                            Government Information

                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-sm
                                text-slate-500
                            "
                        >

                            Employee government identification details.

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
                                            group-hover:border-blue-200
                                            group-hover:text-blue-700
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
                                                break-all
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