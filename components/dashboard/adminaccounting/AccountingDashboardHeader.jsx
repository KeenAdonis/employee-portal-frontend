"use client";

import {
    CalendarDays,
    Receipt,
} from "lucide-react";

export default function AccountingDashboardHeader({

    user,

}) {

    /*
    |--------------------------------------------------------------------------
    | DATE
    |--------------------------------------------------------------------------
    */
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    /*
    |--------------------------------------------------------------------------
    | GREETING
    |--------------------------------------------------------------------------
    */
    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 18
                ? "Good afternoon"
                : "Good evening";

    /*
    |--------------------------------------------------------------------------
    | FIRST NAME
    |--------------------------------------------------------------------------
    */
    const fullName = user?.name || "Admin";

    const firstName = fullName.includes(",")

        ? fullName
            .split(",")[1]
            ?.trim()
            ?.split(" ")[0]

        : fullName
            .trim()
            .split(" ")[0];

    return (
        <div
            className="
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-blue-950/40
                bg-gradient-to-r
                from-[#061534]
                via-[#08204a]
                to-[#12306b]
                p-8
                shadow-2xl
            "
        >

            {/* MAIN GLOW */}
            <div
                className="
                    absolute
                    right-0
                    top-0
                    h-full
                    w-[40%]
                    bg-blue-500/10
                    blur-3xl
                "
            />

            {/* SECONDARY GLOW */}
            <div
                className="
                    absolute
                    bottom-0
                    left-0
                    h-48
                    w-48
                    rounded-full
                    bg-amber-400/10
                    blur-3xl
                "
            />

            {/* GRID OVERLAY */}
            <div
                className="
                    absolute
                    inset-0
                    opacity-[0.03]
                    [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
                    [background-size:40px_40px]
                "
            />

            {/* CONTENT */}
            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    gap-6
                    lg:flex-row
                    lg:items-end
                    lg:justify-between
                "
            >

                {/* LEFT */}
                <div className="max-w-3xl">

                    {/* BADGE */}
                    <div
                        className="
                            mb-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-amber-400/20
                            bg-amber-400/10
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-amber-200
                            backdrop-blur-sm
                        "
                    >

                        <Receipt className="h-4 w-4" />

                        <span>
                            Accounting Management Dashboard
                        </span>

                    </div>

                    {/* TITLE */}
                    <h1
                        className="
                            text-4xl
                            font-bold
                            tracking-tight
                            text-white
                            sm:text-5xl
                        "
                    >

                        {greeting},

                        <span
                            className="
                                ml-3
                                bg-gradient-to-r
                                from-amber-300
                                via-amber-400
                                to-orange-400
                                bg-clip-text
                                text-transparent
                            "
                        >
                            {firstName}!
                        </span>

                    </h1>

                    {/* SUBTITLE */}
                    <p
                        className="
                            mt-5
                            max-w-2xl
                            text-base
                            leading-relaxed
                            text-blue-100/80
                        "
                    >

                        Manage requisitions, liquidation workflows,
                        accounting approvals, and financial monitoring
                        in one centralized workspace.

                    </p>

                </div>

                {/* RIGHT */}
                <div
                    className="
                        flex
                        w-fit
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        px-5
                        py-3
                        text-sm
                        text-slate-100
                        backdrop-blur-md
                    "
                >

                    <CalendarDays
                        className="
                            h-5
                            w-5
                            text-amber-300
                        "
                    />

                    <span className="font-medium">
                        {today}
                    </span>

                </div>

            </div>

        </div>
    );
}