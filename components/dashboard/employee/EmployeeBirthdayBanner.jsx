"use client";

import {
    Gift,
    Cake,
} from "lucide-react";

export default function EmployeeBirthdayBanner({
    employee,
}) {

    if (!employee?.birthday) {
        return null;
    }

    const today = new Date();

    const birthday = new Date(
        employee.birthday
    );

    const isBirthday =
        today.getMonth() ===
        birthday.getMonth() &&

        today.getDate() ===
        birthday.getDate();

    if (!isBirthday) {
        return null;
    }

    return (
        <div
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-pink-200
                bg-gradient-to-r
                from-pink-50
                via-rose-50
                to-orange-50
                p-8
            "
        >

            {/* BACKGROUND GLOW */}
            <div
                className="
                    absolute
                    -top-16
                    -right-16
                    h-56
                    w-56
                    rounded-full
                    bg-pink-200/40
                    blur-3xl
                "
            />

            {/* CONTENT */}
            <div
                className="
                    relative
                    z-10
                    flex
                    items-center
                    gap-6
                "
            >

                {/* ICON */}
                <div
                    className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-3xl
                        bg-pink-500/10
                        text-pink-500
                    "
                >
                    <Cake size={36} />
                </div>

                {/* TEXT */}
                <div>

                    {/* BADGE */}
                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-pink-200
                            bg-pink-100
                            px-4
                            py-1.5
                            text-sm
                            font-medium
                            text-pink-600
                        "
                    >
                        <Gift size={16} />

                        Birthday Celebration
                    </div>

                    {/* TITLE */}
                    <h2
                        className="
                            mt-5
                            text-[38px]
                            font-bold
                            leading-tight
                            tracking-tight
                            text-slate-900
                        "
                    >
                        Happy Birthday,
                        <span
                            className="
                                text-pink-500
                            "
                        >
                            {" "}
                            {employee.name}
                        </span>
                        🎉
                    </h2>

                    {/* DESCRIPTION */}
                    <p
                        className="
                            mt-3
                            text-lg
                            leading-8
                            text-slate-500
                        "
                    >
                        Wishing you happiness,
                        success, and a wonderful
                        year ahead.
                    </p>
                </div>
            </div>
        </div>
    );
}