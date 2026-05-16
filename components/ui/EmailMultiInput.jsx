"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

/* =========================
   UTIL
========================= */
function getInitials(name = "") {
    return name
        .split("@")[0]
        .slice(0, 2)
        .toUpperCase();
}

export default function EmailMultiInput({ value = [], onChange }) {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    /* =========================
       LOAD SAVED EMAILS
    ========================= */
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("emails") || "[]");
        setSuggestions(stored);
    }, []);

    /* =========================
       SAVE EMAIL (for future suggestion)
    ========================= */
    const saveEmail = (email) => {
        let stored = JSON.parse(localStorage.getItem("emails") || "[]");

        if (!stored.includes(email)) {
            stored.unshift(email);
            localStorage.setItem("emails", JSON.stringify(stored.slice(0, 5)));
        }
    };

    /* =========================
       ADD EMAIL
    ========================= */
    const addEmail = (email) => {
        const cleaned = email.trim().toLowerCase();
        if (!cleaned) return;

        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned);
        if (!isValid) return;

        if (!value.includes(cleaned)) {
            onChange([...value, cleaned]);
            saveEmail(cleaned); // 🔥 save for suggestion
        }
    };

    /* =========================
       REMOVE EMAIL
    ========================= */
    const removeEmail = (email) => {
        onChange(value.filter((e) => e !== email));
    };

    /* =========================
       KEY HANDLER
    ========================= */
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addEmail(input);
            setInput("");
        }

        if (e.key === "Backspace" && !input && value.length > 0) {
            removeEmail(value[value.length - 1]);
        }
    };

    /* =========================
       PASTE SUPPORT
    ========================= */
    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text");
        const emails = pasted.split(/[,;\s]+/);
        emails.forEach(addEmail);
        e.preventDefault();
    };

    /* =========================
       CLOSE DROPDOWN
    ========================= */
    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest(".email-wrapper")) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative email-wrapper">

            {/* INPUT CONTAINER */}
            <div className="w-full border rounded-xl p-2 flex flex-wrap gap-2 bg-white focus-within:ring-2 focus-within:ring-indigo-500">

                {/* CHIPS */}
                {value.map((email, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                        <span>{email}</span>
                        <button
                            type="button"
                            onClick={() => removeEmail(email)}
                            className="text-gray-400 hover:text-red-500"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                {/* INPUT */}
                <input
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onBlur={() => {
                        if (input) {
                            addEmail(input);
                            setInput("");
                        }
                    }}
                    placeholder="Enter email..."
                    className="flex-1 min-w-[160px] outline-none text-sm px-1 py-1"
                />
            </div>

            {/* 🔥 SUGGESTIONS DROPDOWN */}
            {showSuggestions && input && (
                <div className="absolute z-50 bg-white border rounded-xl mt-1 w-full shadow">

                    {suggestions
                        .filter((e) =>
                            e.toLowerCase().includes(input.toLowerCase())
                        )
                        .map((email, i) => (
                            <div
                                key={i}
                                onMouseDown={() => {
                                    addEmail(email);
                                    setInput("");
                                    setShowSuggestions(false);
                                }}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold">
                                    {getInitials(email)}
                                </div>

                                <span className="text-sm">{email}</span>
                            </div>
                        ))}

                    {suggestions.length === 0 && (
                        <div className="px-3 py-2 text-xs text-gray-400">
                            No suggestions
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}