"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import {
    Eye,
    EyeOff,
    UploadCloud,
    FileText,
    Copy,
    X
} from "lucide-react";
import api from "@/services/api";
import EmailMultiInput from "@/components/ui/EmailMultiInput";

/* =========================
   FORM FIELD (FIXED)
========================= */
function FormField({
    label,
    required,
    error,
    value,
    children,
    className = "",
}) {
    const isValid = value && value.toString().trim() !== "" && !error;

    const starColor = isValid
        ? "text-green-500"
        : error
            ? "text-red-500"
            : "text-gray-400";

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className="text-xs font-medium text-gray-700">
                {label}
                {required && (
                    <span className={`${starColor} ml-1 font-bold`}>
                        *
                    </span>
                )}
            </label>

            {children}

            {/* ✅ ALWAYS SHOW ERROR */}
            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
}

export default function UploadForm({ onSuccess }) {
    const { showToast } = useToast();

    const [form, setForm] = useState({
        employee_name: "",
        emails: [],
        password: "",
        password_confirmation: "",
        pdfs: [],
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    /* ================= HANDLE CHANGE ================= */
    const handleChange = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    /* ================= VALIDATION ================= */
    const validate = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.employee_name) newErrors.employee_name = "Required";

        if (!form.emails || form.emails.length === 0) {
            newErrors.emails = "At least one email is required";
        }

        if (!form.password) newErrors.password = "Required";

        if (!form.password_confirmation) {
            newErrors.password_confirmation = "Required";
        } else if (form.password !== form.password_confirmation) {
            newErrors.password_confirmation = "Passwords do not match";
        }

        if (!form.pdfs || form.pdfs.length === 0) {
            newErrors.pdfs = "At least one PDF is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            const data = new FormData();

            data.append("employee_name", form.employee_name);
            data.append("password", form.password);
            data.append("password_confirmation", form.password_confirmation);

            form.pdfs.forEach((file, index) => {
                data.append(`pdfs[${index}]`, file);
            });

            // MULTIPLE EMAILS
            form.emails.forEach((email, index) => {
                data.append(`emails[${index}]`, email);
            });

            // ✅ SAVE RESPONSE
            const res = await api.post("/secure-documents", data);

            // ✅ SUCCESS TOAST
            showToast({
                title: "Success",
                message:
                    res.data.message ||
                    `Batch uploaded (${res.data.documents_count || form.pdfs.length} files)`,
                type: "success",
            });

            // ✅ RESET FORM
            setForm({
                employee_name: "",
                emails: [],
                password: "",
                password_confirmation: "",
                pdfs: [],
            });

            setErrors({});

            // ✅ REFRESH TABLE/LIST
            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            console.error(error);

            showToast({
                title: "Error",
                message:
                    error?.response?.data?.message ||
                    "Upload failed",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 border rounded-2xl bg-white shadow-sm">

            <div className="grid grid-cols-3 gap-6">

                {/* LEFT */}
                <div className="col-span-2 space-y-4">

                    <FormField label="Full Name" required error={errors.employee_name} value={form.employee_name}>
                        <Input
                            value={form.employee_name}
                            onChange={(e) => handleChange("employee_name", e.target.value)}
                        />
                    </FormField>

                    <FormField
                        label="Recipient Emails"
                        required
                        error={errors.emails}
                        value={form.emails?.length}
                    >
                        <EmailMultiInput
                            value={form.emails}
                            onChange={(value) => handleChange("emails", value)}
                        />
                    </FormField>

                    <FormField label="Password" required error={errors.password} value={form.password}>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                            />

                            <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(form.password)}
                                className="absolute right-10 top-2.5 text-gray-400"
                            >
                                <Copy size={16} />
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </FormField>

                    <FormField label="Confirm Password" required error={errors.password_confirmation} value={form.password_confirmation}>
                        <Input
                            type="password"
                            value={form.password_confirmation}
                            onChange={(e) => handleChange("password_confirmation", e.target.value)}
                        />
                    </FormField>

                </div>

                {/* RIGHT */}
                <div className="col-span-1 flex">
                    <FormField
                        label="Upload PDF"
                        required
                        error={errors.pdfs}
                        value={form.pdfs?.length}
                        className="w-full"
                    >
                        <div
                            className="border-2 border-dashed rounded-xl p-6 flex-1 flex flex-col justify-center items-center relative transition hover:border-indigo-400 cursor-pointer"

                            onClick={() => {
                                if (!form.pdfs || form.pdfs.length === 0) {
                                    document.getElementById("pdf-upload").click();
                                }
                            }}

                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();

                                const droppedFiles = Array.from(e.dataTransfer.files)
                                    .filter(file => file.type === "application/pdf");

                                const merged = [...(form.pdfs || []), ...droppedFiles];

                                const unique = merged.filter(
                                    (file, index, self) =>
                                        index === self.findIndex(f => f.name === file.name)
                                );

                                handleChange("pdfs", unique);
                            }}
                        >

                            {/* EMPTY STATE */}
                            {(!form.pdfs || form.pdfs.length === 0) && (
                                <>
                                    <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">
                                        Click or drag & drop PDFs
                                    </p>
                                </>
                            )}

                            {/* FILE LIST */}
                            {form.pdfs?.length > 0 && (
                                <div className="w-full space-y-2 mt-2">
                                    {form.pdfs.map((file, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm"
                                        >
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileText className="text-indigo-600 w-4 h-4" />
                                                <span className="truncate">{file.name}</span>

                                                {/* FILE SIZE */}
                                                <span className="text-xs text-gray-400">
                                                    ({(file.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>

                                            {/* REMOVE */}
                                            <Button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 🔥 VERY IMPORTANT

                                                    const updated = form.pdfs.filter((_, idx) => idx !== i);
                                                    handleChange("pdfs", updated);
                                                }}
                                                className="text-red-500 text-xs bg-white-500 hover:underline"
                                            >
                                                <X />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* INPUT BUTTON (NO OVERLAY ISSUE) */}
                            <input
                                type="file"
                                accept="application/pdf"
                                multiple
                                className="hidden"
                                id="pdf-upload"
                                onChange={(e) => {
                                    const newFiles = Array.from(e.target.files);

                                    const merged = [...(form.pdfs || []), ...newFiles];

                                    const unique = merged.filter(
                                        (file, index, self) =>
                                            index === self.findIndex(f => f.name === file.name)
                                    );

                                    handleChange("pdfs", unique);
                                    e.target.value = null;
                                }}
                            />

                        </div>
                    </FormField>
                </div>

            </div>

            <div className="flex justify-end mt-6">
                <Button disabled={loading}>
                    {loading ? "Uploading..." : "Save Document"}
                </Button>
            </div>

        </form>
    );
}