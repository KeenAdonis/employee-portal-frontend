"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import api from "@/services/api";

import {
    Plus,
    X,
    UploadCloud,
    FileText,
    Paperclip,
} from "lucide-react";

/* =========================
   OPTIONS
========================= */
const typeOptions = [
    { label: "Cash Advance", value: "Cash Advance" },
    { label: "Request for Payment", value: "Request for Payment" },
    { label: "Petty Cash", value: "Petty Cash" },
    { label: "Reimbursement", value: "Reimbursement" },
];

/* =========================
   INITIAL STATE
========================= */
const initialForm = {
    Type: "",
    StartDateNeeded: "",
    EndDateNeeded: "",
    Remarks: "",
    particulars: [{ Particulars: "", Amount: "" }],
    attachments: [],
};

const formatDateForApi = (date) => {

    if (!date) return "";

    const d = new Date(date);

    const year = d.getFullYear();

    const month = String(
        d.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        d.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        <div className="flex flex-col gap-1.5">
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

export default function CreateRequisitionModal({
    open,
    onClose,
    onSuccess,
}) {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();

    /* ================= RESET ================= */
    useEffect(() => {
        if (!open) {
            setForm(initialForm);
            setErrors({});
        }
    }, [open]);

    /* =========================
   DATE HELPERS
========================= */

    const isWeekend = (date) => {
        const day = new Date(date).getDay();

        return day === 0 || day === 6;
    };

    const getMinDate = (type) => {
        let date = new Date();

        date.setHours(0, 0, 0, 0);

        if (
            type === "Cash Advance" ||
            type === "Request for Payment"
        ) {
            date.setDate(date.getDate() + 3);
        }

        while (isWeekend(date)) {
            date.setDate(date.getDate() + 1);
        }

        return date;
    };

    /* =========================
       MIN DATE
    ========================= */

    const minDate = useMemo(() => {
        return getMinDate(form.Type);
    }, [form.Type]);



    /* ================= TOTAL ================= */
    const totalAmount = useMemo(() => {
        return form.particulars.reduce((sum, item) => {
            return sum + Number(item.Amount || 0);
        }, 0);
    }, [form.particulars]);

    /* ================= HANDLE CHANGE ================= */
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

    /* ================= PARTICULARS ================= */
    const handleParticularChange = (
        index,
        field,
        value
    ) => {
        const updated = [...form.particulars];

        updated[index][field] = value;

        setForm({
            ...form,
            particulars: updated,
        });

        setErrors((prev) => ({
            ...prev,
            [`${field}_${index}`]: "",
        }));
    };

    const addParticular = () => {
        setForm((prev) => ({
            ...prev,
            particulars: [
                ...prev.particulars,
                {
                    Particulars: "",
                    Amount: "",
                },
            ],
        }));
    };

    const removeParticular = (index) => {
        if (form.particulars.length === 1) return;

        setForm({
            ...form,
            particulars: form.particulars.filter(
                (_, i) => i !== index
            ),
        });
    };

    /* ================= FILE HANDLING ================= */
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        setForm((prev) => ({
            ...prev,
            attachments: [
                ...prev.attachments,
                ...files,
            ],
        }));
    };

    const removeFile = (index) => {
        setForm({
            ...form,
            attachments: form.attachments.filter(
                (_, i) => i !== index
            ),
        });
    };

    /* ================= VALIDATION ================= */
    const validate = () => {
        let e = {};

        if (!form.Type)
            e.Type = "Request type is required";

        if (!form.StartDateNeeded)
            e.StartDateNeeded =
                "Start date is required";

        if (!form.EndDateNeeded)
            e.EndDateNeeded =
                "End date is required";

        /* =========================
           DATE RULES
        ========================= */

        if (
            form.Type === "Cash Advance" ||
            form.Type === "Request for Payment"
        ) {

            const start = new Date(form.StartDateNeeded);
            const min = getMinDate(form.Type);

            /* REMOVE TIME */
            start.setHours(0, 0, 0, 0);
            min.setHours(0, 0, 0, 0);

            if (start < min) {
                e.StartDateNeeded =
                    "Must be filed at least 3 days ahead";
            }}

            /* =========================
               WEEKEND VALIDATION
            ========================= */

            if (
                form.StartDateNeeded &&
                isWeekend(form.StartDateNeeded)
            ) {
                e.StartDateNeeded =
                    "Weekend requests are not allowed";
            }

            if (
                form.EndDateNeeded &&
                isWeekend(form.EndDateNeeded)
            ) {
                e.EndDateNeeded =
                    "Weekend requests are not allowed";
            }

            /* =========================
               ATTACHMENT REQUIRED
            ========================= */

            if (
                form.Type === "Request for Payment" &&
                form.attachments.length === 0
            ) {
                e.Attachments =
                    "Attachment is required for Request for Payment";
            }

            /* =========================
               PETTY CASH LIMIT
            ========================= */

            if (
                form.Type === "Petty Cash" &&
                totalAmount > 1000
            ) {
                e.TotalAmount =
                    "Petty Cash request cannot exceed ₱1,000";
            }

            form.particulars.forEach((p, i) => {
                if (!p.Particulars)
                    e[`Particulars_${i}`] =
                        "Particular is required";

                if (!p.Amount)
                    e[`Amount_${i}`] =
                        "Amount is required";
            });

            setErrors(e);

            return Object.keys(e).length === 0;
        };

        /* ================= SUBMIT ================= */
        const handleSubmit = async () => {
            if (!validate()) {
                showToast({
                    title: "Validation Error",
                    message:
                        "Please complete all required fields.",
                    type: "warning",
                });

                return;
            }

            try {
                setLoading(true);

                const formData = new FormData();

                formData.append("Type", form.Type);

                formData.append(
                    "StartDateNeeded",
                    formatDateForApi(form.StartDateNeeded)
                );

                formData.append(
                    "EndDateNeeded",
                    formatDateForApi(form.EndDateNeeded)
                );

                formData.append(
                    "Remarks",
                    form.Remarks
                );

                form.particulars.forEach((p, i) => {
                    formData.append(
                        `particulars[${i}][Particulars]`,
                        p.Particulars
                    );

                    formData.append(
                        `particulars[${i}][Amount]`,
                        p.Amount
                    );
                });

                form.attachments.forEach((file) => {
                    formData.append(
                        "attachments[]",
                        file
                    );
                });

                await api.post(
                    "/requisition",
                    formData
                );

                showToast({
                    title: "Success",
                    message:
                        "Request submitted successfully.",
                    type: "success",
                });

                onSuccess();
                onClose();

            } catch (err) {
                showToast({
                    title: "Error",
                    message:
                        err.response?.data?.message ||
                        "Failed to submit request.",
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
                title="Create Requisition"
                subtitle="Submit a new financial request."
                maxWidth="max-w-5xl"
                footer={
                    <div className="flex items-center justify-between w-full border-t pt-4">

                        <div>
                            {errors.TotalAmount && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.TotalAmount}
                                </p>
                            )}

                            <p className="text-lg font-bold text-indigo-600">
                                ₱
                                {totalAmount.toLocaleString()}
                            </p>
                        </div>

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
                                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Request"}
                            </Button>
                        </div>
                    </div>
                }
            >
                <div className="space-y-8">

                    {/* ================= REQUEST INFO ================= */}
                    <section className="rounded-2xl border bg-white p-5 shadow-sm">

                        <div className="mb-5">
                            <h2 className="text-sm font-bold text-gray-800">
                                Request Information
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                Provide the basic details
                                of your request.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

                            <FormField
                                label="Request Type"
                                required
                                error={errors.Type}
                                value={form.Type}
                            >
                                <CustomSelect
                                    value={form.Type}
                                    options={typeOptions}
                                    onChange={(v) =>
                                        handleChange(
                                            "Type",
                                            v
                                        )
                                    }
                                />
                            </FormField>

                            {form.Type && (
                                <div className="md:col-span-2">

                                    {(
                                        form.Type === "Cash Advance" ||
                                        form.Type === "Request for Payment"
                                    ) && (
                                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                                                <p className="text-sm font-medium text-amber-800">
                                                    This request type must be filed
                                                    at least 3 days in advance.
                                                </p>
                                            </div>
                                        )}

                                    {form.Type === "Petty Cash" && (
                                        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                                            <p className="text-sm font-medium text-blue-800">
                                                Petty Cash requests are limited
                                                to ₱1,000 maximum total amount.
                                            </p>
                                        </div>
                                    )}

                                </div>
                            )}



                            <FormField
                                label="Start Date"
                                required
                                error={
                                    errors.StartDateNeeded
                                }
                                value={
                                    form.StartDateNeeded
                                }
                            >
                                <CustomDatePicker
                                    value={form.StartDateNeeded}
                                    minDate={minDate}
                                    disabledDates={(date) =>
                                        isWeekend(date)
                                    }
                                    onChange={(v) =>
                                        handleChange(
                                            "StartDateNeeded",
                                            v
                                        )
                                    }
                                />
                            </FormField>

                            <FormField
                                label="End Date"
                                required
                                error={
                                    errors.EndDateNeeded
                                }
                                value={
                                    form.EndDateNeeded
                                }
                            >
                                <CustomDatePicker
                                    value={form.EndDateNeeded}
                                    minDate={
                                        form.StartDateNeeded
                                            ? new Date(form.StartDateNeeded)
                                            : minDate
                                    }
                                    disabledDates={(date) =>
                                        isWeekend(date)
                                    }
                                    onChange={(v) =>
                                        handleChange(
                                            "EndDateNeeded",
                                            v
                                        )
                                    }
                                />
                            </FormField>

                        </div>
                    </section>

                    {/* ================= PARTICULARS ================= */}
                    <section className="rounded-2xl border bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between mb-5">

                            <div>
                                <h2 className="text-sm font-bold text-gray-800">
                                    Particulars
                                </h2>

                                <p className="text-xs text-gray-500 mt-1">
                                    Add request items and
                                    corresponding amounts.
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addParticular}
                                className="gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Item
                            </Button>
                        </div>

                        <div className="space-y-4">

                            {form.particulars.map((p, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-4 items-start border rounded-xl p-4 bg-gray-50/60"
                                >

                                    <FormField
                                        label="Particular"
                                        required
                                        error={
                                            errors[
                                            `Particulars_${i}`
                                            ]
                                        }
                                        value={
                                            p.Particulars
                                        }
                                    >
                                        <Input
                                            placeholder="Enter particulars"
                                            value={
                                                p.Particulars
                                            }
                                            onChange={(e) =>
                                                handleParticularChange(
                                                    i,
                                                    "Particulars",
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />
                                    </FormField>

                                    <FormField
                                        label="Amount"
                                        required
                                        error={
                                            errors[
                                            `Amount_${i}`
                                            ]
                                        }
                                        value={p.Amount}
                                    >
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={p.Amount}
                                            onChange={(e) =>
                                                handleParticularChange(
                                                    i,
                                                    "Amount",
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />
                                    </FormField>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeParticular(i)
                                        }
                                        className="w-10 h-10 mt-6 rounded-xl border bg-white hover:bg-red-50 text-red-500 flex items-center justify-center transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                </div>
                            ))}

                        </div>
                    </section>

                    {/* ================= REMARKS ================= */}
                    <section className="rounded-2xl border bg-white p-5 shadow-sm">

                        <div className="mb-5">
                            <h2 className="text-sm font-bold text-gray-800">
                                Remarks
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                Add supporting explanation
                                or request notes.
                            </p>
                        </div>

                        <textarea
                            rows={5}
                            value={form.Remarks}
                            onChange={(e) =>
                                handleChange(
                                    "Remarks",
                                    e.target.value
                                )
                            }
                            placeholder="Enter remarks here..."
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />

                    </section>

                    {/* ================= ATTACHMENTS ================= */}
                    <section className="rounded-2xl border bg-white p-5 shadow-sm">

                        <div className="mb-5">
                            <h2 className="text-sm font-bold text-gray-800">
                                Attachments
                            </h2>

                            <div className="space-y-2 mt-1">

                                <p className="text-xs text-gray-500">
                                    Upload supporting documents
                                    such as receipts, quotations,
                                    or invoices.
                                </p>

                                {form.Type === "Request for Payment" && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                                        <p className="text-xs font-medium text-red-700">
                                            Attachment is required for
                                            Request for Payment requests.
                                        </p>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Upload Box */}
                        <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl px-6 py-10 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">

                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
                                <UploadCloud className="w-7 h-7 text-indigo-600" />
                            </div>

                            <p className="text-sm font-semibold text-gray-700">
                                Click to upload files
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                Supports PDF, JPG, PNG, DOCX
                            </p>

                        </label>

                        {errors.Attachments && (
                            <p className="text-sm text-red-500 mt-2">
                                {errors.Attachments}
                            </p>
                        )}

                        {/* Attachment List */}
                        {form.attachments.length > 0 && (
                            <div className="mt-5 space-y-3">

                                {form.attachments.map(
                                    (file, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between border rounded-xl px-4 py-3 bg-gray-50"
                                        >

                                            <div className="flex items-center gap-3 overflow-hidden">

                                                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                                                    <FileText className="w-5 h-5 text-indigo-600" />
                                                </div>

                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                        {
                                                            file.name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {formatFileSize(
                                                            file.size
                                                        )}
                                                    </p>
                                                </div>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFile(i)
                                                }
                                                className="w-9 h-9 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </section>

                </div>
            </Modal>
        );
    }