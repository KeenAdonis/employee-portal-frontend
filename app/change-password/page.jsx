"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import api from "@/services/api";

export default function ChangePasswordPage() {
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* =========================
       🔐 PASSWORD RULES
    ========================= */
    const passwordChecks = {
        length: newPassword.length >= 8,
        upper: /[A-Z]/.test(newPassword),
        lower: /[a-z]/.test(newPassword),
        number: /[0-9]/.test(newPassword),
        special: /[^A-Za-z0-9]/.test(newPassword),
    };

    const passedChecks = Object.values(passwordChecks).filter(Boolean).length;

    const getStrength = () => {
        if (passedChecks <= 2) return "Weak";
        if (passedChecks <= 4) return "Medium";
        return "Strong";
    };

    const strength = getStrength();

    const isMatch = newPassword && confirmPassword && newPassword === confirmPassword;

    /* =========================
       🚀 SUBMIT
    ========================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!isMatch) {
            setError("Passwords do not match");
            return;
        }

        if (strength !== "Strong") {
            setError("Password is not strong enough");
            return;
        }

        setLoading(true);

        try {
            await api.post("/change-password", {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });

            setSuccess("Password updated successfully!");

            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);

        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to update password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1a3a] via-[#0d1f4d] to-[#09142b] p-6">

            {/* CARD */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                {/* LOGO */}
                <div className="flex justify-center mb-4">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-14 h-14 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]"
                    />
                </div>

                {/* TITLE */}
                <h2 className="text-xl font-semibold text-center text-gray-800">
                    Set New Password
                </h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Please change your temporary password
                </p>

                {/* ALERTS */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                        {success}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* CURRENT PASSWORD */}
                    <InputField
                        placeholder="Current Password"
                        value={currentPassword}
                        setValue={setCurrentPassword}
                        show={showCurrent}
                        setShow={setShowCurrent}
                    />

                    {/* NEW PASSWORD */}
                    <InputField
                        placeholder="New Password"
                        value={newPassword}
                        setValue={setNewPassword}
                        show={showNew}
                        setShow={setShowNew}
                    />

                    {/* 🔥 LIVE VALIDATION */}
                    <div className="mt-2 space-y-2 text-sm">

                        {/* Strength */}
                        <div className="flex justify-between">
                            <span className="text-gray-500">Strength:</span>
                            <span
                                className={`font-semibold ${strength === "Strong"
                                        ? "text-green-600"
                                        : strength === "Medium"
                                            ? "text-yellow-500"
                                            : "text-red-500"
                                    }`}
                            >
                                {strength}
                            </span>
                        </div>

                        {/* Progress */}
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${strength === "Strong"
                                        ? "bg-green-500 w-full"
                                        : strength === "Medium"
                                            ? "bg-yellow-400 w-2/3"
                                            : "bg-red-400 w-1/3"
                                    }`}
                            />
                        </div>

                        {/* RULES */}
                        <div className="grid gap-1 mt-2">
                            <Rule ok={passwordChecks.length} label="At least 8 characters" />
                            <Rule ok={passwordChecks.upper} label="Uppercase letter" />
                            <Rule ok={passwordChecks.lower} label="Lowercase letter" />
                            <Rule ok={passwordChecks.number} label="Number" />
                            <Rule ok={passwordChecks.special} label="Special character" />
                        </div>

                    </div>

                    {/* CONFIRM PASSWORD */}
                    <InputField
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        show={showConfirm}
                        setShow={setShowConfirm}
                    />

                    {/* MATCH CHECK */}
                    {confirmPassword && (
                        <p className={`text-xs ${isMatch ? "text-green-600" : "text-red-500"}`}>
                            {isMatch ? "Passwords match" : "Passwords do not match"}
                        </p>
                    )}

                    {/* SUBMIT */}
                    <button
                        disabled={loading || strength !== "Strong" || !isMatch}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-50 transition"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>

                </form>
            </div>
        </div>
    );
}

/* =========================
   🔹 INPUT COMPONENT
========================= */
function InputField({ placeholder, value, setValue, show, setShow }) {
    return (
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-1 focus:ring-amber-300 outline-none pr-10"
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-2.5 text-gray-400"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}

/* =========================
   🔹 RULE COMPONENT
========================= */
function Rule({ ok, label }) {
    return (
        <div className="flex items-center gap-2">
            <div
                className={`w-2 h-2 rounded-full ${ok ? "bg-green-500" : "bg-gray-300"
                    }`}
            />
            <span className={ok ? "text-green-600" : "text-gray-400"}>
                {label}
            </span>
        </div>
    );
}