"use client";

import Image from "next/image";

import {
    Camera,
    Loader2,
} from "lucide-react";

export default function ProfileAvatarUpload({
    profile,
    onUpload,
    uploading,
}) {

    const initials = `${profile?.FirstName?.charAt(0) || ""}
${profile?.LastName?.charAt(0) || ""}`;

    return (
        <div className="relative group">

            {/* GLOW */}
            <div
                className="
                    absolute
                    inset-0
                    rounded-[32px]
                    bg-blue-500/20
                    blur-2xl
                    opacity-0
                    transition-all
                    duration-300
                    group-hover:opacity-100
                "
            />

            {/* AVATAR CONTAINER */}
            <div
                className="
                    relative
                    flex
                    h-32
                    w-32
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[30px]
                    border-[5px]
                    border-white
                    bg-gradient-to-br
                    from-slate-900
                    via-blue-950
                    to-indigo-950
                    text-3xl
                    font-bold
                    text-white
                    shadow-[0_15px_40px_rgba(0,0,0,0.25)]
                "
            >

                {/* IMAGE */}
                {profile?.ProfileImage ? (

                    <Image
                        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${profile.ProfileImage}`}
                        alt="Profile"
                        fill
                        priority
                        className="
                            object-cover
                            transition-transform
                            duration-300
                            group-hover:scale-105
                        "
                    />

                ) : (

                    <div
                        className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                        "
                    >

                        {initials}

                    </div>

                )}

                {/* OVERLAY */}
                <div
                    className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        bg-black/40
                        opacity-0
                        transition-all
                        duration-200
                        group-hover:opacity-100
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            gap-2
                        "
                    >

                        <Camera
                            size={24}
                            className="text-white"
                        />

                        <span
                            className="
                                text-xs
                                font-semibold
                                tracking-wide
                                text-white
                            "
                        >

                            Change Photo

                        </span>

                    </div>

                </div>

            </div>

            {/* UPLOAD BUTTON */}
            <label
                className={`
                    absolute
                    bottom-1
                    right-1
                    flex
                    h-11
                    w-11
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-2xl
                    border-4
                    border-white
                    shadow-xl
                    transition-all
                    duration-200
                    ${
                        uploading
                            ? "bg-slate-400 text-white"
                            : "bg-white text-slate-700 hover:scale-105 hover:bg-slate-100"
                    }
                `}
            >

                {uploading ? (

                    <Loader2
                        size={18}
                        className="animate-spin"
                    />

                ) : (

                    <Camera size={18} />

                )}

                <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    disabled={uploading}
                    onChange={onUpload}
                />

            </label>

        </div>
    );
}