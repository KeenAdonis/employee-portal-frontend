"use client";

import { useEffect, useMemo, useState } from "react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";

import CustomDatePicker from "@/components/ui/CustomDatePicker";
import CustomTimePicker from "@/components/ui/CustomTimePicker";

import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import { useToast } from "@/components/ui/ToastProvider";

import api from "@/services/api";

import {
    Plane,
    Car,
    CalendarClock,
    AlertCircle,
} from "lucide-react";

import {
    transportationTypeOptions,
    fuelTypeOptions,
} from "@/config/options";

/* =========================
   INITIAL STATE
========================= */
const initialForm = {
    destination: "",
    purpose: "",
    transportation_type: "",
    plate_number: "",
    fuel_consumption: "",
    fuel_type: "",
    departure_date: "",
    departure_time: "",
    return_date: "",
    return_time: "",
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
const computeDays = (
    departureDate,
    returnDate
) => {

    if (!departureDate || !returnDate) {
        return 0;
    }

    const start =
        new Date(departureDate);

    const end =
        new Date(returnDate);

    const diff =
        Math.ceil(
            (
                end - start
            ) /
            (1000 * 60 * 60 * 24)
        ) + 1;

    return diff > 0 ? diff : 0;
};

export default function CreateTravelModal({
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
       TOTAL DAYS
    ========================= */
    const totalDays = useMemo(() => {

        return computeDays(
            form.departure_date,
            form.return_date
        );

    }, [
        form.departure_date,
        form.return_date
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
       VALIDATION
    ========================= */
    const validate = () => {

        let e = {};

        if (!form.destination) { e.destination = "Destination is required"; }

        if (!form.purpose?.trim()) {
            e.purpose = "Purpose is required";
        }

        if (!form.transportation_type) {
            e.transportation_type =
                "Transportation type is required";
        }

        if (!form.departure_date) {
            e.departure_date =
                "Departure date is required";
        }

        if (!form.departure_time) {
            e.departure_time =
                "Departure time is required";
        }

        if (!form.return_date) {
            e.return_date =
                "Return date is required";
        }

        if (!form.return_time) {
            e.return_time =
                "Return time is required";
        }

        if (totalDays <= 0) {
            e.return_date =
                "Invalid travel schedule";
        }

        if (
            form.transportation_type ===
            "Personal Vehicle"
        ) {

            if (!form.plate_number) {
                e.plate_number =
                    "Plate number is required";
            }

            if (!form.fuel_type) {
                e.fuel_type =
                    "Fuel type is required";
            }

            if (
                !form.fuel_consumption
            ) {
                e.fuel_consumption =
                    "Fuel consumption is required";
            }
        }

        setErrors(e);

        return Object.keys(e)
            .length === 0;
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

            const payload = {

                destination: form.destination,
                purpose: form.purpose,
                transportation_type: form.transportation_type,
                plate_number: form.plate_number,
                fuel_consumption: form.fuel_consumption,
                fuel_type: form.fuel_type,
                departure_datetime: `${formatDateForApi(form.departure_date)} ${form.departure_time}:00`,
                return_datetime: `${formatDateForApi(form.return_date)} ${form.return_time}:00`,
            };

            await api.post("/travel/requests", payload);

            showToast({
                title: "Success",
                message:
                    "Travel request submitted successfully.",
                type: "success",
            });

            onSuccess?.();

            onClose?.();

        } catch (err) {

            showToast({
                title: "Error",
                message:
                    err.response?.data
                        ?.message
                    || "Failed to submit request.",
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
            title="Create Travel Request"
            subtitle="Submit travel itinerary for approval."
            maxWidth="max-w-5xl"

            footer={
                <div className="w-full flex items-center justify-between border-t pt-4">

                    {/* LEFT */}
                    <div>

                        <p className="text-xs text-gray-500">
                            Computed Travel Days
                        </p>

                        <p className="text-2xl font-bold text-indigo-600">
                            {totalDays} Day(s)
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
                    NOTICE
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
                                Travel Filing Process
                            </h3>

                            <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                                Submit your travel itinerary for approval.
                                Ensure all schedule and transportation details
                                are accurate before submission.
                            </p>

                        </div>

                    </div>

                </section>

                {/* =========================
                    TRAVEL DETAILS
                ========================= */}
                <section className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="mb-5">

                        <h2 className="text-sm font-bold text-gray-800">
                            Travel Details
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            Provide destination and travel information.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* DESTINATION */}
                        <FormField
                            label="Destination"
                            required
                            error={errors.destination}
                            value={form.destination}
                        >

                            <Input
                                value={
                                    form.destination
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "destination",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter destination"
                            />

                        </FormField>

                        {/* TRANSPORTATION */}
                        <FormField
                            label="Transportation Type"
                            name="TransportationType"
                            required
                            error={errors.transportation_type}
                            value={form.transportation_type}
                        >
                            <CustomSelect
                                value={form.transportation_type}
                                options={transportationTypeOptions}
                                onChange={(value) =>
                                    handleChange(
                                        "transportation_type",
                                        value
                                    )
                                }
                            />
                        </FormField>

                    </div>

                    {/* PURPOSE */}
                    <div className="mt-5">

                        <FormField
                            label="Purpose"
                            required
                            error={errors.purpose}
                            value={form.purpose}
                        >

                            <textarea
                                rows={5}
                                value={
                                    form.purpose
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "purpose",
                                        e.target.value
                                    )
                                }
                                placeholder="Explain travel purpose..."
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
                    SCHEDULE
                ========================= */}
                <section className="rounded-2xl border bg-white p-5 shadow-sm">

                    <div className="mb-5">

                        <h2 className="text-sm font-bold text-gray-800">
                            Travel Schedule
                        </h2>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* DEPARTURE DATE */}
                        <FormField
                            label="Departure Date"
                            required
                            error={
                                errors.departure_date
                            }
                            value={
                                form.departure_date
                            }
                        >

                            <CustomDatePicker
                                value={
                                    form.departure_date
                                }
                                onChange={(v) =>
                                    handleChange(
                                        "departure_date",
                                        v
                                    )
                                }
                            />

                        </FormField>

                        {/* DEPARTURE TIME */}
                        <FormField
                            label="Departure Time"
                            required
                            error={
                                errors.departure_time
                            }
                            value={
                                form.departure_time
                            }
                        >

                            <CustomTimePicker
                                value={
                                    form.departure_time
                                }
                                onChange={(v) =>
                                    handleChange(
                                        "departure_time",
                                        v
                                    )
                                }
                            />

                        </FormField>

                        {/* RETURN DATE */}
                        <FormField
                            label="Return Date"
                            required
                            error={
                                errors.return_date
                            }
                            value={
                                form.return_date
                            }
                        >

                            <CustomDatePicker
                                value={
                                    form.return_date
                                }
                                onChange={(v) =>
                                    handleChange(
                                        "return_date",
                                        v
                                    )
                                }
                            />

                        </FormField>

                        {/* RETURN TIME */}
                        <FormField
                            label="Return Time"
                            required
                            error={
                                errors.return_time
                            }
                            value={
                                form.return_time
                            }
                        >

                            <CustomTimePicker
                                value={
                                    form.return_time
                                }
                                onChange={(v) =>
                                    handleChange(
                                        "return_time",
                                        v
                                    )
                                }
                            />

                        </FormField>

                    </div>

                </section>

                {/* =========================
                    PERSONAL VEHICLE
                ========================= */}
                {form.transportation_type ===
                    "Personal Vehicle" && (

                        <section className="rounded-2xl border bg-white p-5 shadow-sm">

                            <div className="mb-5">

                                <h2 className="text-sm font-bold text-gray-800">
                                    Vehicle Information
                                </h2>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                                <FormField
                                    label="Plate Number"
                                    required
                                    error={
                                        errors.plate_number
                                    }
                                    value={
                                        form.plate_number
                                    }
                                >

                                    <Input
                                        value={
                                            form.plate_number
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "plate_number",
                                                e.target.value
                                            )
                                        }
                                    />

                                </FormField>

                                <FormField
                                    label="Fuel Type"
                                    name="FuelType"
                                    required
                                    error={errors.fuel_type}
                                    value={form.fuel_type}
                                >
                                    <CustomSelect
                                        value={form.fuel_type}
                                        options={fuelTypeOptions}
                                        onChange={(value) =>
                                            handleChange(
                                                "fuel_type",
                                                value
                                            )
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Fuel Consumption"
                                    required
                                    error={
                                        errors.fuel_consumption
                                    }
                                    value={
                                        form.fuel_consumption
                                    }
                                >

                                    <Input
                                        type="number"
                                        value={
                                            form.fuel_consumption
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "fuel_consumption",
                                                e.target.value
                                            )
                                        }
                                    />

                                </FormField>

                            </div>

                        </section>

                    )}

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
                                Ensure all travel information is accurate before submission.
                                Approved travel requests may require
                                liquidation and supporting documents.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </Modal>
    );
}