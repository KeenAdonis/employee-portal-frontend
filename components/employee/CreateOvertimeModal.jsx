"use client";

import { useEffect, useMemo, useState } from "react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";

import CustomDatePicker from "@/components/ui/CustomDatePicker";
import CustomTimePicker from "@/components/ui/CustomTimePicker";

import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/ToastProvider";

import api from "@/services/api";

import {
    Clock3,
    CalendarClock,
    FileText,
    AlertCircle,
} from "lucide-react";

/* =========================
   INITIAL STATE
========================= */
const initialForm = {
    OvertimeDate: "",
    TimeFrom: "",
    TimeTo: "",
    OvertimeReason: "",
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

/* =========================
   COMPUTE HOURS
========================= */
const computeHours = (from, to) => {

    if (!from || !to) return 0;

    const start = new Date(`2000-01-01T${from}`);
    const end = new Date(`2000-01-01T${to}`);

    let diff = (end - start) / 1000 / 60 / 60;

    if (diff < 0) {
        diff += 24;
    }

    return Number(diff.toFixed(2));
};

export default function CreateOvertimeModal({
    open,
    onClose,
    onSuccess,
}) {

    const { showToast } = useToast();

    const [form, setForm] = useState(initialForm);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

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
       TOTAL HOURS
    ========================= */
    const totalHours = useMemo(() => {

        return computeHours(
            form.TimeFrom,
            form.TimeTo
        );

    }, [form.TimeFrom, form.TimeTo]);

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

        if (!form.OvertimeDate) {
            e.OvertimeDate =
                "Overtime date is required";
        }

        if (!form.TimeFrom) {
            e.TimeFrom =
                "Time from is required";
        }

        if (!form.TimeTo) {
            e.TimeTo =
                "Time to is required";
        }

        if (!form.OvertimeReason?.trim()) {
            e.OvertimeReason =
                "Reason is required";
        }

        if (
            form.TimeFrom &&
            form.TimeTo &&
            totalHours <= 0
        ) {
            e.TimeTo =
                "Invalid overtime duration";
        }

        if (totalHours > 16) {
            e.TimeTo =
                "Overtime duration is too long";
        }

        setErrors(e);

        return Object.keys(e).length === 0;
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

    /* =========================
       SUBMIT
    ========================= */
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

            const payload = {
                OvertimeDate: formatDateForApi(
                    form.OvertimeDate
                ),
                TimeFrom: form.TimeFrom,
                TimeTo: form.TimeTo,
                TotalHours: totalHours,
                OvertimeReason:
                    form.OvertimeReason,
            };

            await api.post(
                "/overtime",
                payload
            );

            showToast({
                title: "Success",
                message:
                    "Overtime request submitted successfully.",
                type: "success",
            });

            onSuccess?.();

            onClose?.();

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err.response?.data?.message ||
                    "Failed to submit overtime request.",
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
            title="Create Overtime"
            subtitle="Submit overtime request for HR pre-approval."
            maxWidth="max-w-4xl"

            footer={
                <div className="w-full flex items-center justify-between border-t pt-4">

                    {/* LEFT */}
                    <div>

                        <p className="text-xs text-gray-500">
                            Computed Overtime Hours
                        </p>

                        <p className="text-2xl font-bold text-indigo-600">
                            {totalHours.toFixed(2)} hrs
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
                                min-w-[150px]
                            "
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

                {/* =========================
                    INTRO NOTICE
                ========================= */}
                <section className="
                    rounded-2xl border
                    border-blue-200
                    bg-blue-50
                    p-5
                ">

                    <div className="flex items-start gap-4">

                        <div className="
                            w-12 h-12 rounded-2xl
                            bg-blue-100
                            flex items-center justify-center
                            shrink-0
                        ">
                            <CalendarClock className="w-6 h-6 text-blue-600" />
                        </div>

                        <div>

                            <h3 className="text-sm font-semibold text-blue-900">
                                Overtime Filing Process
                            </h3>

                            <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                                Submit your overtime request for HR review and pre-approval.
                                Accomplishments and completed tasks can only be added
                                once the request has been pre-approved.
                            </p>

                        </div>

                    </div>

                </section>

                {/* =========================
                    OVERTIME DETAILS
                ========================= */}
                <section className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="mb-5">

                        <h2 className="text-sm font-bold text-gray-800">
                            Overtime Details
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            Provide overtime schedule and justification.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* DATE */}
                        <FormField
                            label="Overtime Date"
                            required
                            error={errors.OvertimeDate}
                            value={form.OvertimeDate}
                        >

                            <CustomDatePicker
                                value={form.OvertimeDate}
                                onChange={(v) =>
                                    handleChange(
                                        "OvertimeDate",
                                        v
                                    )
                                }
                            />

                        </FormField>

                        {/* HOURS PREVIEW */}
                        <div className="
                            rounded-2xl border
                            bg-gradient-to-br
                            from-indigo-50 to-blue-50
                            p-5
                        ">

                            <div className="flex items-start gap-3">

                                <div className="
                                    w-11 h-11 rounded-2xl
                                    bg-indigo-100
                                    flex items-center justify-center
                                ">
                                    <Clock3 className="w-5 h-5 text-indigo-600" />
                                </div>

                                <div>

                                    <p className="text-xs font-medium text-gray-500 uppercase">
                                        Total Overtime Hours
                                    </p>

                                    <p className="text-3xl font-bold text-indigo-700 mt-1">
                                        {totalHours.toFixed(2)}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Automatically computed
                                        from selected time range
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* TIME FROM */}
                        <FormField
                            label="Time From"
                            required
                            error={errors.TimeFrom}
                            value={form.TimeFrom}
                        >

                            <CustomTimePicker
                                value={form.TimeFrom}
                                onChange={(value) =>
                                    handleChange("TimeFrom", value)
                                }
                            />

                        </FormField>

                        {/* TIME TO */}
                        <FormField
                            label="Time To"
                            required
                            error={errors.TimeTo}
                            value={form.TimeTo}
                        >

                            <CustomTimePicker
                                value={form.TimeTo}
                                onChange={(value) =>
                                    handleChange("TimeTo", value)
                                }
                            />

                        </FormField>

                    </div>

                    {/* REASON */}
                    <div className="mt-5">

                        <FormField
                            label="Overtime Reason"
                            required
                            error={errors.OvertimeReason}
                            value={form.OvertimeReason}
                        >

                            <textarea
                                rows={5}
                                value={
                                    form.OvertimeReason
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "OvertimeReason",
                                        e.target.value
                                    )
                                }
                                placeholder="Explain why overtime work is necessary..."
                                className="
                                    w-full rounded-xl border border-gray-300
                                    bg-white px-4 py-3 text-sm
                                    outline-none resize-none
                                    focus:ring-2 focus:ring-indigo-500
                                "
                            />

                        </FormField>

                    </div>

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
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                        </div>

                        <div>

                            <h3 className="text-sm font-semibold text-amber-900">
                                Important Reminder
                            </h3>

                            <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                                Ensure all overtime details are accurate before submission.
                                Once pre-approved, you will be required to submit
                                accomplishments and completed tasks related to this overtime request.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </Modal>
    );
}