"use client";

import { useEffect, useMemo, useState } from "react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import CustomSelect from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/ToastProvider";

import api from "@/services/api";

import {
    CalendarDays,
    ClipboardList,
    AlertTriangle,
    ShieldCheck,
} from "lucide-react";

import {
    companyOptions,
} from "@/config/options";

/* =========================================
   INITIAL STATE
========================================= */
const initialForm = {
    name: "",
    description: "",
    company: "",
    start_date: "",
    end_date: "",
    is_active: true,
};

/* =========================================
   FORM FIELD
========================================= */
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

/* =========================================
   COMPONENT
========================================= */
export default function CreateSurveyBatchModal({
    open,
    onClose,
    onSuccess,
}) {

    const { showToast } = useToast();

    const [form, setForm] = useState(initialForm);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    /* =========================================
       RESET
    ========================================= */
    useEffect(() => {

        if (!open) {

            setForm(initialForm);

            setErrors({});
        }

    }, [open]);

    /* =========================================
       HANDLE CHANGE
    ========================================= */
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

    /* =========================================
       DURATION
    ========================================= */
    const durationDays = useMemo(() => {

        if (
            !form.start_date ||
            !form.end_date
        ) {
            return 0;
        }

        const start =
            new Date(form.start_date);

        const end =
            new Date(form.end_date);

        const diff =
            (end - start) /
            (1000 * 60 * 60 * 24);

        return diff >= 0
            ? diff + 1
            : 0;

    }, [
        form.start_date,
        form.end_date,
    ]);

    /* =========================================
       VALIDATION
    ========================================= */
    const validate = () => {

        let e = {};

        if (!form.name?.trim()) {
            e.name =
                "Survey name is required";
        }

        if (!form.start_date) {
            e.start_date =
                "Start date is required";
        }

        if (!form.company) {
            e.company = "Company is required";
        }

        if (!form.end_date) {
            e.end_date =
                "End date is required";
        }

        if (
            form.start_date &&
            form.end_date
        ) {

            const start =
                new Date(form.start_date);

            const end =
                new Date(form.end_date);

            if (end < start) {

                e.end_date =
                    "End date cannot be earlier than start date";
            }
        }

        setErrors(e);

        return Object.keys(e).length === 0;
    };

    /* =========================================
       FORMAT DATE
    ========================================= */
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

    /* =========================================
       SUBMIT
    ========================================= */
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
                name: form.name,
                description: form.description,
                company: form.company,
                start_date: formatDateForApi(
                    form.start_date
                ),
                end_date: formatDateForApi(
                    form.end_date
                ),
                is_active: form.is_active,
            };

            await api.post(
                "/employee-survey/batches",
                payload
            );

            showToast({
                title: "Success",
                message:
                    "Survey batch created successfully.",
                type: "success",
            });

            setForm(initialForm);

            setErrors({});

            onSuccess?.();

            onClose?.();

        } catch (err) {

            console.error(err);

            showToast({
                title: "Error",
                message:
                    err.response?.data?.message ||
                    "Failed to create survey batch.",
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
            title="Create Survey Batch"
            subtitle="Create and schedule an employee survey cycle."
            maxWidth="max-w-4xl"

            footer={
                <div className="w-full flex items-center justify-between border-t pt-4">

                    {/* LEFT */}
                    <div>

                        <p className="text-xs text-gray-500">
                            Survey Duration
                        </p>

                        <p className="text-2xl font-bold text-amber-600">
                            {durationDays} day{durationDays !== 1 ? "s" : ""}
                        </p>

                    </div>

                    {/* RIGHT */}
                    <div className="flex gap-2">

                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="
                                bg-amber-500
                                hover:bg-amber-600
                                text-white
                                min-w-[160px]
                            "
                        >
                            {loading
                                ? "Creating..."
                                : "Create Survey"}
                        </Button>

                    </div>

                </div>
            }
        >

            <div className="space-y-8">

                {/* =========================================
                    INTRO NOTICE
                ========================================= */}
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
                            <ClipboardList className="w-6 h-6 text-amber-600" />
                        </div>

                        <div>

                            <h3 className="text-sm font-semibold text-amber-900">
                                Employee Survey Batch
                            </h3>

                            <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                                Create a new employee survey cycle for performance,
                                engagement, and workplace feedback collection.
                                Employees will rank their coworkers anonymously.
                            </p>

                        </div>

                    </div>

                </section>

                {/* =========================================
                    SURVEY DETAILS
                ========================================= */}
                <section className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="mb-5">

                        <h2 className="text-sm font-bold text-gray-800">
                            Survey Details
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            Configure survey information and schedule.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* NAME */}
                        {/* NAME */}
                        <div className="md:col-span-2">

                            <FormField
                                label="Survey Name"
                                required
                                error={errors.name}
                                value={form.name}
                            >

                                <Input
                                    value={form.name}
                                    onChange={(e) =>
                                        handleChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Q2 Employee Engagement Survey"
                                />

                            </FormField>

                        </div>

                        {/* COMPANY */}
                        <div className="md:col-span-2">

                            <FormField
                                label="Company"
                                required
                                error={errors.company}
                                value={form.company}
                            >

                                <CustomSelect
                                    value={form.company}
                                    options={companyOptions}
                                    onChange={(value) =>
                                        handleChange(
                                            "company",
                                            value?.value || value
                                        )
                                    }
                                />

                            </FormField>

                        </div>

                        {/* START DATE */}
                        <FormField
                            label="Start Date"
                            required
                            error={errors.start_date}
                            value={form.start_date}
                        >

                            <CustomDatePicker
                                value={form.start_date}
                                onChange={(value) =>
                                    handleChange(
                                        "start_date",
                                        value
                                    )
                                }
                            />

                        </FormField>

                        {/* END DATE */}
                        <FormField
                            label="End Date"
                            required
                            error={errors.end_date}
                            value={form.end_date}
                        >

                            <CustomDatePicker
                                value={form.end_date}
                                onChange={(value) =>
                                    handleChange(
                                        "end_date",
                                        value
                                    )
                                }
                            />

                        </FormField>



                    </div>

                    {/* DESCRIPTION */}
                    <div className="mt-5">

                        <FormField
                            label="Description"
                            value={form.description}
                        >

                            <textarea
                                rows={5}
                                value={form.description}
                                onChange={(e) =>
                                    handleChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                placeholder="Optional survey description or instructions..."
                                className="
                                    w-full rounded-xl border border-gray-300
                                    bg-white px-4 py-3 text-sm
                                    outline-none resize-none
                                    focus:ring-2 focus:ring-amber-500
                                "
                            />

                        </FormField>

                    </div>

                </section>

                {/* =========================================
                    SETTINGS
                ========================================= */}
                <section className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="mb-5">

                        <h2 className="text-sm font-bold text-gray-800">
                            Survey Settings
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            Configure activation and participation behavior.
                        </p>

                    </div>

                    <div className="
                        flex items-center justify-between
                        border rounded-2xl p-5
                    ">

                        <div className="flex items-start gap-4">

                            <div className="
                                w-12 h-12 rounded-2xl
                                bg-green-100
                                flex items-center justify-center
                            ">
                                <ShieldCheck className="w-6 h-6 text-green-600" />
                            </div>

                            <div>

                                <h3 className="text-sm font-semibold text-gray-900">
                                    Auto Activate Survey
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Automatically make this survey active
                                    immediately after creation.
                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                handleChange(
                                    "is_active",
                                    !form.is_active
                                )
                            }
                            className={`
                                relative w-14 h-8 rounded-full transition
                                ${form.is_active
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }
                            `}
                        >

                            <div
                                className={`
                                    absolute top-1 left-1
                                    w-6 h-6 bg-white rounded-full
                                    shadow transition
                                    ${form.is_active
                                        ? "translate-x-6"
                                        : ""
                                    }
                                `}
                            />

                        </button>

                    </div>

                </section>

                {/* =========================================
                    REMINDER
                ========================================= */}
                <section className="
                    rounded-2xl border
                    border-red-200
                    bg-red-50
                    p-5
                ">

                    <div className="flex items-start gap-4">

                        <div className="
                            w-12 h-12 rounded-2xl
                            bg-red-100
                            flex items-center justify-center
                            shrink-0
                        ">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>

                        <div>

                            <h3 className="text-sm font-semibold text-red-900">
                                Important Reminder
                            </h3>

                            <p className="text-sm text-red-800 mt-1 leading-relaxed">
                                Only one employee survey batch should remain active
                                at a time. Employees can only submit once per survey cycle.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </Modal>
    );
}