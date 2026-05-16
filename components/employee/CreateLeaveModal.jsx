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
    FileText,
    Upload,
    AlertTriangle,
    BriefcaseBusiness,
} from "lucide-react";

import {
    leaveTypeOptions,
    durationOptions,
} from "@/config/options";

/* =========================
   INITIAL FORM
========================= */
const initialForm = {
    DateFrom: "",
    DateTo: "",
    LeaveType: "",
    LeaveDuration: "Whole Day",
    Reason: "",
    Attachment: null,
};

/* =========================
   DATE FORMATTER
========================= */
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
   COMPUTE DAYS
========================= */
const computeTotalDays = (
    from,
    to,
    duration
) => {

    if (!from || !to) return 0;

    const start = new Date(from);

    const end = new Date(to);

    const diff =
        Math.ceil(
            (
                end - start
            ) /
            (
                1000 * 60 * 60 * 24
            )
        ) + 1;

    if (diff <= 0) return 0;

    if (
        duration === "Half Day AM" ||
        duration === "Half Day PM"
    ) {
        return 0.5;
    }

    return diff;
};

/* =========================
   BALANCE FIELD MAP
========================= */
const leaveBalanceMap = {
    "Vacation Leave": "VLBalance",
    "Sick Leave": "SLBalance",
    "Emergency Leave": "ELBalance",
    "Maternity Leave": "MLBalance",
    "Paternity Leave": "PLBalance",
    "Bereavement Leave": "BLBalance",
    "Birthday Leave": "BDLBalance",
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

            <label className="
                text-xs font-semibold
                tracking-wide uppercase
                text-gray-700
            ">

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

export default function CreateLeaveModal({
    open,
    onClose,
    onSuccess,
}) {

    const { showToast } = useToast();

    const [form, setForm] = useState(initialForm);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const [credits, setCredits] = useState(null);

    /* =========================
       RESET
    ========================= */
    useEffect(() => {

        if (!open) {

            setForm(initialForm);

            setErrors({});

            return;
        }

        fetchCredits();

    }, [open]);

    /* =========================
       FETCH CREDITS
    ========================= */
    const fetchCredits = async () => {

        try {

            const res = await api.get(
                "/leave-credits/me"
            );

            setCredits(
                res.data.data
            );

        } catch (err) {

            console.error(err);
        }
    };

    /* =========================
       TOTAL DAYS
    ========================= */
    const totalDays = useMemo(() => {

        return computeTotalDays(
            form.DateFrom,
            form.DateTo,
            form.LeaveDuration
        );

    }, [
        form.DateFrom,
        form.DateTo,
        form.LeaveDuration,
    ]);

    /* =========================
       BALANCE
    ========================= */
    const balanceInfo = useMemo(() => {

        if (
            !credits ||
            !form.LeaveType
        ) {
            return null;
        }

        const field =
            leaveBalanceMap[
            form.LeaveType
            ];

        if (!field) {

            return {
                available: "Unlimited",
                remaining: "Unlimited",
                isOther: true,
                isEnough: true,
            };
        }

        const available =
            Number(
                credits[field] || 0
            );

        const remaining =
            available - totalDays;

        return {
            available,
            remaining,
            isOther: false,
            isEnough:
                remaining >= 0,
        };

    }, [
        credits,
        form.LeaveType,
        totalDays,
    ]);

    /* =========================
       HANDLE CHANGE
    ========================= */
    const handleChange = (
        name,
        value
    ) => {

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
       FILE CHANGE
    ========================= */
    const handleFileChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;

        const allowed = [
            "application/pdf",
            "image/png",
            "image/jpeg",
            "image/jpg",
        ];

        if (
            !allowed.includes(file.type)
        ) {

            showToast({
                title: "Invalid File",
                message:
                    "Only PDF, JPG, JPEG, and PNG files are allowed.",
                type: "warning",
            });

            return;
        }

        if (
            file.size >
            2 * 1024 * 1024
        ) {

            showToast({
                title: "File Too Large",
                message:
                    "Maximum file size is 2MB.",
                type: "warning",
            });

            return;
        }

        handleChange(
            "Attachment",
            file
        );
    };

    /* =========================
       VALIDATION
    ========================= */
    const validate = () => {

        let e = {};

        if (!form.LeaveType) {
            e.LeaveType =
                "Leave type is required";
        }

        if (!form.DateFrom) {
            e.DateFrom =
                "Date from is required";
        }

        if (!form.DateTo) {
            e.DateTo =
                "Date to is required";
        }

        if (!form.LeaveDuration) {
            e.LeaveDuration =
                "Leave duration is required";
        }

        if (
            !form.Reason?.trim()
        ) {
            e.Reason =
                "Reason is required";
        }

        if (
            totalDays <= 0
        ) {
            e.DateTo =
                "Invalid leave duration";
        }

        if (
            balanceInfo &&
            !balanceInfo.isEnough
        ) {
            e.LeaveType =
                "Insufficient leave balance";
        }

        /* =========================
   VACATION LEAVE POLICY
========================= */
        if (
            form.LeaveType === "Vacation Leave"
        ) {

            const today = new Date();

            today.setHours(0, 0, 0, 0);

            const from = new Date(
                form.DateFrom
            );

            from.setHours(0, 0, 0, 0);

            let requiredLeadDays = 0;

            if (
                totalDays >= 1 &&
                totalDays <= 2
            ) {
                requiredLeadDays = 2;
            } else if (
                totalDays >= 3 &&
                totalDays <= 5
            ) {
                requiredLeadDays = 4;
            } else if (
                totalDays >= 6 &&
                totalDays <= 7
            ) {
                requiredLeadDays = 6;
            } else if (
                totalDays >= 8 &&
                totalDays <= 10
            ) {
                requiredLeadDays = 9;
            }

            if (requiredLeadDays > 0) {

                const minimumDate =
                    new Date(today);

                minimumDate.setDate(
                    minimumDate.getDate() +
                    requiredLeadDays
                );

                if (from < minimumDate) {

                    e.DateFrom =
                        `Vacation Leave for ${Number(totalDays).toFixed(1)} day(s) must be filed at least ${requiredLeadDays} day(s) in advance.`;
                }
            }
        }

        /* =========================
           SICK LEAVE POLICY
        ========================= */
        if (
            form.LeaveType === "Sick Leave"
        ) {

            if (!form.Attachment) {

                e.Attachment =
                    totalDays >= 2
                        ? "Medical Certificate is required."
                        : "Excuse Letter is required.";
            }
        }

        setErrors(e);

        return (
            Object.keys(e).length === 0
        );
    };

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async () => {

        if (!validate()) {

            showToast({
                title:
                    "Validation Error",
                message:
                    "Please complete all required fields.",
                type: "warning",
            });

            return;
        }

        try {

            setLoading(true);

            const payload =
                new FormData();

            payload.append(
                "DateFrom",
                formatDateForApi(
                    form.DateFrom
                )
            );

            payload.append(
                "DateTo",
                formatDateForApi(
                    form.DateTo
                )
            );

            payload.append(
                "TotalDays",
                totalDays
            );

            payload.append(
                "LeaveType",
                form.LeaveType
            );

            payload.append(
                "LeaveDuration",
                form.LeaveDuration
            );

            payload.append(
                "Reason",
                form.Reason
            );

            if (
                form.Attachment
            ) {

                payload.append(
                    "Attachment",
                    form.Attachment
                );
            }

            await api.post(
                "/leave",
                payload,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            showToast({
                title: "Success",
                message:
                    "Leave request submitted successfully.",
                type: "success",
            });

            onSuccess?.();

            onClose?.();

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err.response?.data
                        ?.message ||
                    "Failed to submit leave request.",
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
            title="Create Leave Request"
            subtitle="Submit leave application for HR review."
            maxWidth="max-w-5xl"

            footer={
                <div className="
                    w-full flex items-center
                    justify-between border-t
                    pt-4
                ">

                    {/* LEFT */}
                    <div>

                        <p className="
                            text-xs text-gray-500
                        ">
                            Computed Leave Days
                        </p>

                        <p className="
                            text-2xl font-bold
                            text-indigo-600
                        ">
                            {totalDays}
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
                            onClick={
                                handleSubmit
                            }
                            disabled={
                                loading ||
                                (
                                    balanceInfo &&
                                    !balanceInfo.isEnough
                                )
                            }
                            className="
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                min-w-[160px]
                            "
                        >
                            {
                                loading
                                    ? "Submitting..."
                                    : balanceInfo &&
                                        !balanceInfo.isEnough
                                        ? "Insufficient Balance"
                                        : "Submit Leave"
                            }
                        </Button>

                    </div>

                </div>
            }
        >

            <div className="space-y-8">

                {/* =========================
                    INTRO
                ========================= */}
                <section className="
                    rounded-2xl border
                    border-blue-200
                    bg-blue-50 p-3
                ">

                    <div className="
                        flex items-start gap-4
                    ">

                        <div className="
                            w-12 h-12 rounded-2xl
                            bg-blue-100
                            flex items-center
                            justify-center
                            shrink-0
                        ">

                            <CalendarDays className="
                                w-6 h-6
                                text-blue-600
                            " />

                        </div>

                        <div>

                            <h3 className="
                                text-sm font-semibold
                                text-blue-900
                            ">
                                Leave Filing Process
                            </h3>

                            <p className="
                                text-sm text-blue-800
                                mt-1 leading-relaxed
                            ">
                                Submit your leave request for
                                HR approval. Ensure dates and
                                supporting documents are accurate
                                before submission.
                            </p>

                        </div>

                    </div>

                </section>

                <section className="
                            rounded-2xl border
                            border-amber-200
                            bg-amber-50
                            p-3
                        ">

                    <div className="
                                flex items-start gap-4
                            ">

                        <div className="
                                    w-12 h-12 rounded-2xl
                                    bg-amber-100
                                    flex items-center
                                    justify-center
                                    shrink-0
                                ">

                            <AlertTriangle className="
                                        w-6 h-6
                                        text-amber-600
                                    " />

                        </div>

                        <div>

                            <h3 className="
                                        text-sm font-semibold
                                        text-amber-900
                                    ">
                                Important Reminder
                            </h3>

                            <p className="
                                        text-sm text-amber-800
                                        mt-1 leading-relaxed
                                    ">
                                Leave requests are subject
                                to HR approval and leave
                                balance validation.
                            </p>

                        </div>

                    </div>

                </section>

                {/* =========================
                    MAIN GRID
                ========================= */}
                <div className="
                        grid grid-cols-1
                        xl:grid-cols-[2fr_1fr]
                        gap-6
                    ">

                    {/* =========================
                        LEFT
                    ========================= */}
                    <div className="
                        space-y-6
                    ">

                        {/* DETAILS */}
                        <section className="
                            rounded-2xl border
                            bg-white p-5 shadow-sm
                        ">

                            <div className="mb-5">

                                <h2 className="
                                    text-sm font-bold
                                    text-gray-800
                                ">
                                    Leave Information
                                </h2>

                                <p className="
                                    text-xs text-gray-500
                                    mt-1
                                ">
                                    Provide leave details and
                                    schedule.
                                </p>

                            </div>

                            <div className="
                                grid grid-cols-1
                                md:grid-cols-2
                                gap-5
                            ">

                                <FormField
                                    label="Leave Type"
                                    name="LeaveType"
                                    required
                                    error={errors.LeaveType}
                                    value={form.LeaveType}
                                >
                                    <CustomSelect
                                        value={form.LeaveType}
                                        options={leaveTypeOptions}
                                        onChange={(value) => handleChange("LeaveType", value)}
                                    />
                                </FormField>




                                {/* DURATION */}
                                <FormField
                                    label="Leave Duration"
                                    name="LeaveType"
                                    required
                                    error={errors.LeaveDuration}
                                    value={form.LeaveDuration}
                                >
                                    <CustomSelect
                                        value={form.LeaveDuration}
                                        options={durationOptions}
                                        onChange={(value) => handleChange("LeaveDuration", value)}
                                    />
                                </FormField>




                                {/* DATE FROM */}
                                <FormField
                                    label="Date From"
                                    required
                                    error={
                                        errors.DateFrom
                                    }
                                    value={
                                        form.DateFrom
                                    }
                                >

                                    <CustomDatePicker
                                        value={
                                            form.DateFrom
                                        }
                                        onChange={(value) =>
                                            handleChange(
                                                "DateFrom",
                                                value
                                            )
                                        }
                                    />

                                </FormField>

                                {/* DATE TO */}
                                <FormField
                                    label="Date To"
                                    required
                                    error={
                                        errors.DateTo
                                    }
                                    value={
                                        form.DateTo
                                    }
                                >

                                    <CustomDatePicker
                                        value={
                                            form.DateTo
                                        }
                                        onChange={(value) =>
                                            handleChange(
                                                "DateTo",
                                                value
                                            )
                                        }
                                        minDate={
                                            form.DateFrom
                                        }
                                    />

                                </FormField>

                            </div>

                            {/* REASON */}
                            <div className="mt-5">

                                <FormField
                                    label="Reason"
                                    required
                                    error={
                                        errors.Reason
                                    }
                                    value={
                                        form.Reason
                                    }
                                >

                                    <textarea
                                        rows={5}
                                        value={
                                            form.Reason
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "Reason",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Explain the purpose of your leave request..."
                                        className="
                                            w-full rounded-xl
                                            border border-gray-300
                                            bg-white px-4 py-3
                                            text-sm outline-none
                                            resize-none
                                            focus:ring-2
                                            focus:ring-indigo-500
                                        "
                                    />

                                </FormField>

                            </div>

                        </section>

                        {/* ATTACHMENT */}
                        <section className="
                            rounded-2xl border
                            bg-white p-5 shadow-sm
                        ">

                            <div className="mb-5">

                                <h2 className="
                                    text-sm font-bold
                                    text-gray-800
                                ">
                                    Attachment
                                </h2>

                                <p className="
                                    text-xs text-gray-500
                                    mt-1
                                ">
                                    Upload supporting documents
                                    if applicable.
                                </p>

                            </div>

                            <label className="
                                border-2 border-dashed
                                rounded-2xl
                                p-8 bg-gray-50
                                hover:bg-gray-100
                                transition
                                flex flex-col
                                items-center
                                justify-center
                                text-center
                                cursor-pointer
                            ">

                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={
                                        handleFileChange
                                    }
                                />

                                <Upload className="
                                    w-10 h-10
                                    text-gray-400
                                    mb-3
                                " />

                                <p className="
                                    text-sm font-medium
                                    text-gray-700
                                ">
                                    Click to upload attachment
                                </p>

                                <p className="
                                    text-xs text-gray-500
                                    mt-1
                                ">
                                    PDF, JPG, JPEG, PNG
                                    (Max 2MB)
                                </p>

                            </label>

                            {form.Attachment && (

                                <div className="
                                    mt-4 border rounded-xl
                                    bg-indigo-50
                                    p-4 flex items-center
                                    gap-3
                                ">

                                    <FileText className="
                                        w-5 h-5
                                        text-indigo-600
                                    " />

                                    <div>

                                        <p className="
                                            text-sm font-medium
                                            text-gray-900
                                        ">
                                            {
                                                form.Attachment.name
                                            }
                                        </p>

                                        <p className="
                                            text-xs text-gray-500
                                        ">
                                            Attachment ready
                                            for upload
                                        </p>

                                    </div>

                                </div>
                            )}

                            {errors.Attachment && (

                                <div className="
                                    mb-4 rounded-xl
                                    border border-red-200
                                    bg-red-50 p-3
                                ">

                                    <p className="
                                        text-sm text-red-600
                                    ">
                                        {errors.Attachment}
                                    </p>

                                </div>
                            )}

                        </section>

                    </div>

                    {/* =========================
                        RIGHT
                    ========================= */}
                    {/* =========================
    RIGHT
========================= */}
                    <div className="space-y-6">

                        {/* SUMMARY */}
                        <section className="
        rounded-2xl border
        bg-white p-5 shadow-sm
    ">

                            <div className="
            flex items-center gap-3
            mb-5
        ">

                                <div className="
                w-12 h-12 rounded-2xl
                bg-indigo-100
                flex items-center
                justify-center
            ">

                                    <BriefcaseBusiness className="
                    w-6 h-6
                    text-indigo-600
                " />

                                </div>

                                <div>

                                    <h3 className="
                    text-sm font-semibold
                    text-gray-900
                ">
                                        Leave Summary
                                    </h3>

                                    <p className="
                    text-xs text-gray-500
                ">
                                        Computed leave details
                                    </p>

                                </div>

                            </div>

                            <div className="
            space-y-4 text-sm
        ">

                                <div className="
                flex justify-between
            ">

                                    <span className="
                    text-gray-500
                ">
                                        Leave Type
                                    </span>

                                    <span className="
                    font-medium text-gray-900
                ">
                                        {form.LeaveType || "Not Selected"}
                                    </span>

                                </div>

                                <div className="
                flex justify-between
            ">

                                    <span className="
                    text-gray-500
                ">
                                        Duration
                                    </span>

                                    <span className="
                    font-medium text-gray-900
                ">
                                        {form.LeaveDuration}
                                    </span>

                                </div>

                                <div className="
                flex justify-between
            ">

                                    <span className="
                    text-gray-500
                ">
                                        Total Days
                                    </span>

                                    <span className="
                    font-bold text-indigo-600
                ">
                                        {totalDays}
                                    </span>

                                </div>

                            </div>

                        </section>

                        {/* BALANCE */}
                        {balanceInfo && !balanceInfo.isOther && (

                            <section className={`
            rounded-2xl border p-5 shadow-sm
            ${balanceInfo.isEnough
                                    ? "border-green-200 bg-green-50"
                                    : "border-red-200 bg-red-50"
                                }
        `}>

                                <div className="mb-4">

                                    <h3 className="
                    text-sm font-semibold
                    text-gray-900
                ">
                                        Leave Balance
                                    </h3>

                                    <p className="
                    text-xs text-gray-500 mt-1
                ">
                                        Available leave credits summary
                                    </p>

                                </div>

                                <div className="space-y-4">

                                    <div className="
                    flex items-center justify-between
                    text-sm
                ">

                                        <span className="text-gray-600">
                                            Available Balance
                                        </span>

                                        <span className="
                        font-bold text-gray-900
                    ">
                                            {balanceInfo.available} day(s)
                                        </span>

                                    </div>

                                    <div className="
                    flex items-center justify-between
                    text-sm
                ">

                                        <span className="text-gray-600">
                                            Requested
                                        </span>

                                        <span className="
                        font-medium text-gray-900
                    ">
                                            {totalDays} day(s)
                                        </span>

                                    </div>

                                    <div className="
                    flex items-center justify-between
                    text-sm
                ">

                                        <span className="text-gray-600">
                                            Remaining
                                        </span>

                                        <span className={`
                        font-bold
                        ${balanceInfo.remaining < 0
                                                ? "text-red-600"
                                                : "text-green-700"
                                            }
                    `}>
                                            {balanceInfo.remaining} day(s)
                                        </span>

                                    </div>

                                    {!balanceInfo.isEnough && (

                                        <div className="
                        rounded-xl
                        bg-red-100
                        border border-red-200
                        px-3 py-3
                        text-sm text-red-700
                        font-medium
                    ">

                                            Not enough leave balance.
                                            Only {balanceInfo.available} day(s)
                                            available.

                                        </div>
                                    )}

                                </div>

                            </section>
                        )}

                    </div>

                </div>

            </div >

        </Modal >
    );
}