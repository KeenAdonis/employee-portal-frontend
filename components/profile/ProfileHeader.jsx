"use client";

import { useMemo, useState } from "react";

import Image from "next/image";

import { formatDate } from "@/lib/format";

import ProfileAvatarModal from "@/components/profile/ProfileAvatarModal";

import {
    Mail,
    Phone,
    Building2,
    Pencil,
    CalendarDays,
    VenusAndMars,
    Heart,
    User,
} from "lucide-react";

export default function ProfileHeader({ profile }) {

    const [openAvatarModal, setOpenAvatarModal] = useState(false);

    const initials = useMemo(() => {
        return `${profile?.FirstName?.charAt(0) || ""}${profile?.LastName?.charAt(0) || ""}`;
    }, [profile]);

    const infoItems = [
        {
            label: "Department",
            icon: Building2,
            value: profile?.Department || "No Department",
        },
        {
            label: "Birthday",
            icon: CalendarDays,
            value: formatDate(profile?.Birthday),
        },
        {
            label: "Gender",
            icon: VenusAndMars,
            value: profile?.Gender || "—",
        },
        {
            label: "Civil Status",
            icon: Heart,
            value: profile?.CivilStatus || "—",
        },
    ];

    return (
        <>
            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[34px]
                    shadow-sm
                "
            >

                {/* HEADER */}
                <div
                    className="
                        relative
                        overflow-hidden
                        rounded-[34px]
                        bg-gradient-to-r
                        from-slate-950
                        via-blue-950
                        to-indigo-950
                    "
                >

                    {/* LIGHT GLOW */}
                    <div
                        className="
                            absolute
                            inset-0
                            bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.20),_transparent_35%)]
                        "
                    />

                    {/* RIGHT GLOW */}
                    <div
                        className="
                            absolute
                            bottom-0
                            right-0
                            h-80
                            w-80
                            rounded-full
                            bg-indigo-500/20
                            blur-3xl
                        "
                    />

                    {/* GRID */}
                    <div
                        className="
                            absolute
                            inset-0
                            bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
                            bg-[size:32px_32px]
                        "
                    />

                    {/* CURVES */}
                    <div
                        className="
                            absolute
                            -bottom-24
                            -left-16
                            h-80
                            w-80
                            rounded-full
                            border
                            border-blue-400/10
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-40
                            -left-28
                            h-[500px]
                            w-[500px]
                            rounded-full
                            border
                            border-blue-400/10
                        "
                    />

                    <div
                        className="
                            absolute
                            -right-24
                            top-0
                            h-[420px]
                            w-[420px]
                            rounded-full
                            border
                            border-indigo-300/10
                        "
                    />

                    {/* CONTENT */}
                    <div
                        className="
                            relative
                            flex
                            flex-col
                            gap-10
                            px-8
                            py-8
                            xl:flex-row
                            xl:items-center
                            xl:justify-between
                        "
                    >

                        {/* LEFT SIDE */}
                        <div
                            className="
                                flex
                                flex-col
                                gap-8
                                lg:flex-row
                                lg:items-center
                            "
                        >

                            {/* PROFILE IMAGE */}
                            <div className="relative shrink-0">

                                <div
                                    className="
                                        relative
                                        h-32
                                        w-32
                                        overflow-hidden
                                        rounded-full
                                        border-[5px]
                                        border-white
                                        bg-white
                                        shadow-2xl
                                    "
                                >

                                    {profile?.ProfileImage ? (

                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${profile.ProfileImage}`}
                                            alt="Profile"
                                            fill
                                            priority
                                            className="object-cover"
                                        />

                                    ) : (

                                        <div
                                            className="
                                                flex
                                                h-full
                                                w-full
                                                items-center
                                                justify-center
                                                bg-slate-900
                                                text-4xl
                                                font-bold
                                                text-white
                                            "
                                        >

                                            {initials}

                                        </div>

                                    )}

                                </div>

                                {/* CHANGE PROFILE IMAGE */}
                                <button
                                    onClick={() => setOpenAvatarModal(true)}
                                    className="
                                        absolute
                                        bottom-1
                                        right-1
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-4
                                        border-white
                                        bg-white
                                        text-slate-700
                                        shadow-xl
                                        transition-all
                                        duration-200
                                        hover:scale-105
                                        hover:bg-slate-100
                                    "
                                >

                                    <Pencil size={16} />

                                </button>

                            </div>

                            {/* DETAILS */}
                            <div className="text-white">

                                {/* NAME */}
                                <h1
                                    className="
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                        xl:text-4xl
                                    "
                                >

                                    {profile?.FirstName} {profile?.LastName}

                                </h1>

                                {/* INFO */}
                                <div className="mt-5 space-y-3">

                                    {/* EMPLOYEE NUMBER */}
                                    <div className="flex items-center gap-3">

                                        <div
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-white/10
                                                text-white
                                            "
                                        >

                                            <User size={16} />

                                        </div>

                                        <p
                                            className="
                                                text-sm
                                                font-medium
                                                text-white/80
                                            "
                                        >

                                            Employee No: {profile?.EmployeeNo || "—"}

                                        </p>

                                    </div>

                                    {/* CONTACT */}
                                    <div className="flex items-center gap-3">

                                        <div
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-white/10
                                                text-white
                                            "
                                        >

                                            <Phone size={16} />

                                        </div>

                                        <p
                                            className="
                                                text-sm
                                                font-medium
                                                text-white/80
                                            "
                                        >

                                            {profile?.ContactNumber || "No Contact"}

                                        </p>

                                    </div>

                                    {/* EMAIL */}
                                    <div className="flex items-center gap-3">

                                        <div
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-white/10
                                                text-white
                                            "
                                        >

                                            <Mail size={16} />

                                        </div>

                                        <p
                                            className="
                                                text-sm
                                                font-medium
                                                text-white/80
                                                break-all
                                            "
                                        >

                                            {profile?.EmailAddress || "No Email"}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RIGHT SIDE */}
                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-2
                                xl:w-[480px]
                            "
                        >

                            {infoItems.map((item, index) => {

                                const Icon = item.icon;

                                return (
                                    <div
                                        key={index}
                                        className="
                                            flex
                                            items-center
                                            gap-4
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/5
                                            px-4
                                            py-4
                                            backdrop-blur-md
                                        "
                                    >

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
                                                bg-white/10
                                                text-white
                                            "
                                        >

                                            <Icon size={18} />

                                        </div>

                                        {/* CONTENT */}
                                        <div className="min-w-0">

                                            <p
                                                className="
                                                    text-xs
                                                    font-medium
                                                    uppercase
                                                    tracking-wide
                                                    text-white/50
                                                "
                                            >

                                                {item.label}

                                            </p>

                                            <p
                                                className="
                                                    truncate
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                "
                                            >

                                                {item.value}

                                            </p>

                                        </div>

                                    </div>
                                );

                            })}

                        </div>

                    </div>

                </div>

            </div>

            {/* PROFILE IMAGE MODAL */}
            <ProfileAvatarModal
                open={openAvatarModal}
                onClose={() => setOpenAvatarModal(false)}
                profile={profile}
                onSuccess={() => window.location.reload()}
            />

        </>
    );
}