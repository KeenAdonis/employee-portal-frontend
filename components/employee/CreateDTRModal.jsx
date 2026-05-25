"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import Modal from "@/components/ui/Modal";

import CustomDatePicker from "@/components/ui/CustomDatePicker";

import CustomTimePicker from "@/components/ui/CustomTimePicker";

import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/ToastProvider";

import api from "@/services/api";

import {
    Clock3,
    Timer,
    Coffee,
    AlertCircle,
    CalendarClock,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| INITIAL STATE
|--------------------------------------------------------------------------
*/

const initialForm = {

    date: "",

    time_in: "",

    break_out: "",

    break_in: "",

    time_out: "",

    remarks: "",
};

/*
|--------------------------------------------------------------------------
| FORM FIELD
|--------------------------------------------------------------------------
*/

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

            <label
                className="
                    text-xs
                    font-semibold
                    tracking-wide
                    text-gray-700
                    uppercase
                "
            >

                {label}

                {required && (

                    <span
                        className={`${starColor} ml-1`}
                    >
                        *
                    </span>

                )}

            </label>

            {children}

            {error && (

                <span
                    className="
                        text-xs
                        text-red-500
                    "
                >
                    {error}
                </span>

            )}

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| COMPUTE DTR
|--------------------------------------------------------------------------
*/

const computeDTR = ({
    time_in,
    break_out,
    break_in,
    time_out,
}) => {

    if (!time_in || !time_out) {

        return {

            totalWorkHours: 0,

            totalBreakHours: 0,

            overtimeHours: 0,
        };
    }

    const start =
        new Date(
            `2000-01-01T${time_in}`
        );

    const end =
        new Date(
            `2000-01-01T${time_out}`
        );

    let totalMinutes =
        (end - start) / 1000 / 60;

    if (totalMinutes < 0) {

        totalMinutes += 24 * 60;
    }

    /*
    |--------------------------------------------------------------------------
    | BREAK
    |--------------------------------------------------------------------------
    */

    let breakMinutes = 0;

    if (
        break_out &&
        break_in
    ) {

        const breakStart =
            new Date(
                `2000-01-01T${break_out}`
            );

        const breakEnd =
            new Date(
                `2000-01-01T${break_in}`
            );

        breakMinutes =
            (breakEnd - breakStart) /
            1000 /
            60;

        if (breakMinutes < 0) {

            breakMinutes +=
                24 * 60;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | COMPUTE
    |--------------------------------------------------------------------------
    */

    const netMinutes =
        totalMinutes - breakMinutes;

    const totalWorkHours =
        Number(
            (
                netMinutes / 60
            ).toFixed(2)
        );

    const totalBreakHours =
        Number(
            (
                breakMinutes / 60
            ).toFixed(2)
        );

    const overtimeHours =
        Number(
            Math.max(
                0,
                totalWorkHours - 8
            ).toFixed(2)
        );

    return {

        totalWorkHours,

        totalBreakHours,

        overtimeHours,
    };
};

export default function CreateDTRModal({
    open,
    onClose,
    onSuccess,
}) {

    const { showToast } =
        useToast();

    const [form, setForm] =
        useState(initialForm);

    const [errors, setErrors] =
        useState({});

    const [loading, setLoading] =
        useState(false);

    /*
    |--------------------------------------------------------------------------
    | RESET
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!open) {

            setForm(initialForm);

            setErrors({});
        }

    }, [open]);

    /*
    |--------------------------------------------------------------------------
    | COMPUTED VALUES
    |--------------------------------------------------------------------------
    */

    const computed =
        useMemo(() => {

            return computeDTR(form);

        }, [form]);

    /*
    |--------------------------------------------------------------------------
    | HANDLE CHANGE
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    const validate = () => {

        let e = {};

        if (!form.date) {

            e.date =
                "Date is required";
        }

        if (!form.time_in) {

            e.time_in =
                "Time in is required";
        }

        if (!form.time_out) {

            e.time_out =
                "Time out is required";
        }

        /*
        |--------------------------------------------------------------------------
        | BREAK VALIDATION
        |--------------------------------------------------------------------------
        */

        if (
            form.break_in &&
            !form.break_out
        ) {

            e.break_out =
                "Break out is required";
        }

        if (
            form.break_out &&
            !form.break_in
        ) {

            e.break_in =
                "Break in is required";
        }

        /*
        |--------------------------------------------------------------------------
        | INVALID HOURS
        |--------------------------------------------------------------------------
        */

        if (
            computed.totalWorkHours <= 0
        ) {

            e.time_out =
                "Invalid work duration";
        }

        if (
            computed.totalWorkHours > 24
        ) {

            e.time_out =
                "Work duration is too long";
        }

        setErrors(e);

        return (
            Object.keys(e).length === 0
        );
    };

    /*
    |--------------------------------------------------------------------------
    | FORMAT DATE
    |--------------------------------------------------------------------------
    */

    const formatDateForApi = (
        date
    ) => {

        if (!date) return "";

        const d =
            new Date(date);

        const year =
            d.getFullYear();

        const month =
            String(
                d.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                d.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit =
        async () => {

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

                const payload = {

                    date:
                        formatDateForApi(
                            form.date
                        ),

                    time_in:
                        form.time_in,

                    break_out:
                        form.break_out,

                    break_in:
                        form.break_in,

                    time_out:
                        form.time_out,

                    remarks:
                        form.remarks,
                };

                await api.post(
                    "/dtr",
                    payload
                );

                showToast({

                    title: "Success",

                    message:
                        "DTR submitted successfully.",

                    type: "success",
                });

                onSuccess?.();

                onClose?.();

            } catch (err) {

                showToast({

                    title: "Error",

                    message:
                        err.response?.data?.message ||
                        "Failed to submit DTR.",

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
            title="Create DTR"
            subtitle="Submit daily attendance record for HR approval."
            maxWidth="max-w-5xl"

            footer={

                <div
                    className="
                        w-full
                        flex
                        items-center
                        justify-between
                        border-t
                        pt-4
                    "
                >

                    {/* LEFT */}

                    <div>

                        <p
                            className="
                                text-xs
                                text-gray-500
                            "
                        >
                            Computed Daily Summary
                        </p>

                        <div
                            className="
                                flex
                                items-center
                                gap-4
                                mt-1
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                    "
                                >
                                    Work
                                </p>

                                <p
                                    className="
                                        text-lg
                                        font-bold
                                        text-indigo-600
                                    "
                                >
                                    {
                                        computed.totalWorkHours
                                    } hrs
                                </p>

                            </div>

                            <div>

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                    "
                                >
                                    OT
                                </p>

                                <p
                                    className="
                                        text-lg
                                        font-bold
                                        text-sky-600
                                    "
                                >
                                    {
                                        computed.overtimeHours
                                    } hrs
                                </p>

                            </div>

                        </div>

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
                                : "Submit DTR"}

                        </Button>

                    </div>

                </div>
            }
        >

            <div className="space-y-8">

                {/* NOTICE */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-blue-200
                        bg-blue-50
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-4
                        "
                    >

                        <div
                            className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-blue-100
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                        >

                            <CalendarClock
                                className="
                                    w-6
                                    h-6
                                    text-blue-600
                                "
                            />

                        </div>

                        <div>

                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    text-blue-900
                                "
                            >
                                Daily Time Record
                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-blue-800
                                    mt-1
                                    leading-relaxed
                                "
                            >
                                Submit your attendance logs including
                                work schedule and break periods for
                                HR review and payroll processing.
                            </p>

                        </div>

                    </div>

                </section>

                {/* ATTENDANCE DETAILS */}

                <section
                    className="
                        rounded-2xl
                        border
                        bg-white
                        p-5
                        shadow-sm
                    "
                >

                    <div className="mb-5">

                        <h2
                            className="
                                text-sm
                                font-bold
                                text-gray-800
                            "
                        >
                            Attendance Details
                        </h2>

                        <p
                            className="
                                text-xs
                                text-gray-500
                                mt-1
                            "
                        >
                            Provide complete daily attendance logs.
                        </p>

                    </div>

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-5
                        "
                    >

                        {/* DATE */}

                        <FormField
                            label="Date"
                            required
                            error={errors.date}
                            value={form.date}
                        >

                            <CustomDatePicker
                                value={form.date}
                                onChange={(v) =>
                                    handleChange(
                                        "date",
                                        v
                                    )
                                }
                            />

                        </FormField>

                        {/* WORK HOURS */}

                        <div
                            className="
                                rounded-2xl
                                border
                                bg-gradient-to-br
                                from-indigo-50
                                to-blue-50
                                p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        w-11
                                        h-11
                                        rounded-2xl
                                        bg-indigo-100
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <Clock3
                                        className="
                                            w-5
                                            h-5
                                            text-indigo-600
                                        "
                                    />

                                </div>

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-gray-500
                                            uppercase
                                        "
                                    >
                                        Total Work Hours
                                    </p>

                                    <p
                                        className="
                                            text-3xl
                                            font-bold
                                            text-indigo-700
                                            mt-1
                                        "
                                    >
                                        {
                                            computed.totalWorkHours
                                        }
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-gray-500
                                            mt-1
                                        "
                                    >
                                        Automatically computed
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* TIME IN */}

                        <FormField
                            label="Time In"
                            required
                            error={errors.time_in}
                            value={form.time_in}
                        >

                            <CustomTimePicker
                                value={
                                    form.time_in
                                }
                                onChange={(v) =>
                                    handleChange(
                                        "time_in",
                                        v
                                    )
                                }
                            />

                        </FormField>

                        {/* BREAK OUT */}

                        <FormField
                            label="Break Out"
                            error={errors.break_out}
                            value={form.break_out}
                        >

                            <CustomTimePicker
                                value={
                                    form.break_out
                                }
                                onChange={(v) =>
                                    handleChange(
                                        "break_out",
                                        v
                                    )
                                }
                            />

                        </FormField>

                        {/* BREAK IN */}

                        <FormField
                            label="Break In"
                            error={errors.break_in}
                            value={form.break_in}
                        >

                            <CustomTimePicker
                                value={
                                    form.break_in
                                }
                                onChange={(v) =>
                                    handleChange(
                                        "break_in",
                                        v
                                    )
                                }
                            />

                        </FormField>

                        {/* TIME OUT */}

                        <FormField
                            label="Time Out"
                            required
                            error={errors.time_out}
                            value={form.time_out}
                        >

                            <CustomTimePicker
                                value={
                                    form.time_out
                                }
                                onChange={(v) =>
                                    handleChange(
                                        "time_out",
                                        v
                                    )
                                }
                            />

                        </FormField>

                    </div>

                    {/* SUMMARY CARDS */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-3
                            gap-4
                            mt-5
                        "
                    >

                        {/* WORK */}

                        <div
                            className="
                                rounded-2xl
                                border
                                bg-indigo-50
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        w-10
                                        h-10
                                        rounded-xl
                                        bg-indigo-100
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <Clock3
                                        className="
                                            w-5
                                            h-5
                                            text-indigo-600
                                        "
                                    />

                                </div>

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            text-gray-500
                                        "
                                    >
                                        Work Hours
                                    </p>

                                    <p
                                        className="
                                            text-xl
                                            font-bold
                                            text-indigo-700
                                        "
                                    >
                                        {
                                            computed.totalWorkHours
                                        } hrs
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* BREAK */}

                        <div
                            className="
                                rounded-2xl
                                border
                                bg-amber-50
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        w-10
                                        h-10
                                        rounded-xl
                                        bg-amber-100
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <Coffee
                                        className="
                                            w-5
                                            h-5
                                            text-amber-600
                                        "
                                    />

                                </div>

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            text-gray-500
                                        "
                                    >
                                        Break Hours
                                    </p>

                                    <p
                                        className="
                                            text-xl
                                            font-bold
                                            text-amber-700
                                        "
                                    >
                                        {
                                            computed.totalBreakHours
                                        } hrs
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* OT */}

                        <div
                            className="
                                rounded-2xl
                                border
                                bg-sky-50
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        w-10
                                        h-10
                                        rounded-xl
                                        bg-sky-100
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <Timer
                                        className="
                                            w-5
                                            h-5
                                            text-sky-600
                                        "
                                    />

                                </div>

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            text-gray-500
                                        "
                                    >
                                        OT Hours
                                    </p>

                                    <p
                                        className="
                                            text-xl
                                            font-bold
                                            text-sky-700
                                        "
                                    >
                                        {
                                            computed.overtimeHours
                                        } hrs
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* REMARKS */}

                    <div className="mt-5">

                        <FormField
                            label="Remarks"
                            value={form.remarks}
                        >

                            <textarea
                                rows={4}
                                value={
                                    form.remarks
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "remarks",
                                        e.target.value
                                    )
                                }
                                placeholder="Optional remarks..."
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-gray-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    resize-none
                                    focus:ring-2
                                    focus:ring-indigo-500
                                "
                            />

                        </FormField>

                    </div>

                </section>

                {/* REMINDER */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-amber-200
                        bg-amber-50
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-4
                        "
                    >

                        <div
                            className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-amber-100
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                        >

                            <AlertCircle
                                className="
                                    w-6
                                    h-6
                                    text-amber-600
                                "
                            />

                        </div>

                        <div>

                            <h3
                                className="
                                    text-sm
                                    font-semibold
                                    text-amber-900
                                "
                            >
                                Important Reminder
                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-amber-800
                                    mt-1
                                    leading-relaxed
                                "
                            >
                                Ensure all attendance logs are accurate
                                before submission. Incorrect attendance
                                entries may affect payroll computation
                                and overtime processing.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </Modal>
    );
}