"use client";

import { Camera } from "lucide-react";

export default function ProfileAvatarUpload({
    profile,
    onUpload,
    uploading,
}) {

    const initials = `${profile?.FirstName?.charAt(0) || ""}
${profile?.LastName?.charAt(0) || ""}`;

    return (
        <div className="relative">

            {/* AVATAR */}
            <div
                className="
                    flex
                    h-32
                    w-32
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-3xl
                    border-4
                    border-white
                    bg-indigo-600
                    text-4xl
                    font-bold
                    text-white
                    shadow-xl
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

            {/* UPLOAD BUTTON */}
            <label
                className="
                    absolute
                    bottom-0
                    right-0
                    flex
                    h-10
                    w-10
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-2xl
                    bg-indigo-600
                    text-white
                    shadow-lg
                    transition
                    hover:bg-indigo-700
                "
            >

                <Camera size={18} />

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={onUpload}
                />
            </label>
        </div>
    );
}