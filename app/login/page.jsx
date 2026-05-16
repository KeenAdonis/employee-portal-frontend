"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

/* ✅ Static paths (no animation) */
const PATHS = [
  "M-200,400 C300,200 900,600 2000,300",
  "M-200,450 C350,250 950,650 2000,350",
  "M-200,520 C450,300 1000,700 2000,400",
  "M-200,580 C500,350 1100,750 2000,450",
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [loginType, setLoginType] = useState("employee");
  const [employeeNo, setEmployeeNo] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(0);

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
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
          { text: "Stay consistent. Small steps matter." },
          { text: "Discipline beats motivation." },
          { text: "Focus on progress, not perfection." },
        ]);
      }
    };

    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [quotes]);

  const quote = useMemo(() => quotes[currentQuote], [quotes, currentQuote]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login({
        type: loginType,
        email,
        password,
        employee_no: loginType === "employee" ? employeeNo : null,
      });

      if (res.force_change_password) {
        router.push("/change-password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617]">

      {/* BACKGROUND */}
      <div className="absolute inset-0">

        {/* Gradient animation (light lang, ok na) */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]"
          animate={
            reducedMotion
              ? {}
              : {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
          }
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Blur blobs (optimized) */}
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-amber-400/20 blur-[80px] rounded-full top-[-120px] left-[-120px]" />
          <div className="absolute w-[400px] h-[400px] bg-pink-500/20 blur-[80px] rounded-full bottom-[-120px] right-[-120px]" />
        </div>

        {/* ✅ STATIC SVG (NO animation at all) */}
        <svg
          className="absolute inset-0 w-[120%] -left-[10%] h-full opacity-60 pointer-events-none"
          viewBox="0 0 2000 800"
          preserveAspectRatio="none"
        >
          {PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke={
                i < 2
                  ? "rgba(251,191,36,0.4)"
                  : i === 2
                    ? "rgba(236,72,153,0.25)"
                    : "rgba(59,130,246,0.2)"
              }
              strokeWidth={i === 0 ? 2 : 1.5}
              fill="none"
            />
          ))}
        </svg>
      </div>

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-center justify-center px-4">

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl"
        >

          {/* LEFT */}
          <div className="hidden lg:flex flex-col justify-between p-10 text-white">

            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-6">
                A Wise Quote
              </p>

              <AnimatePresence mode="wait">
                {quote && (
                  <motion.div
                    key={currentQuote}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-3xl font-semibold leading-tight">
                      {quote.text}
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-white/50 text-sm">
              Employee Portal © {new Date().getFullYear()}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white/95 backdrop-blur-xl p-8 flex flex-col justify-center">

            <div className="text-center mb-6">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-20 h-20 mx-auto mb-3 object-contain drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
              />
              <h2 className="text-2xl font-semibold text-gray-950">
                Welcome Back!
              </h2>
              <p className="text-sm text-gray-500">
                Enter your credentials to continue
              </p>
            </div>

            {/* SWITCH */}
            <div className="relative flex w-full mb-5 bg-[#0f172a] rounded-full p-1">
              <div
                className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-white shadow-md transition-all duration-300 ${loginType === "employee"
                    ? "left-1"
                    : "left-[calc(50%-4px)]"
                  }`}
              />

              <button
                type="button"
                onClick={() => setLoginType("employee")}
                className={`relative z-10 flex-1 py-2 text-sm font-medium ${loginType === "employee"
                    ? "text-[#0f172a]"
                    : "text-white/70"
                  }`}
              >
                Employee
              </button>

              <button
                type="button"
                onClick={() => setLoginType("admin")}
                className={`relative z-10 flex-1 py-2 text-sm font-medium ${loginType === "admin"
                    ? "text-[#0f172a]"
                    : "text-white/70"
                  }`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">

              {error && (
                <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              {loginType === "employee" && (
                <input
                  type="text"
                  placeholder="Employee No"
                  value={employeeNo}
                  onChange={(e) => setEmployeeNo(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-1 focus:ring-amber-300 focus:border-amber-300 outline-none"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-1 focus:ring-amber-300 focus:border-amber-300 outline-none"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border pr-10 focus:ring-1 focus:ring-amber-300 focus:border-amber-300 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#0f172a] font-semibold shadow-lg shadow-amber-500/30 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>

          </div>
        </motion.div>
      </div>
    </div>
  );
}