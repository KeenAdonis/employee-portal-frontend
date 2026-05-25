"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Eye,
    EyeOff,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const PATHS = [
    "M-200,400 C300,200 900,600 2000,300",
    "M-200,470 C400,280 1000,650 2000,360",
    "M-200,540 C450,330 1050,730 2000,430",
    "M-200,610 C550,400 1200,760 2000,500",
];

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [loginType, setLoginType] =
        useState("employee");

    const [employeeNo, setEmployeeNo] =
        useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] = useState("");

    const [quotes, setQuotes] = useState([]);

    const [currentQuote, setCurrentQuote] =
        useState(0);

    const [reducedMotion, setReducedMotion] =
        useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        setReducedMotion(mediaQuery.matches);
    }, []);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const res = await fetch("/api/quotes");
                const data = await res.json();

                setQuotes(data);
            } catch {
                setQuotes([
                    {
                        text: "Excellence is built through consistency.",
                    },
                    {
                        text: "Precision drives enterprise success.",
                    },
                    {
                        text: "Leadership begins with discipline.",
                    },
                ]);
            }
        };

        fetchQuotes();
    }, []);

    useEffect(() => {
        if (quotes.length === 0) return;

        const interval = setInterval(() => {
            setCurrentQuote((prev) => {
                return (prev + 1) % quotes.length;
            });
        }, 6000);

        return () => clearInterval(interval);
    }, [quotes]);

    const quote = useMemo(() => {
        return quotes[currentQuote];
    }, [quotes, currentQuote]);

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const res = await login({
                type: loginType,
                email,
                password,
                employee_no:
                    loginType === "employee"
                        ? employeeNo
                        : null,
            });

            if (res.force_change_password) {
                router.push("/change-password");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Invalid credentials"
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

                {/* GLOW ORBS */}
                <motion.div
                    animate={
                        reducedMotion
                            ? {}
                            : {
                                  x: [0, 30, 0],
                                  y: [0, -20, 0],
                              }
                    }
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
                    animate={
                        reducedMotion
                            ? {}
                            : {
                                  x: [0, -40, 0],
                                  y: [0, 20, 0],
                              }
                    }
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

                {/* SVG LINES */}
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
                    md:py-6
                    overflow-hidden
                "
            >
                <motion.div
                    initial={{
                        opacity: 0,
                        y: reducedMotion ? 0 : 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                    className="
                        w-full
                        max-w-5xl
                        xl:max-w-6xl
                        grid
                        md:grid-cols-2
                        rounded-[32px]
                        overflow-hidden
                        border
                        border-white/10
                        bg-white/[0.04]
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
                            p-8
                            lg:p-10
                            border-r
                            border-white/10
                            bg-white/[0.02]
                        "
                    >

                        {/* GOLD GLOW */}
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
                                Enterprise Employee Portal
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
                                    text-4xl
                                    xl:text-5xl
                                    font-bold
                                    text-white
                                    leading-tight
                                "
                            >
                                Workforce
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
                                    Management
                                </span>
                                Platform
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
                                Secure enterprise-grade portal
                                for employee management,
                                payroll, requisitions,
                                approvals, and operations.
                            </p>
                        </div>

                        {/* QUOTES */}
                        <div className="relative z-10">

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-amber-300
                                    mb-4
                                "
                            >
                                <Sparkles size={16} />
                                <span className="text-sm">
                                    Leadership Insight
                                </span>
                            </div>

                            <AnimatePresence mode="wait">

                                {quote && (
                                    <motion.div
                                        key={currentQuote}
                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -10,
                                        }}
                                    >
                                        <p
                                            className="
                                                text-2xl
                                                text-white
                                                font-medium
                                                leading-relaxed
                                            "
                                        >
                                            “{quote.text}”
                                        </p>
                                    </motion.div>
                                )}

                            </AnimatePresence>

                            <div
                                className="
                                    mt-10
                                    text-sm
                                    text-white/40
                                "
                            >
                                Employee Portal ©{" "}
                                {new Date().getFullYear()}
                            </div>
                        </div>
                    </div>

                    {/* ========================================= */}
                    {/* RIGHT PANEL */}
                    {/* ========================================= */}

                    <div
                        className="
                            relative
                            bg-white/[0.97]
                            p-5
                            sm:p-6
                            lg:p-8
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <div className="w-full max-w-md">

                            {/* MOBILE LOGO */}
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
                                    Welcome Back
                                </h2>
                            </div>

                            {/* HEADER */}
                            <div className="mb-8">

                                <h2
                                    className="
                                        text-3xl
                                        lg:text-4xl
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    Sign In
                                </h2>

                                <p
                                    className="
                                        mt-2
                                        text-slate-500
                                    "
                                >
                                    Access your enterprise
                                    workspace securely.
                                </p>
                            </div>

                            {/* SWITCH */}
                            <div
                                className="
                                    relative
                                    flex
                                    mb-6
                                    p-1
                                    rounded-2xl
                                    bg-slate-100
                                "
                            >

                                <div
                                    className={`
                                        absolute
                                        top-1
                                        bottom-1
                                        w-1/2
                                        rounded-xl
                                        bg-gradient-to-r
                                        from-amber-400
                                        to-orange-400
                                        shadow-lg
                                        transition-all
                                        duration-300
                                        ${
                                            loginType ===
                                            "employee"
                                                ? "left-1"
                                                : "left-[calc(50%-4px)]"
                                        }
                                    `}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setLoginType(
                                            "employee"
                                        )
                                    }
                                    className={`
                                        relative
                                        z-10
                                        flex-1
                                        py-3
                                        text-sm
                                        font-semibold
                                        transition-colors
                                        ${
                                            loginType ===
                                            "employee"
                                                ? "text-slate-900"
                                                : "text-slate-500"
                                        }
                                    `}
                                >
                                    Employee
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setLoginType(
                                            "admin"
                                        )
                                    }
                                    className={`
                                        relative
                                        z-10
                                        flex-1
                                        py-3
                                        text-sm
                                        font-semibold
                                        transition-colors
                                        ${
                                            loginType ===
                                            "admin"
                                                ? "text-slate-900"
                                                : "text-slate-500"
                                        }
                                    `}
                                >
                                    Admin
                                </button>
                            </div>

                            {/* FORM */}
                            <form
                                onSubmit={handleLogin}
                                className="space-y-5"
                            >

                                {error && (
                                    <div
                                        className="
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

                                {loginType ===
                                    "employee" && (
                                    <input
                                        type="text"
                                        placeholder="Employee Number"
                                        value={
                                            employeeNo
                                        }
                                        onChange={(e) =>
                                            setEmployeeNo(
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-white
                                            px-4
                                            py-4
                                            outline-none
                                            transition-all
                                            focus:border-amber-400
                                            focus:ring-4
                                            focus:ring-amber-100
                                        "
                                    />
                                )}

                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        px-4
                                        py-4
                                        outline-none
                                        transition-all
                                        focus:border-amber-400
                                        focus:ring-4
                                        focus:ring-amber-100
                                    "
                                />

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Password"
                                        value={
                                            password
                                        }
                                        onChange={(e) =>
                                            setPassword(
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-white
                                            px-4
                                            py-4
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
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-slate-400
                                        "
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                size={18}
                                            />
                                        ) : (
                                            <Eye
                                                size={18}
                                            />
                                        )}
                                    </button>
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        text-sm
                                    "
                                >
                                    <label
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-slate-600
                                        "
                                    >
                                        <input type="checkbox" />
                                        Remember me
                                    </label>

                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        relative
                                        overflow-hidden
                                        w-full
                                        rounded-2xl
                                        py-4
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
                                        disabled:opacity-70
                                    "
                                >
                                    {loading
                                        ? "Signing In..."
                                        : "Sign In"}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}