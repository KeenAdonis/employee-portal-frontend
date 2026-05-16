"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastProvider";

import { Check } from "lucide-react";

// ✅ NEW: extracted section
import InformationSection from "@/components/payroll/InformationSection";
import OvertimeSection from "@/components/payroll/OvertimeSection";
import PerDaySection from "@/components/payroll/PerDaySection";
import DeductionSection from "@/components/payroll/DeductionSection";
import AllowanceSection from "@/components/payroll/AllowanceSection";
import LoanSection from "@/components/payroll/LoanSection";
import PayrollPreviewModal from "@/components/payroll/PayrollPreviewModal";

import {
    User,
    Clock,
    Calendar,
    MinusCircle,
    Gift,
    CreditCard,
} from "lucide-react";




export default function PayrollCreatePage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [employeeLoans, setEmployeeLoans] = useState([]);

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const [loadingPreview, setLoadingPreview] = useState(false);

    const [step, setStep] = useState(1);
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const [form, setForm] = useState({
        employee_id: "",
        selectedEmployee: null,
        EmployeeNo: "",
        EmployeeName: "",
        Position: "",
        CompanyStatus: "",
        PayDate: "",
        MonthlySalary: "",

        OTRegularDay: 0,
        OTRestDay: 0,
        OTSpecialNonWorkingDay: 0,
        OTSpecialNonWorkingAndRestDay: 0,
        OTRegularHoliday: 0,
        OTRegularHolidayAndRestDay: 0,

        PDRestDay: 0,
        PDSpecialNonWorkingDay: 0,
        PDSpecialNonWorkingAndRestDay: 0,
        PDRegularHoliday: 0,
        PDRegularHolidayAndRestDay: 0,

        Absences: 0,
        Tardiness: 0,
        Undertime: 0,

        RiceSubsidy: 0,
        LoadAllowance: 0,
        MedicalReimbursement: 0,
        TripTicket: 0,
        Additional: 0,

        SalaryLoanPayment: 0,
        LaptopLoanPayment: 0,
        SSSPersonalLoanPayment: 0,
        SSSCalamityLoanPayment: 0,
        PagIbigPersonalLoanPayment: 0,
        PagIbigCalamityLoanPayment: 0,
    });

    useEffect(() => {
        if (!form.employee_id) return;

        const fetchLoans = async () => {
            try {
                const res = await api.get(`/employees/${form.employee_id}/loans`);
                setEmployeeLoans(res.data.data);
            } catch (err) {
                console.error("Failed to fetch loans", err);
            }
        };

        fetchLoans();
    }, [form.employee_id]);

    const isStep1Valid =
        !!form.employee_id &&
        !!form.EmployeeNo &&
        !!form.PayDate &&
        form.MonthlySalary !== "" &&
        form.MonthlySalary !== null;

    const steps = [
        { id: 1, label: "Info", icon: User },
        { id: 2, label: "Overtime", icon: Clock },
        { id: 3, label: "Per Day", icon: Calendar },
        { id: 4, label: "Deductions", icon: MinusCircle },
        { id: 5, label: "Allowances", icon: Gift },
        { id: 6, label: "Loans", icon: CreditCard },
    ];

    /* =========================
       FETCH EMPLOYEES
    ========================= */
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await api.get("/employees/active");
                setEmployees(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchEmployees();
    }, []);

    /* =========================
       EMPLOYEE SELECT
    ========================= */
    const handleEmployeeSelect = (selectedValue) => {
        if (!selectedValue) return;

        const selected = employees.find(
            (emp) => emp.employee_id === selectedValue
        );

        if (!selected) return;

        setForm((prev) => ({
            ...prev,
            selectedEmployee: selected,

            employee_id: selected.employee_id, // ✅ FIXED

            EmployeeNo: selected.EmployeeNo,
            EmployeeName: selected.EmployeeName,
            Position: selected.Position,
            CompanyStatus: selected.CompanyStatus,
            MonthlySalary: selected.MonthlySalary,
        }));
    };

    /* =========================
       HANDLE CHANGE (FIXED)
    ========================= */
    const handleChange = ({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            [name]:
                name === "PayDate"
                    ? value // 🔥 KEEP STRING DATE
                    : value === ""
                        ? ""
                        : Number(value),
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: null,
        }));
    };


    const handleStepClick = (targetStep) => {

        // ✅ Always allow going backward
        if (targetStep < step) {
            setStep(targetStep);
            return;
        }

        // ✅ Validate current step before going forward
        if (targetStep > step) {
            const isValid = validateStep(step);

            if (!isValid) {
                // 🔥 OPTIONAL: auto scroll to first error
                window.scrollTo({ top: 0, behavior: "smooth" });

                showToast({
                    title: "Incomplete Step",
                    message: "Please complete required fields",
                    type: "warning",
                });
                return;
            }
        }

        setStep(targetStep);
    };

    const getStepError = (stepId) => {
        if (stepId === 1) {
            return (
                (errors.EmployeeNo || errors.PayDate || errors.MonthlySalary)
            );
        }

        return false;
    };

    /* =========================
       VALIDATION
    ========================= */
    const validateStep = (currentStep) => {
        let newErrors = {};

        if (currentStep === 1) {
            if (!form.EmployeeNo) newErrors.EmployeeNo = "Required";
            if (!form.PayDate) newErrors.PayDate = "Required";
            if (!form.MonthlySalary) newErrors.MonthlySalary = "Required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* =========================
       PREVIEW
    ========================= */
    const handlePreview = async () => {
        if (!validateStep(step)) return;

        // 🔥 FIX
        if (!form.employee_id && form.selectedEmployee) {
            form.employee_id = form.selectedEmployee.employee_id;
        }

        try {
            setLoadingPreview(true);

            const res = await api.post("/payroll/preview", form);

            setResult(res.data.data);
            setPreviewOpen(true);

        } catch (err) {
            console.error("PREVIEW ERROR:", err.response?.data);
        } finally {
            setLoadingPreview(false);
        }
    };

    /* =========================
       SAVE
    ========================= */
    const handleSubmit = async () => {
        if (!validateStep(1)) return;

        // 🔥 FORCE FIX
        if (!form.employee_id && form.selectedEmployee) {
            form.employee_id = form.selectedEmployee.employee_id;
        }

        if (!form.employee_id) {
            showToast({
                title: "Error",
                message: "Employee is required",
                type: "error",
            });
            return;
        }

        try {
            setLoading(true);

            await api.post("/payroll", form);

            showToast({
                title: "Success",
                message: "Payroll created successfully",
                type: "success",
            });

            router.push("/dashboard/adminhr/payroll-list");

        } catch (err) {
            console.error(err.response?.data); // 🔥

            showToast({
                title: "Error",
                message: err.response?.data?.message || "Failed to save payroll",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-xl font-semibold text-gray-900">
                    Create Payroll
                </h1>
                <p className="text-sm text-gray-500">
                    Compute and generate employee payroll
                </p>
            </div>

            <div className="flex items-center justify-between mb-6">

                {steps.map((s, index) => {
                    const Icon = s.icon;

                    const isActive = step === s.id;
                    const isCompleted = step > s.id;

                    return (
                        <div
                            key={s.id}
                            className="flex-1 flex items-center cursor-pointer"
                            onClick={() => handleStepClick(s.id)}
                        >

                            {/* STEP */}
                            <div
                                className={`
                                        relative
                                        w-10 h-10 rounded-full flex items-center justify-center
                                        transition-all
                                        ${isCompleted
                                        ? "bg-indigo-600 text-white"
                                        : isActive
                                            ? "bg-indigo-100 text-indigo-600 border border-indigo-300"
                                            : "bg-gray-100 text-gray-400"
                                    }
                                        `}
                            >
                                {/* ✅ COMPLETED → CHECK ICON */}
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}

                                {/* 🔴 ERROR DOT */}
                                {getStepError(s.id) && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                                )}
                            </div>

                            {/* LINE */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-[2px] mx-2 bg-gray-200 relative">
                                    <div
                                        className={`
                                absolute top-0 left-0 h-full transition-all
                                ${step > s.id
                                                ? "bg-indigo-600 w-full"
                                                : "w-0"
                                            }
                            `}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}

            </div>

            {step === 1 && (
                <InformationSection
                    form={form}
                    errors={errors}
                    employees={employees}
                    onChange={handleChange}
                    onSelectEmployee={handleEmployeeSelect}
                />
            )}

            {step === 2 && (
                <OvertimeSection form={form} onChange={handleChange} />
            )}

            {step === 3 && (
                <PerDaySection form={form} onChange={handleChange} />
            )}

            {step === 4 && (
                <DeductionSection form={form} onChange={handleChange} />
            )}

            {step === 5 && (
                <AllowanceSection form={form} onChange={handleChange} />
            )}

            {step === 6 && (
                <LoanSection loans={employeeLoans} />
            )}


            {/* ACTIONS */}
            <div className="flex justify-between items-center mt-6">

                {/* BACK */}
                {step > 1 && (
                    <Button
                        variant="secondary"
                        onClick={prevStep}
                    >
                        Back
                    </Button>
                )}

                {/* NEXT / SAVE */}
                {step < 6 ? (
                    <Button
                        onClick={() => {
                            if (!validateStep(step)) return;
                            nextStep();
                        }}
                        disabled={step === 1 && !isStep1Valid}
                        className={`
            text-white
            ${step === 1 && !isStep1Valid
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"}
        `}
                    >
                        Next
                    </Button>
                ) : (
                    <div className="flex gap-3">
                        <Button
                            onClick={handlePreview}
                            disabled={loadingPreview}
                            className="bg-gray-900 text-white"
                        >
                            {loadingPreview ? "Computing..." : "Preview Payroll"}
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-indigo-600 text-white"
                        >
                            Save Payroll
                        </Button>
                    </div>
                )}
            </div>

            <PayrollPreviewModal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                onConfirm={handleSubmit}
                data={result}
                loading={loading}
            />

        </div>
    );
}