"use client";

import { useState } from "react";

import ProfileAvatarModal from "@/components/profile/ProfileAvatarModal";

import {
    Building2,
    Briefcase,
    Mail,
    Phone,
    BadgeCheck,
    Pencil,
} from "lucide-react";

export default function ProfileHeader({ profile }) {

    const [openAvatarModal, setOpenAvatarModal] = useState(false);

    const initials = `${profile?.FirstName?.charAt(0) || ""}${profile?.LastName?.charAt(0) || ""}`;

    return (
        <>
            <div
                className="
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:shadow-md
                "
            >

                {/* COVER */}
                <div
                    className="
                        relative
                        h-44
                        overflow-hidden
                        bg-gradient-to-r
                        from-slate-950
                        via-slate-900
                        to-indigo-950
                    "
                >

                    {/* ENTERPRISE GLOW */}
                    <div
                        className="
                            absolute
                            inset-0
                            opacity-30
                            bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.35),_transparent_35%)]
                        "
                    />

                    {/* GRID PATTERN */}
                    <div
                        className="
                            absolute
                            inset-0
                            bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
                            bg-[size:32px_32px]
                        "
                    />

                    {/* OPTIONAL SOFT BOTTOM FADE */}
                    <div
                        className="
                            absolute
                            inset-x-0
                            bottom-0
                            h-20
                            bg-gradient-to-t
                            from-black/20
                            to-transparent
                        "
                    />

                </div>

                {/* CONTENT */}
                <div
                    className="
                        relative
                        border-t
                        border-slate-100
                        px-6
                        pt-6
                        pb-6
                    "
                >

                    <div
                        className="
                            relative
                            -mt-24
                            flex
                            flex-col
                            gap-6
                            xl:flex-row
                            xl:items-end
                            xl:justify-between
                        "
                    >

                        {/* LEFT SIDE */}
                        <div
                            className="
                                flex
                                flex-col
                                gap-5
                                sm:flex-row
                                sm:items-end
                            "
                        >

                            {/* AVATAR */}
                            <div className="relative">

                                <div
                                    className="
                                        flex
                                        h-32
                                        w-32
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-[28px]
                                        border-4
                                        border-white
                                        bg-slate-900
                                        text-5xl
                                        font-bold
                                        text-white
                                        shadow-2xl
                                    "
                                >

                                    {profile?.ProfileImage ? (

                                        <img
                                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${profile.ProfileImage}`}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />

                                    ) : (

                                        initials

                                    )}

                                </div>

                                {/* EDIT AVATAR BUTTON */}
                                <button
                                    onClick={() => setOpenAvatarModal(true)}
                                    className="
                                        absolute
                                        bottom-1
                                        right-1
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border-4
                                        border-white
                                        bg-amber-500
                                        text-amber-900
                                        shadow-xl
                                        transition-all
                                        duration-300
                                        hover:scale-105
                                        hover:bg-amber-600
                                    "
                                >
                                    <Pencil size={14} />
                                </button>

                            </div>

                            {/* EMPLOYEE DETAILS */}
                            <div className="pb-2">

                                {/* NAME + STATUS */}
                                <div className="flex flex-wrap items-center gap-3">

                                    <h1
                                        className="
                                            -mt-1
                                            text-[52px]
                                            font-bold
                                            tracking-tight
                                            bg-gradient-to-r
                                            from-amber-400
                                            via-yellow-700
                                            to-amber-300
                                            bg-clip-text
                                            text-transparent
                                            drop-shadow-[0_2px_10px_rgba(212,175,55,0.25)]
                                        "
                                    >

                                        {profile?.FirstName} {profile?.LastName}

                                    </h1>

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1
                                            rounded-full
                                            bg-green-200
                                            px-4
                                            py-1.5
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-green-700
                                        "
                                    >

                                        <BadgeCheck size={14} />

                                        {profile?.Status || "ACTIVE"}

                                    </span>

                                </div>

                                {/* EMPLOYEE NUMBER */}
                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        font-medium
                                        text-slate-500
                                    "
                                >

                                    Employee No: {profile?.EmployeeNo || "—"}

                                </p>

                                {/* INFO ROW */}
                                <div
                                    className="
                                        mt-5
                                        flex
                                        flex-wrap
                                        gap-x-6
                                        gap-y-3
                                        text-sm
                                        text-slate-600
                                    "
                                >

                                    <div className="flex items-center gap-2">

                                        <Briefcase
                                            size={16}
                                            className="text-amber-500"
                                        />

                                        <span className="font-medium">
                                            {profile?.Position || "No Position"}
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-2">

                                        <Building2
                                            size={16}
                                            className="text-amber-500"
                                        />

                                        <span className="font-medium">
                                            {profile?.Department || "No Department"}
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-2">

                                        <Mail
                                            size={16}
                                            className="text-amber-500"
                                        />

                                        <span className="font-medium">
                                            {profile?.EmailAddress || "No Email"}
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-2">

                                        <Phone
                                            size={16}
                                            className="text-amber-500"
                                        />

                                        <span className="font-medium">
                                            {profile?.ContactNumber || "No Contact"}
                                        </span>

                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-3">

                            <button
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    bg-slate-900
                                    px-6
                                    py-3.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    transition-all
                                    duration-300
                                    hover:bg-slate-800
                                    hover:shadow-xl
                                "
                            >

                                <Pencil size={16} />

                                Edit Profile

                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* AVATAR MODAL */}
            <ProfileAvatarModal
                open={openAvatarModal}
                onClose={() => setOpenAvatarModal(false)}
                profile={profile}
                onSuccess={() => window.location.reload()}
            />
        </>
    );
}