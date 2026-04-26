"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import api from "@/services/api";

import {
    genderOptions,
    departmentOptions,
    positionOptions,
} from "@/config/options";
import { SendHorizonal } from "lucide-react";

/* =========================
   INITIAL FORM
========================= */
const initialForm = {
    EmployeeNo: "",
    FirstName: "",
    MiddleInitial: "",
    LastName: "",
    HomeAddress: "",
    Birthday: "",
    Gender: "",
    CivilStatus: "",
    ContactNumber: "",
    EmailAddress: "",
    DateHired: "",
    Department: "",
    CompanyStatus: "",
    Position: "",
    JobLevel: "",
    MonthlySalary: "",
};

/* =========================
   FORM FIELD
========================= */
function FormField({ label, required = false, error, value, children }) {
    const isValid = value && value.toString().trim() !== "" && !error;

    const starColor = isValid
        ? "text-green-500"
        : error
            ? "text-red-500"
            : "text-gray-400";

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
                {label}
                {required && (
                    <span className={`${starColor} ml-1 font-bold`}>
                        *
                    </span>
                )}
            </label>

            {children}

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}

export default function EditEmployeeModal({
    open,
    onClose,
    onSuccess,
    employee,
}) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const { showToast } = useToast();

    /* =========================
       LOAD DATA
    ========================= */
    useEffect(() => {
        if (open && employee) {
            setForm({
                ...initialForm,
                ...employee,
            });
            setErrors({});
            setSubmitted(false);
        }
    }, [open, employee]);

    /* =========================
       RESET ON CLOSE
    ========================= */
    useEffect(() => {
        if (!open) {
            setForm(initialForm);
            setErrors({});
            setSubmitted(false);
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

    const formatPhone = (num) => {
        if (!num) return "";
        return num.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
    };

    /* =========================
       VALIDATION
    ========================= */
    const validate = () => {
        let newErrors = {};

        if (!form.FirstName?.trim()) newErrors.FirstName = "Required";
        if (!form.LastName?.trim()) newErrors.LastName = "Required";

        if (!form.EmailAddress?.trim()) {
            newErrors.EmailAddress = "Required";
        } else if (!/\S+@\S+\.\S+/.test(form.EmailAddress)) {
            newErrors.EmailAddress = "Invalid email";
        }

        if (!form.ContactNumber?.trim()) {
            newErrors.ContactNumber = "Required";
        } else if (!/^\d{10,15}$/.test(form.ContactNumber.replace(/\s/g, ""))) {
            newErrors.ContactNumber = "Invalid number";
        }

        if (form.MonthlySalary && Number(form.MonthlySalary) < 0) {
            newErrors.MonthlySalary = "Invalid amount";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isFormValid = () => {
        return (
            form.FirstName &&
            form.LastName &&
            form.EmailAddress &&
            form.ContactNumber &&
            Object.values(errors).every((e) => !e) // ✅ FIX
        );
    };

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async () => {
        setSubmitted(true);

        if (!validate()) {
            showToast({
                title: "Validation Error",
                message: "Please fill required fields correctly",
                type: "warning",
            });
            return;
        }

        try {
            setLoading(true);

            showToast({
                title: "Updating employee...",
                message: "Please wait...",
                type: "info",
            });

            await api.put(`/employees/${form.EmployeeNo}`, {
                ...form,
                ContactNumber: form.ContactNumber.replace(/\s/g, ""),
            });

            showToast({
                title: "Success",
                message: "Employee updated successfully",
                type: "success",
            });

            onSuccess();
            onClose();

        } catch (err) {
            showToast({
                title: "Error",
                message: err.response?.data?.message || "Update failed",
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
            title="Edit Employee"
            subtitle="Update employee details below."
            footer={
                <div className="flex justify-end w-full gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !isFormValid()}
                        className="
                                    bg-gradient-to-r from-amber-400 to-amber-500
                                    white
                                    font-medium
                                    px-4 py-2 rounded-lg
                                    shadow-md shadow-amber-500/30
                                    hover:from-amber-300 hover:to-amber-400
                                    hover:shadow-lg hover:shadow-amber-500/40
                                    active:scale-[0.98]
                                    transition-all duration-200
                                    "
                    >
                        {loading ? "Updating..." : "Save Changes"} <SendHorizonal/>
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">

                {/* PERSONAL */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <FormField
                            label="First Name"
                            required
                            error={submitted ? errors.FirstName : ""}
                            value={form.FirstName}
                        >
                            <Input
                                value={form.FirstName}
                                onChange={(e) =>
                                    handleChange("FirstName", e.target.value)
                                }
                            />
                        </FormField>

                        <FormField
                            label="Last Name"
                            required
                            error={submitted ? errors.LastName : ""}
                            value={form.LastName}
                        >
                            <Input
                                value={form.LastName}
                                onChange={(e) =>
                                    handleChange("LastName", e.target.value)
                                }
                            />
                        </FormField>

                        <FormField label="Birthday">
                            <CustomDatePicker
                                value={form.Birthday}
                                onChange={(v) =>
                                    handleChange("Birthday", v)
                                }
                            />
                        </FormField>

                        <FormField label="Gender">
                            <CustomSelect
                                value={form.Gender}
                                options={genderOptions}
                                onChange={(v) =>
                                    handleChange("Gender", v)
                                }
                            />
                        </FormField>

                    </div>
                </div>

                {/* CONTACT */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">
                        Contact Information
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <FormField
                            label="Email"
                            required
                            error={submitted ? errors.EmailAddress : ""}
                            value={form.EmailAddress}
                        >
                            <Input
                                value={form.EmailAddress}
                                onChange={(e) =>
                                    handleChange("EmailAddress", e.target.value)
                                }
                            />
                        </FormField>

                        <FormField
                            label="Contact"
                            required
                            error={submitted ? errors.ContactNumber : ""}
                            value={form.ContactNumber}
                        >
                            <Input
                                value={formatPhone(form.ContactNumber)}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/\D/g, ""); // numbers only
                                    handleChange("ContactNumber", raw);
                                }}
                            />
                        </FormField>

                    </div>
                </div>

                {/* JOB */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">
                        Job Information
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <FormField label="Department">
                            <CustomSelect
                                value={form.Department}
                                options={departmentOptions}
                                onChange={(v) =>
                                    handleChange("Department", v)
                                }
                            />
                        </FormField>

                        <FormField label="Position">
                            <CustomSelect
                                value={form.Position}
                                options={positionOptions}
                                onChange={(v) =>
                                    handleChange("Position", v)
                                }
                            />
                        </FormField>

                        <FormField
                            label="Monthly Salary"
                            error={submitted ? errors.MonthlySalary : ""}
                            value={form.MonthlySalary}
                        >
                            <Input
                                type="number"
                                value={form.MonthlySalary}
                                onChange={(e) =>
                                    handleChange("MonthlySalary", e.target.value)
                                }
                            />
                        </FormField>

                    </div>
                </div>

            </div>
        </Modal>
    );
}