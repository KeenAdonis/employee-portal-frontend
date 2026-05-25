"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import {
    Camera,
    Upload,
    X,
    Loader2,
    ImagePlus,
    AlertCircle,
} from "lucide-react";

import { uploadProfileAvatar } from "@/services/profileService";

export default function ProfileAvatarModal({
    open,
    onClose,
    profile,
    onSuccess,
}) {

    const inputRef = useRef(null);

    const [preview, setPreview] = useState(null);

    const [file, setFile] = useState(null);

    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");

    const initials = `${profile?.FirstName?.charAt(0) || ""}${profile?.LastName?.charAt(0) || ""}`;

    useEffect(() => {

        if (!open) {
            setPreview(null);
            setFile(null);
            setError("");
        }

    }, [open]);

    const handleSelectImage = (event) => {

        const selectedFile = event.target.files?.[0];

        if (!selectedFile) return;

        // VALIDATE FILE TYPE
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(selectedFile.type)) {

            setError("Only JPG, PNG, and WEBP images are allowed.");

            return;
        }

        // VALIDATE FILE SIZE (5MB)
        const maxSize = 5 * 1024 * 1024;

        if (selectedFile.size > maxSize) {

            setError("Image size must not exceed 5MB.");

            return;
        }

        setError("");

        setFile(selectedFile);

        const imageUrl = URL.createObjectURL(selectedFile);

        setPreview(imageUrl);
    };

    const handleUpload = async () => {

        try {

            if (!file) return;

            setUploading(true);

            const formData = new FormData();

            formData.append("avatar", file);

            await uploadProfileAvatar(formData);

            onSuccess();

            onClose();

        } catch (error) {

            console.error("UPLOAD ERROR:", error);

            setError("Failed to upload profile image.");

        } finally {

            setUploading(false);

        }
    };

    if (!open) return null;

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-slate-950/70
                p-4
                backdrop-blur-md
                animate-in
                fade-in
                duration-200
            "
        >

            {/* MODAL */}
            <div
                className="
                    relative
                    w-full
                    max-w-2xl
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-slate-200
                    bg-white
                    shadow-[0_25px_80px_rgba(0,0,0,0.35)]
                    animate-in
                    zoom-in-95
                    duration-200
                "
            >

                {/* HEADER */}
                <div
                    className="
                        relative
                        overflow-hidden
                        border-b
                        border-slate-100
                        bg-gradient-to-r
                        from-slate-950
                        via-blue-950
                        to-indigo-950
                        px-8
                        py-7
                    "
                >

                    {/* GLOW */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_35%)]
                        "
                    />

                    {/* CLOSE BUTTON */}
                    <button
                        onClick={onClose}
                        className="
                            absolute
                            right-5
                            top-5
                            z-50
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-2xl
                            bg-white/10
                            text-white
                            backdrop-blur-md
                            transition-all
                            duration-200
                            hover:bg-white/20
                        "
                    >

                        <X size={18} />

                    </button>

                    {/* TITLE */}
                    <div className="relative">

                        <h2
                            className="
                                text-2xl
                                font-bold
                                tracking-tight
                                text-white
                            "
                        >

                            Update Profile Photo

                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-blue-100/70
                            "
                        >

                            Upload a professional profile image for your account.

                        </p>

                    </div>

                </div>

                {/* BODY */}
                <div
                    className="
                        grid
                        gap-8
                        p-8
                        lg:grid-cols-[240px_1fr]
                    "
                >

                    {/* LEFT SIDE */}
                    <div className="flex flex-col items-center">

                        {/* AVATAR */}
                        <div className="group relative">

                            <div
                                className="
                                    relative
                                    h-40
                                    w-40
                                    overflow-hidden
                                    rounded-full
                                    border-[5px]
                                    border-slate-100
                                    bg-slate-900
                                    shadow-xl
                                "
                            >

                                {preview ? (

                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />

                                ) : profile?.ProfileImage ? (

                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${profile.ProfileImage}`}
                                        alt="Profile"
                                        fill
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
                                            text-5xl
                                            font-bold
                                            text-white
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

                                    <Camera
                                        size={32}
                                        className="text-white"
                                    />

                                </div>

                            </div>

                            {/* CHANGE BUTTON */}
                            <button
                                onClick={() => inputRef.current?.click()}
                                className="
                                    absolute
                                    bottom-2
                                    right-2
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-4
                                    border-white
                                    bg-blue-600
                                    text-white
                                    shadow-xl
                                    transition-all
                                    duration-200
                                    hover:scale-105
                                    hover:bg-blue-700
                                "
                            >

                                <Camera size={18} />

                            </button>

                        </div>

                        {/* HELPER TEXT */}
                        <p
                            className="
                                mt-5
                                text-center
                                text-sm
                                text-slate-500
                            "
                        >

                            Recommended size: 512 × 512 px

                        </p>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col">

                        {/* DROPZONE */}
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="
                                group
                                flex
                                flex-col
                                items-center
                                justify-center
                                rounded-[28px]
                                border-2
                                border-dashed
                                border-slate-300
                                bg-slate-50/70
                                px-8
                                py-12
                                text-center
                                transition-all
                                duration-200
                                hover:border-blue-400
                                hover:bg-blue-50/40
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-white
                                    text-slate-700
                                    shadow-sm
                                    transition-all
                                    duration-200
                                    group-hover:text-blue-700
                                "
                            >

                                <ImagePlus size={30} />

                            </div>

                            <h3
                                className="
                                    mt-5
                                    text-lg
                                    font-semibold
                                    text-slate-900
                                "
                            >

                                Upload New Photo

                            </h3>

                            <p
                                className="
                                    mt-2
                                    max-w-sm
                                    text-sm
                                    leading-relaxed
                                    text-slate-500
                                "
                            >

                                Drag and drop your image here, or click to browse files.

                            </p>

                            <p
                                className="
                                    mt-4
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >

                                JPG • PNG • WEBP • Max 5MB

                            </p>

                        </button>

                        {/* FILE INPUT */}
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleSelectImage}
                        />

                        {/* ERROR */}
                        {error && (

                            <div
                                className="
                                    mt-5
                                    flex
                                    items-start
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-4
                                "
                            >

                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 text-red-600"
                                />

                                <p
                                    className="
                                        text-sm
                                        font-medium
                                        text-red-700
                                    "
                                >

                                    {error}

                                </p>

                            </div>

                        )}

                        {/* ACTIONS */}
                        <div className="mt-8 flex gap-4">

                            <button
                                onClick={onClose}
                                className="
                                    flex-1
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-5
                                    py-3.5
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition-all
                                    duration-200
                                    hover:bg-slate-50
                                "
                            >

                                Cancel

                            </button>

                            <button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="
                                    flex
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    bg-blue-600
                                    px-5
                                    py-3.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    transition-all
                                    duration-200
                                    hover:bg-blue-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                {uploading ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Uploading...

                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />

                                        Save Changes
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}