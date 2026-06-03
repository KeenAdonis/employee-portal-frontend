"use client";

import { useEffect, useMemo, useState } from "react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/ToastProvider";

import api from "@/services/api";

import {
    Plus,
    Trash2,
    ClipboardList,
    CheckCircle2,
    AlertTriangle,
    TimerReset,
} from "lucide-react";

/* =========================
   CATEGORY OPTIONS
========================= */
const categoryOptions = [
    {
        label: "Backlog",
        value: "Backlog",
    },
    {
        label: "Rush",
        value: "Rush",
    },
    {
        label: "Urgent",
        value: "Urgent",
    },
    {
        label: "Production Support",
        value: "Production Support",
    },
    {
        label: "Client Request",
        value: "Client Request",
    },
    {
        label: "Bug Fix",
        value: "Bug Fix",
    },
];

/* =========================
   STATUS OPTIONS
========================= */
const statusOptions = [
    {
        label: "Pending",
        value: "Pending",
    },
    {
        label: "Ongoing",
        value: "Ongoing",
    },
    {
        label: "Done",
        value: "Done",
    },
];

/* =========================
   INITIAL FORM
========================= */
const getInitialForm = () => ({
    accomplishments: [
        {
            Task: "",
            Category: "",
            TaskStatus: "Pending",
        },
    ],
});

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

