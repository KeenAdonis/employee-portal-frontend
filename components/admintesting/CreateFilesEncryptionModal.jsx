"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import EmailMultiInput from "@/components/ui/EmailMultiInput";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";

import api from "@/services/api";

import {
    Eye,
    EyeOff,
    UploadCloud,
    FileText,
    Copy,
    X,
    ShieldCheck,
    Mail,
    Lock,
    AlertTriangle,
    Files,
} from "lucide-react";

/* =========================
   INITIAL STATE
========================= */
const initialForm = {
    employee_name: "",
    emails: [],
    password: "",
    password_confirmation: "",
    pdfs: [],
};

/* =========================
   FORM FIELD
========================= */
function FormField({
    label,
    required = false,
    error,
    value,
    children,
    className = "",
}) {

    const isValid =
        value &&
        value.toString().trim() !== "" &&
        !error;

    const starColor = isValid
        ? "text-green-500"
        : error
            ? "text-red-500"
            : "text-gray-400";

    return (

        <div className={`flex flex-col gap-1.5 ${className}`}>

            <label className="text-xs font-semibold tracking-wide text-gray-700 uppercase">

                {label}

                {required && (
                    <span className={`${starColor} ml-1`}>
                        *
                    </span>
                )}

            </label>

            {children}

            {error && (
                <span className="text-xs text-red-500">
                    {error}
                </span>
            )}

        </div>
    );
}

