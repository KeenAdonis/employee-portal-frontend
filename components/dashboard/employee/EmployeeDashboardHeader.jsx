"use client";

import { CalendarDays, Sparkles } from "lucide-react";

export default function EmployeeDashboardHeader({user}) {

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 18
                ? "Good afternoon"
                : "Good evening";

    /*
    |--------------------------------------------------------------------------
    | GET FIRST NAME
    |--------------------------------------------------------------------------
    */
    const fullName = user?.name || "User";

    const firstName = fullName.includes(",")
        ? fullName.split(",")[1]?.trim()?.split(" ")[0]
        : fullName.trim().split(" ")[0];

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div
            className="
                relative
                overflow-hidden
                rounded-[2rem]
                border
                border-white/10
                bg-gradient-to-br
                from-[#071225]
                via-[#0b1730]
                to-[#132850]
                p-6
                md:p-8
                shadow-[0_20px_60px_rgba(0,0,0,0.45)]
            "
        >

            {/* MAIN GLOW */}
            <div
                className="
                    absolute
                    -top-24
                    right-0
                    h-72
                    w-72
                    rounded-full
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
                    bg-cyan-400/5
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
                    lg:items-center
                    lg:justify-between
                "
            >

                {/* LEFT SIDE */}
                <div className="space-y-5">

                    {/* BADGE */}
                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-blue-400/20
                            bg-blue-500/10
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-blue-200
                            backdrop-blur-xl
                        "
                    >
                        <Sparkles className="h-4 w-4" />

                        <span>Employee Dashboard</span>
                    </div>

                    {/* TITLE + DESCRIPTION */}
                    <div className="space-y-3">

                        <h1
                            className="
                                text-3xl
                                md:text-5xl
                                font-bold
                                tracking-tight
                                text-white
                                leading-tight
                            "
                        >
                            {greeting},{" "}

                            <span
                                className="
                                    bg-gradient-to-r
                                    from-amber-500
                                    to-amber-600
                                    bg-clip-text
                                    text-transparent
                                "
                            >
                                {firstName}!
                            </span>
                        </h1>

                        <p
                            className="
                                max-w-2xl
                                text-sm
                                md:text-base
                                leading-7
                                text-slate-300
                            "
                        >
                            Monitor your requests, approvals, notifications,
                            attendance, and daily activities in one centralized
                            workspace built for productivity and efficiency.
                        </p>

                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div
                    className="
                        flex
                        w-fit
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        px-5
                        py-4
                        backdrop-blur-2xl
                    "
                >

                    {/* ICON */}
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-blue-500/15
                        "
                    >
                        <CalendarDays className="h-5 w-5 text-blue-300" />
                    </div>

                    {/* DATE */}
                    <div className="flex flex-col">

                        <span
                            className="
                                text-xs
                                uppercase
                                tracking-[0.2em]
                                text-slate-400
                            "
                        >
                            Today
                        </span>

                        <span
                            className="
                                text-sm
                                font-medium
                                text-white
                            "
                        >
                            {today}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}