export default function AddAccomplishmentModal({
    open,
    onClose,
    onSuccess,
    overtime,
}) {

    const { showToast } = useToast();

    const [form, setForm] = useState(getInitialForm());

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    /* =========================
       RESET
    ========================= */
    useEffect(() => {

        if (open) {

            setForm(getInitialForm());

            setErrors({});
        }

    }, [open, overtime?.id]);

    /* =========================
       EXISTING COUNT
    ========================= */
    const totalTasks = useMemo(() => {

        return form.accomplishments.length;

    }, [form.accomplishments]);

    /* =========================
       HANDLE CHANGE
    ========================= */
    const handleAccomplishmentChange = (
        index,
        field,
        value
    ) => {

        const updated = [...form.accomplishments];

        updated[index][field] = value;

        setForm((prev) => ({
            ...prev,
            accomplishments: updated,
        }));

        setErrors((prev) => ({
            ...prev,
            [`${field}_${index}`]: "",
        }));
    };

    /* =========================
       ADD TASK
    ========================= */
    const addAccomplishment = () => {

        setForm((prev) => ({
            ...prev,
            accomplishments: [
                ...prev.accomplishments,
                {
                    Task: "",
                    Category: "",
                    TaskStatus: "Pending",
                },
            ],
        }));
    };

    /* =========================
       REMOVE TASK
    ========================= */
    const removeAccomplishment = (index) => {

        if (form.accomplishments.length === 1) return;

        setForm((prev) => ({
            ...prev,
            accomplishments:
                prev.accomplishments.filter(
                    (_, i) => i !== index
                ),
        }));
    };

    /* =========================
       VALIDATION
    ========================= */
    const validate = () => {

        let e = {};

        form.accomplishments.forEach(
            (item, index) => {

                if (!item.Task?.trim()) {

                    e[`Task_${index}`] =
                        "Task is required";
                }

                if (!item.Category) {

                    e[`Category_${index}`] =
                        "Category is required";
                }

                if (!item.TaskStatus) {

                    e[`TaskStatus_${index}`] =
                        "Status is required";
                }
            }
        );

        setErrors(e);

        return Object.keys(e).length === 0;
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

            await api.post(
                `/overtime/${overtime.id}/accomplishments`,
                {
                    accomplishments:
                        form.accomplishments,
                }
            );

            showToast({
                title: "Success",
                message:
                    "Accomplishments submitted successfully.",
                type: "success",
            });

            onSuccess?.();

            onClose?.();

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err.response?.data?.message ||
                    "Failed to submit accomplishments.",
                type: "error",
            });

        } finally {

            setLoading(false);
        }
    };

    /* =========================
       INVALID STATE
    ========================= */
    if (!overtime) return null;

    return (

        <Modal
            open={open}
            onClose={onClose}
            title="Add Accomplishments"
            subtitle="Submit completed overtime tasks and deliverables."
            maxWidth="max-w-5xl"

            footer={
                <div className="w-full flex items-center justify-between border-t pt-4">

                    {/* LEFT */}
                    <div>

                        <p className="text-xs text-gray-500">
                            Total Tasks
                        </p>

                        <p className="text-xl font-bold text-indigo-600">
                            {totalTasks}
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
                                min-w-[170px]
                            "
                        >
                            {loading
                                ? "Submitting..."
                                : "Submit Accomplishments"}
                        </Button>

                    </div>

                </div>
            }
        >

            <div className="space-y-8">

                {/* =========================
                    OVERTIME SUMMARY
                ========================= */}
                <section className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="flex items-start justify-between gap-5">

                        {/* LEFT */}
                        <div className="flex items-start gap-4">

                            <div className="
                                w-14 h-14 rounded-2xl
                                bg-indigo-100
                                flex items-center justify-center
                                shrink-0
                            ">
                                <ClipboardList className="w-7 h-7 text-indigo-600" />
                            </div>

                            <div>

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Overtime Accomplishments
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Add the completed tasks and outputs
                                    accomplished during your approved overtime.
                                </p>

                            </div>

                        </div>


                    </div>

                    {/* INFO GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                        {/* DATE */}
                        <div className="
                            rounded-2xl border
                            bg-gray-50
                            px-4 py-4
                        ">

                            <p className="text-xs text-gray-500 uppercase font-medium">
                                Overtime Date
                            </p>

                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                {overtime.OvertimeDate}
                            </p>

                        </div>

                        {/* HOURS */}
                        <div className="
                            rounded-2xl border
                            bg-gray-50
                            px-4 py-4
                        ">

                            <p className="text-xs text-gray-500 uppercase font-medium">
                                Total Hours
                            </p>

                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                {overtime.TotalHours} hrs
                            </p>

                        </div>

                        {/* STATUS */}
                        <div className="
                            rounded-2xl border
                            bg-gray-50
                            px-4 py-4
                        ">

                            <p className="text-xs text-gray-500 uppercase font-medium">
                                Approval Status
                            </p>

                            <div className="mt-2">
                                <StatusBadge
                                    status={overtime.Status}
                                />
                            </div>

                        </div>

                    </div>

                </section>

                {/* =========================
                    PRE-APPROVED NOTICE
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
                            <TimerReset className="w-6 h-6 text-blue-600" />
                        </div>

                        <div>

                            <h3 className="text-sm font-semibold text-blue-900">
                                Pre-Approved Overtime
                            </h3>

                            <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                                This overtime request has been pre-approved by HR.
                                You may now submit completed accomplishments and
                                task outputs performed during overtime hours.
                            </p>

                        </div>

                    </div>

                </section>

                {/* =========================
                    TASKS
                ========================= */}
                <section className="rounded-2xl border bg-white p-5 shadow-sm">

                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-6">

                        <div>

                            <h2 className="text-sm font-bold text-gray-800">
                                Accomplishment Items
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                Add completed overtime deliverables and work items.
                            </p>

                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={addAccomplishment}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Task
                        </Button>

                    </div>

                    {/* TASK LIST */}
                    <div className="space-y-5">

                        {form.accomplishments.map(
                            (item, index) => (

                                <div
                                    key={index}
                                    className="
                                        rounded-2xl border
                                        bg-gray-50/70
                                        p-5
                                        space-y-5
                                    "
                                >

                                    {/* TOP */}
                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-3">

                                            <div className="
                                                w-11 h-11 rounded-2xl
                                                bg-indigo-100
                                                flex items-center justify-center
                                            ">
                                                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                            </div>

                                            <div>

                                                <p className="text-sm font-semibold text-gray-800">
                                                    Task #{index + 1}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    Overtime accomplishment entry
                                                </p>

                                            </div>

                                        </div>

                                        {form.accomplishments.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeAccomplishment(index)
                                                }
                                                className="
                                                    w-10 h-10 rounded-xl
                                                    border bg-white
                                                    hover:bg-red-50
                                                    text-red-500
                                                    flex items-center justify-center
                                                    transition
                                                "
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}

                                    </div>

                                    {/* FIELDS */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                                        {/* TASK */}
                                        <FormField
                                            label="Specific Task"
                                            required
                                            error={
                                                errors[`Task_${index}`]
                                            }
                                            value={item.Task}
                                        >

                                            <Input
                                                placeholder="Ex. Fixed payroll computation bug"
                                                value={item.Task}
                                                onChange={(e) =>
                                                    handleAccomplishmentChange(
                                                        index,
                                                        "Task",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </FormField>

                                        {/* CATEGORY */}
                                        <FormField
                                            label="Category"
                                            required
                                            error={
                                                errors[`Category_${index}`]
                                            }
                                            value={item.Category}
                                        >

                                            <CustomSelect
                                                value={item.Category}
                                                options={categoryOptions}
                                                onChange={(value) =>
                                                    handleAccomplishmentChange(
                                                        index,
                                                        "Category",
                                                        value
                                                    )
                                                }
                                            />

                                        </FormField>

                                        {/* STATUS */}
                                        <FormField
                                            label="Task Status"
                                            required
                                            error={
                                                errors[`TaskStatus_${index}`]
                                            }
                                            value={item.TaskStatus}
                                        >

                                            <CustomSelect
                                                value={item.TaskStatus}
                                                options={statusOptions}
                                                onChange={(value) =>
                                                    handleAccomplishmentChange(
                                                        index,
                                                        "TaskStatus",
                                                        value
                                                    )
                                                }
                                            />

                                        </FormField>

                                    </div>

                                </div>
                            )
                        )}

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
                            <AlertTriangle className="w-6 h-6 text-amber-600" />
                        </div>

                        <div>

                            <h3 className="text-sm font-semibold text-amber-900">
                                Submission Reminder
                            </h3>

                            <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                                Ensure all accomplishments are accurate before submission.
                                Submitted accomplishments may be reviewed during
                                final overtime approval.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </Modal>
    );
}