"use client";

import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";
import api from "@/services/api";

/* =========================
INITIAL STATE
========================= */
const initialForm = {
    employee_id: "",
    loan_type: "",
    principal_amount: "",
    interest_amount: "",
    terms: "",
    cutoff_type: "both",
    start_date: "",
};

/* =========================
OPTIONS
========================= */
const loanTypes = [
    { label: "Salary Loan", value: "Salary Loan" },
    { label: "Company Deduction", value: "Deduction" },
    { label: "Laptop Loan", value: "Laptop Loan" },
    { label: "SSS Personal Loan", value: "SSS Personal Loan" },
    { label: "SSS Calamity Loan", value: "SSS Calamity Loan" },
    { label: "Pag-IBIG Personal Loan", value: "Pag-IBIG Personal Loan" },
    { label: "Pag-IBIG Calamity Loan", value: "Pag-IBIG Calamity Loan" },
];

const cutoffOptions = [
    { label: "15th", value: "15" },
    { label: "30th", value: "30" },
    { label: "Both", value: "both" },
];

/* =========================
FORM FIELD
========================= */
function Field({ label, required, error, children }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}

export default function AddLoanModal({ open, onClose, onSuccess }) {

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);

    const { showToast } = useToast();

    /* =========================
    FETCH EMPLOYEES
    ========================= */
    useEffect(() => {
        if (open) fetchEmployees();
    }, [open]);

    const fetchEmployees = async () => {
        try {
            const res = await api.get("/employees/active");
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    /* =========================
    RESET FORM
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
    SELECTED EMPLOYEE (INFO ONLY)
    ========================= */
    const selectedEmployee = useMemo(() => {
        return employees.find(e => e.value === form.employee_id);
    }, [form.employee_id, employees]);

    /* =========================
    VALIDATION
    ========================= */
    const validate = () => {
        let err = {};

        if (!form.employee_id) err.employee_id = "Required";
        if (!form.loan_type) err.loan_type = "Required";
        if (!form.principal_amount) err.principal_amount = "Required";
        if (!form.terms) err.terms = "Required";
        if (!form.start_date) err.start_date = "Required";

        setErrors(err);
        return Object.keys(err).length === 0;
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

            await api.post("/loans", form);

            showToast({
                title: "Success",
                message: "Loan created successfully",
                type: "success",
            });

            onSuccess();
            onClose();

        } catch (err) {
            showToast({
                title: "Error",
                message: err.response?.data?.message || "Failed to create loan",
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
            title="Add Loan"
            subtitle="Create a new employee loan"
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-indigo-600 text-white"
                    >
                        {loading ? "Saving..." : "Save Loan"}
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-2 gap-4">

                {/* EMPLOYEE */}
                <Field label="Employee" required error={errors.employee_id}>
                    <CustomSelect
                        value={form.employee_id}
                        options={employees}
                        onChange={(val) => handleChange("employee_id", val)}
                    />
                </Field>

                {/* LOAN TYPE */}
                <Field label="Loan Type" required error={errors.loan_type}>
                    <CustomSelect
                        value={form.loan_type}
                        options={loanTypes}
                        onChange={(val) => handleChange("loan_type", val)}
                    />
                </Field>

                {/* EMPLOYEE INFO */}
                {selectedEmployee && (
                    <div className="col-span-2 bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
                        <p><strong>Position:</strong> {selectedEmployee.Position}</p>
                        <p><strong>Monthly Salary:</strong> ₱ {selectedEmployee.MonthlySalary}</p>
                    </div>
                )}

                {/* PRINCIPAL */}
                <Field label="Principal Amount" required error={errors.principal_amount}>
                    <Input
                        type="number"
                        value={form.principal_amount}
                        onChange={(e) => handleChange("principal_amount", e.target.value)}
                    />
                </Field>

                {/* INTEREST */}
                <Field label="Interest Amount">
                    <Input
                        type="number"
                        value={form.interest_amount}
                        onChange={(e) => handleChange("interest_amount", e.target.value)}
                    />
                </Field>

                {/* TERMS */}
                <Field label="Terms (months)" required error={errors.terms}>
                    <Input
                        type="number"
                        value={form.terms}
                        onChange={(e) => handleChange("terms", e.target.value)}
                    />
                </Field>

                {/* CUTOFF */}
                <Field label="Cutoff Type">
                    <CustomSelect
                        value={form.cutoff_type}
                        options={cutoffOptions}
                        onChange={(val) => handleChange("cutoff_type", val)}
                    />
                </Field>

                {/* START DATE */}
                <div className="col-span-2">
                    <Field label="Start Date" required error={errors.start_date}>
                        <CustomDatePicker
                            value={form.start_date}
                            onChange={(val) => handleChange("start_date", val)}
                        />
                    </Field>
                </div>

            </div>
        </Modal>
    );
}