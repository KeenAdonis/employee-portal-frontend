"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Eye,
    EyeOff,
    ShieldCheck,
    LockKeyhole,
    Sparkles,
    CheckCircle2,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";

const PATHS = [
    "M-200,400 C300,200 900,600 2000,300",
    "M-200,470 C400,280 1000,650 2000,360",
    "M-200,540 C450,330 1050,730 2000,430",
    "M-200,610 C550,400 1200,760 2000,500",
];

export default function ChangePasswordPage() {
    const router = useRouter();

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showCurrent, setShowCurrent] =
        useState(false);

    const [showNew, setShowNew] =
        useState(false);

    const [showConfirm, setShowConfirm] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] =
        useState(false);

    /* ================================================= */
    /* PASSWORD RULES */
    /* ================================================= */

    const passwordChecks = {
        length: newPassword.length >= 8,
        upper: /[A-Z]/.test(newPassword),
        lower: /[a-z]/.test(newPassword),
        number: /[0-9]/.test(newPassword),
        special: /[^A-Za-z0-9]/.test(
            newPassword
        ),
    };

    const passedChecks = Object.values(
        passwordChecks
    ).filter(Boolean).length;

    const getStrength = () => {
        if (passedChecks <= 2) return "Weak";
        if (passedChecks <= 4) return "Medium";
        return "Strong";
    };

    const strength = getStrength();

    const isMatch =
        newPassword &&
        confirmPassword &&
        newPassword === confirmPassword;

    /* ================================================= */
    /* SUBMIT */
    /* ================================================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!isMatch) {
            setError("Passwords do not match");
            return;
        }

        if (strength !== "Strong") {
            setError(
                "Password is not strong enough"
            );
            return;
        }

        setLoading(true);

        try {
            await api.post("/change-password", {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation:
                    confirmPassword,
            });

            setSuccess(true);

            setTimeout(() => {
                router.push("/dashboard");
            }, 1800);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to update password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#020617]">

            {/* ================================================= */}
            {/* BACKGROUND */}
            {/* ================================================= */}

            <div className="absolute inset-0">

                {/* MAIN GRADIENT */}
                <div
                    className="
                        absolute inset-0
                        bg-[radial-gradient(circle_at_top_left,#f59e0b22,transparent_30%),radial-gradient(circle_at_bottom_right,#ea580c22,transparent_35%),linear-gradient(to_bottom_right,#020617,#081028,#0f172a)]
                    "
                />

                {/* PARTICLES */}
                <div className="absolute inset-0 overflow-hidden">

                    {Array.from({ length: 20 }).map(
                        (_, i) => {
                            const size =
                                2 + (i % 4);

                            const left =
                                (i * 13) % 100;

                            const top =
                                (i * 17) % 100;

                            return (
                                <motion.span
                                    key={i}
                                    initial={{
                                        opacity: 0,
                                        y: 0,
                                    }}
                                    animate={{
                                        opacity: [
                                            0,
                                            0.6,
                                            0,
                                        ],
                                        y: [
                                            -20,
                                            -120,
                                        ],
                                        x: [
                                            0,
                                            i % 2 === 0
                                                ? 18
                                                : -18,
                                        ],
                                    }}
                                    transition={{
                                        duration:
                                            12 +
                                            (i % 5),
                                        repeat:
                                            Infinity,
                                        delay:
                                            i * 0.4,
                                    }}
                                    className="
                                        absolute
                                        rounded-full
                                        bg-amber-200/40
                                        blur-sm
                                    "
                                    style={{
                                        width: size,
                                        height: size,
                                        left: `${left}%`,
                                        top: `${top}%`,
                                    }}
                                />
                            );
                        }
                    )}

                </div>

                {/* GLOW ORBS */}
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                    }}
                    className="
                        absolute
                        top-[-120px]
                        left-[-120px]
                        w-[420px]
                        h-[420px]
                        rounded-full
                        bg-amber-400/20
                        blur-[120px]
                    "
                />

                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                    }}
                    className="
                        absolute
                        bottom-[-140px]
                        right-[-120px]
                        w-[460px]
                        h-[460px]
                        rounded-full
                        bg-orange-500/20
                        blur-[140px]
                    "
                />

                {/* GRID */}
                <div
                    className="
                        absolute inset-0
                        opacity-[0.05]
                        [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                        [background-size:60px_60px]
                    "
                />

                {/* SVG */}
                <svg
                    className="
                        absolute
                        inset-0
                        w-[140%]
                        h-full
                        opacity-50
                        -left-[15%]
                    "
                    viewBox="0 0 2000 800"
                    preserveAspectRatio="none"
                >
                    {PATHS.map((d, i) => (
                        <path
                            key={i}
                            d={d}
                            stroke={
                                i < 2
                                    ? "rgba(251,191,36,0.35)"
                                    : "rgba(249,115,22,0.22)"
                            }
                            strokeWidth={
                                i === 0 ? 2 : 1.5
                            }
                            fill="none"
                        />
                    ))}
                </svg>
            </div>

            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    z-10
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    px-4
                    py-4
                "
            >

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="
                        w-full
                        max-w-[1100px]
                        grid
                        md:grid-cols-2
                        rounded-[32px]
                        overflow-hidden
                        border
                        border-white/10
                        bg-white/[0.045]
                        backdrop-blur-2xl
                        shadow-[0_25px_80px_rgba(0,0,0,0.55)]
                    "
                >

                    {/* ========================================= */}
                    {/* LEFT PANEL */}
                    {/* ========================================= */}

                    <div
                        className="
                            hidden
                            md:flex
                            relative
                            flex-col
                            justify-between
                            overflow-hidden
                            p-6
                            lg:p-7
                            border-r
                            border-white/10
                            bg-white/[0.02]
                        "
                    >

                        <div
                            className="
                                absolute
                                top-0
                                right-0
                                w-[300px]
                                h-[300px]
                                bg-amber-400/10
                                blur-[100px]
                            "
                        />

                        <div className="relative z-10">

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-full
                                    bg-white/5
                                    border
                                    border-white/10
                                    text-amber-300
                                    text-sm
                                    mb-10
                                "
                            >
                                <ShieldCheck size={16} />
                                Enterprise Security
                            </div>

                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="
                                    w-24
                                    h-24
                                    object-contain
                                    mb-8
                                    drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]
                                "
                            />

                            <h1
                                className="
                                    text-3xl
                                    xl:text-4xl
                                    font-bold
                                    text-white
                                    leading-tight
                                "
                            >
                                Secure
                                <span
                                    className="
                                        block
                                        text-transparent
                                        bg-clip-text
                                        bg-gradient-to-r
                                        from-amber-300
                                        via-yellow-400
                                        to-orange-400
                                    "
                                >
                                    Your Account
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-6
                                    text-white/60
                                    text-base
                                    leading-relaxed
                                    max-w-md
                                "
                            >
                                Protect your enterprise
                                account by creating a
                                strong password that meets
                                modern security standards.
                            </p>
                        </div>

                        {/* SECURITY TIPS */}
                        <div className="space-y-4 relative z-10">

                            <SecurityItem text="Use unique passwords for every account" />
                            <SecurityItem text="Avoid personal information in passwords" />
                            <SecurityItem text="Use strong symbols and numbers" />

                        </div>
                    </div>

                    {/* ========================================= */}
                    {/* RIGHT PANEL */}
                    {/* ========================================= */}

                    <div
                        className="
                            relative
                            bg-white/[0.97]
                            p-4
                            sm:p-5
                            lg:p-6
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <div className="w-full max-w-md">

                            {/* MOBILE */}
                            <div className="md:hidden text-center mb-8">

                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="
                                        w-20
                                        h-20
                                        mx-auto
                                        mb-4
                                    "
                                />

                                <h2
                                    className="
                                        text-3xl
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Secure Account
                                </h2>
                            </div>

                            {/* SUCCESS */}
                            <AnimatePresence>

                                {success && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            scale: 0.9,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        className="
                                            mb-6
                                            rounded-2xl
                                            border
                                            border-green-200
                                            bg-green-50
                                            p-4
                                            text-center
                                        "
                                    >
                                        <CheckCircle2
                                            className="
                                                mx-auto
                                                mb-2
                                                text-green-500
                                            "
                                            size={40}
                                        />

                                        <p
                                            className="
                                                text-green-700
                                                font-semibold
                                            "
                                        >
                                            Password updated successfully
                                        </p>

                                        <p
                                            className="
                                                text-green-600
                                                text-sm
                                                mt-1
                                            "
                                        >
                                            Redirecting to dashboard...
                                        </p>
                                    </motion.div>
                                )}

                            </AnimatePresence>

                            {/* HEADER */}
                            <div className="mb-8">

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        mb-3
                                    "
                                >
                                    <div
                                        className="
                                            w-12
                                            h-12
                                            rounded-2xl
                                            bg-gradient-to-br
                                            from-amber-300
                                            to-orange-500
                                            flex
                                            items-center
                                            justify-center
                                            shadow-lg
                                        "
                                    >
                                        <LockKeyhole
                                            className="text-black"
                                            size={22}
                                        />
                                    </div>

                                    <div>
                                        <h2
                                            className="
                                                text-3xl
                                                font-bold
                                                text-slate-900
                                            "
                                        >
                                            New Password
                                        </h2>

                                        <p
                                            className="
                                                text-slate-500
                                                text-sm
                                            "
                                        >
                                            Update your credentials
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ERROR */}
                            {error && (
                                <div
                                    className="
                                        mb-5
                                        rounded-2xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        px-4
                                        py-3
                                        text-sm
                                        text-red-600
                                    "
                                >
                                    {error}
                                </div>
                            )}

                            {/* FORM */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >

                                <InputField
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    setValue={
                                        setCurrentPassword
                                    }
                                    show={showCurrent}
                                    setShow={
                                        setShowCurrent
                                    }
                                />

                                <InputField
                                    placeholder="New Password"
                                    value={newPassword}
                                    setValue={
                                        setNewPassword
                                    }
                                    show={showNew}
                                    setShow={setShowNew}
                                />

                                {/* STRENGTH */}
                                <div className="space-y-3">

                                    <div className="flex justify-between">

                                        <span className="text-sm text-slate-500">
                                            Password Strength
                                        </span>

                                        <span
                                            className={`text-sm font-semibold ${
                                                strength ===
                                                "Strong"
                                                    ? "text-green-600"
                                                    : strength ===
                                                      "Medium"
                                                    ? "text-yellow-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {strength}
                                        </span>
                                    </div>

                                    <div
                                        className="
                                            w-full
                                            h-2.5
                                            rounded-full
                                            overflow-hidden
                                            bg-slate-200
                                        "
                                    >
                                        <motion.div
                                            animate={{
                                                width:
                                                    strength ===
                                                    "Strong"
                                                        ? "100%"
                                                        : strength ===
                                                          "Medium"
                                                        ? "70%"
                                                        : "35%",
                                            }}
                                            className={`h-full ${
                                                strength ===
                                                "Strong"
                                                    ? "bg-green-500"
                                                    : strength ===
                                                      "Medium"
                                                    ? "bg-yellow-400"
                                                    : "bg-red-400"
                                            }`}
                                        />
                                    </div>

                                    <div className="grid gap-2">

                                        <Rule
                                            ok={
                                                passwordChecks.length
                                            }
                                            label="At least 8 characters"
                                        />

                                        <Rule
                                            ok={
                                                passwordChecks.upper
                                            }
                                            label="Uppercase letter"
                                        />

                                        <Rule
                                            ok={
                                                passwordChecks.lower
                                            }
                                            label="Lowercase letter"
                                        />

                                        <Rule
                                            ok={
                                                passwordChecks.number
                                            }
                                            label="Number"
                                        />

                                        <Rule
                                            ok={
                                                passwordChecks.special
                                            }
                                            label="Special character"
                                        />
                                    </div>
                                </div>

                                <InputField
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    setValue={
                                        setConfirmPassword
                                    }
                                    show={showConfirm}
                                    setShow={
                                        setShowConfirm
                                    }
                                />

                                {confirmPassword && (
                                    <p
                                        className={`text-sm ${
                                            isMatch
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {isMatch
                                            ? "Passwords match"
                                            : "Passwords do not match"}
                                    </p>
                                )}

                                {/* BUTTON */}
                                <button
                                    disabled={
                                        loading ||
                                        strength !==
                                            "Strong" ||
                                        !isMatch
                                    }
                                    className="
                                        relative
                                        overflow-hidden
                                        w-full
                                        rounded-2xl
                                        py-3.5
                                        font-semibold
                                        text-slate-900
                                        bg-gradient-to-r
                                        from-amber-300
                                        via-yellow-400
                                        to-orange-400
                                        shadow-[0_15px_35px_rgba(251,191,36,0.35)]
                                        transition-all
                                        duration-300
                                        hover:scale-[1.01]
                                        active:scale-[0.99]
                                        disabled:opacity-60
                                    "
                                >

                                    <span
                                        className="
                                            absolute
                                            inset-0
                                            -translate-x-full
                                            hover:translate-x-full
                                            transition-transform
                                            duration-1000
                                            bg-gradient-to-r
                                            from-transparent
                                            via-white/40
                                            to-transparent
                                        "
                                    />

                                    {loading
                                        ? "Updating..."
                                        : "Update Password"}
                                </button>

                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

/* ================================================= */
/* INPUT */
/* ================================================= */

function InputField({
    placeholder,
    value,
    setValue,
    show,
    setShow,
}) {
    return (
        <div className="relative">

            <input
                type={show ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={(e) =>
                    setValue(e.target.value)
                }
                className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3.5
                    pr-12
                    outline-none
                    transition-all
                    focus:border-amber-400
                    focus:ring-4
                    focus:ring-amber-100
                "
            />

            <button
                type="button"
                onClick={() => setShow(!show)}
                className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                "
            >
                {show ? (
                    <EyeOff size={18} />
                ) : (
                    <Eye size={18} />
                )}
            </button>
        </div>
    );
}

/* ================================================= */
/* RULE */
/* ================================================= */

function Rule({ ok, label }) {
    return (
        <div className="flex items-center gap-2">

            <div
                className={`
                    w-2.5
                    h-2.5
                    rounded-full
                    ${ok
                        ? "bg-green-500"
                        : "bg-slate-300"}
                `}
            />

            <span
                className={`text-sm ${
                    ok
                        ? "text-green-600"
                        : "text-slate-400"
                }`}
            >
                {label}
            </span>
        </div>
    );
}

/* ================================================= */
/* SECURITY ITEM */
/* ================================================= */

function SecurityItem({ text }) {
    return (
        <div
            className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                px-3.5
                py-2.5
            "
        >

            <div
                className="
                    w-10
                    h-10
                    rounded-xl
                    bg-gradient-to-br
                    from-amber-300
                    to-orange-500
                    flex
                    items-center
                    justify-center
                    text-black
                "
            >
                <ShieldCheck size={18} />
            </div>

            <p className="text-sm text-white/70">
                {text}
            </p>
        </div>
    );
}