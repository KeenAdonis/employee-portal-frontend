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
    civilStatusOptions,
    companyStatusOptions,
    jobLevelOptions,
    departmentOptions,
    positionOptions,
} from "@/config/options";

/* =========================
   INITIAL STATE
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
function FormField({ label, name, required = false, error, value, children }) {

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
/* =========================
   FORMAT CONTACT NUMBER
========================= */
function formatCurrency(value) {
    if (!value) return "";

    const number = Number(value.toString().replace(/,/g, ""));
    if (isNaN(number)) return "";

    return number.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

/* =========================
   FORMAT CONTACT NUMBER
========================= */
function formatPhone(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11); // max 11 digits

    if (digits.length <= 4) return digits;
    if (digits.length <= 7)
        return `${digits.slice(0, 4)} ${digits.slice(4)}`;

    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

export default function AddEmployeeModal({ open, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const { showToast } = useToast();

    /* =========================
       RESET WHEN CLOSE
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
       HANDLE PHONE INPUT
    ========================= */
    const handlePhoneChange = (value) => {
        const formatted = formatPhone(value);
        handleChange("ContactNumber", formatted);
    };

    /* =========================
       VALIDATION
    ========================= */
    const validate = () => {
        let newErrors = {};

        if (!form.EmployeeNo) newErrors.EmployeeNo = "This field is required!";
        if (!form.FirstName) newErrors.FirstName = "This field is required!";
        if (!form.LastName) newErrors.LastName = "This field is required!";
        if (!form.Birthday) newErrors.Birthday = "This field is required!";
        if (!form.Gender) newErrors.Gender = "This field is required!";
        if (!form.CivilStatus) newErrors.CivilStatus = "This field is required!";

        if (!form.EmailAddress) newErrors.EmailAddress = "This field is required!";
        if (!form.ContactNumber) newErrors.ContactNumber = "This field is required!";
        if (!form.HomeAddress) newErrors.HomeAddress = "This field is required!";

        if (!form.Department) newErrors.Department = "This field is required!";
        if (!form.Position) newErrors.Position = "This field is required!";
        if (!form.CompanyStatus) newErrors.CompanyStatus = "This field is required!";
        if (!form.JobLevel) newErrors.JobLevel = "This field is required!";
        if (!form.DateHired) newErrors.DateHired = "This field is required!";
        if (!form.MonthlySalary) newErrors.MonthlySalary = "This field is required!";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async () => {
        if (!validate()) {
            showToast({
                title: "Validation Error",
                message: "Please fill all required fields",
                type: "warning",
            });
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/employees", {
                EmployeeNo: form.EmployeeNo,
                FirstName: form.FirstName,
                MiddleInitial: form.MiddleInitial,
                LastName: form.LastName,
                HomeAddress: form.HomeAddress,
                Birthday: form.Birthday,
                Gender: form.Gender,
                CivilStatus: form.CivilStatus,
                ContactNumber: form.ContactNumber.replace(/\s/g, ""),
                EmailAddress: form.EmailAddress,
                DateHired: form.DateHired,
                Department: form.Department,
                CompanyStatus: form.CompanyStatus,
                Position: form.Position,
                JobLevel: form.JobLevel,
                MonthlySalary: form.MonthlySalary,
            });

            const data = res.data;

            if (!data.success) {
                showToast({
                    title: "Error",
                    message: data.message,
                    type: "error",
                });
                return;
            }

            showToast({
                title: "Success",
                message: "Employee created successfully",
                type: "success",
            });

            setForm(initialForm);
            setErrors({});
            onSuccess();
            onClose();

        } catch (err) {
            showToast({
                title: "Error",
                message: err.response?.data?.message || "Something went wrong",
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
            title="Add Employee"
            subtitle="This section is creation of employee's account; temporary password will automatically send to employee's email. Make sure to filled all required fields."
            footer={
                <div className="flex justify-end w-full gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
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
                                    ">
                        {loading ? "Saving..." : "Save Employee"}
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
                            label="Employee No"
                            name="EmployeeNo"
                            required
                            error={errors.EmployeeNo}
                            value={form.EmployeeNo}
                        >
                            <Input
                                value={form.EmployeeNo}
                                onChange={(e) =>
                                    handleChange("EmployeeNo", e.target.value)
                                }
                            />
                        </FormField>

                        <FormField
                            label="First Name"
                            name="FirstName"
                            required
                            error={errors.FirstName}
                            value={form.FirstName}
                        >
                            <Input
                                value={form.FirstName}
                                onChange={(e) =>
                                    handleChange("FirstName", e.target.value)
                                }
                            />
                        </FormField>

                        <FormField label="Middle Initial">
                            <Input
                                value={form.MiddleInitial}
                                onChange={(e) =>
                                    handleChange("MiddleInitial", e.target.value)
                                }
                            />
                        </FormField>

                        <FormField
                            label="Last Name"
                            name="LastName"
                            required
                            error={errors.LastName}
                            value={form.LastName}
                        >
                            <Input
                                value={form.LastName}
                                onChange={(e) =>
                                    handleChange("LastName", e.target.value)
                                }
                            />
                        </FormField>

                        <FormField
                            label="Birthday"
                            name="Birthday"
                            required
                            error={errors.Birthday}
                            value={form.Birthday}
                        >
                            <CustomDatePicker
                                value={form.Birthday}
                                onChange={(value) => handleChange("Birthday", value)}
                            />
                        </FormField>

                        <FormField
                            label="Gender"
                            name="Gender"
                            required
                            error={errors.Gender}
                            value={form.Gender}
                        >
                            <CustomSelect
                                value={form.Gender}
                                options={genderOptions}
                                onChange={(value) => handleChange("Gender", value)}
                            />
                        </FormField>

                        <FormField
                            label="Civil Status"
                            name="CivilStatus"
                            required
                            error={errors.CivilStatus}
                            value={form.CivilStatus}
                        >
                            <CustomSelect
                                value={form.CivilStatus}
                                options={civilStatusOptions}
                                onChange={(value) =>
                                    handleChange("CivilStatus", value)
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
                            label="Email Address"
                            name="EmailAddress"
                            required
                            error={errors.EmailAddress}
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
                            label="Mobile Number"
                            name="ContactNumber"
                            required
                            error={errors.ContactNumber}
                            value={form.ContactNumber}
                        >
                            <Input
                                value={form.ContactNumber}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                            />
                        </FormField>

                        <div className="col-span-2">
                            <FormField
                                label="Home Address"
                                name="HomeAddress"
                                required
                                error={errors.HomeAddress}
                                value={form.HomeAddress}
                            >
                                <Input
                                    value={form.HomeAddress}
                                    onChange={(e) =>
                                        handleChange("HomeAddress", e.target.value)
                                    }
                                />
                            </FormField>
                        </div>
                    </div>
                </div>

                {/* JOB */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">
                        Job Information
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            label="Department"
                            name="Department"
                            required
                            error={errors.Department}
                            value={form.Department}
                        >
                            <CustomSelect
                                value={form.Department}
                                options={departmentOptions}
                                onChange={(value) =>
                                    handleChange("Department", value)
                                }
                            />
                        </FormField>

                        <FormField
                            label="Position"
                            name="Position"
                            required
                            error={errors.Position}
                            value={form.Position}
                        >
                            <CustomSelect
                                value={form.Position}
                                options={positionOptions}
                                onChange={(value) =>
                                    handleChange("Position", value)
                                }
                            />
                        </FormField>

                        <FormField
                            label="Company Status"
                            name="CompanyStatus"
                            required
                            error={errors.CompanyStatus}
                            value={form.CompanyStatus}
                        >
                            <CustomSelect
                                value={form.CompanyStatus}
                                options={companyStatusOptions}
                                onChange={(value) =>
                                    handleChange("CompanyStatus", value)
                                }
                            />
                        </FormField>

                        <FormField
                            label="Job Level"
                            name="JobLevel"
                            required
                            error={errors.JobLevel}
                            value={form.JobLevel}
                        >
                            <CustomSelect
                                value={form.JobLevel}
                                options={jobLevelOptions}
                                onChange={(value) =>
                                    handleChange("JobLevel", value)
                                }
                            />
                        </FormField>

                        <FormField
                            label="Date Hired"
                            name="DateHired"
                            required
                            error={errors.DateHired}
                            value={form.DateHired}
                        >
                            <CustomDatePicker
                                value={form.DateHired}
                                onChange={(value) =>
                                    handleChange("DateHired", value)
                                }
                            />
                        </FormField>

                        <FormField
                            label="Monthly Salary"
                            name="MonthlySalary"
                            required
                            error={errors.MonthlySalary}
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