export default function CreateFilesEncryptionModal({
    open,
    onClose,
    onSuccess,
}) {

    const { showToast } = useToast();

    const [form, setForm] = useState(initialForm);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    /* =========================
       RESET
    ========================= */
    useEffect(() => {

        if (!open) {

            setForm(initialForm);

            setErrors({});
        }

    }, [open]);

    /* =========================
       HANDLE CHANGE
    ========================= */
    const handleChange = (name, value) => {

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    /* =========================
       VALIDATION
    ========================= */
    const validate = () => {

        let e = {};

        if (!form.employee_name?.trim()) {
            e.employee_name = "Employee name is required";
        }

        if (!form.emails || form.emails.length === 0) {
            e.emails = "At least one recipient email is required";
        }

        if (!form.password) {
            e.password = "Password is required";
        }

        if (!form.password_confirmation) {
            e.password_confirmation = "Password confirmation is required";
        }

        if (
            form.password &&
            form.password_confirmation &&
            form.password !== form.password_confirmation
        ) {
            e.password_confirmation = "Passwords do not match";
        }

        if (!form.pdfs || form.pdfs.length === 0) {
            e.pdfs = "At least one PDF file is required";
        }

        setErrors(e);

        return Object.keys(e).length === 0;
    };

    /* =========================
       TOTAL FILE SIZE
    ========================= */
    const totalFileSize = form.pdfs.reduce(
        (acc, file) => acc + file.size,
        0
    );

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async () => {

        if (!validate()) {

            showToast({
                title: "Validation Error",
                message: "Please complete all required fields.",
                type: "warning",
            });

            return;
        }

        try {

            setLoading(true);

            const data = new FormData();

            data.append(
                "employee_name",
                form.employee_name
            );

            data.append(
                "password",
                form.password
            );

            data.append(
                "password_confirmation",
                form.password_confirmation
            );

            form.emails.forEach((email, index) => {
                data.append(
                    `emails[${index}]`,
                    email
                );
            });

            form.pdfs.forEach((file, index) => {
                data.append(
                    `pdfs[${index}]`,
                    file
                );
            });

            const res = await api.post(
                "/secure-documents",
                data
            );

            showToast({
                title: "Success",
                message:
                    res.data.message ||
                    `Encrypted documents uploaded successfully.`,
                type: "success",
            });

            onSuccess?.();

            onClose?.();

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err?.response?.data?.message ||
                    "Failed to upload encrypted documents.",
                type: "error",
            });

        } finally {

            setLoading(false);
        }
    };

    return (

        <Modal
            open={open}
            onClose={onClose}
            title="Create Files Encryption"
            subtitle="Upload password-protected PDF documents and securely send them via email."
            maxWidth="max-w-6xl"

            footer={
                <div className="w-full flex items-center justify-between border-t pt-4">

                    {/* LEFT */}
                    <div>

                        <p className="text-xs text-gray-500">
                            Selected Files
                        </p>

                        <p className="text-2xl font-bold text-indigo-600">
                            {form.pdfs.length}
                        </p>

                        <p className="text-xs text-gray-500">
                            {(totalFileSize / 1024 / 1024).toFixed(2)} MB total
                        </p>

                    </div>

                    {/* RIGHT */}
                    <div className="flex gap-2">

                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                min-w-[180px]
                            "
                        >
                            {loading
                                ? "Encrypting & Uploading..."
                                : "Save Secure Files"}
                        </Button>

                    </div>

                </div>
            }
        >

            <div className="space-y-8">

                {/* =========================
                    INTRO NOTICE
                ========================= */}
                <section className="
                    rounded-2xl border
                    border-indigo-200
                    bg-indigo-50
                    p-5
                ">

                    <div className="flex items-start gap-4">

                        <div className="
                            w-12 h-12 rounded-2xl
                            bg-indigo-100
                            flex items-center justify-center
                            shrink-0
                        ">
                            <ShieldCheck className="w-6 h-6 text-indigo-600" />
                        </div>

                        <div>

                            <h3 className="text-sm font-semibold text-indigo-900">
                                Secure Files Encryption
                            </h3>

                            <p className="text-sm text-indigo-800 mt-1 leading-relaxed">
                                Upload PDF files securely with password encryption.
                                Recipient emails will receive encrypted files and
                                access instructions automatically.
                            </p>

                        </div>

                    </div>

                </section>

                {/* =========================
                    RECIPIENT DETAILS
                ========================= */}
                <section className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="mb-5">

                        <h2 className="text-sm font-bold text-gray-800">
                            Recipient Information
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            Configure employee details and recipient email addresses.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* EMPLOYEE NAME */}
                        <FormField
                            label="Employee Name"
                            required
                            error={errors.employee_name}
                            value={form.employee_name}
                        >

                            <Input
                                value={form.employee_name}
                                onChange={(e) =>
                                    handleChange(
                                        "employee_name",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter employee full name"
                            />

                        </FormField>

                        {/* EMAIL COUNT */}
                        <div className="
                            rounded-2xl border
                            bg-gradient-to-br
                            from-blue-50 to-indigo-50
                            p-5
                        ">

                            <div className="flex items-start gap-3">

                                <div className="
                                    w-11 h-11 rounded-2xl
                                    bg-blue-100
                                    flex items-center justify-center
                                ">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>

                                <div>

                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                        Recipient Emails
                                    </p>

                                    <p className="text-3xl font-bold text-blue-700 mt-1">
                                        {form.emails.length}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Active recipients configured
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* EMAILS */}
                    <div className="mt-5">

                        <FormField
                            label="Recipient Emails"
                            required
                            error={errors.emails}
                            value={form.emails?.length}
                        >

                            <EmailMultiInput
                                value={form.emails}
                                onChange={(value) =>
                                    handleChange(
                                        "emails",
                                        value
                                    )
                                }
                            />

                        </FormField>

                    </div>

                </section>

                {/* =========================
                    SECURITY SECTION
                ========================= */}
                <section className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="mb-5">

                        <h2 className="text-sm font-bold text-gray-800">
                            Encryption Security
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            Configure PDF password protection settings.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* PASSWORD */}
                        <FormField
                            label="Encryption Password"
                            required
                            error={errors.password}
                            value={form.password}
                        >

                            <div className="relative">

                                <Input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={form.password}
                                    onChange={(e) =>
                                        handleChange(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter secure password"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            form.password
                                        )
                                    }
                                    className="absolute right-10 top-2.5 text-gray-400"
                                >
                                    <Copy size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-2.5 text-gray-500"
                                >
                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />}
                                </button>

                            </div>

                        </FormField>

                        {/* PASSWORD STATUS */}
                        <div className="
                            rounded-2xl border
                            bg-gradient-to-br
                            from-green-50 to-emerald-50
                            p-5
                        ">

                            <div className="flex items-start gap-3">

                                <div className="
                                    w-11 h-11 rounded-2xl
                                    bg-green-100
                                    flex items-center justify-center
                                ">
                                    <Lock className="w-5 h-5 text-green-600" />
                                </div>

                                <div>

                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                        Security Status
                                    </p>

                                    <p className="text-lg font-bold text-green-700 mt-1">
                                        {form.password
                                            ? "Protected"
                                            : "No Password"}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        PDF encryption enabled
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="md:col-span-2">

                            <FormField
                                label="Confirm Password"
                                required
                                error={errors.password_confirmation}
                                value={form.password_confirmation}
                            >

                                <Input
                                    type="password"
                                    value={form.password_confirmation}
                                    onChange={(e) =>
                                        handleChange(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Confirm encryption password"
                                />

                            </FormField>

                        </div>

                    </div>

                </section>

                {/* =========================
                    FILE UPLOAD
                ========================= */}
                <section className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="mb-5">

                        <h2 className="text-sm font-bold text-gray-800">
                            PDF File Upload
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            Upload one or multiple PDF files for encryption.
                        </p>

                    </div>

                    <FormField
                        label="Upload PDF Files"
                        required
                        error={errors.pdfs}
                        value={form.pdfs?.length}
                    >

                        <div
                            className="
                                border-2 border-dashed
                                rounded-2xl p-8
                                transition
                                hover:border-indigo-400
                                bg-gray-50
                                cursor-pointer
                            "

                            onClick={() => {
                                document
                                    .getElementById("pdf-upload")
                                    ?.click();
                            }}

                            onDragOver={(e) =>
                                e.preventDefault()
                            }

                            onDrop={(e) => {

                                e.preventDefault();

                                const droppedFiles =
                                    Array.from(
                                        e.dataTransfer.files
                                    ).filter(
                                        (file) =>
                                            file.type === "application/pdf"
                                    );

                                const merged = [
                                    ...(form.pdfs || []),
                                    ...droppedFiles,
                                ];

                                const unique =
                                    merged.filter(
                                        (file, index, self) =>
                                            index ===
                                            self.findIndex(
                                                (f) =>
                                                    f.name === file.name
                                            )
                                    );

                                handleChange(
                                    "pdfs",
                                    unique
                                );
                            }}
                        >

                            {/* EMPTY */}
                            {form.pdfs.length === 0 && (

                                <div className="flex flex-col items-center justify-center text-center py-10">

                                    <UploadCloud className="w-14 h-14 text-indigo-400 mb-4" />

                                    <h3 className="text-sm font-semibold text-gray-700">
                                        Drag & Drop PDF Files
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Click to browse or drop PDF files here
                                    </p>

                                </div>
                            )}

                            {/* FILE LIST */}
                            {form.pdfs.length > 0 && (

                                <div className="space-y-3">

                                    {form.pdfs.map((file, i) => (

                                        <div
                                            key={i}
                                            className="
                                                flex items-center justify-between
                                                rounded-xl border bg-white
                                                px-4 py-3
                                            "
                                        >

                                            <div className="flex items-center gap-3 overflow-hidden">

                                                <div className="
                                                    w-10 h-10 rounded-xl
                                                    bg-red-100
                                                    flex items-center justify-center
                                                ">
                                                    <FileText className="w-5 h-5 text-red-600" />
                                                </div>

                                                <div className="overflow-hidden">

                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                        {file.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {(file.size / 1024).toFixed(1)} KB
                                                    </p>

                                                </div>

                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    const updated =
                                                        form.pdfs.filter(
                                                            (_, idx) =>
                                                                idx !== i
                                                        );

                                                    handleChange(
                                                        "pdfs",
                                                        updated
                                                    );
                                                }}
                                            >
                                                <X className="w-4 h-4 text-red-500" />
                                            </Button>

                                        </div>

                                    ))}

                                </div>

                            )}

                            <input
                                id="pdf-upload"
                                type="file"
                                multiple
                                accept="application/pdf"
                                className="hidden"

                                onChange={(e) => {

                                    const newFiles =
                                        Array.from(
                                            e.target.files
                                        );

                                    const merged = [
                                        ...(form.pdfs || []),
                                        ...newFiles,
                                    ];

                                    const unique =
                                        merged.filter(
                                            (file, index, self) =>
                                                index ===
                                                self.findIndex(
                                                    (f) =>
                                                        f.name === file.name
                                                )
                                        );

                                    handleChange(
                                        "pdfs",
                                        unique
                                    );

                                    e.target.value = null;
                                }}
                            />

                        </div>

                    </FormField>

                </section>

                {/* =========================
                    REMINDER
                ========================= */}
                <section className="
                    rounded-2xl border
                    border-amber-200
                    bg-amber-50
                    p-5
                ">

                    <div className="flex items-start gap-4">

                        <div className="
                            w-12 h-12 rounded-2xl
                            bg-amber-100
                            flex items-center justify-center
                            shrink-0
                        ">
                            <AlertTriangle className="w-6 h-6 text-amber-600" />
                        </div>

                        <div>

                            <h3 className="text-sm font-semibold text-amber-900">
                                Important Reminder
                            </h3>

                            <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                                Ensure recipient emails and encryption password
                                are accurate before submission. Uploaded PDF files
                                will be encrypted and securely distributed via email.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </Modal>
    );
}