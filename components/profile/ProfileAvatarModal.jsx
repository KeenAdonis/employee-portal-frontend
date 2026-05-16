

import { useRef, useState } from "react";

import {
    Camera,
    Upload,
    X,
    Loader2,
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

    const initials = `${profile?.FirstName?.charAt(0) || ""}${profile?.LastName?.charAt(0) || ""}`;

    const handleSelectImage = (event) => {

        const selectedFile = event.target.files[0];

        if (!selectedFile) return;

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
                bg-black/50
                p-4
                backdrop-blur-sm
            "
        >

            {/* MODAL */}
            <div
                className="
                    relative
                    w-full
                    max-w-md
                    rounded-3xl
                    bg-white
                    p-6
                    shadow-2xl
                "
            >

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="
                        absolute
                        right-4
                        top-4
                        rounded-xl
                        p-2
                        text-gray-500
                        transition
                        hover:bg-gray-100
                    "
                >
                    <X size={18} />
                </button>

                {/* HEADER */}
                <div>

                    <h2 className="text-2xl font-bold text-gray-900">
                        Update Profile Photo
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Upload a new profile image for your account.
                    </p>

                </div>

                {/* PREVIEW */}
                <div className="mt-8 flex justify-center">

                    <div
                        className="
                            relative
                            flex
                            h-44
                            w-44
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-full
                            border-4
                            border-indigo-100
                            bg-indigo-600
                            text-5xl
                            font-bold
                            text-white
                            shadow-lg
                        "
                    >

                        {preview ? (

                            <img
                                src={preview}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />

                        ) : profile?.ProfileImage ? (

                            <img
                                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${profile.ProfileImage}`}
                                alt="Profile"
                                className="h-full w-full object-cover"
                            />

                        ) : (

                            initials

                        )}

                        {/* CAMERA OVERLAY */}
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="
                                absolute
                                bottom-3
                                right-3
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-full
                                bg-indigo-600
                                text-white
                                shadow-lg
                                transition
                                hover:bg-indigo-700
                            "
                        >
                            <Camera size={20} />
                        </button>
                    </div>
                </div>

                {/* FILE INPUT */}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSelectImage}
                />

                {/* SELECT BUTTON */}
                <button
                    onClick={() => inputRef.current?.click()}
                    className="
                        mt-8
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        border
                        border-dashed
                        border-indigo-300
                        bg-indigo-50
                        px-4
                        py-4
                        text-sm
                        font-semibold
                        text-indigo-700
                        transition
                        hover:bg-indigo-100
                    "
                >
                    <Upload size={18} />
                    Choose Photo
                </button>

                {/* ACTIONS */}
                <div className="mt-6 flex gap-3">

                    <button
                        onClick={onClose}
                        className="
                            flex-1
                            rounded-2xl
                            border
                            border-gray-200
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-gray-700
                            transition
                            hover:bg-gray-50
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
                            bg-indigo-600
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-indigo-700
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
                            "Save Changes"
                        )}

                    </button>
                </div>
            </div>
        </div>
    );
}